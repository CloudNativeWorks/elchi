import { useState } from 'react';
import { useMetricsApiMutation } from '@/common/operations-api';
import { MetricsApiMutationOptions } from '@/common/types';

export interface VictoriaMetricPoint {
    [0]: number;
    [1]: string;
}

export interface VictoriaMetricSeries {
    metric: {
        __name__: string;
        [label: string]: string;
    };
    values: VictoriaMetricPoint[];
}

export interface VictoriaQueryData {
    resultType: "matrix";
    result: VictoriaMetricSeries[];
}

export interface VictoriaQueryStats {
    seriesFetched: string;
    executionTimeMsec: number;
}

export interface VictoriaQueryRangeResponse {
    status: "success" | "error";
    data: VictoriaQueryData;
    stats?: VictoriaQueryStats;
    windowSec?: number;
}

export function useMetrics(options: MetricsApiMutationOptions) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [metricsData, setMetricsData] = useState<VictoriaQueryRangeResponse | null>(null);
    const mutate = useMetricsApiMutation();

    const fetchMetrics = async () => {
        if (!options.name) {
            return { success: false, error: 'Service name is required' };
        }

        setLoading(true);
        setError(null);
        try {
            const response = await mutate.mutateAsync(options);
            setMetricsData(response);
            return { success: true, data: response };
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Failed to fetch metrics';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        metricsData,
        fetchMetrics,
        enabled: !!options.name
    };
} 