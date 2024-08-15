import {forwardRef, useImperativeHandle, useRef} from 'react';
import {useExtend} from '@pixi/react';
import type {} from '@pixi/react';
import {Sprite as PixiSprite} from 'pixi.js';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';
import {useAsset} from '../hooks/useAsset';

import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

export type SpriteProps = JSX.IntrinsicElements['sprite'] & {
  image?: string;
  texture?: Texture;
};

const SpriteFromImage = forwardRef(({image, ...props}: SpriteProps & {image: string}, ref: Ref<PixiSprite>) => {
  const texture = useAsset<Texture>(image);
  return <sprite ref={ref} texture={texture} {...props} />;
});

const Sprite = forwardRef(function Sprite({image, texture, ...props}: SpriteProps, forwardedRef: Ref<PixiSprite>) {
  useExtend({Sprite: PixiSprite});

  const ref = useRef<PixiSprite>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const {width, height} = props;

  return (
    <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
      {image ? (
        <SpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <sprite ref={ref} texture={texture} {...props} />
      )}
    </ErrorBoundary>
  );
});

export default Sprite;
