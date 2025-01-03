import {useImperativeHandle, useRef} from 'react';
import {useApplication, useSuspenseAssets, useTick} from '@pixi/react';
import {Point} from 'pixi.js';

import Sprite from './Sprite';
import {useGameState} from '../hooks/useGameState';
import {useTickAction} from '../hooks/useTickAction';
import {MOVEMENT_SPEED} from '../lib/constants';

import type {SpriteProps} from './Sprite';
import type {Sprite as PixiSprite, Spritesheet} from 'pixi.js';

type PlayerProps = Omit<SpriteProps, 'texture'> & {
  id: number;
  atlas: string;
  texture: string;
};

export default function Player({id, atlas, texture, ref: parentRef}: PlayerProps) {
  const ref = useRef<PixiSprite>(null);
  useImperativeHandle(parentRef, () => ref.current!, []);

  const {app} = useApplication();
  const playerActions = useGameState(state => state.players.actions);
  const bulletActions = useGameState(state => state.bullets.actions);
  const [spriteSheet] = useSuspenseAssets<Spritesheet>([atlas]);

  const player = playerActions.get(id);
  const sprite = spriteSheet.textures[texture];
  const scale = 1.5;

  // Update player position
  useTick(({deltaTime: delta}) => {
    const globalPos = new Point(
      Math.min(
        app.renderer.screen.width - sprite.width / 2,
        Math.max(sprite.width / 2, app.renderer.events.pointer.global.x),
      ),
      Math.min(
        app.renderer.screen.height - sprite.height / 2,
        Math.max(sprite.height / 2, app.renderer.events.pointer.global.y),
      ),
    );
    const dir = globalPos.subtract(player.pos).normalize();
    const distance = globalPos.subtract(player.pos).magnitude();

    if (distance >= MOVEMENT_SPEED) {
      const destination = dir.multiplyScalar(MOVEMENT_SPEED * delta).add(player.pos);
      player.pos.x = destination.x;
      player.pos.y = destination.y;
      ref.current?.position.set(player.pos.x, player.pos.y);
    }
  });

  // Fire bullets
  useTickAction(player.fireRate, () => {
    bulletActions.add({
      pos: {x: player.pos.x, y: player.pos.y},
      dir: 0,
      radius: 4,
      speed: 10,
      damage: 10,
      delta: 0,
      lifetime: 1000,
    });
  });

  return (
    <Sprite
      ref={ref}
      label={`Player-${id}`}
      scale={scale}
      anchor={0.5}
      x={player.pos.x}
      y={player.pos.y}
      texture={sprite}
    />
  );
}
