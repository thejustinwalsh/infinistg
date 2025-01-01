import {useCallback} from 'react';
import {useExtend} from '@pixi/react';
import {Graphics as PixiGraphics} from 'pixi.js';

import type {Graphics} from 'pixi.js';

export type SpriteFallbackProps = {
  color?: number;
  width?: number;
  height?: number;
};

export default function SpriteFallback({color = 0xef2b7c, width = 32, height = 32}: SpriteFallbackProps) {
  useExtend({Graphics: PixiGraphics});

  const fallback = useCallback(
    (g: Graphics) => {
      g.clear();
      g.stroke({color: 0x000000, width: 1});
      g.fill(color);
      g.roundRect(0, 0, width, height, 6);
    },
    [color, height, width],
  );

  return <pixiGraphics draw={fallback} />;
}
