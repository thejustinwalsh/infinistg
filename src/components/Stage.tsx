import {Suspense} from 'react';
import {Stage as ReactPixiStage} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';

export type StageProps = React.ComponentProps<typeof ReactPixiStage> &
  React.PropsWithChildren<{
    loading?: React.ReactNode;
    error?: React.ReactElement;
  }>;

export default function Stage({children, loading, error, ...props}: StageProps) {
  return (
    <ReactPixiStage {...props}>
      <ErrorBoundary fallback={error}>
        <Suspense fallback={loading}>{children}</Suspense>
      </ErrorBoundary>
    </ReactPixiStage>
  );
}
