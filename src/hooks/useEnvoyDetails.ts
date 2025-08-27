import { useState } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';

interface EnvoyDetailsProps {
    name: string;
    project: string;
    version?: string;
}

interface EnvoyData {
    Result: {
        EnvoyAdmin: {
            body: {
                server_info: any;
                stats: any;
                config_dump: any;
                listeners: any;
                memory: any;
                certs: any;
                ready: any;
                hot_restart_version: any;
                runtime: any;
            }
        }
    };
    identity: {
        client_name: string;
    };
}

export const useEnvoyDetails = ({ name, project, version }: EnvoyDetailsProps) => {
    const mutate = useOperationsApiMutation(version);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [envoyData, setEnvoyData] = useState<Record<string, EnvoyData>>({});

    const fetchEnvoyDetails = async () => {
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
                        path: '/envoy',
                        queries: {
                            format: 'json'
                        }
                    }
                },
                project,
                version
            });

            if (Array.isArray(response)) {
                const groupedData: Record<string, EnvoyData> = {};
                response.forEach((item: EnvoyData) => {
                    if (item.identity?.client_name) {
                        groupedData[item.identity.client_name] = item;
                    }
                });
                setEnvoyData(groupedData);
            }
            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'An error occurred while fetching envoy details';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        envoyData,
        fetchEnvoyDetails
    };
}; 