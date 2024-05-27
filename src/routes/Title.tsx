import {useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {Container, Text} from '@pixi/react';
import {TextStyle} from 'pixi.js';

import Sprite from '../components/Sprite';
import {useAsset} from '../hooks/useAsset';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';
import zzfx from '../lib/zzfx';

import type {Spritesheet} from 'pixi.js';

export default function Title() {
  const [players, actions] = useGameState(state => [state.players, state.actions] as const);
  const navigate = useNavigate();

  useEffect(() => {
    actions.reset(),
      actions.add('players', {
        texture: 'ship-1',
        pos: {x: WIDTH / 2, y: HEIGHT / 2},
        radius: 16,
        health: 100,
        maxHealth: 100,
        fireRate: 500 / 60,
      });
  }, [actions]);

  // TODO: Multiplayer?
  const handlePointerDown = useCallback(() => {
    if (players.active === 0) {
      console.log('Adding player');
      actions.add('players', {
        texture: 'ship-1',
        pos: {x: WIDTH / 2, y: HEIGHT / 2},
        radius: 16,
        health: 100,
        maxHealth: 100,
        fireRate: 500 / 60,
      });
    }
    zzfx.start();
    navigate('/game'), [navigate];
  }, [players, actions, navigate]);
  const spriteSheet: Spritesheet = useAsset('/assets/ships/atlas.json');
  const shipWidth = spriteSheet.textures['ship-1'].width;

  return (
    <Container interactive pointerdown={handlePointerDown}>
      <Text
        text="INFINISTG"
        anchor={[0.5, 0.5]}
        x={WIDTH / 2}
        y={HEIGHT / 2}
        style={
          new TextStyle({
            align: 'center',
            fill: '0xf7f7f7',
            fontSize: 32,
            letterSpacing: 4,
          })
        }
      />
      <Container x={WIDTH / 2 - (shipWidth * 5) / 2} y={HEIGHT / 2 + 18}>
        <Sprite texture={spriteSheet.textures['ship-1']} />
        <Sprite x={shipWidth * 1} texture={spriteSheet.textures['ship-2']} />
        <Sprite x={shipWidth * 2} texture={spriteSheet.textures['ship-3']} />
        <Sprite x={shipWidth * 3} texture={spriteSheet.textures['ship-4']} />
        <Sprite x={shipWidth * 4} texture={spriteSheet.textures['ship-5']} />
      </Container>
    </Container>
  );
}
