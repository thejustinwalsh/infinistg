/* eslint-disable @typescript-eslint/no-namespace */

import {extend} from '@pixi/react';
import {CompositeTilemap} from '@pixi/tilemap';

import type {TextureSource} from 'pixi.js';

extend({CompositeTilemap});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // TODO: How do we ensure we ger the correct props for Tilemap?
      compositeTilemap: React.PropsWithRef<{
        ref?: React.RefObject<CompositeTilemap>;
        label?: string;
        tilesets: TextureSource[];
      }>;
    }
  }
}
