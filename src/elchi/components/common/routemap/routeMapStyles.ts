export const RouteMapColors = {
    node: {
        virtual_host: {
            bg: 'rgba(76, 175, 80, 0.15)',
            border: 'rgba(76, 175, 80, 0.7)',
            text: '#fff'
        },
        domain: {
            bg: 'rgba(33, 150, 243, 0.15)',
            border: 'rgba(33, 150, 243, 0.7)',
            text: '#fff'
        },
        route: {
            bg: 'rgba(255, 152, 0, 0.15)',
            border: 'rgba(255, 152, 0, 0.7)',
            text: '#fff'
        },
        match: {
            bg: 'rgba(156, 39, 176, 0.15)',
            border: 'rgba(156, 39, 176, 0.7)',
            text: '#fff'
        },
        cluster: {
            bg: 'rgba(244, 67, 54, 0.15)',
            border: 'rgba(244, 67, 54, 0.7)',
            text: '#fff'
        },
        weighted_cluster: {
            bg: 'rgba(96, 125, 139, 0.15)',
            border: 'rgba(96, 125, 139, 0.7)',
            text: '#fff'
        },
        redirect: {
            bg: 'rgba(233, 30, 99, 0.15)',
            border: 'rgba(233, 30, 99, 0.7)',
            text: '#fff'
        },
        direct_response: {
            bg: 'rgba(103, 58, 183, 0.15)',
            border: 'rgba(103, 58, 183, 0.7)',
            text: '#fff'
        },
        default: {
            bg: 'rgba(158, 158, 158, 0.15)',
            border: 'rgba(158, 158, 158, 0.7)',
            text: '#fff'
        }
    }
};

export const getRouteMapNodeStyle = (nodeType: string) => {
    const type = nodeType.toLowerCase();
    
    if (type === 'virtual_host') {
        return RouteMapColors.node.virtual_host;
    } else if (type === 'domain') {
        return RouteMapColors.node.domain;
    } else if (type === 'route') {
        return RouteMapColors.node.route;
    } else if (type === 'match') {
        return RouteMapColors.node.match;
    } else if (type === 'cluster') {
        return RouteMapColors.node.cluster;
    } else if (type === 'weighted_cluster') {
        return RouteMapColors.node.weighted_cluster;
    } else if (type === 'redirect') {
        return RouteMapColors.node.redirect;
    } else if (type === 'direct_response') {
        return RouteMapColors.node.direct_response;
    }
    
    return RouteMapColors.node.default;
};