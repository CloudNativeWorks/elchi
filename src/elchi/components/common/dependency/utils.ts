import { ThemeColors } from './themes';
import { icons } from './icon';

// İlgili icon'u belirle
export const getIconForResource = (category: string) => {
    if (!category) return null;

    const lowercaseCat = category.toLowerCase();

    if (lowercaseCat.includes('listener')) {
        return icons.listener;
    } else if (lowercaseCat.includes('clusters')) {
        return icons.cluster;
    } else if (lowercaseCat.includes('filters')) {
        return icons.filter;
    } else if (lowercaseCat.includes('route')) {
        return icons.route;
    } else if (lowercaseCat.includes('endpoint')) {
        return icons.endpoint;
    } else if (lowercaseCat.includes('tls')) {
        return icons.tls;
    } else if (lowercaseCat.includes('bootstrap')) {
        return icons.bootstrap;
    } else if (lowercaseCat.includes('secret')) {
        return icons.secret;
    } else if (lowercaseCat.includes('extension')) {
        return icons.extension;
    } else if (lowercaseCat.includes('virtual_host')) {
        return icons.virtual_host;
    }

    return null;
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