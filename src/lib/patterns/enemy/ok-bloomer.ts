import {Point} from 'pixi.js';

import type {EnemyState, GameState} from '../../../hooks/useGameState';
import type {PatternGenerator} from '../index';

function spawn(dir: number, state: EnemyState, world: () => GameState) {
  const {actions} = world().enemies;
  actions.add({
    sprite: state.sprite,
    pos: structuredClone(state.pos),
    scale: state.scale * 0.5,
    radius: state.radius * 0.5,
    health: 100,
    maxHealth: 100,
    fireRate: 1000,
    pattern: moveTowardPlayer,
    speed: 100,
    dir: {x: Math.cos(dir), y: Math.sin(dir)},
    delta: 0,
    sleep: 0,
    timestamp: 0,
  });
}

function* moveTowardPlayer(state: EnemyState): PatternGenerator {
  while (true) {
    const {players} = yield;
    const player = players.actions.get(0);
    state.dir = structuredClone(new Point(player.pos.x, player.pos.y).subtract(state.pos).normalize());
  }
}

function* bloom(state: EnemyState, world: () => GameState): PatternGenerator {
  void state;

  for (let i = 0; i < 360; i += 15) {
    spawn(i, state, world);
    yield 10;
  }
}

export default function* (state: EnemyState, world: () => GameState): PatternGenerator {
  state.speed = 100;

  // Travel Downward for 1000ms
  state.dir.y = 1;
  yield 1000;

  // Hold for 200ms
  state.dir = {x: 0, y: 0};
  yield 200;

  // Emit Spinner
  yield* bloom(state, world);

  // Increase speed
  state.speed *= 4;

  // Move toward player
  moveTowardPlayer(state);
}
