import {forwardRef} from 'react';
import {TilingSprite as ReactPixiTilingSprite} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';
import {useAsset} from '../hooks/useAsset';

import type {PixiRef} from '@pixi/react';
import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

export type TilingSpriteRef = PixiRef<typeof ReactPixiTilingSprite>;

export type TilingSpriteProps = Omit<React.ComponentProps<typeof ReactPixiTilingSprite>, 'image' | 'texture'> & {
  image?: string;
  texture?: Texture;
};

const TilingSpriteFromImage = forwardRef(
  ({image, ...props}: TilingSpriteProps & {image: string}, ref: Ref<TilingSpriteRef>) => {
    const texture = useAsset<Texture>(image);
    return <ReactPixiTilingSprite ref={ref} texture={texture} {...props} />;
  },
);

const TilingSprite = forwardRef(function TilingSprite(
  {image, texture, ...props}: TilingSpriteProps,
  ref: Ref<TilingSpriteRef>,
) {
  const {width, height} = props;
  return (
    <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
      {image ? (
        <TilingSpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <ReactPixiTilingSprite ref={ref} texture={texture} {...props} />
      )}
    </ErrorBoundary>
  );
});

export default TilingSprite;
