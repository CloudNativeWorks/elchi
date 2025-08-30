import { ExclamationCircleOutlined } from '@ant-design/icons';

export const renderStatusBadge = (clients: any[], statusData: any[] | null, enhancedErrors?: any[]) => {
    if (!Array.isArray(clients) || clients?.length === 0) {
        return (
            <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#f5f5f5',
                color: '#bfbfbf',
                borderRadius: 8,
                padding: '4px 14px',
                fontWeight: 700,
                fontSize: 15,
                boxShadow: '0 1px 4px rgba(191,191,191,0.08)',
                marginLeft: 16
            }}>
                Not Deployed
            </span>
        );
    }

    if (Array.isArray(statusData) && statusData.length > 0) {
        const all = statusData.map(item => item.Result?.Service?.status?.active?.toLowerCase() || '');
        const runningCount = all.filter(s => s.includes('running')).length;

        if (runningCount === all.length) {
            return renderStatusIndicator('Live', '#f6ffed', '#389e0d', '#52c41a', true, enhancedErrors);
        } else if (runningCount > 0) {
            return renderStatusIndicator('Partial', '#fffbe6', '#faad14', '#faad14', true, enhancedErrors);
        } else {
            return renderStatusIndicator('Offline', '#fff1f0', '#ff4d4f', '#ff4d4f', false, enhancedErrors);
        }
    }

    return null;
};

const renderStatusIndicator = (
    text: string,
    bgColor: string,
    textColor: string,
    dotColor: string,
    animate: boolean,
    enhancedErrors?: any[]
) => (
    <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: bgColor,
        color: textColor,
        borderRadius: 8,
        padding: '4px 14px',
        fontWeight: 700,
        fontSize: 15,
        boxShadow: `0 1px 4px ${textColor}14`,
        marginLeft: 16
    }}>
        <span style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: dotColor,
            marginRight: 6,
            boxShadow: animate ? `0 0 6px ${dotColor}` : 'none',
            animation: animate ? 'pulse 1.2s infinite' : 'none'
        }} />
        {text}
        {enhancedErrors && enhancedErrors.length > 0 && (() => {
            const activeErrorCount = enhancedErrors.filter((err: any) => err.status === 'active').length;
            const hasActiveErrors = activeErrorCount > 0;
            const iconColor = hasActiveErrors ? '#ff4d4f' : '#52c41a';
            const shadowColor = hasActiveErrors ? 'rgba(255, 77, 79, 0.4)' : 'rgba(82, 196, 26, 0.4)';
            
            return (
                <div style={{ position: 'relative', marginLeft: 8 }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: `0 2px 8px ${shadowColor}`,
                        transition: 'all 0.2s ease',
                        border: `2px solid ${iconColor}`
                    }}>
                        <ExclamationCircleOutlined 
                            style={{ 
                                color: iconColor, 
                                fontSize: 10,
                                fontWeight: 'bold'
                            }} 
                        />
                </div>
                <div style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#ff4d4f',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: 14,
                    height: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    border: '1px solid white',
                    lineHeight: 1
                }}>
                    {activeErrorCount}
                </div>
                </div>
            );
        })()}
    </span>
);