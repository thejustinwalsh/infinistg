import type {EnemyState} from '../../../hooks/useGameState';
import type {PatternGenerator} from '../index';

export default function* (state: EnemyState): PatternGenerator {
  state.speed = 2;
  state.dir.y = 1;
  while (true) {
    yield 0;
  }
}
