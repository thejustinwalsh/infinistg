import {useExtend, useSuspenseAssets} from '@pixi/react';
import {Texture} from 'pixi.js';
import {TilingSprite as PixiTilingSprite} from 'pixi.js';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';

import type {PixiElements} from '@pixi/react';

export type TilingSpriteProps = PixiElements['pixiTilingSprite'] & {
  image?: string;
  texture?: Texture;
};

function TilingSpriteFromImage({image, ref, ...props}: TilingSpriteProps & {image: string}) {
  const [texture] = useSuspenseAssets<Texture>([image]);
  return <pixiTilingSprite ref={ref} texture={texture} {...props} />;
}

export default function TilingSprite({image, texture, ref, ...props}: TilingSpriteProps) {
  useExtend({TilingSprite: PixiTilingSprite});

  const {width, height} = props;
  return (
    <ErrorBoundary fallback={<SpriteFallback width={width} height={height} />}>
      {image ? (
        <TilingSpriteFromImage ref={ref} image={image} {...props} />
      ) : (
        <pixiTilingSprite ref={ref} texture={texture ?? Texture.EMPTY} {...props} />
      )}
    </ErrorBoundary>
  );
}
