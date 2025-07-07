import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

export function useServices() {
    const { project } = useProjectVariable();
    
    const { data, isLoading, error } = useCustomGetQuery({
        queryKey: "custom_get_listeners",
        enabled: true,
        path: `custom/resource_list?collection=listeners&category=listener&project=${project}&for_metrics=true`
    });

    const services = data?.map(service => service.name) || [];

    return {
        data: services,
        isLoading,
        error
    };
} 