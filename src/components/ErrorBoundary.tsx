import React from 'react';

type Props = React.PropsWithChildren<{
  fallback?: React.ReactNode;
}>;

type State = {
  hasError: boolean;
  fallback?: React.ReactNode;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: React.PropsWithoutRef<{fallback?: React.ReactNode}>) {
    super(props);
    this.state = {hasError: false, fallback: props.fallback};
  }

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <>{this.state.fallback}</>;
    }

    return this.props.children;
  }
}
