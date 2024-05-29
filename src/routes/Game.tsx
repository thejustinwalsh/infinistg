import {Container} from '@pixi/react';
import {Point} from 'pixi.js';

import BulletRunner from '../components/BulletRunner';
import Player from '../components/Player';
import TileMap from '../components/TileMap';
import {useGameState} from '../hooks/useGameState';
import {TickGroup, useTickGroup} from '../hooks/useTickGroup';
import SpatialHash from '../lib/spatial-hash';

import type {CollisionPairs} from '../hooks/useGameState';

const spatialHash = SpatialHash<{pool: string; id: number; x: number; y: number; width: number; height: number}>(32);

export default function Game() {
  const players = useGameState(state => state.players);
  const enemies = useGameState(state => state.enemies);
  const bullets = useGameState(state => state.bullets);
  const collision = useGameState(state => state.collision);

  useTickGroup(TickGroup.POST_TICK, () => {
    const collisions: CollisionPairs = [];
    spatialHash.clear();

    // Palyer Bullets vs Enemies
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
    <Container>
      <TileMap tileMap="/data/level-1.json" />
      {players.actions.map((player, index) => (
        <Player key={index} id={index} atlas="/assets/ships/atlas.json" texture={player.texture ?? 'ship-1'} />
      ))}
      <BulletRunner atlas="/assets/bullets/atlas.json" />
    </Container>
  );
}
