import {forwardRef, memo, useEffect, useImperativeHandle, useRef} from 'react';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';

import type {SpriteProps} from './Sprite';
import type {Sprite as PixiSprite, Texture} from 'pixi.js';
import type {Ref} from 'react';

type EnemyProps = SpriteProps & {
  id: number;
  texture: Texture;
};

const Enemy = memo(
  forwardRef(function Enemy({id, texture}: EnemyProps, forwardedRef: Ref<PixiSprite>) {
    const ref = useRef<PixiSprite>(null);
    useImperativeHandle(forwardedRef, () => ref.current!, []);

    const actions = useGameState(state => state.enemies.actions);

    useEffect(() => {
      actions.bind(id, ref.current);
      () => actions.unbind(id);
    }, [actions, id]);

    return <Sprite ref={ref} label={`Enemy-${id}`} anchor={0.5} rotation={Math.PI} texture={texture} />;
  }),
);

export default Enemy;
