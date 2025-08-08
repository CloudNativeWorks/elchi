import { useEffect, useState, useCallback } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsClient, OperationsType } from '@/common/types';
import { OperationsSubType } from '@/common/types';


export function useServiceStatus({ name, project, enabled = true }: { name: string; project: string; enabled?: boolean; }) {
    const mutate = useOperationsApiMutation();
    const [statusData, setStatusData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        if (!name || !project || !enabled || loading) return;

        setLoading(true);
        setError(null);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.SERVICE,
                    sub_type: OperationsSubType.SUB_STATUS,
                    command: { name, project }
                }
            });
            setStatusData(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Status not found.');
        } finally {
            setLoading(false);
        }
    }, [mutate, name, project, enabled, loading]);

    useEffect(() => {
        if (enabled && name && project) {
            fetchStatus();
        }
    }, [name, project, enabled]);

    return { statusData, loading, error, refresh: fetchStatus };
}

export function useServiceAction({ name, project }: { name: string; project: string }) {
    const mutate = useOperationsApiMutation();
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const callAction = useCallback(async (subType: OperationsSubType) => {
        setActionLoading(true);
        setActionError(null);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: OperationsType.SERVICE,
                    sub_type: subType,
                    command: { name, project }
                }
            });
            return data;
        } catch (err: any) {
            setActionError(err?.response?.data?.message || 'Action failed.');
            return null;
        } finally {
            setActionLoading(false);
        }
    }, [mutate, name, project]);

    return { callAction, actionLoading, actionError };
}

export function useDeployUndeployService({ name, project }: { name: string; project: string }) {
    const mutate = useOperationsApiMutation();
    const [statusData, setStatusData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const executeAction = async (type: OperationsType, clients: OperationsClient[]) => {
        setLoading(true);
        try {
            const data = await mutate.mutateAsync({
                data: {
                    type: type,
                    command: { name, project },
                    clients: clients
                }
            });
            setStatusData(data);

            if (data?.[0]?.error) {
                return { success: false, error: data?.[0]?.error };
            }
            return { success: true, data };
        } catch (err: any) {
            console.log(err);
            const errorMessage = err?.response?.data?.message ||  'Operation failed.';
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return { statusData, loading, executeAction };
}