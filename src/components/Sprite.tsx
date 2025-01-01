import {forwardRef, memo, useImperativeHandle, useRef} from 'react';
import {useExtend, useSuspenseAssets} from '@pixi/react';
import {Sprite as PixiSprite} from 'pixi.js';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';

import type {PixiElements} from '@pixi/react';
import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

export type SpriteProps = PixiElements['pixiSprite'] & {
  image?: string;
  texture?: Texture;
};

const SpriteFromImage = forwardRef(({image, ...props}: SpriteProps & {image: string}, ref: Ref<PixiSprite>) => {
  const [texture] = useSuspenseAssets<Texture>([image]);
  return <pixiSprite ref={ref} texture={texture} {...props} />;
});

const Sprite = memo(
  forwardRef(function Sprite({image, texture, ...props}: SpriteProps, forwardedRef: Ref<PixiSprite>) {
    useExtend({Sprite: PixiSprite});

    const ref = useRef<PixiSprite>(null);
    useImperativeHandle(forwardedRef, () => ref.current!, []);

    const {width, height} = props;

    return (
      <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
        {image ? (
          <SpriteFromImage ref={ref} image={image} {...props} />
        ) : (
          <pixiSprite ref={ref} texture={texture} {...props} />
        )}
      </ErrorBoundary>
    );
  }),
);

export default Sprite;
