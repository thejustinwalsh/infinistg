import {useRef} from 'react';
import {useTick} from '@pixi/react';

import TilingSprite from './TilingSprite';
import {HEIGHT, WIDTH} from '../lib/constants';

import type {TilingSpriteProps} from './TilingSprite';
import type {TilingSprite as PixiTilingSprite} from 'pixi.js';

export type ScrollingTilingSpriteProps = TilingSpriteProps & {
  scroll?: [number, number];
};

export default function ScrollingTilingSprite({image, scroll, ...props}: ScrollingTilingSpriteProps) {
  const ref = useRef<PixiTilingSprite>(null);

  useTick(({deltaTime: delta}) => {
    ref.current?.tilePosition.set(
      ref.current.tilePosition.x + delta * (scroll?.[0] ?? 0),
      ref.current.tilePosition.y + delta * (scroll?.[1] ?? 0),
    );
  });

  return <TilingSprite ref={ref} image={image} width={WIDTH} height={HEIGHT} {...props} />;
}
