import {forwardRef} from 'react';
import {useExtend, useSuspenseAssets} from '@pixi/react';
import {Texture} from 'pixi.js';
import {TilingSprite as PixiTilingSprite} from 'pixi.js';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';

import type {Ref} from 'react';

export type TilingSpriteProps = JSX.IntrinsicElements['tilingSprite'] & {
  image?: string;
  texture?: Texture;
};

const TilingSpriteFromImage = forwardRef(
  ({image, ...props}: TilingSpriteProps & {image: string}, ref: Ref<PixiTilingSprite>) => {
    const [texture] = useSuspenseAssets<Texture>([image]);
    return <tilingSprite ref={ref} texture={texture} {...props} />;
  },
);

const TilingSprite = forwardRef(function TilingSprite(
  {image, texture, ...props}: TilingSpriteProps,
  ref: Ref<PixiTilingSprite>,
) {
  useExtend({TilingSprite: PixiTilingSprite});

  const {width, height} = props;
  return (
    <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
      {image ? (
        <TilingSpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <tilingSprite ref={ref} texture={texture ?? Texture.EMPTY} {...props} />
      )}
    </ErrorBoundary>
  );
});

export default TilingSprite;
