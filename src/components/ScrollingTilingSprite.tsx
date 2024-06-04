import {useRef} from 'react';
import {useApp, useTick} from '@pixi/react';

import TilingSprite from './TilingSprite';

import type {TilingSpriteProps, TilingSpriteRef} from './TilingSprite';

export type ScrollingTilingSpriteProps = TilingSpriteProps & {
  scroll?: [number, number];
};

export default function ScrollingTilingSprite({image, scroll, ...props}: ScrollingTilingSpriteProps) {
  const app = useApp();
  const ref = useRef<TilingSpriteRef>(null);

  useTick(delta => {
    ref.current?.tilePosition.set(
      ref.current.tilePosition.x + delta * (scroll?.[0] ?? 0),
      ref.current.tilePosition.y + delta * (scroll?.[1] ?? 0),
    );
  });

  return (
    <TilingSprite
      ref={ref}
      image={image}
      width={app.renderer.screen.width}
      height={app.renderer.screen.height}
      {...props}
    />
  );
}
