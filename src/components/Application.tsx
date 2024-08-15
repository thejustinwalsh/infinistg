import {Suspense} from 'react';
import {Application as PixiApplication} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';

export type StageProps = React.ComponentProps<typeof PixiApplication> &
  React.PropsWithChildren<{
    loading?: React.ReactNode;
    error?: React.ReactElement;
  }>;

export default function Stage({children, loading, error, ...props}: StageProps) {
  return (
    <PixiApplication {...props}>
      <ErrorBoundary fallback={error}>
        <Suspense fallback={loading}>{children}</Suspense>
      </ErrorBoundary>
    </PixiApplication>
  );
}
