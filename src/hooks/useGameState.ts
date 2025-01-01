import {create} from 'zustand';

import {HEIGHT, WIDTH} from '../lib/constants';

import type {Pattern, PatternGenerator} from '../lib/patterns';
import type {Container} from 'pixi.js';

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
    update: (entity: T, update: Partial<T>) => void;
    bind: (id: number, ref?: SceneObjectRef) => void;
    unbind: (id: number) => void;
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

export type SceneObjectRef<T extends Container = Container> = T | null;

export type SceneObjectState = {
  id?: number;
  pos: {x: number; y: number};
  radius: number;
  texture?: string;
  ref?: SceneObjectRef;
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

export type EnemyState = EntityState & {
  sprite: string;
  pattern: Pattern<EnemyState>;
  generator?: PatternGenerator;
  dir: {x: number; y: number};
  scale: number;
  speed: number;
  delta: number;
  sleep: number;
  timestamp: number;
};

export type GameState = {
  players: StatePool<EntityState>;
  enemies: StatePool<EnemyState>;
  bullets: StatePool<BulletState>;
  collision: {
    pairs: CollisionPairs;
    actions: {
      set: (pairs: CollisionPairs) => void;
    };
  };
  world: {
    level: string;
    index: number;
    scroll: number;
  };
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
      update(entity: EntityState, update: Partial<EntityState>) {
        Object.assign(entity, update);
      },
      bind: (id: number, ref?: SceneObjectRef) => bindFrom(get().players, id, ref),
      unbind: (id: number) => unbindFrom(get().players, id),
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
      add: (entity: EnemyState) =>
        set(state => ({...state, enemies: {...state.enemies, count: addTo(state.enemies, entity)}})),
      remove: (entity: number | EnemyState) =>
        set(state => ({...state, enemies: {...state.enemies, count: removeFrom(state.enemies, entity)}})),
      update(entity: EnemyState, update: Partial<EnemyState>) {
        Object.assign(entity, update);
      },
      bind: (id: number, ref?: SceneObjectRef) => bindFrom(get().enemies, id, ref),
      unbind: (id: number) => unbindFrom(get().enemies, id),
      get: (index: number) => getFrom(get().enemies, index),
      map: <U>(fn: (entity: EnemyState, index: number) => U) => mapFrom(get().enemies, fn),
    },
    pool: {
      entities: Array<EnemyState>(MAX_ENEMIES).fill({
        sprite: '',
        pattern: function* (state: EnemyState) { void state; yield; }, // prettier-ignore
        generator: undefined,
        pos: {x: -WIDTH, y: -HEIGHT},
        dir: {x: 0, y: 0},
        radius: 0,
        scale: 1,
        speed: 0,
        delta: 0,
        sleep: 0,
        timestamp: 0,
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
      update(entity: BulletState, update: Partial<BulletState>) {
        Object.assign(entity, update);
      },
      bind: (id: number, ref?: SceneObjectRef) => bindFrom(get().bullets, id, ref),
      unbind: (id: number) => unbindFrom(get().bullets, id),
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
  world: {
    level: '',
    index: 0,
    scroll: 0,
  },
  collision: {
    pairs: [],
    actions: {
      set: (pairs: CollisionPairs) => set(state => ({...state, collision: {...state.collision, pairs}})),
    },
  },
  actions: {
    reset: () => reset(get()),
  },
}));

export const getGameState = <T>(selector: (state: GameState) => T): T => selector(useGameState.getState());

function addTo<T extends SceneObjectState>(state: StatePool<T>, entity: T): number {
  if (state.pool.ids.length === 0) throw new Error('Pool is full');

  const id = state.pool.ids.pop();
  if (id === undefined) throw new Error('Invalid id');

  state.pool.activeEntities.push(id);
  state.pool.entities[id] = Object.assign({}, state.pool.entities[id], entity, {id});

  return ++state.count;
}

function removeFrom<T extends SceneObjectState>(state: StatePool<T>, entity: number | T): number {
  const id = typeof entity === 'number' ? (entity as number) : entity.id ?? -1;
  if (id < 0 || id >= state.pool.entities.length) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  state.pool.ids.push(id);
  state.pool.entities[id].id = undefined;

  const index = state.pool.activeEntities.indexOf(id);
  if (index === -1) throw new Error('Invalid id; Not found.');

  state.pool.activeEntities[index] = state.pool.activeEntities[state.count - 1];
  state.pool.activeEntities.pop();

  return --state.count;
}

function getFrom<T extends SceneObjectState>(state: StatePool<T>, id: number): T {
  if (id < 0 || id >= state.pool.entities.length) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  return state.pool.entities[id];
}

function bindFrom<T extends SceneObjectState>(state: StatePool<T>, id: number, ref?: SceneObjectRef) {
  if (id < 0 || id >= state.pool.entities.length) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  const entity = state.pool.entities[id];
  if (ref) entity.ref = ref;
}

function unbindFrom<T extends SceneObjectState>(state: StatePool<T>, id: number) {
  if (id < 0 || id >= state.pool.entities.length) throw new Error(`Invalid id (${id}) - last: ${state.count}`);

  const entity = state.pool.entities[id];
  entity.ref = null;
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
  state.collision.pairs = [];
}

function mapFrom<T extends SceneObjectState, U>(state: StatePool<T>, fn: (entity: T, id: number) => U): U[] {
  const res: U[] = [];
  for (let i = 0; i < state.count; i++) {
    res[i] = fn(state.pool.entities[state.pool.activeEntities[i]], i);
  }
  return res;
}
