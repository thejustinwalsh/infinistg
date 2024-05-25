import {Container} from '@pixi/react';

import BulletRunner from '../components/BulletRunner';
import Player from '../components/Player';
import {useGameState} from '../hooks/useGameState';

export default function Game() {
  const actions = useGameState(state => state.actions);

  return (
    <Container>
      {actions.map('players', (player, index) => (
        <Player key={index} index={index} atlas="/assets/ships/atlas.json" texture={player.texture ?? 'ship-1'} />
      ))}
      <BulletRunner atlas="/assets/bullets/atlas.json" />
    </Container>
  );
}
