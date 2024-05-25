import {useState} from 'react';
import {useApp, useTick} from '@pixi/react';
import '@pixi/math-extras';
import {Point} from 'pixi.js';

export function usePointerMovement(pos: Point, speed: number, transform?: (p: Point) => Point): Point {
  const [target, setTarget] = useState(new Point(0, 0));
  const app = useApp();

  useTick(delta => {
    const globalPos = transform?.(app.renderer.events.pointer.global) ?? app.renderer.events.pointer.global;
    const dir = globalPos.subtract(pos).normalize();
    const distance = globalPos.subtract(pos).magnitude();

    if (distance >= speed) {
      const destination = dir.multiplyScalar(speed * delta).add(pos);
      setTarget(destination);
    }
  });

  return target;
}
