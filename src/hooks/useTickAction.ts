import {useRef, useState} from 'react';
import {useTick} from '@pixi/react';

export function useTickAction<T>(delay: number = 1000, action: () => T) {
  const elapsed = useRef(0);
  const [value, setValue] = useState<T | undefined>(undefined);

  useTick(({deltaTime: delta}) => {
    elapsed.current += delta;
    if (elapsed.current >= delay) {
      elapsed.current = 0;
      setValue(action());
    }
  });

  return value;
}
