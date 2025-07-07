/**
 * Resource and ConfigDiscovery ordering synchronization utility functions
 */

export interface SyncFilterOrderingParams {
    resourceStore: any;
    configDiscovery: any[];
    resourcePath: string[];
}

/**
 * Reorders the filter array in Resource according to ConfigDiscovery ordering
 * Places router filters at the bottom according to terminal filter rule
 */
export const syncResourceFilterOrdering = ({
    resourceStore,
    configDiscovery,
    resourcePath
}: SyncFilterOrderingParams): void => {
    const targetResource = resourcePath.reduce((obj: any, key: string) => {
        return obj && obj[key];
    }, resourceStore);

    if (!targetResource || !Array.isArray(targetResource)) {
        return;
    }

    // Separate router filters and other filters
    const { routerFilters, nonRouterFilters } = separateRouterFilters(targetResource);

    // Order non-router filters according to ConfigDiscovery ordering
    const orderedNonRouterFilters = orderFiltersByConfigDiscovery(
        nonRouterFilters,
        configDiscovery
    );

    // Final ordering: non-router filters + router filters (at the bottom)
    const finalFilterOrder = [...orderedNonRouterFilters, ...routerFilters];

    // Update the resource array
    updateResourceArray(resourceStore, resourcePath, finalFilterOrder);
};

/**
 * Separates router filters and other filters
 */
const separateRouterFilters = (filters: any[]) => {
    const routerFilters: any[] = [];
    const nonRouterFilters: any[] = [];

    filters.forEach(filter => {
        if (isRouterFilter(filter)) {
            routerFilters.push(filter);
        } else {
            nonRouterFilters.push(filter);
        }
    });

    return { routerFilters, nonRouterFilters };
};

/**
 * Checks if a filter is a router filter
 */
const isRouterFilter = (filter: any): boolean => {
    return filter?.config_discovery?.type_urls?.[0] === 'envoy.extensions.filters.http.router.v3.Router';
};

/**
 * Orders filters according to ConfigDiscovery ordering
 */
const orderFiltersByConfigDiscovery = (filters: any[], configDiscovery: any[]): any[] => {
    return configDiscovery
        .map(configItem => {
            return filters.find(resourceFilter => 
                resourceFilter.name === configItem.name
            );
        })
        .filter(Boolean);
};

/**
 * Updates the resource array with the given ordering
 */
const updateResourceArray = (
    resourceStore: any,
    resourcePath: string[],
    orderedFilters: any[]
): void => {
    resourcePath.reduce((obj: any, key: string, index: number) => {
        if (index === resourcePath.length - 1) {
            obj[key] = orderedFilters;
        }
        return obj && obj[key];
    }, resourceStore);
}; 