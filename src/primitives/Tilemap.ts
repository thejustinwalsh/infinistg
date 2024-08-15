/* eslint-disable @typescript-eslint/no-namespace */

import {extend} from '@pixi/react';
import {Tilemap} from '@pixi/tilemap';

import type {TextureSource} from 'pixi.js';

extend({Tilemap});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // TODO: How do we ensure we ger the correct props for Tilemap?
      tilemap: React.PropsWithRef<{
        ref?: React.RefObject<Tilemap>;
        label?: string;
        tilesets: TextureSource[];
      }>;
    }
  }
}
