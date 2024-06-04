import {useEffect, useState} from 'react';
import {useTick} from '@pixi/react';
// @ts-expect-error: Ignore missing types for stats.js
import StatsImpl from 'stats.js';

type Props = {
  showPanel?: number;
  className?: string;
  parent?: React.RefObject<HTMLElement>;
};

function StatsEnabled({showPanel = 0, className, parent}: Props): null {
  const [stats] = useState(() => new StatsImpl());

  useEffect(() => {
    const node = (parent && parent.current) || document.body;
    stats.showPanel(showPanel);
    node?.appendChild(stats.dom);
    if (className) stats.dom.classList.add(...className.split(' ').filter(cls => cls));
    return () => {
      node?.removeChild(stats.dom);
    };
  }, [parent, stats, className, showPanel]);

  useTick(() => {
    stats.update();
  });

  return null;
}

export function Stats({showPanel = 0, className, parent}: Props) {
  return import.meta.env.DEV ? <StatsEnabled showPanel={showPanel} className={className} parent={parent} /> : null;
}
