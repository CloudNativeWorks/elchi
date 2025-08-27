import { useState } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';

interface HostStatus {
    address: {
        socket_address: {
            address: string;
            port_value: number;
        };
    };
    health_status: {
        eds_health_status: string;
    };
    hostname?: string;
    stats: Array<{
        name: string;
        value?: string;
        type?: string;
    }>;
    weight: number;
}

interface ClusterStatus {
    name: string;
    observability_name: string;
    added_via_api?: boolean;
    circuit_breakers: {
        thresholds: Array<{
            max_connections: number;
            max_pending_requests: number;
            max_requests: number;
            max_retries: number;
            priority?: string;
        }>;
    };
    host_statuses: HostStatus[];
}

interface ClusterResponse {
    Result: {
        EnvoyAdmin: {
            body: {
                cluster_statuses: ClusterStatus[];
            };
        };
    };
    identity: {
        client_id: string;
        client_name: string;
    };
}

export function useClusterDetails({ name, project, version }: { name: string; project: string; version?: string }) {
    const mutate = useOperationsApiMutation(version);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clusterData, setClusterData] = useState<ClusterResponse[]>([]);

    const fetchClusterDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.PROXY,
                    command: {
                        project,
                        name,
                        method: 'POST',
                        path: '/clusters',
                        queries: {
                            format: 'json'
                        }
                    }
                },
                project,
                version
            });

            setClusterData(response);
            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Failed to fetch cluster details';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        clusterData,
        fetchClusterDetails
    };
} 