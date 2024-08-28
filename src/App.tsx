import {MemoryRouter, Route, Routes} from 'react-router';
import {useExtend} from '@pixi/react';
import {AbstractRenderer, EventSystem, Text, TextureSource} from 'pixi.js';

import Application from './components/Application';
import DevTools from './components/DevTools';
import {Stats} from './components/Stats';
import {BACKGROUND_COLOR, HEIGHT, WIDTH} from './lib/constants';
import Game from './routes/Game';
import Title from './routes/Title';

import 'pixi.js/math-extras';

// Default global pixi settings
TextureSource.defaultOptions.scaleMode = 'nearest';
AbstractRenderer.defaultOptions.roundPixels = true;
EventSystem.defaultEventFeatures.move = true;
EventSystem.defaultEventFeatures.globalMove = true;

export default function App() {
  useExtend({Text});

  return (
    <>
      <Application
        preference="webgpu"
        width={WIDTH}
        height={HEIGHT}
        background={BACKGROUND_COLOR}
        loading={<pixiText text="Loading..." />}>
        <DevTools />
        <Stats />
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Title />} />
            <Route path="/title" element={<Title />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </MemoryRouter>
      </Application>
    </>
  );
}
