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

const Enemy = forwardRef(function Enemy({id, texture}: BulletProps, forwardedRef: Ref<SpriteRef>) {
  const ref = useRef<SpriteRef>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const enemies = useGameState(state => state.bullets);
  const enemy = enemies.actions.get(id);

  useTick(() => {
    ref.current?.position.set(enemy.pos.x, enemy.pos.y);
  });

  return <Sprite ref={ref} name={`Enemy-${id}`} anchor={0.5} x={enemy.pos.x} y={enemy.pos.y} texture={texture} />;
});

export default Enemy;
