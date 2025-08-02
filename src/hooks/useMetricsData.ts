import { useMemo } from 'react';
import { UseMetricsOptions } from '@/pages/metrics/types';

export function useMetricsData({ metrics, selectedService, timeRange }: UseMetricsOptions) {
    // Güvenli default değerler
    const safeMetrics = metrics || [];
    const safeSelectedService = selectedService || '';
    
    // Hook çağırmadan sadece data structure oluştur
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