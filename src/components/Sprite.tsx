import {forwardRef, useImperativeHandle, useRef} from 'react';
import {Sprite as ReactPixiSprite} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';
import {useAsset} from '../hooks/useAsset';

import type {PixiRef} from '@pixi/react';
import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

export type SpriteRef = PixiRef<typeof ReactPixiSprite>;

export type SpriteProps = Omit<React.ComponentProps<typeof ReactPixiSprite>, 'image' | 'texture'> & {
  image?: string;
  texture?: Texture;
};

const SpriteFromImage = forwardRef(({image, ...props}: SpriteProps & {image: string}, ref: Ref<SpriteRef>) => {
  const texture = useAsset<Texture>(image);
  return <ReactPixiSprite ref={ref} texture={texture} {...props} />;
});

const Sprite = forwardRef(function Sprite({image, texture, ...props}: SpriteProps, forwardedRef: Ref<SpriteRef>) {
  const ref = useRef<SpriteRef>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const {width, height} = props;

  return (
    <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
      {image ? (
        <SpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <ReactPixiSprite ref={ref} texture={texture} {...props} />
      )}
    </ErrorBoundary>
  );
});

export default Sprite;
