import {useApp} from '@pixi/react';

function DevToolsEnabled(): null {
  const app = useApp();
  // @ts-expect-error - Expose app to global scope for debugging
  globalThis.__PIXI_APP__ = app;
  return null;
}

export default function DevTools() {
  return import.meta.env.DEV ? <DevToolsEnabled /> : null;
}
