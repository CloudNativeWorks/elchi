import { ThemeColors } from './themes';

export const getIconForResource = (category: string): string => {
    if (!category) return 'QuestionCircleOutlined';

    const lowercaseCat = category.toLowerCase();

    if (lowercaseCat.includes('listener')) {
        return 'GlobalOutlined';                // Sidenav listener: GlobalOutlined
    } else if (lowercaseCat.includes('cluster')) {
        return 'ClusterOutlined';               // Sidenav cluster: ClusterOutlined
    } else if (lowercaseCat.includes('filter')) {
        return 'FilterOutlined';                // Sidenav filters: FilterOutlined
    } else if (lowercaseCat.includes('route')) {
        return 'ShareAltOutlined';              // Sidenav route: ShareAltOutlined
    } else if (lowercaseCat.includes('endpoint')) {
        return 'AimOutlined';                   // Sidenav endpoint: AimOutlined
    } else if (lowercaseCat.includes('tls')) {
        return 'SafetyOutlined';                // Sidenav tls: SafetyOutlined
    } else if (lowercaseCat.includes('bootstrap')) {
        return 'CodeOutlined';                  // Sidenav bootstrap: CodeOutlined
    } else if (lowercaseCat.includes('secret')) {
        return 'KeyOutlined';                   // Sidenav secret: KeyOutlined
    } else if (lowercaseCat.includes('extension')) {
        return 'AppstoreOutlined';              // Sidenav extensions: AppstoreOutlined
    } else if (lowercaseCat.includes('virtual_host')) {
        return 'CloudOutlined';                 // Sidenav virtual_host: CloudOutlined
    }

    return 'QuestionCircleOutlined';
};

export const getNodeStyle = (category: string) => {
    const category_lower = category.toLowerCase();

    if (category_lower.includes('route')) {
        return ThemeColors.node.route;
    } else if (category_lower.includes('filter')) {
        return ThemeColors.node.filter;
    } else if (category_lower.includes('listener')) {
        return ThemeColors.node.listener;
    } else if (category_lower.includes('cluster')) {
        return ThemeColors.node.cluster;
    } else if (category_lower.includes('endpoint')) {
        return ThemeColors.node.endpoint;
    } else if (category_lower.includes('tls')) {
        return ThemeColors.node.tls;
    } else if (category_lower.includes('bootstrap')) {
        return ThemeColors.node.bootstrap;
    } else if (category_lower.includes('secret')) {
        return ThemeColors.node.secret;
    } else if (category_lower.includes('extension')) {
        return ThemeColors.node.extension;
    } else if (category_lower.includes('virtual_host')) {
        return ThemeColors.node.virtual_host;
    }


    return ThemeColors.node.default;
}; 