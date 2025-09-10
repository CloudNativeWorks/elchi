import { useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

interface SubnetAvailableIPsData {
    subnet_id: string;
    subnet_name: string;
    network_id: string;
    network_name: string;
    cidr: string;
    gateway_ip: string;
    available_ips: string[];
    used_ips: string[];
    total_available: number;
    total_used: number;
}

interface SubnetAvailableIPsResponse {
    message: string;
    data: SubnetAvailableIPsData;
}

export function useSubnetAvailableIPs(
    clientId: string,
    subnetId: string,
    osUuid: string,
    osProjectId: string,
    enabled: boolean = true
) {
    const { project } = useProjectVariable();

    return useQuery<SubnetAvailableIPsData>({
        queryKey: ['subnet-available-ips', clientId, subnetId, osUuid, osProjectId, project],
        queryFn: async () => {
            const response = await api.get<SubnetAvailableIPsResponse>(
                `/api/op/clients/${clientId}/openstack/subnets/${subnetId}/available_ips?osp_project=${osProjectId}&project=${project}&os_uuid=${osUuid}`
            );
            return response.data.data;
        },
        enabled: enabled && !!clientId && !!subnetId && !!osUuid && !!osProjectId && !!project,
        staleTime: 30000, // 30 seconds
        refetchOnWindowFocus: false
    });
}