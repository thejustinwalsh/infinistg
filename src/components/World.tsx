import {useEffect, useMemo, useRef} from 'react';
import {useApplication, useExtend, useSuspenseAssets, useTick} from '@pixi/react';
import {Pool, Sprite} from 'pixi.js';
import {Container} from 'pixi.js';

import {useGameState} from '../hooks/useGameState';
import useTileset from '../hooks/useTileset';
import {HEIGHT, WIDTH} from '../lib/constants';
import {pattern} from '../lib/patterns';
import {relativeTo, url} from '../lib/url-cache';

import type {EnemyState} from '../hooks/useGameState';
import type {EntityInstance, LayerInstance, Ldtk, TileInstance} from '../lib/ldtk';
import type Tileset from '../lib/tileset';

export type WorldProps = {
  world: string;
  level: string;
};

const spritePool: Pool<Sprite> = new Pool(Sprite, (WIDTH * HEIGHT) / 18 + 1);

export default function World({world: path, level}: WorldProps) {
  useExtend({Container});

  const {app} = useApplication();
  const actions = useGameState(state => state.enemies.actions);
  const world = useGameState.getState().world;
  const ref = useRef<Container>(null);
  const [worldData] = useSuspenseAssets<Ldtk>([path]);

  const [tilesetUrls, tilesetFrames] = useMemo(() => {
    const data = worldData.defs.tilesets
      .filter(({relPath}) => !!relPath)
      .map(({__cHei: rows, __cWid: cols, padding, spacing, tileGridSize, relPath}) => ({
        url: url(relPath!, relativeTo(path, relPath!)),
        frames: Array.from({length: rows * cols}, (_, i) => {
          const x = (i % cols) * (tileGridSize + spacing) + padding;
          const y = Math.floor(i / cols) * (tileGridSize + spacing) + padding;
          return {x, y, width: tileGridSize, height: tileGridSize};
        }),
      }));
    return [data.map(({url}) => url), data] as const;
  }, [path, worldData.defs.tilesets]);
  const tilesets = useTileset(tilesetUrls, tilesetFrames);

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
    ref.current?.removeChildren().forEach(sprite => (sprite instanceof Sprite ? spritePool.return(sprite) : null));

    // TODO: Update tiles in spatial-hash as we scroll

    // Render the next level's tiles starting at the top of the viewport and ending at the scroll position
    renderTiles(
      nextLevel.layerInstances,
      tilesets,
      tilesetUrls,
      ref,
      layer => world.scroll - layer.__cHei * layer.__gridSize,
      (tile, layer, scroll) => tile.px[1] + scroll + layer.__gridSize >= 0,
    );

    // Render the tiles for the current level starting at the scroll position and ending at the last tile in the viewport
    renderTiles(
      currentLevel.layerInstances,
      tilesets,
      tilesetUrls,
      ref,
      () => world.scroll,
      (tile, _, scroll) => tile.px[1] + scroll <= app.renderer.screen.height,
    );

    // Spawn entities as the row scrolls into view
    // TODO: We only need to process the current row that is scrolling into view

    spawnEntities(
      nextLevel.layerInstances,
      layer => world.scroll - layer.__cHei * layer.__gridSize,
      e => !spawned.current.has(e.px[0] * nextLevel.pxHei + e.px[1]),
      actions.add,
    ).reduce((acc, e) => acc.set(e.px[0] * nextLevel.pxHei + e.px[1], e), spawned.current);

    spawnEntities(
      currentLevel.layerInstances,
      () => world.scroll,
      e => !spawned.current.has(e.px[0] * currentLevel.pxHei + e.px[1]),
      actions.add,
    ).reduce((acc, e) => acc.set(e.px[0] * currentLevel.pxHei + e.px[1], e), spawned.current);

    // Scroll to the next level when the current level is out of view
    if (world.scroll > currentLevel.pxHei) {
      spawned.current = new Map();
      world.scroll = world.scroll - currentLevel.pxHei;
      world.index = world.index - 1 < 0 ? worldData.levels.length - 1 : world.index - 1;
    }
  });

  return <pixiContainer ref={ref} label={`World-${level}`} />;
}

function renderTiles(
  layers: LayerInstance[] | null | undefined,
  tilesets: Tileset,
  tileSetUrls: string[],
  ref: React.MutableRefObject<Container | null>,
  scroll: (layer: LayerInstance) => number,
  filter?: (tile: TileInstance, layer: LayerInstance, scroll: number) => boolean,
) {
  layers
    ?.filter(l => l.__type !== 'Entities')
    .forEach(layer => {
      const url = tileSetUrls[tileSetUrls.findIndex(u => u.endsWith(layer.__tilesetRelPath!))];
      const tiles = layer.__type === 'Tiles' ? layer.gridTiles : layer.autoLayerTiles;
      if (tiles.length === 0) return;

      const s = scroll(layer);
      tiles
        .filter(tile => filter?.(tile, layer, s) ?? true)
        .forEach(tile => {
          const t = spritePool.get();
          t.texture = tilesets.tile(url, tile.t);
          t.x = tile.px[0];
          t.y = tile.px[1] + s;
          ref.current?.addChild(t);
        });
    });
}

function spawnEntities(
  layers: LayerInstance[] | null | undefined,
  scroll: (layer: LayerInstance) => number,
  filter: (e: EntityInstance) => boolean,
  spawner: (entity: EnemyState) => void,
) {
  const spawned: EntityInstance[] = [];

  layers
    ?.filter(l => l.__type === 'Entities')
    .forEach(layer => {
      const entities = layer.entityInstances;
      if (!entities) return;

      const s = scroll(layer);
      spawned.push(...entities.filter(e => (filter?.(e) ?? true) && e.px[1] + s >= 0));
      spawned.forEach(entity => {
        const sprite = entity.fieldInstances.find(f => f.__identifier === 'Sprite')?.__value;
        const p = pattern(entity.fieldInstances.find(f => f.__identifier === 'Pattern')?.__value);
        spawner({
          sprite,
          pattern: p,
          delta: 0,
          sleep: 0,
          pos: {x: entity.px[0], y: entity.px[1]},
          radius: entity.width,
          dir: {x: 0, y: 0},
          scale: 1,
          speed: 100,
          timestamp: 0,
          fireRate: 1,
          health: 1,
          maxHealth: 1,
        });
      });
    });

  return spawned;
}
