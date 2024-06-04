import {useCallback} from 'react';
import {Graphics as ReactPixiGraphics} from '@pixi/react';

import type {Graphics} from 'pixi.js';

export type SpriteFallbackProps = {
  color?: number;
  width?: number;
  height?: number;
};

export default function SpriteFallback({color = 0xef2b7c, width = 32, height = 32}: SpriteFallbackProps) {
  const fallback = useCallback(
    (g: Graphics) => {
      g.clear();
      g.lineStyle(1, 0x000000);
      g.beginFill(color);
      g.drawRoundedRect(0, 0, width, height, 6);
      g.endFill();
    },
    [color, height, width],
  );

  return <ReactPixiGraphics draw={fallback} />;
}
