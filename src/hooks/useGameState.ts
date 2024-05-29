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
  actions: {
    add: (entity: T) => void;
    remove: (index: number) => void;
    get: (index: number) => T;
    map: <U>(fn: (entity: T, index: number) => U) => U[];
  };
  count: number;
};

export type CollisionPairs = {
  target: CollisionEntityKey;
  instigator: CollisionEntityKey;
}[];

export type CollisionEntityKey = {
  pool: GameStateEntityPoolKeys;
  id: number;
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
  collisions: CollisionPairs[];
  actions: {
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
    actions: {
      add: (entity: EntityState) =>
        set(state => ({...state, players: {...state.players, count: addTo(state.players, entity)}})),
      remove: (entity: number | EntityState) =>
        set(state => ({...state, players: {...state.players, count: removeFrom(state.players, entity)}})),
      get: (index: number) => getFrom(get().players, index),
      map: <U>(fn: (entity: EntityState, index: number) => U) => mapFrom(get().players, fn),
    },
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
    actions: {
      add: (entity: EntityState) =>
        set(state => ({...state, enemies: {...state.enemies, count: addTo(state.enemies, entity)}})),
      remove: (entity: number | EntityState) =>
        set(state => ({...state, enemies: {...state.enemies, count: removeFrom(state.enemies, entity)}})),
      get: (index: number) => getFrom(get().enemies, index),
      map: <U>(fn: (entity: EntityState, index: number) => U) => mapFrom(get().enemies, fn),
    },
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
    actions: {
      add: (entity: BulletState) =>
        set(state => ({...state, bullets: {...state.bullets, count: addTo(state.bullets, entity)}})),
      remove: (entity: number | BulletState) =>
        set(state => ({...state, bullets: {...state.bullets, count: removeFrom(state.bullets, entity)}})),
      get: (index: number) => getFrom(get().bullets, index),
      map: <U>(fn: (entity: BulletState, index: number) => U) => mapFrom(get().bullets, fn),
    },
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
  collisions: [],
  actions: {
    reset: () => reset(get()),
  },
}));

function addTo<T extends SceneObjectState>(state: StatePool<T>, entity: T): number {
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

function removeFrom<T extends SceneObjectState>(state: StatePool<T>, entity: number | T): number {
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

function getFrom<T extends SceneObjectState>(state: StatePool<T>, id: number): T {
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

function mapFrom<T extends SceneObjectState, U>(state: StatePool<T>, fn: (entity: T, id: number) => U): U[] {
  const res: U[] = [];
  console.log(state);
  for (let i = 0; i < state.count; i++) {
    res[i] = fn(state.pool.entities[state.pool.activeEntities[i]], i);
  }
  return res;
}
