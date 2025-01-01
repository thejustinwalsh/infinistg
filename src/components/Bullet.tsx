import {useEffect, useImperativeHandle, useRef} from 'react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps} from './Sprite';
import type {Sprite as PixiSprite} from 'pixi.js';
import type {Texture} from 'pixi.js';

type BulletProps = SpriteProps & {
  id: number;
  texture: Texture;
};

const Bullet = function Bullet({id, texture, ref: parentRef}: BulletProps) {
  const ref = useRef<PixiSprite>(null);
  useImperativeHandle(parentRef, () => ref.current!, []);

  const actions = useGameState(state => state.bullets.actions);

  useEffect(() => {
    actions.bind(id, ref.current);
    () => actions.unbind(id);
  }, [actions, id, ref]);

  return <Sprite ref={ref} label={`Bullet-${id}`} anchor={0.5} texture={texture} />;
};

export default Bullet;
