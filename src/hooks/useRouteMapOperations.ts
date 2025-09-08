import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

export const useRouteMapOperations = () => {
    const { project } = useProjectVariable();

    const getSupportedTypes = () => {
        return useCustomGetQuery({
            queryKey: 'routemap-supported-types',
            enabled: false,
            path: 'routemap/supported-types',
        });
    };

    const getRouteMap = (name: string, gtype: string, collection: string, version: string) => {
        return useCustomGetQuery({
            queryKey: `routemap_${name}_${collection}_${gtype}`,
            enabled: false,
            path: `routemap/${name}?project=${project}&collection=${collection}&gtype=${gtype}&version=${version}`,
        });
    };

    const isRouteMapSupported = (gtype: string): boolean => {
        const supportedTypes = [
            'envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager',
            'envoy.config.route.v3.RouteConfiguration',
            'envoy.config.route.v3.VirtualHost'
        ];
        return supportedTypes.includes(gtype);
    };

    const getCollectionForType = (gtype: string): string => {
        switch (gtype) {
            case 'envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager':
                return 'filters';
            case 'envoy.config.route.v3.RouteConfiguration':
                return 'routes';
            case 'envoy.config.route.v3.VirtualHost':
                return 'virtual_hosts';
            default:
                return '';
        }
    };

    return {
        getSupportedTypes,
        getRouteMap,
        isRouteMapSupported,
        getCollectionForType
    };
};