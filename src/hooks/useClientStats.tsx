import { useState, useEffect, useCallback } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';


interface ClientStatsResponse {
    identity: {
        client_id: string;
        client_name: string;
        session_token: string;
    };
    command_id: string;
    success: boolean;
    Result: {
        ClientStats: {
            cpu: {
                usage_percent: number;
                load_avg_1: number;
                load_avg_5: number;
                load_avg_15: number;
                core_stats: Record<string, number>;
                process_count: number;
                thread_count: number;
            };
            memory: {
                total: number;
                used: number;
                free: number;
                usage_percent: number;
                swap_total: number;
                swap_free: number;
                cached: number;
                buffers: number;
            };
            disk: Array<{
                device: string;
                mount_point: string;
                fs_type: string;
                total: number;
                used: number;
                free: number;
                usage_percent: number;
                io_read_bytes?: number;
                io_write_bytes?: number;
                io_read_ops?: number;
                io_write_ops?: number;
            }>;
            network: {
                interfaces: Record<string, {
                    bytes_received?: number;
                    bytes_sent: number;
                    packets_received?: number;
                    packets_sent: number;
                    dropped?: number;
                }>;
                connections: number;
                tcp_connections: number;
                udp_connections: number;
            };
            system: {
                hostname: string;
                os: string;
                kernel_version: string;
                uptime: number;
            };
        };
    };
}

export function useClientStats({ clientId }: { clientId: string }) {
    const mutate = useOperationsApiMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statsData, setStatsData] = useState<ClientStatsResponse>();

    const fetchClientStats = useCallback(async () => {
        if (!clientId) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.CLIENT_STATS,
                    clients: [
                        {
                            client_id: clientId
                        }
                    ],
                    command: {
                        count: 100
                    }
                }
            });

            if (Array.isArray(response) && response.length > 0) {
                setStatsData(response[0]);
                return { success: true, data: response[0] };
            }

            throw new Error('Invalid response format');
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Failed to fetch client statistics';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [clientId, mutate]);

    useEffect(() => {
        if (clientId) {
            fetchClientStats();
        }
    }, [clientId, fetchClientStats]);

    return {
        loading,
        error,
        statsData,
        fetchClientStats
    };
} 