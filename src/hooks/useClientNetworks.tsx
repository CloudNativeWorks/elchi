import { useState, useCallback } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { BaseResponse, OperationsSubType, OperationsType } from '@/common/types';

export interface Interface {
    name: string;
    addresses: string[];
    state: string;
    has_carrier: boolean;
    mac_address?: string;
    mtu: number;
    dhcp4?: boolean;
    optional?: boolean;
}

export interface Route {
    to: string;
    via?: string;
    interface: string;
    table: number;
    metric?: number;
    scope?: string;
}

export interface RoutingPolicy {
    from?: string;
    to?: string;
    table: number;
    priority: number;
    iif?: string;
}

export interface NetworkState {
    interfaces: Interface[];
    routes: Route[];
    policies: RoutingPolicy[];
    current_netplan_yaml?: string;
}

export interface NetworkStateResponse extends BaseResponse {
    success: boolean;
    network_state?: NetworkState;
    error?: string;
}


export function useClientNetworks({ clientId }: { clientId: string }) {
    const mutate = useOperationsApiMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [networkState, setNetworkState] = useState<NetworkState | null>(null);

    const fetchNetworkState = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.NETWORK,
                    sub_type: OperationsSubType.SUB_GET_NETWORK_STATE,
                    clients: [{ client_id: clientId }]
                }
            });

            if (Array.isArray(response) && response.length > 0) {
                const networkResponse = response[0] as NetworkStateResponse;
                if (networkResponse.success && networkResponse.network_state) {
                    setNetworkState(networkResponse.network_state);
                    return { success: true, data: networkResponse.network_state };
                } else {
                    const errorMessage = networkResponse.error || 'Failed to fetch network state';
                    setError(errorMessage);
                    return { success: false, error: errorMessage };
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err: any) {
            const errorMessage = err?.message || err?.response?.data?.message || 'Failed to fetch network state';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [clientId, mutate]);

    return {
        loading,
        error,
        networkState,
        fetchNetworkState,
        refetch: fetchNetworkState
    };
} 