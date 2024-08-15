import {useExtend, useTick} from '@pixi/react';
import {Container} from 'pixi.js';

import Enemy from './Enemy';
import {useAsset} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';

import type {Spritesheet} from 'pixi.js';

type EnemyRunnerProps = {
  atlas: string;
};

export default function EnemyRunner({atlas}: EnemyRunnerProps) {
  useExtend({Container});

  const enemies = useGameState(state => state.enemies);

  const spriteSheet: Spritesheet = useAsset(atlas);
  const texture = spriteSheet.textures['bullet-1'];

  useTick(({deltaTime: delta}) => {
    const pendingRemoval: number[] = [];

    for (let i = 0; i < enemies.count; i++) {
      const id = enemies.pool.activeEntities[i];
      const enemy = enemies.pool.entities[enemies.pool.activeEntities[i]];
      if (!enemy.generator) enemy.generator = enemy.pattern(enemy, () => useGameState.getState());

      enemy.delta += delta;
      if (enemy.delta - enemy.timestamp < enemy.sleep) continue;
      const {value: sleep, done} = enemy.generator.next(useGameState.getState());
      if (done) { pendingRemoval.push(id); continue; } // prettier-ignore

      enemy.timestamp = enemy.delta;
      enemy.sleep = sleep ?? 0;
      enemy.pos.x += enemy.speed * enemy.dir.x * delta;
      enemy.pos.y += enemy.speed * enemy.dir.y * delta;

      if (
        enemy.pos.x < -texture.width ||
        enemy.pos.x > WIDTH + texture.width ||
        enemy.pos.y < -texture.height ||
        enemy.pos.y > HEIGHT + texture.height
      ) {
        enemy.delta = enemy.timestamp = enemy.sleep = 0;
        enemy.generator = undefined;
        enemy.pos.x = -WIDTH;
        enemy.pos.y = -HEIGHT;
        pendingRemoval.push(id);
      }
    }

    pendingRemoval.forEach(id => enemies.actions.remove(id));
  });

  return (
    <container label="EnemyRunner">
      {enemies.actions.map(enemy => (
        <Enemy key={enemy.id} id={enemy.id ?? -1} texture={texture} x={enemy.pos.x} y={enemy.pos.y} />
      ))}
    </container>
  );
}
