import {forwardRef, memo, useEffect, useImperativeHandle, useRef} from 'react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps} from './Sprite';
import type {Sprite as PixiSprite} from 'pixi.js';
import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

type BulletProps = SpriteProps & {
  id: number;
  texture: Texture;
};

const Bullet = memo(
  forwardRef(function Bullet({id, texture}: BulletProps, forwardedRef: Ref<PixiSprite>) {
    const ref = useRef<PixiSprite>(null);
    useImperativeHandle(forwardedRef, () => ref.current!, []);

    const actions = useGameState(state => state.bullets.actions);

    useEffect(() => {
      actions.bind(id, ref.current);
      () => actions.unbind(id);
    }, [actions, id]);

    return <Sprite ref={ref} label={`Bullet-${id}`} anchor={0.5} texture={texture} />;
  }),
);

export default Bullet;
