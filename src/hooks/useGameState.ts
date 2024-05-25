/* eslint-disable react-refresh/only-export-components */

import {create} from 'zustand';

import {HEIGHT, WIDTH} from '../lib/constants';

const MAX_PLAYERS = 4;
const MAX_ENEMIES = 100;
const MAX_BULLETS = 5000;

export type StatePool<T> = {
  pool: T[];
  active: number;
};

export type SceneObjectState = {
  id?: number;
  pos: [x: number, y: number];
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
    pool: Array<EntityState>(MAX_PLAYERS).fill({
      pos: [-WIDTH, -HEIGHT],
      radius: 0,
      fireRate: 0,
      health: 0,
      maxHealth: 0,
    }),
    active: 0,
  },
  enemies: {
    pool: Array<EntityState>(MAX_ENEMIES).fill({
      pos: [-WIDTH, -HEIGHT],
      radius: 0,
      fireRate: 0,
      health: 0,
      maxHealth: 0,
    }),
    active: 0,
  },
  bullets: {
    pool: Array<BulletState>(MAX_BULLETS).fill({
      pos: [-WIDTH, -HEIGHT],
      dir: 0,
      radius: 0,
      speed: 0,
      damage: 0,
      delta: 0,
      lifetime: 0,
    }),
    active: 0,
  },
  actions: {
    add: (pool: GameStateEntityPoolKeys, entity: GameStateEntity) =>
      set(state => ({...state, [pool]: {pool: state[pool].pool, active: addTo(state[pool], entity)}})),
    remove: (pool: GameStateEntityPoolKeys, index: number) =>
      set(state => ({...state, [pool]: {pool: state[pool].pool, active: removeFrom(state[pool], index)}})),
    get: (pool: GameStateEntityPoolKeys, index: number) => getFrom(get()[pool], index),
    map: <U>(pool: GameStateEntityPoolKeys, fn: (entity: GameStateEntity, index: number) => U) =>
      mapFrom(get()[pool], fn),
    reset: () => reset(get()),
  },
}));

function addTo(state: GameStateEntityPools, entity: GameStateEntity): number {
  if (state.active >= state.pool.length) throw new Error('Pool is full');

  state.pool[state.active] = structuredClone(entity);
  return state.active + 1;
}

function removeFrom(state: GameStateEntityPools, index: number) {
  if (index < 0 || index >= state.active) throw new Error(`Invalid index (${index}) max: ${state.active}`);
  state.pool[index] = state.pool[state.active - 1];
  return Math.max(0, state.active - 1);
}

function getFrom(state: GameStateEntityPools, index: number) {
  if (index < 0 || index >= state.active) throw new Error('Invalid index');

  return state.pool[index];
}

function reset(state: GameState) {
  state.players.active = 0;
  state.enemies.active = 0;
  state.bullets.active = 0;
}

function mapFrom<U>(state: GameStateEntityPools, fn: (entity: GameStateEntity, index: number) => U): U[] {
  const res = Array(state.active);
  for (let i = 0; i < state.active; i++) {
    res[i] = fn(state.pool[i], i);
  }
  return res;
}
