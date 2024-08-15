import type {EnemyState} from '../../../hooks/useGameState';
import type {PatternGenerator} from '../index';

export default function* (state: EnemyState): PatternGenerator {
  state.speed = 100;
  state.dir.y = 1;
  yield Number.MAX_SAFE_INTEGER;
}
