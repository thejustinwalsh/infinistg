import {Container} from '@pixi/react';

import BulletRunner from '../components/BulletRunner';
import Player from '../components/Player';
import TileMap from '../components/TileMap';
import {useGameState} from '../hooks/useGameState';

export default function Game() {
  const players = useGameState(state => state.players);

  return (
    <Container>
      <TileMap tileMap="/data/level-1.json" />
      {players.actions.map((player, index) => (
        <Player key={index} id={index} atlas="/assets/ships/atlas.json" texture={player.texture ?? 'ship-1'} />
      ))}
      <BulletRunner atlas="/assets/bullets/atlas.json" />
    </Container>
  );
}
