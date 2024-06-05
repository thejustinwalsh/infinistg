import {useEffect, useMemo, useRef} from 'react';
import {type PixiRef, useApp, useTick} from '@pixi/react';

import {useAsset, useAssets} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {relativeTo, url} from '../lib/url-cache';
import Tilemap from '../primitives/Tilemap';

import type {Ldtk} from '../lib/ldtk';
import type {Texture} from 'pixi.js';

export type WorldProps = {
  world: string;
  level: string;
};

export default function World({world: path, level}: WorldProps) {
  const app = useApp();
  const world = useGameState.getState().world;
  const ref = useRef<PixiRef<typeof Tilemap>>(null);
  const worldData = useAsset<Ldtk>(path);
  const tileSetUrls = useMemo(
    () =>
      worldData.defs.tilesets
        .filter(({relPath}) => !!relPath)
        .map(({relPath}) => url(relPath!, relativeTo(path, relPath!))),
    [path, worldData.defs.tilesets],
  );
  const tilesets = useAssets<Texture>(tileSetUrls);
  const tilesetsList = useMemo(() => Object.values(tilesets).map(t => t.baseTexture), [tilesets]);
  const levelIndex = worldData.levels.findIndex(({identifier}) => identifier === level);
  if (!worldData.levels[levelIndex]) throw new Error(`Level not found: ${level}`);

  useEffect(() => {
    world.level = level;
    world.index = levelIndex;
  }, [level, levelIndex, world]);

  useTick(delta => {
    world.scroll += delta * 0.5;

    const currentLevel = worldData.levels[world.index % worldData.levels.length];
    const nextLevel = worldData.levels[world.index - 1 < 0 ? worldData.levels.length - 1 : world.index - 1];

    // Clear the tilemap
    ref.current?.clear();

    // TODO: Update tiles in spatial-hash as we scroll

    // Render the next level's tiles starting at the top of the viewport and ending at the scroll position
    nextLevel.layerInstances?.forEach(layer => {
      const tileset = layer.__tilesetRelPath
        ? tilesets[tileSetUrls.findIndex(u => u.endsWith(layer.__tilesetRelPath!))]
        : undefined;
      const tiles = layer.__type === 'Tiles' ? layer.gridTiles : layer.autoLayerTiles;
      if (!tileset || tiles.length === 0) return;

      tiles.forEach(tile => {
        const s = world.scroll - layer.__cHei * layer.__gridSize;
        if (tile.px[1] + s + layer.__gridSize < 0) return;

        ref.current?.tile(tileset.baseTexture, tile.px[0], tile.px[1] + s, {
          u: tile.src[0],
          v: tile.src[1],
          tileWidth: layer.__gridSize,
          tileHeight: layer.__gridSize,
        });
      });
    });

    // Render the tiles for the current level starting at the scroll position and ending at the last tile in the viewport
    currentLevel.layerInstances?.forEach(layer => {
      const tileset = layer.__tilesetRelPath
        ? tilesets[tileSetUrls.findIndex(u => u.endsWith(layer.__tilesetRelPath!))]
        : undefined;
      const tiles = layer.__type === 'Tiles' ? layer.gridTiles : layer.autoLayerTiles;
      if (!tileset || tiles.length === 0) return;

      tiles.forEach(tile => {
        if (tile.px[1] + world.scroll > app.renderer.screen.height) return;

        ref.current?.tile(tileset.baseTexture, tile.px[0], tile.px[1] + world.scroll, {
          u: tile.src[0],
          v: tile.src[1],
          tileWidth: layer.__gridSize,
          tileHeight: layer.__gridSize,
        });
      });
    });

    // Scroll to the next level when the current level is out of view
    if (world.scroll > currentLevel.pxHei) {
      world.scroll = world.scroll - currentLevel.pxHei;
      world.index = world.index - 1 < 0 ? worldData.levels.length - 1 : world.index - 1;
    }
  });

  return <Tilemap ref={ref} name={`World-${level}`} tilesets={tilesetsList} />;
}
