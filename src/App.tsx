import {MemoryRouter, Route, Routes} from 'react-router';
import {Text} from '@pixi/react';
import {BaseTexture, SCALE_MODES, settings} from 'pixi.js';

import Stage from './components/Stage';
import {Stats} from './components/Stats';
import {BACKGROUND_COLOR, HEIGHT, WIDTH} from './lib/constants';
import Game from './routes/Game';
import Title from './routes/Title';

import '@pixi/math-extras';

// Default global pixi settings
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = true;

export default function App() {
  return (
    <Stage width={WIDTH} height={HEIGHT} options={{background: BACKGROUND_COLOR}} loading={<Text text="Loading..." />}>
      <Stats />
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Title />} />
          <Route path="/title" element={<Title />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </MemoryRouter>
    </Stage>
  );
}
