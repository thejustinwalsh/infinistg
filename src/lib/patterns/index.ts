import okBloomer from './enemy/ok-bloomer';
import straightDown from './enemy/straight-down';

import type {GameState, SceneObjectState} from '../../hooks/useGameState';

export type PatternGenerator = Generator<number | undefined, number | void, GameState>;
export type Pattern<T extends SceneObjectState> = (state: T, world: () => GameState) => PatternGenerator;

export function pattern(name: string) {
  switch (name) {
    case 'ok-bloomer':
      return okBloomer;
    case 'straight-down':
      return straightDown;
  }

  return straightDown;
}
