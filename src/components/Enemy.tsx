import {useEffect, useImperativeHandle, useRef} from 'react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps} from './Sprite';
import type {Sprite as PixiSprite, Texture} from 'pixi.js';

type EnemyProps = SpriteProps & {
  id: number;
  texture: Texture;
};

export default function Enemy({id, texture, ref: parentRef}: EnemyProps) {
  const ref = useRef<PixiSprite>(null);
  useImperativeHandle(parentRef, () => ref.current!, []);

  const actions = useGameState(state => state.enemies.actions);

  useEffect(() => {
    actions.bind(id, ref.current);
    () => actions.unbind(id);
  }, [actions, id]);

  return <Sprite ref={ref} label={`Enemy-${id}`} anchor={0.5} rotation={Math.PI} texture={texture} />;
}
