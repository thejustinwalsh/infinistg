import {useExtend, useSuspenseAssets, useTick} from '@pixi/react';
import {Container} from 'pixi.js';

import Enemy from './Enemy';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';

import type {Spritesheet} from 'pixi.js';

type EnemyRunnerProps = {
  atlas: string;
};

export default function EnemyRunner({atlas}: EnemyRunnerProps) {
  useExtend({Container});

  const enemies = useGameState(state => state.enemies);

  const [spriteSheet] = useSuspenseAssets<Spritesheet>([atlas]);
  const texture = (sprite: string) => spriteSheet.textures[sprite] ?? spriteSheet.textures['ship-2'];

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

      if (enemy.ref?.parent) {
        enemy.ref.position.set(enemy.pos.x, enemy.pos.y);
      }

      if (
        enemy.pos.x < -enemy.radius ||
        enemy.pos.x > WIDTH + enemy.radius ||
        enemy.pos.y < -enemy.radius ||
        enemy.pos.y > HEIGHT + enemy.radius
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
        <Enemy key={enemy.id} id={enemy.id ?? -1} texture={texture(enemy.sprite)} />
      ))}
    </container>
  );
}
