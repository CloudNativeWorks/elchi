import { useMemo } from 'react';
import { UseMetricsOptions } from '@/pages/metrics/types';

export function useMetricsData({ metrics, selectedService, timeRange }: UseMetricsOptions) {
    const safeMetrics = metrics || [];
    const safeSelectedService = selectedService || '';
    
    const metricsData = useMemo(() => {
        return safeMetrics.map(() => ({
            loading: false,
            error: null,
            metricsData: null,
            timeRange,
            enabled: !!safeSelectedService,
            fetchMetrics: async () => ({ success: false, data: null }),
            severity: 'info' as const
        }));
    }, [safeMetrics, safeSelectedService, timeRange]);

    return metricsData;
} 