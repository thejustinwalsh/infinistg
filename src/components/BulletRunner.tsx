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
  const bullets = useGameState(state => state.bullets);

  const spriteSheet: Spritesheet = useAsset(atlas);
  const texture = spriteSheet.textures['bullet-1'];

  useTick(delta => {
    const pendingRemoval: number[] = [];

    for (let i = 0; i < bullets.count; i++) {
      const id = bullets.pool.activeEntities[i];
      const bullet = bullets.pool.entities[bullets.pool.activeEntities[i]];
      bullet.pos.x += bullet.speed * Math.cos(bullet.dir - Math.PI / 2) * delta;
      bullet.pos.y += bullet.speed * Math.sin(bullet.dir - Math.PI / 2) * delta;
      bullet.delta += delta;

      if (
        bullet.delta > bullet.lifetime ||
        bullet.pos.x < -texture.width ||
        bullet.pos.x > WIDTH + texture.width ||
        bullet.pos.y < -texture.height ||
        bullet.pos.y > HEIGHT + texture.height
      ) {
        bullet.delta = bullet.lifetime = 0;
        bullet.pos.x = -WIDTH;
        bullet.pos.y = -HEIGHT;
        pendingRemoval.push(id);
      }
    }

    pendingRemoval.forEach(id => bullets.actions.remove(id));
  });

  return (
    <Container name="BulletRunner">
      {bullets.actions.map(bullet => (
        <Bullet key={bullet.id} id={bullet.id ?? -1} texture={texture} x={bullet.pos.x} y={bullet.pos.y} />
      ))}
    </Container>
  );
}
