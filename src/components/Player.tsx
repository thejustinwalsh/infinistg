import {forwardRef, useCallback, useEffect, useState} from 'react';
import {Point} from 'pixi.js';

import Sprite from './Sprite';
import {useAsset} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {usePointerMovement} from '../hooks/usePointerMovement';
import {useTickAction} from '../hooks/useTickAction';
import {HEIGHT, MOVEMENT_SPEED, WIDTH} from '../lib/constants';

import type {SpriteRef} from './Sprite';
import type {EntityState} from '../hooks/useGameState';
import type {Spritesheet} from 'pixi.js';
import type {Ref} from 'react';

type PlayerProps = {
  index: number;
  atlas: string;
  texture: string;
};

let bulletId = 0;

const Player = forwardRef(({index, atlas, texture}: PlayerProps, ref: Ref<SpriteRef>) => {
  const actions = useGameState(state => state.actions);
  const player = actions.get('players', index) as EntityState; // TODO: Fix this type

  const spriteSheet: Spritesheet = useAsset(atlas);
  const ship = spriteSheet.textures[texture];
  const scale = 2;

  const [pos, setPos] = useState(new Point(0, 0));
  const clamp = useCallback(
    (p: Point) =>
      p.set(
        Math.min(WIDTH - ship.width / 2, Math.max(ship.width / 2, p.x)),
        Math.min(HEIGHT - ship.height / 2, Math.max(ship.height / 2, p.y)),
      ),
    [ship],
  );
  const target = usePointerMovement(pos, MOVEMENT_SPEED, clamp);

  useEffect(
    () =>
      setPos(() => {
        player.pos = [target.x, target.y];
        return target;
      }),
    [target, player],
  );

  useTickAction(player.fireRate, () => {
    actions.add('bullets', {
      id: ++bulletId,
      pos: [target.x, target.y],
      dir: 0,
      radius: 4,
      speed: 10,
      damage: 10,
      delta: 0,
      lifetime: 1000,
    });
  });

  return <Sprite ref={ref} scale={scale} anchor={0.5} x={pos.x} y={pos.y} texture={ship} />;
});

export default Player;
