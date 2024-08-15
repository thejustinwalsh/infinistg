import {useCallback, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router';
import {useExtend, useTick} from '@pixi/react';
import {Container, Text, TextStyle} from 'pixi.js';

import ScrollingTilingSprite from '../components/ScrollingTilingSprite';
import {useGameState} from '../hooks/useGameState';
import {HEIGHT, WIDTH} from '../lib/constants';
import zzfx from '../lib/zzfx';

export default function Title() {
  useExtend({Container, Text});

  const actions = useGameState(state => state.actions);
  const players = useGameState(state => state.players);
  const navigate = useNavigate();
  const ref = useRef<Text>(null);

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
    <container label="Title" interactive onTouchEnd={handleClick} onClick={handleClick}>
      <ScrollingTilingSprite
        label="Background"
        image={'./assets/backgrounds/bg-1.png'}
        tilePosition={{x: 0, y: 0}}
        scroll={[0, 0.25]}
      />
      <pixiText
        text="INFINISTG"
        anchor={0.5}
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
      <pixiText
        ref={ref}
        text="PRESS TO START"
        anchor={0.5}
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
    </container>
  );
}
