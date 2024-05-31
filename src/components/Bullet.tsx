import {forwardRef, useImperativeHandle, useRef} from 'react';
import {useTick} from '@pixi/react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps, SpriteRef} from './Sprite';
import type {Texture} from 'pixi.js';
import type {Ref} from 'react';

type BulletProps = Omit<SpriteProps, 'texture'> & {
  id: number;
  texture: Texture;
};

const Bullet = forwardRef(function Bullet({id, texture}: BulletProps, forwardedRef: Ref<SpriteRef>) {
  const ref = useRef<SpriteRef>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const bullets = useGameState(state => state.bullets);
  const bullet = bullets.actions.get(id);

  useTick(() => {
    ref.current?.position.set(bullet.pos.x, bullet.pos.y);
  });

  return <Sprite ref={ref} anchor={0.5} x={bullet.pos.x} y={bullet.pos.y} texture={texture} />;
});

export default Bullet;
