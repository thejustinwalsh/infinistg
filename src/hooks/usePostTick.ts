import {useEffect, useRef} from 'react';
import {useApp} from '@pixi/react';
import {UPDATE_PRIORITY} from 'pixi.js';

type Callback = (delta: number) => void;

export function usePostTick(callback: Callback, enabled = true) {
  const app = useApp();
  const callbackRef = useRef<Callback | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (enabled) {
      const tick = (delta: number) => callbackRef.current?.apply(app.ticker, [delta]);
      app.ticker.add(tick, undefined, UPDATE_PRIORITY.LOW);

      return () => {
        if (app.ticker) {
          app.ticker.remove(tick);
        }
      };
    }
  }, [enabled, app.ticker]);
}
