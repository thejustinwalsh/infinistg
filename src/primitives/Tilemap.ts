import {PixiComponent, applyDefaultProps} from '@pixi/react';
import {Tilemap} from '@pixi/tilemap';

import type {BaseTexture} from 'pixi.js';

export type TilemapProps = {
  tilesets: BaseTexture[];
};

export default PixiComponent<TilemapProps, Tilemap>('Tilemap', {
  create: props => {
    const {tilesets} = props;
    const composite = new Tilemap(tilesets);
    return composite;
  },
  applyProps: (instance, oldProps, newProps) => {
    applyDefaultProps(instance, oldProps, newProps);
  },
});
