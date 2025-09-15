import { useCustomGetQuery } from '@/common/api';

interface ServiceClient {
    downstream_address: string;
    [key: string]: any;
}

interface ServiceData {
    data: {
        id: string;
        name: string;
        project: string;
        version: string;
        admin_port: number;
        clients: ServiceClient[];
        permissions: any;
        status: string;
    }[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

interface UseServiceDataOptions {
    project: string;
    version: string;
    serviceName?: string;
    enabled?: boolean;
}

export const useServiceData = ({ project, version, serviceName, enabled = true }: UseServiceDataOptions) => {
    const { data, isFetching, error } = useCustomGetQuery({
        queryKey: `services_${project}_${version}_${serviceName || 'all'}`,
        enabled: enabled && !!project && !!version,
        path: `api/op/services?project=${project}&version=${version}&name=${serviceName}`,
        directApi: true
    });

    // Extract IP addresses from the clients array - data.data is the array, then we get the first service
    const service = data?.data?.data?.[0];
    const clientIPs = service?.clients?.map((client: ServiceClient) => client.downstream_address) || [];

    return {
        data: data as ServiceData,
        clientIPs,
        isLoading: isFetching,
        error
    };
};