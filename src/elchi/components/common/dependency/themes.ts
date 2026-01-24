import { ResourceCategory } from './types';

/**
 * Node style configuration with modern gradients
 */
interface NodeStyle {
    gradient: string;
    border: string;
    text: string;
    shadow: string;
    glow: string;
}

/**
 * Edge style configuration
 */
interface EdgeStyle {
    default: string;
    highlighted: string;
    hover: string;
    animated: string;
}

/**
 * Modern theme colors with professional gradients
 * Uses CSS variables for dark mode support
 */
export const ThemeColors = {
    background: 'var(--dependency-bg, #fafbfc)',
    backgroundSolid: 'var(--bg-surface, #ffffff)',

    // Glass morphism effects
    glass: {
        background: 'var(--glass-bg, rgba(255, 255, 255, 0.92))',
        backdrop: 'blur(12px)',
        border: 'var(--glass-border, rgba(0, 0, 0, 0.08))',
        shadow: 'var(--glass-shadow, 0 8px 32px 0 rgba(31, 38, 135, 0.15))',
    },

    // Node styles with gradients per category
    node: {
        listeners: {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '#5a67d8',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            glow: '0 0 20px rgba(102, 126, 234, 0.6)',
        },
        clusters: {
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: '#e94560',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(240, 147, 251, 0.4)',
            glow: '0 0 20px rgba(240, 147, 251, 0.6)',
        },
        routes: {
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: '#0ea5e9',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(79, 172, 254, 0.4)',
            glow: '0 0 20px rgba(79, 172, 254, 0.6)',
        },
        filters: {
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            border: '#10b981',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(67, 233, 123, 0.4)',
            glow: '0 0 20px rgba(67, 233, 123, 0.6)',
        },
        endpoints: {
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            border: '#f97316',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(250, 112, 154, 0.4)',
            glow: '0 0 20px rgba(250, 112, 154, 0.6)',
        },
        tls: {
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            border: '#0891b2',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(48, 207, 208, 0.4)',
            glow: '0 0 20px rgba(48, 207, 208, 0.6)',
        },
        secrets: {
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            border: '#64748b',
            text: '#1e293b',
            shadow: '0 4px 20px rgba(168, 237, 234, 0.4)',
            glow: '0 0 20px rgba(168, 237, 234, 0.6)',
        },
        bootstrap: {
            gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
            border: '#f97316',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(255, 154, 86, 0.4)',
            glow: '0 0 20px rgba(255, 154, 86, 0.6)',
        },
        extensions: {
            gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
            border: '#8b5cf6',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(161, 140, 209, 0.4)',
            glow: '0 0 20px rgba(161, 140, 209, 0.6)',
        },
        virtual_hosts: {
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            border: '#f59e0b',
            text: '#78350f',
            shadow: '0 4px 20px rgba(255, 236, 210, 0.4)',
            glow: '0 0 20px rgba(255, 236, 210, 0.6)',
        },
        default: {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '#5a67d8',
            text: '#ffffff',
            shadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            glow: '0 0 20px rgba(102, 126, 234, 0.6)',
        },
        // Special states
        highlighted: {
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            border: '#f59e0b',
            text: '#78350f',
            shadow: '0 4px 25px rgba(251, 191, 36, 0.6)',
            glow: '0 0 30px rgba(251, 191, 36, 0.8)',
        },
        neighbor: {
            parent: {
                border: '#10b981',
                glow: '0 0 20px rgba(16, 185, 129, 0.6)',
            },
            child: {
                border: '#3b82f6',
                glow: '0 0 20px rgba(59, 130, 246, 0.6)',
            },
        },
    } as Record<ResourceCategory | 'highlighted' | 'neighbor', NodeStyle | any>,

    // Edge styles
    edge: {
        default: 'var(--dependency-edge, rgba(100, 116, 139, 0.5))',
        highlighted: '#fbbf24',
        hover: '#3b82f6',
        animated: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
    } as EdgeStyle,

    // Animation configurations
    animations: {
        duration: {
            fast: 200,
            normal: 300,
            slow: 500,
        },
        easing: {
            smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
    },
};

/**
 * Get node style by category
 */
export const getNodeStyleByCategory = (category: string): NodeStyle => {
    const normalizedCategory = category.toLowerCase() as ResourceCategory;
    return ThemeColors.node[normalizedCategory] || ThemeColors.node.default;
};

/**
 * Get icon name for category
 */
export const getIconForCategory = (category: string): string => {
    const normalizedCategory = category.toLowerCase();

    const iconMap: Record<string, string> = {
        listeners: 'GlobalOutlined',
        clusters: 'ClusterOutlined',
        filters: 'FilterOutlined',
        routes: 'ShareAltOutlined',
        endpoints: 'AimOutlined',
        tls: 'SafetyOutlined',
        secrets: 'KeyOutlined',
        bootstrap: 'CodeOutlined',
        extensions: 'AppstoreOutlined',
        virtual_hosts: 'CloudOutlined',
    };

    return iconMap[normalizedCategory] || 'QuestionCircleOutlined';
};
