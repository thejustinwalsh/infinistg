import {PixiComponent, applyDefaultProps} from '@pixi/react';
import {CompositeTilemap} from '@pixi/tilemap';

import type {BaseTexture} from 'pixi.js';

export type CompositeTilemapProps = {
  name?: string;
  tilesets: BaseTexture[];
};

export default PixiComponent<CompositeTilemapProps, CompositeTilemap>('CompositeTilemap', {
  create: props => {
    const {tilesets} = props;
    const composite = new CompositeTilemap(tilesets);
    return composite;
  },
  applyProps: (instance, oldProps, newProps) => {
    applyDefaultProps(instance, oldProps, newProps);
  },
});
