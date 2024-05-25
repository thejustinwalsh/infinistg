import {Container, useTick} from '@pixi/react';

import Bullet from './Bullet';
import {useAsset} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';

import type {Spritesheet} from 'pixi.js';

type BulletRunnerProps = {
  atlas: string;
};

export default function BulletRunner({atlas}: BulletRunnerProps) {
  const actions = useGameState(state => state.actions);
  const bullets = useGameState(state => state.bullets);

  const spriteSheet: Spritesheet = useAsset(atlas);
  const texture = spriteSheet.textures['bullet-1'];

  useTick(delta => {
    for (let i = 0; i < bullets.active; i++) {
      const bullet = bullets.pool[i];
      bullet.pos[0] += bullet.speed * Math.cos(bullet.dir - Math.PI / 2) * delta;
      bullet.pos[1] += bullet.speed * Math.sin(bullet.dir - Math.PI / 2) * delta;
      bullet.delta += delta;

      if (
        bullet.delta > bullet.lifetime ||
        bullet.pos[0] < -texture.width ||
        bullet.pos[0] > WIDTH + texture.width ||
        bullet.pos[1] < -texture.height ||
        bullet.pos[1] > HEIGHT + texture.height
      ) {
        bullet.delta = bullet.lifetime = 0;
        bullet.pos = [-WIDTH, -HEIGHT];
        actions.remove('bullets', i);
      }
    }
  });

  return (
    <Container>
      {actions.map('bullets', (bullet, index) => (
        <Bullet key={bullet.id ?? index} index={index} texture={texture} x={bullet.pos[0]} y={bullet.pos[1]} />
      ))}
    </Container>
  );
}
