import {useEffect, useRef} from 'react';
import {useApplication} from '@pixi/react';
import {UPDATE_PRIORITY} from 'pixi.js';

import type {Ticker} from 'pixi.js';

export type Callback = (delta: number) => void;
export enum TickGroup {
  PRE_TICK = 'pre',
  POST_TICK = 'post',
}

const priority: {[key in TickGroup]: UPDATE_PRIORITY} = {
  [TickGroup.PRE_TICK]: UPDATE_PRIORITY.INTERACTION,
  [TickGroup.POST_TICK]: UPDATE_PRIORITY.UTILITY,
};

export function useTickGroup(group: TickGroup, callback: Callback, enabled = true) {
  const {app} = useApplication();
  const callbackRef = useRef<Callback | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (enabled) {
      const tick = (ticker: Ticker) => callbackRef.current?.apply(app.ticker, [ticker.deltaTime]);
      app.ticker.add(tick, undefined, priority[group]);

      return () => {
        if (app.ticker) {
          app.ticker.remove(tick);
        }
      };
    }
  }, [enabled, app.ticker, group]);
}
