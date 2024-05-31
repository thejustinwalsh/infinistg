import {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {Graphics as ReactPixiGraphics, Sprite as ReactPixiSprite} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';
import {useAsset} from '../hooks/useAsset';

import type {PixiRef} from '@pixi/react';
import type {Graphics, Texture} from 'pixi.js';
import type {Ref} from 'react';

export type SpriteRef = PixiRef<typeof ReactPixiSprite>;

type SpriteWithImageProps = {
  image: string;
  texture?: never;
};

type SpriteWithTextureProps = {
  image?: never;
  texture: Texture;
};

export type SpriteProps = React.ComponentProps<typeof ReactPixiSprite> &
  (SpriteWithImageProps | SpriteWithTextureProps);

const SpriteFromImage = forwardRef(
  ({image, ...props}: {image: string} & React.ComponentProps<typeof ReactPixiSprite>, ref: Ref<SpriteRef>) => {
    const texture: Texture = useAsset(image);
    return <ReactPixiSprite ref={ref} texture={texture} {...props} />;
  },
);

const Sprite = forwardRef(function Sprite({image, texture, ...props}: SpriteProps, forwardedRef: Ref<SpriteRef>) {
  const ref = useRef<SpriteRef>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const fallback = useCallback((g: Graphics) => {
    g.clear();
    g.lineStyle(1, 0x000000);
    g.beginFill(0xef2b7c);
    g.drawRoundedRect(0, 0, 32, 32, 6);
    g.endFill();
  }, []);

  return (
    <ErrorBoundary fallback={<ReactPixiGraphics draw={fallback} />}>
      {image ? (
        <SpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <ReactPixiSprite ref={ref} texture={texture} {...props} />
      )}
    </ErrorBoundary>
  );
});

export default Sprite;
