import {useRef} from 'react';
import {useTick} from '@pixi/react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps, SpriteRef} from './Sprite';
import type {BulletState} from '../hooks/useGameState';
import type {Texture} from 'pixi.js';

type BulletProps = Omit<SpriteProps, 'texture'> & {
  index: number;
  texture: Texture;
};

const Bullet = function Bullet({index, texture}: BulletProps) {
  const ref = useRef<SpriteRef>(null);
  const actions = useGameState(state => state.actions);
  const bullet = actions.get('bullets', index) as BulletState; // TODO: Fix this type

  useTick(() => {
    if (ref.current) {
      ref.current.position.set(bullet.pos[0], bullet.pos[1]);
    }
  });

  return <Sprite ref={ref} anchor={0.5} x={bullet.pos[0]} y={bullet.pos[1]} texture={texture} />;
};

export default Bullet;
