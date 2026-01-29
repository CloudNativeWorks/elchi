import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LazyLoadErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if it's a chunk loading error
    const isChunkError =
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Unable to preload CSS');

    if (isChunkError) {
      console.warn('Chunk loading failed, will retry on user action:', error.message);
    } else {
      console.error('LazyLoadErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message.includes('Loading chunk') ||
        this.state.error?.message.includes('Failed to fetch dynamically imported module') ||
        this.state.error?.message.includes('Unable to preload CSS');

      return (
        <div style={{ padding: 24, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Result
            status="warning"
            title={isChunkError ? "Page Loading Failed" : "Something went wrong"}
            subTitle={isChunkError
              ? "A new version may be available. Please refresh the page."
              : "An unexpected error occurred while loading this page."
            }
            extra={
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.handleRetry}
              >
                Refresh Page
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;
