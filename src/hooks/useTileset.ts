import {useEffect, useMemo, useRef} from 'react';
import {useSuspenseAssets} from '@pixi/react';

import Tileset from '../lib/tileset';

import type {Texture} from 'pixi.js';

export type TileSetFrames = {
  url: string;
  frames: {
    label?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}[];

export default function useTileset(urls: string | string[], frames: TileSetFrames) {
  const sources = useMemo(() => (Array.isArray(urls) ? urls : [urls]), [urls]);
  const textures = useSuspenseAssets<Texture>(sources);

  const loadedFrames = useMemo(
    () =>
      frames.map(frame => {
        return {url: frame.url, source: textures[sources.indexOf(frame.url)].source, frames: frame.frames};
      }),
    [frames, sources, textures],
  );

  const tileset = useRef(new Tileset(loadedFrames));

  useEffect(() => {
    tileset.current = new Tileset(loadedFrames);
  }, [loadedFrames]);

  return tileset;
}
