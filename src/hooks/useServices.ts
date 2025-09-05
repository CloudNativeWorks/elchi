import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

interface ServiceInfo {
    name: string;
    canonical_name: string;
    gtype: string;
    type: string;
    category: string;
    collection: string;
    version: string;
}

export function useServices(searchQuery: string = '', enabled: boolean = true) {
    const { project } = useProjectVariable();

    const { data, isLoading, error } = useCustomGetQuery({
        queryKey: `custom_get_listeners_${searchQuery}`,
        enabled: enabled,
        path: `custom/resource_list_search?collection=listeners&category=listener&project=${project}&for_metrics=true&search=${searchQuery}`
    });

    const services: ServiceInfo[] = data || [];
    const serviceNames = services.map(service => service.name);

    return {
        data: serviceNames, // Keep backward compatibility
        services: services, // New field with full service objects
        isLoading,
        error
    };
} 