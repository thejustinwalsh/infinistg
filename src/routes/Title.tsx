import {useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router';
import {Container, Text, useTick} from '@pixi/react';
import {TextStyle} from 'pixi.js';

import ScrollingTilingSprite from '../components/ScrollingTilingSprite';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';
import zzfx from '../lib/zzfx';

import type {PixiRef} from '@pixi/react';

export default function Title() {
  const actions = useGameState(state => state.actions);
  const players = useGameState(state => state.players);
  const navigate = useNavigate();
  const ref = useRef<PixiRef<typeof Text>>(null);

  useEffect(() => {
    actions.reset(),
      players.actions.add({
        texture: 'ship-1',
        pos: {x: WIDTH / 2, y: HEIGHT / 2},
        radius: 16,
        health: 100,
        maxHealth: 100,
        fireRate: 500 / 60,
      });
  }, [actions, players.actions]);

  useTick(() => {
    if (ref.current) {
      ref.current.alpha = Math.sin(performance.now() / 500) / 2 + 0.5;
    }
  });

  // TODO: Multiplayer?
  const handleClick = useCallback(() => {
    if (players.count === 0) {
      console.log('Adding player');
      players.actions.add({
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
  }, [players, navigate]);

  return (
    <Container name={'Title'} interactive touchend={handleClick} click={handleClick}>
      <ScrollingTilingSprite
        name="Background"
        image={'./assets/backgrounds/bg-1.png'}
        tilePosition={[0, 0]}
        scroll={[0, 0.25]}
      />
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
      <Text
        ref={ref}
        text="PRESS TO START"
        anchor={[0.5, 0.5]}
        x={WIDTH / 2}
        y={HEIGHT / 2 + 40}
        style={
          new TextStyle({
            align: 'center',
            fill: '0xf7f7f7',
            fontSize: 10,
            letterSpacing: 1,
          })
        }
      />
    </Container>
  );
}
