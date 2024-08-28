import {Suspense, useCallback, useState} from 'react';
import {Application as ReactPixiApplication} from '@pixi/react';

import ErrorBoundary from './ErrorBoundary';

export type ApplicationProps = React.ComponentProps<typeof ReactPixiApplication> &
  React.PropsWithChildren<{
    loading?: React.ReactNode;
    error?: React.ReactElement;
  }>;

export default function Application({children, loading, error, ...props}: ApplicationProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const handleInit = useCallback(() => setIsInitialized(true), []);

  return (
    <ReactPixiApplication onInit={handleInit} {...props}>
      {isInitialized && (
        <ErrorBoundary fallback={error}>
          <Suspense fallback={loading}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </ReactPixiApplication>
  );
}
