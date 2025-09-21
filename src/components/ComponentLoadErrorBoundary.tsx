import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Card, Button, Result, Typography, Space, Collapse } from 'antd';
import { ReloadOutlined, ArrowLeftOutlined, BugOutlined } from '@ant-design/icons';
import { showErrorNotification } from '@/common/notificationHandler';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Props {
    children: ReactNode;
    componentName?: string;
    onRetry?: () => void;
    onGoBack?: () => void;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    retryCount: number;
}

class ComponentLoadErrorBoundary extends Component<Props, State> {
    private maxRetries = 3;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Component Load Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Send error to notification system
        showErrorNotification(
            'Component Loading Error',
            `Failed to load ${this.props.componentName || 'component'}: ${error.message}`
        );

        // You could also send this to your error reporting service
        // errorReportingService.reportError(error, errorInfo, this.props.componentName);
    }

    handleRetry = () => {
        const { retryCount } = this.state;

        if (retryCount < this.maxRetries) {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: retryCount + 1,
            });

            // Call parent retry function if provided
            if (this.props.onRetry) {
                this.props.onRetry();
            }
        }
    };

    handleGoBack = () => {
        if (this.props.onGoBack) {
            this.props.onGoBack();
        } else {
            // Default behavior: go back in history
            window.history.back();
        }
    };

    render() {
        const { hasError, error, errorInfo, retryCount } = this.state;
        const { children, componentName, fallback } = this.props;

        if (hasError) {
            // If a custom fallback is provided, use it
            if (fallback) {
                return fallback;
            }

            const canRetry = retryCount < this.maxRetries;
            const errorMessage = error?.message || 'Unknown error occurred';
            const componentDisplayName = componentName || 'Component';

            return (
                <Card
                    style={{
                        margin: '20px auto',
                        maxWidth: '800px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                >
                    <Result
                        status="error"
                        title="Component Loading Failed"
                        subTitle={
                            <Space direction="vertical" style={{ textAlign: 'center' }}>
                                <Text>
                                    Failed to load <strong>{componentDisplayName}</strong>
                                </Text>
                                <Text type="secondary">
                                    {errorMessage}
                                </Text>
                                {retryCount > 0 && (
                                    <Text type="warning">
                                        Retry attempts: {retryCount}/{this.maxRetries}
                                    </Text>
                                )}
                            </Space>
                        }
                        extra={
                            <Space>
                                {canRetry && (
                                    <Button
                                        type="primary"
                                        icon={<ReloadOutlined />}
                                        onClick={this.handleRetry}
                                    >
                                        Retry Loading
                                    </Button>
                                )}
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={this.handleGoBack}
                                >
                                    Go Back
                                </Button>
                            </Space>
                        }
                    />

                    {/* Development error details */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <Card
                            size="small"
                            title={
                                <Space>
                                    <BugOutlined />
                                    <Text strong style={{color: "white"}}>Development Error Details</Text>
                                </Space>
                            }
                            style={{ marginTop: 16 }}
                        >
                            <Collapse ghost>
                                <Panel header="Error Stack Trace" key="stack">
                                    <Paragraph>
                                        <pre style={{
                                            background: '#f5f5f5',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            overflow: 'auto'
                                        }}>
                                            {error.stack}
                                        </pre>
                                    </Paragraph>
                                </Panel>
                                {errorInfo && (
                                    <Panel header="Component Stack" key="component">
                                        <Paragraph>
                                            <pre style={{
                                                background: '#f5f5f5',
                                                padding: '12px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                overflow: 'auto'
                                            }}>
                                                {errorInfo.componentStack}
                                            </pre>
                                        </Paragraph>
                                    </Panel>
                                )}
                            </Collapse>
                        </Card>
                    )}

                    {/* User-friendly troubleshooting tips */}
                    <Card
                        size="small"
                        title="Troubleshooting Tips"
                        style={{ marginTop: 16 }}
                    >
                        <ul style={{ marginBottom: 0 }}>
                            <li>Try refreshing the page!</li>
                            <li>Check your internet connection</li>
                            <li>Clear browser cache and cookies</li>
                            <li>Contact support if the problem persists</li>
                        </ul>
                    </Card>
                </Card>
            );
        }

        return children;
    }
}

export default ComponentLoadErrorBoundary;