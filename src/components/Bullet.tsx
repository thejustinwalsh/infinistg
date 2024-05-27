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

export default function Bullet({index, texture}: BulletProps) {
  const ref = useRef<SpriteRef>(null);
  const actions = useGameState(state => state.actions);
  const bullet = actions.get('bullets', index) as BulletState; // TODO: Fix this type

  useTick(() => {
    if (ref.current) {
      ref.current.position.set(bullet.pos.x, bullet.pos.y);
    }
  });

  return <Sprite ref={ref} anchor={0.5} x={bullet.pos.x} y={bullet.pos.y} texture={texture} />;
}
