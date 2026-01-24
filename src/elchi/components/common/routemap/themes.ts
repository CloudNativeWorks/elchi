/**
 * Theme colors and styles for RouteMap visualization
 */

export const ThemeColors = {
    // Background colors - use CSS variables for dark mode
    background: 'var(--bg-body)',
    backgroundSolid: 'var(--bg-body)',

    // Glass morphism effect - use CSS variables
    glass: {
        background: 'var(--glass-bg)',
        backdrop: 'blur(12px)',
        border: 'var(--border-default)',
        shadow: 'var(--glass-shadow)',
    },

    // Node styles by route map type
    node: {
        virtual_host: {
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            border: '#4CAF50',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
        },
        domain: {
            gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
            border: '#2196F3',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
        },
        route: {
            gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            border: '#FF9800',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
        },
        route_config: {
            gradient: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
            border: '#FF5722',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(255, 87, 34, 0.4)',
        },
        match: {
            gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
            border: '#9C27B0',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(156, 39, 176, 0.4)',
        },
        cluster: {
            gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
            border: '#F44336',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
        },
        weighted_cluster: {
            gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
            border: '#607D8B',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(96, 125, 139, 0.4)',
        },
        redirect: {
            gradient: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
            border: '#E91E63',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(233, 30, 99, 0.4)',
        },
        direct_response: {
            gradient: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
            border: '#673AB7',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(103, 58, 183, 0.4)',
        },
        action: {
            gradient: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
            border: '#FFC107',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(255, 193, 7, 0.4)',
        },
        policy: {
            gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
            border: '#00BCD4',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
        },
        vhds: {
            gradient: 'linear-gradient(135deg, #009688 0%, #00796B 100%)',
            border: '#009688',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(0, 150, 136, 0.4)',
        },
        default: {
            gradient: 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
            border: '#9E9E9E',
            text: '#ffffff',
            shadow: '0 4px 12px rgba(158, 158, 158, 0.4)',
        },
    },

    // Edge colors
    edge: {
        default: 'var(--routemap-edge, #94a3b8)',
        highlighted: 'var(--color-warning)',
    },
};

/**
 * Get node style based on route map type
 */
export const getNodeStyleByCategory = (nodeType: string) => {
    const type = nodeType?.toLowerCase().replace(/_/g, '_') || 'default';

    const typeMap: Record<string, keyof typeof ThemeColors.node> = {
        'virtual_host': 'virtual_host',
        'virtualhost': 'virtual_host',
        'domain': 'domain',
        'route': 'route',
        'route_config': 'route_config',
        'routeconfig': 'route_config',
        'match': 'match',
        'cluster': 'cluster',
        'weighted_cluster': 'weighted_cluster',
        'weightedcluster': 'weighted_cluster',
        'redirect': 'redirect',
        'direct_response': 'direct_response',
        'directresponse': 'direct_response',
        'action': 'action',
        'policy': 'policy',
        'vhds': 'vhds',
    };

    return ThemeColors.node[typeMap[type] || 'default'];
};

/**
 * Get icon name for route map node type
 */
export const getIconForCategory = (nodeType: string): string => {
    const type = nodeType?.toLowerCase().replace(/_/g, '_') || 'default';

    const iconMap: Record<string, string> = {
        'virtual_host': 'GlobalOutlined',
        'virtualhost': 'GlobalOutlined',
        'domain': 'CloudOutlined',
        'route': 'ShareAltOutlined',
        'route_config': 'FilterOutlined',
        'routeconfig': 'FilterOutlined',
        'match': 'AimOutlined',
        'cluster': 'ClusterOutlined',
        'weighted_cluster': 'AppstoreOutlined',
        'weightedcluster': 'AppstoreOutlined',
        'redirect': 'ReloadOutlined',
        'direct_response': 'ThunderboltOutlined',
        'directresponse': 'ThunderboltOutlined',
        'action': 'ThunderboltFilled',
        'policy': 'SafetyOutlined',
        'vhds': 'SafetyCertificateOutlined',
    };

    return iconMap[type] || 'QuestionCircleOutlined';
};
