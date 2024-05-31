import {forwardRef, useImperativeHandle, useRef} from 'react';
import {useApp, useTick} from '@pixi/react';
import {Point} from 'pixi.js';

import Sprite from './Sprite';
import {useAsset} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {useTickAction} from '../hooks/useTickAction';
import {HEIGHT, MOVEMENT_SPEED, WIDTH} from '../lib/constants';

import type {SpriteRef} from './Sprite';
import type {Spritesheet} from 'pixi.js';
import type {Ref} from 'react';

type PlayerProps = {
  id: number;
  atlas: string;
  texture: string;
};

const Player = forwardRef(function Player({id, atlas, texture}: PlayerProps, forwardedRef: Ref<SpriteRef>) {
  const ref = useRef<SpriteRef>(null);
  useImperativeHandle(forwardedRef, () => ref.current!, []);

  const app = useApp();
  const players = useGameState(state => state.players);
  const bullets = useGameState.getState().bullets;
  const spriteSheet: Spritesheet = useAsset(atlas);

  const player = players.actions.get(id);
  const sprite = spriteSheet.textures[texture];
  const scale = 2;

  // Update player position
  useTick(delta => {
    const globalPos = new Point(
      Math.min(WIDTH - sprite.width / 2, Math.max(sprite.width / 2, app.renderer.events.pointer.global.x)),
      Math.min(HEIGHT - sprite.height / 2, Math.max(sprite.height / 2, app.renderer.events.pointer.global.y)),
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
    bullets.actions.add({
      pos: {x: player.pos.x, y: player.pos.y},
      dir: 0,
      radius: 4,
      speed: 10,
      damage: 10,
      delta: 0,
      lifetime: 1000,
    });
  });

  return <Sprite ref={ref} scale={scale} anchor={0.5} x={player.pos.x} y={player.pos.y} texture={sprite} />;
});

export default Player;
