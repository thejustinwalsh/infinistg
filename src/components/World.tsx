import {useEffect, useMemo, useRef} from 'react';
import {useApplication, useExtend, useTick} from '@pixi/react';
import {Tilemap} from '@pixi/tilemap';

import {useAsset, useAssets} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {relativeTo, url} from '../lib/url-cache';

import type {EntityInstance, LayerInstance, Ldtk, TileInstance} from '../lib/ldtk';
import type {Texture} from 'pixi.js';

export type WorldProps = {
  world: string;
  level: string;
};

export default function World({world: path, level}: WorldProps) {
  useExtend({Tilemap});

  const {app} = useApplication();
  const world = useGameState.getState().world;
  const ref = useRef<Tilemap>(null);
  const worldData = useAsset<Ldtk>(path);
  console.log(worldData);
  const tileSetUrls = useMemo(
    () =>
      worldData.defs.tilesets
        .filter(({relPath}) => !!relPath)
        .map(({relPath}) => url(relPath!, relativeTo(path, relPath!))),
    [path, worldData.defs.tilesets],
  );
  const tilesets = useAssets<Texture>(tileSetUrls);
  const tilesetsList = useMemo(() => Object.values(tilesets).map(t => t.source), [tilesets]);
  const levelIndex = worldData.levels.findIndex(({identifier}) => identifier === level);
  if (!worldData.levels[levelIndex]) throw new Error(`Level not found: ${level}`);

  const spawned = useRef<Map<number, EntityInstance>>(new Map());

  useEffect(() => {
    world.level = level;
    world.index = levelIndex;
  }, [level, levelIndex, world]);

  useTick(({deltaTime: delta}) => {
    world.scroll += delta * 0.5;

    const currentLevel = worldData.levels[world.index % worldData.levels.length];
    const nextLevel = worldData.levels[world.index - 1 < 0 ? worldData.levels.length - 1 : world.index - 1];

    // Clear the tilemap
    ref.current?.clear();

    // TODO: Update tiles in spatial-hash as we scroll

    // Render the next level's tiles starting at the top of the viewport and ending at the scroll position
    renderTiles(
      nextLevel.layerInstances,
      tilesets,
      tileSetUrls,
      ref,
      layer => world.scroll - layer.__cHei * layer.__gridSize,
      (tile, layer, scroll) => tile.px[1] + scroll + layer.__gridSize >= 0,
    );

    // Render the tiles for the current level starting at the scroll position and ending at the last tile in the viewport
    renderTiles(
      currentLevel.layerInstances,
      tilesets,
      tileSetUrls,
      ref,
      () => world.scroll,
      (tile, _, scroll) => tile.px[1] + scroll <= app.renderer.screen.height,
    );

    // Spawn entities as the row scrolls into view
    spawned.current = new Map([
      ...spawned.current,
      ...spawnEntities(
        nextLevel.layerInstances,
        world.scroll,
        e => !spawned.current.has(e.px[0] * nextLevel.pxHei + e.px[1]),
      ).reduce((acc, e) => acc.set(e.px[0] * nextLevel.pxHei + e.px[1], e), new Map()),
      ...spawnEntities(
        currentLevel.layerInstances,
        world.scroll,
        e => !spawned.current.has(e.px[0] * currentLevel.pxHei + e.px[1]),
      ).reduce((acc, e) => acc.set(e.px[0] * currentLevel.pxHei + e.px[1], e), new Map()),
    ]);

    // Scroll to the next level when the current level is out of view
    if (world.scroll > currentLevel.pxHei) {
      spawned.current = new Map();
      world.scroll = world.scroll - currentLevel.pxHei;
      world.index = world.index - 1 < 0 ? worldData.levels.length - 1 : world.index - 1;
    }
  });

  return <tilemap ref={ref} label={`World-${level}`} tilesets={tilesetsList} />;
}

function renderTiles(
  layers: LayerInstance[] | null | undefined,
  tilesets: Record<string, Texture>,
  tileSetUrls: string[],
  ref: React.RefObject<Tilemap>,
  scroll: (layer: LayerInstance) => number,
  filter?: (tile: TileInstance, layer: LayerInstance, scroll: number) => boolean,
) {
  layers
    ?.filter(l => l.__type !== 'Entities')
    .forEach(layer => {
      const tileset = layer.__tilesetRelPath
        ? tilesets[tileSetUrls.findIndex(u => u.endsWith(layer.__tilesetRelPath!))]
        : undefined;
      const tiles = layer.__type === 'Tiles' ? layer.gridTiles : layer.autoLayerTiles;
      if (!tileset || tiles.length === 0) return;

      const s = scroll(layer);
      tiles
        .filter(tile => filter?.(tile, layer, s) ?? true)
        .forEach(tile => {
          ref.current?.tile(tileset.source, tile.px[0], tile.px[1] + s, {
            u: tile.src[0],
            v: tile.src[1],
            tileWidth: layer.__gridSize,
            tileHeight: layer.__gridSize,
          });
        });
    });
}

function spawnEntities(
  layers: LayerInstance[] | null | undefined,
  scroll: number,
  filter?: (e: EntityInstance) => boolean,
) {
  let spawned: EntityInstance[] = [];

  layers
    ?.filter(l => l.__type === 'Entities')
    .forEach(layer => {
      const entities = layer.entityInstances;
      if (!entities) return;

      spawned = spawned.concat(entities.filter(e => (filter?.(e) ?? true) && e.px[1] + scroll >= 0));
      spawned.forEach(entity => {
        const sprite = entity.fieldInstances.find(f => f.__identifier === 'Sprite')?.__value;
        const pattern = entity.fieldInstances.find(f => f.__identifier === 'Pattern')?.__value;
        console.log('Spawn @ ', {iid: entity.iid, px: entity.px.join(', '), sprite, pattern});
      });
    });

  return spawned;
}
