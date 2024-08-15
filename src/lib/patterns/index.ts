import type {GameState, SceneObjectState} from '../../hooks/useGameState';

export type PatternGenerator = Generator<number | undefined, number | void, GameState>;
export type Pattern<T extends SceneObjectState> = (state: T, world: () => GameState) => PatternGenerator;

export function pattern(name: string) {
  return import(`./enemy/${name}`).then(module => module.default).catch(() => undefined);
}
