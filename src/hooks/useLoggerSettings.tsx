import { useState } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';

export function useLoggerSettings({ name, project }: { name: string; project: string }) {
    const mutate = useOperationsApiMutation();
    const [loading, setLoading] = useState(false);

    const fetchCurrentSettings = async () => {
        setLoading(true);
        try {
            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.PROXY,
                    command: {
                        project,
                        name,
                        method: 'POST',
                        path: '/logging'
                    }
                }
            });
            
            const activeLoggers = response?.[0]?.Result?.EnvoyAdmin?.body?.['active loggers'] || {};
            return { success: true, data: activeLoggers };
        } catch (error: any) {
            return { 
                success: false, 
                error: error?.response?.data?.message || 'Failed to fetch logger settings' 
            };
        } finally {
            setLoading(false);
        }
    };

    const updateLoggerSettings = async (updates: { component?: string; level: string }) => {
        setLoading(true);
        try {
            const queries: Record<string, string> = {};
            
            if (updates.component) {
                // Tek bir komponentin seviyesini değiştir
                queries[updates.component] = updates.level;
            } else {
                // Tüm komponentlerin seviyesini değiştir
                queries['level'] = updates.level;
            }

            const response = await mutate.mutateAsync({
                data: {
                    type: OperationsType.PROXY,
                    command: {
                        project,
                        name,
                        method: 'POST',
                        path: '/logging',
                        queries
                    }
                }
            });

            const activeLoggers = response?.[0]?.Result?.EnvoyAdmin?.body?.['active loggers'] || {};
            return { success: true, data: activeLoggers };
        } catch (error: any) {
            return { 
                success: false, 
                error: error?.response?.data?.message || 'Failed to update logger settings' 
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        fetchCurrentSettings,
        updateLoggerSettings
    };
} 