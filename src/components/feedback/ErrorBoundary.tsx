import React from 'react';
import { Text, View } from 'react-native';
import { logger } from '@/lib/logger';

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logger.error('unhandled_render_error', { message: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-astra-bg px-6">
          <Text className="text-center text-lg font-semibold text-astra-text">
            Something went wrong
          </Text>
          <Text className="mt-2 text-center text-astra-muted">
            Please restart the application.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
