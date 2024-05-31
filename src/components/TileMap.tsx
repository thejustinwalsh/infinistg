import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {type PixiRef} from '@pixi/react';

import {useAsset} from '../hooks/useAsset';
import Tilemap from '../primitives/Tilemap';

import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

export type TilemapRef = PixiRef<typeof Tilemap>;

export type TileMapData = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: [
    {
      data: number[];
      width: number;
      height: number;
      x: number;
      y: number;
    },
  ];
  tilesets: [
    {
      firstgid: number;
      source: string;
    },
  ];
};

export type TileSetData = {
  image: string;
  imagewidth: number;
  imageheight: number;
  margin: number;
  spacing: number;
  tilecount: number;
  tilewidth: number;
  tileheight: number;
};

export type TileMapProps = {
  tileMap: string;
};

const urlCache = new Map<string, string>();

function url(url: string, value: string): string {
  if (!urlCache.has(url)) urlCache.set(url, value);
  return urlCache.get(url)!;
}
function relativeTo(source: string, path: string): string {
  return source.replace(/\/(?:.(?!\/))+$/, '/' + path);
}

const TileMap = forwardRef(function TileMap({tileMap}: TileMapProps, forwardedRef: Ref<TilemapRef>) {
  const ref = useRef<PixiRef<typeof Tilemap>>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const tileMapData: TileMapData = useAsset(tileMap);
  const tileSetData: TileSetData = useAsset(
    url(tileMapData.tilesets[0].source, relativeTo(tileMap, tileMapData.tilesets[0].source.replace('.tsx', '.json'))),
  );
  const tiles: Texture = useAsset(url(tileSetData.image, relativeTo(tileMap, tileSetData.image)));

  useEffect(() => {
    tileMapData.layers.forEach(layer => {
      const {data, width} = layer;
      const tileWidth = tileSetData.tilewidth;
      const tileHeight = tileSetData.tileheight;

      for (let i = 0; i < data.length; i++) {
        const tile = data[i];
        if (tile === 0) continue;

        const tileX = (tile - 1) % (tileSetData.imagewidth / tileWidth);
        const tileY = Math.floor((tile - 1) / (tileSetData.imagewidth / tileWidth));
        ref.current?.tile(tiles, (i % width) * tileWidth, Math.floor(i / width) * tileHeight, {
          u: tileX * tileWidth,
          v: tileY * tileHeight,
          tileWidth,
          tileHeight,
        });
      }
    });
  }, [tileMapData.layers, tileSetData.imagewidth, tileSetData.tileheight, tileSetData.tilewidth, tiles]);

  return <Tilemap ref={ref} tilesets={[tiles.baseTexture]} />;
});

export default TileMap;
