/* eslint-disable react-refresh/only-export-components */

import {create} from 'zustand';

import {HEIGHT, WIDTH} from '../lib/constants';

const MAX_PLAYERS = 4;
const MAX_ENEMIES = 100;
const MAX_BULLETS = 5000;

export type StatePool<T> = {
  pool: {
    entities: T[];
    activeEntities: number[];
    ids: number[];
  };
  count: number;
};

export type SceneObjectState = {
  id?: number;
  pos: {x: number; y: number};
  radius: number;
  texture?: string;
};

export type EntityState = SceneObjectState & {
  fireRate: number;
  health: number;
  maxHealth: number;
};

export type BulletState = SceneObjectState & {
  dir: number;
  speed: number;
  damage: number;
  delta: number;
  lifetime: number;
};

export type GameState = {
  players: StatePool<EntityState>;
  enemies: StatePool<EntityState>;
  bullets: StatePool<BulletState>;
  actions: {
    add: (pool: GameStateEntityPoolKeys, entity: GameStateEntity) => void;
    remove: (pool: GameStateEntityPoolKeys, index: number) => void;
    get: (pool: GameStateEntityPoolKeys, index: number) => GameStateEntity;
    map: <U>(pool: GameStateEntityPoolKeys, fn: (entity: GameStateEntity, index: number) => U) => U[];
    reset: () => void;
  };
};

export type GameStateEntityPoolKeys = keyof Omit<GameState, 'actions'>;
export type GameStateEntityPools = GameState[GameStateEntityPoolKeys];
export type GameStateEntity = GameStateEntityPools extends StatePool<infer T> ? T : never;
export type GameStateAction = {
  type: string;
  payload: GameStateEntity;
};

export const useGameState = create<GameState>((set, get) => ({
  players: {
    pool: {
      entities: Array<EntityState>(MAX_PLAYERS).fill({
        pos: {x: -WIDTH, y: -HEIGHT},
        radius: 0,
        fireRate: 0,
        health: 0,
        maxHealth: 0,
      }),
      activeEntities: [],
      ids: Array(MAX_PLAYERS)
        .fill(0)
        .map((_, i) => MAX_PLAYERS - 1 - i),
    },
    count: 0,
  },
  enemies: {
    pool: {
      entities: Array<EntityState>(MAX_ENEMIES).fill({
        pos: {x: -WIDTH, y: -HEIGHT},
        radius: 0,
        fireRate: 0,
        health: 0,
        maxHealth: 0,
      }),
      activeEntities: [],
      ids: Array(MAX_ENEMIES)
        .fill(0)
        .map((_, i) => MAX_ENEMIES - 1 - i),
    },
    count: 0,
  },
  bullets: {
    pool: {
      entities: Array<BulletState>(MAX_BULLETS).fill({
        pos: {x: -WIDTH, y: -HEIGHT},
        dir: 0,
        radius: 0,
        speed: 0,
        damage: 0,
        delta: 0,
        lifetime: 0,
      }),
      activeEntities: [],
      ids: Array(MAX_BULLETS)
        .fill(0)
        .map((_, i) => MAX_BULLETS - 1 - i),
    },
    count: 0,
  },
  actions: {
    add: (pool: GameStateEntityPoolKeys, entity: GameStateEntity) =>
      set(state => ({...state, [pool]: {pool: state[pool].pool, count: addTo(state[pool], entity)}})),
    remove: (pool: GameStateEntityPoolKeys, entity: number | GameStateEntity) =>
      set(state => ({...state, [pool]: {pool: state[pool].pool, count: removeFrom(state[pool], entity)}})),
    get: (pool: GameStateEntityPoolKeys, index: number) => getFrom(get()[pool], index),
    map: <U>(pool: GameStateEntityPoolKeys, fn: (entity: GameStateEntity, index: number) => U) =>
      mapFrom(get()[pool], fn),
    reset: () => reset(get()),
  },
}));

function addTo(state: GameStateEntityPools, entity: GameStateEntity): number {
  if (state.pool.ids.length === 0) throw new Error('Pool is full');

  const id = state.pool.ids.pop();
  if (id === undefined) throw new Error('Invalid id');

  console.log(
    'Adding entity to pool: ',
    entity,
    id,
    state.pool.ids.length,
    state.pool.activeEntities.length,
    state.pool.entities.length,
  );

  state.pool.activeEntities.push(id);

  console.log(Object.entries(state.pool.entities[id]));
  state.pool.entities[id] = Object.assign({}, state.pool.entities[id], entity, {id});
  console.log(Object.entries(state.pool.entities[id]));
  console.log('Added entity to pool: ', state.pool.entities[id]);

  return ++state.count;
}

function removeFrom(state: GameStateEntityPools, entity: number | GameStateEntity) {
  const id = typeof entity === 'number' ? (entity as number) : entity.id ?? -1;
  if (id < 0 || id >= state.count) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  state.pool.ids.push(id);
  state.pool.entities[id].id = undefined;

  const index = state.pool.activeEntities.indexOf(id);
  if (index === -1) throw new Error('Invalid index');

  state.pool.activeEntities[index] = state.pool.activeEntities[state.count - 1];
  state.pool.activeEntities.pop();

  return --state.count;
}

function getFrom(state: GameStateEntityPools, id: number) {
  if (id < 0 || id >= state.pool.entities.length) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  return state.pool.entities[id];
}

function reset(state: GameState) {
  state.players.pool.ids = Array(MAX_PLAYERS)
    .fill(0)
    .map((_, i) => MAX_PLAYERS - 1 - i);
  state.players.count = 0;
  state.enemies.pool.ids = Array(MAX_ENEMIES)
    .fill(0)
    .map((_, i) => MAX_ENEMIES - 1 - i);
  state.enemies.count = 0;
  state.bullets.pool.ids = Array(MAX_BULLETS)
    .fill(0)
    .map((_, i) => MAX_BULLETS - 1 - i);
  state.bullets.count = 0;
}

function mapFrom<U>(state: GameStateEntityPools, fn: (entity: GameStateEntity, id: number) => U): U[] {
  const res: U[] = [];
  console.log(state);
  for (let i = 0; i < state.count; i++) {
    res[i] = fn(state.pool.entities[state.pool.activeEntities[i]], i);
  }
  return res;
}
