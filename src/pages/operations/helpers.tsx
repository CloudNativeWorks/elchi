
export const renderStatusBadge = (clients: any[], statusData: any[] | null, envoysData?: any) => {
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

    // First try to use statusData from API
    if (Array.isArray(statusData) && statusData.length > 0) {
        const all = statusData.map(item => item.Result?.Service?.status?.active?.toLowerCase() || '');
        const runningCount = all.filter(s => s.includes('running')).length;

        // If we don't have status from all clients, it means some are down/unreachable
        const totalClients = clients.length;
        const respondedClients = statusData.length;

        if (runningCount === all.length && respondedClients === totalClients) {
            // All clients responded and all are running
            return renderStatusIndicator('Live', '#f6ffed', '#389e0d', '#52c41a', true);
        } else if (runningCount > 0 || respondedClients < totalClients) {
            // Some running OR some clients didn't respond
            return renderStatusIndicator('Partial', '#fffbe6', '#faad14', '#faad14', true);
        } else {
            return renderStatusIndicator('Offline', '#fff1f0', '#ff4d4f', '#ff4d4f', false);
        }
    }

    // Fallback: use envoys.envoys array connection status
    if (envoysData?.envoys && Array.isArray(envoysData.envoys)) {
        const connectedCount = envoysData.envoys.filter((e: any) => e.connected).length;
        const totalCount = envoysData.envoys.length;

        if (connectedCount === totalCount && totalCount > 0) {
            return renderStatusIndicator('Live', '#f6ffed', '#389e0d', '#52c41a', true);
        } else if (connectedCount > 0) {
            return renderStatusIndicator('Partial', '#fffbe6', '#faad14', '#faad14', true);
        } else {
            return renderStatusIndicator('Offline', '#fff1f0', '#ff4d4f', '#ff4d4f', false);
        }
    }

    // Fallback: use envoys.status field
    if (envoysData?.status) {
        const status = envoysData.status.toLowerCase();
        if (status === 'live') {
            return renderStatusIndicator('Live', '#f6ffed', '#389e0d', '#52c41a', true);
        } else if (status === 'partial') {
            return renderStatusIndicator('Partial', '#fffbe6', '#faad14', '#faad14', true);
        } else if (status === 'offline') {
            return renderStatusIndicator('Offline', '#fff1f0', '#ff4d4f', '#ff4d4f', false);
        }
    }

    return null;
};

const renderStatusIndicator = (
    text: string,
    bgColor: string,
    textColor: string,
    dotColor: string,
    animate: boolean
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
    </span>
);