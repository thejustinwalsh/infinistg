import {Container} from '@pixi/react';
import {Point} from 'pixi.js';

import BulletRunner from '../components/BulletRunner';
import Player from '../components/Player';
import ScrollingTilingSprite from '../components/ScrollingTilingSprite';
import World from '../components/World';
import {useGameState} from '../hooks/useGameState';
import {TickGroup, useTickGroup} from '../hooks/useTickGroup';
import SpatialHash from '../lib/spatial-hash';

import type {CollisionPairs} from '../hooks/useGameState';

const spatialHash = SpatialHash<{pool: string; id: number; x: number; y: number; width: number; height: number}>(32);

export default function Game() {
  const players = useGameState.getState().players;
  const enemies = useGameState.getState().enemies;
  const bullets = useGameState.getState().bullets;
  const collision = useGameState.getState().collision;

  useTickGroup(TickGroup.POST_TICK, () => {
    const collisions: CollisionPairs = [];
    spatialHash.clear();

    // Player Bullets vs Enemies
    bullets.pool.activeEntities.forEach(id => {
      const bullet = bullets.pool.entities[id];
      spatialHash.insert({
        pool: 'bullets',
        id,
        x: bullet.pos.x,
        y: bullet.pos.y,
        width: bullet.radius,
        height: bullet.radius,
      });
    });
    enemies.pool.activeEntities.forEach(id => {
      const enemy = enemies.pool.entities[id];
      const bullets = spatialHash.retrieve(undefined, {
        x: enemy.pos.x,
        y: enemy.pos.y,
        width: enemy.radius,
        height: enemy.radius,
      });

      bullets.forEach(bullet => {
        const hit =
          new Point(enemy.pos.x, enemy.pos.y).subtract({x: bullet.x, y: bullet.y}).magnitude() >
          enemy.radius + bullet.width;
        if (hit) {
          collisions.push({target: {pool: 'enemies', id}, instigator: {pool: 'bullets', id: bullet.id}});
        }
      });
    });

    // TODO: Player vs Enemies

    // TODO: Player vs Tiles

    collision.actions.set(collisions);
  });

  return (
    <Container name={'Game'}>
      <ScrollingTilingSprite
        name="Background"
        image={'./assets/backgrounds/bg-1.png'}
        tilePosition={[0, 0]}
        scroll={[0, 0.25]}
      />
      <World world="./assets/maps/infinistg.json" level="Level_1" />
      {players.actions.map((player, index) => (
        <Player key={index} id={index} atlas="./assets/ships/atlas.json" texture={player.texture ?? 'ship-1'} />
      ))}
      <BulletRunner atlas="./assets/bullets/atlas.json" />
    </Container>
  );
}
