import {useImperativeHandle, useRef} from 'react';
import {useExtend, useSuspenseAssets} from '@pixi/react';
import {Sprite as PixiSprite} from 'pixi.js';

import ErrorBoundary from './ErrorBoundary';
import SpriteFallback from './SpriteFallback';

import type {PixiElements} from '@pixi/react';
import type {Texture} from 'pixi.js';

export type SpriteProps = PixiElements['pixiSprite'] & {
  image?: string;
  texture?: Texture;
};

function SpriteFromImage({image, ref, ...props}: SpriteProps & {image: string}) {
  const [texture] = useSuspenseAssets<Texture>([image]);
  return <pixiSprite ref={ref} texture={texture} {...props} />;
}

export default function Sprite({image, texture, ref: parentRef, ...props}: SpriteProps) {
  useExtend({Sprite: PixiSprite});

  const ref = useRef<PixiSprite>(null);
  useImperativeHandle(parentRef, () => ref.current!, []);

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
}
