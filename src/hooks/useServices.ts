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

export function useServices() {
    const { project } = useProjectVariable();

    const { data, isLoading, error } = useCustomGetQuery({
        queryKey: "custom_get_listeners",
        enabled: true,
        path: `custom/resource_list?collection=listeners&category=listener&project=${project}&for_metrics=true`
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