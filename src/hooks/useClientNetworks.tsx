import { useState, useCallback } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { BaseResponse, OperationsSubType, OperationsType } from '@/common/types';

export interface Interface {
    dhcp4: boolean;
    addresses?: string[];
    mtu?: number;
    optional?: boolean;
    state?: string;
}

export interface Route {
    to: string;
    via: string;
    table?: number;
    metric?: number;
}

export interface RoutingPolicy {
    from: string;
    table: string;
}

export interface NetworkInterfaceEntry {
    ifname: string;
    interface: Interface;
    route?: Route;
    routing_policy?: RoutingPolicy;
}

export interface Network {
    Network: {
        interfaces: NetworkInterfaceEntry[];
    };
}

export interface NetworkCommandResponse extends BaseResponse {
    Result: Network;
}

export function useClientNetworks({ project, clientId }: { project: string, clientId: string }) {
    const mutate = useOperationsApiMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [networkData, setNetworkData] = useState<NetworkCommandResponse[]>([]);

    const fetchNetworkDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.NETWORK,
                    sub_type: OperationsSubType.SUB_GET_IF_CONFIG,
                    clients: [{ client_id: clientId }],
                    command: {
                        project
                    }
                }
            });

            setNetworkData(response);
            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Failed to fetch network details';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const refetch = useCallback(() => {
        return fetchNetworkDetails();
    }, [project, clientId]);

    return {
        loading,
        error,
        networkData,
        fetchNetworkDetails,
        refetch
    };
} 