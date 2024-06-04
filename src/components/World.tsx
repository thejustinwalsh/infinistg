import {useEffect, useMemo, useRef} from 'react';

import {useAsset, useAssets} from '../hooks/useAsset';
import {relativeTo, url} from '../lib/url-cache';
import Tilemap from '../primitives/Tilemap';

import type {Ldtk} from '../lib/ldtk';
import type {PixiRef} from '@pixi/react';
import type {Texture} from 'pixi.js';

export type WorldProps = {
  world: string;
  level: string;
};

export default function World({world, level}: WorldProps) {
  const ref = useRef<PixiRef<typeof Tilemap>>(null);
  const worldData = useAsset<Ldtk>(world);
  const tileSetUrls = useMemo(
    () =>
      worldData.defs.tilesets
        .filter(({relPath}) => !!relPath)
        .map(({relPath}) => url(relPath!, relativeTo(world, relPath!))),
    [world, worldData.defs.tilesets],
  );
  const tilesets = useAssets<Texture>(tileSetUrls);
  const tilesetsList = useMemo(() => Object.values(tilesets).map(t => t.baseTexture), [tilesets]);
  const levelData = worldData.levels.find(({identifier}) => identifier === level);
  if (!levelData) throw new Error(`Level not found: ${level}`);

  useEffect(() => {
    levelData.layerInstances?.forEach(layer => {
      const tileset = layer.__tilesetRelPath
        ? tilesets[tileSetUrls.findIndex(u => u.endsWith(layer.__tilesetRelPath!))]
        : undefined;
      const tiles = layer.__type === 'Tiles' ? layer.gridTiles : layer.autoLayerTiles;
      if (!tileset || tiles.length === 0) return;

      tiles.forEach(tile => {
        ref.current?.tile(tileset.baseTexture, tile.px[0], tile.px[1], {
          u: tile.src[0],
          v: tile.src[1],
          tileWidth: layer.__gridSize,
          tileHeight: layer.__gridSize,
        });
      });
    });
  }, [levelData, tileSetUrls, tilesets]);

  return <Tilemap ref={ref} name={`World-${level}`} tilesets={tilesetsList} />;
}
