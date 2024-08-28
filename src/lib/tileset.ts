import {Rectangle, Texture} from 'pixi.js';

import type {TextureSource} from 'pixi.js';

export type TileSetOptions = {
  url: string;
  source: TextureSource;
  frames: {
    label?: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}[];

export default class Tileset {
  private tiles: Map<string, Texture[]> = new Map();

  constructor(options: TileSetOptions) {
    this.tiles = options.reduce(
      (map, opt) =>
        map.set(
          opt.url,
          opt.frames.map(frame => {
            return new Texture({
              source: opt.source,
              label: frame.label,
              frame: new Rectangle(frame.x, frame.y, frame.width, frame.height),
            });
          }),
        ),
      new Map(),
    );
  }

  tile(url: string, index: number): Texture {
    if (!this.tiles.has(url)) throw new Error(`Tileset does not contain url: ${url}`);
    return this.tiles.get(url)![index];
  }
}
