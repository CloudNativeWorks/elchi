import { TimeRange } from '@grafana/data';
import { MetricConfig } from './metricConfigs/MetricConfig';
import { VictoriaQueryRangeResponse } from '@/hooks/useMetrics';

export interface MetricsProps {
    selectedService?: string;
}

export interface MetricsData {
    loading: boolean;
    error: string | null;
    metricsData: VictoriaQueryRangeResponse | null;
    enabled: boolean;
    timeRange: TimeRange;
    fetchMetrics: () => Promise<{
        success: boolean;
        data?: VictoriaQueryRangeResponse;
        error?: string;
    }>;
}

export interface ChartProps {
    data: MetricsData;
    title: string;
    metricConfig: MetricConfig;
    height: number;
}

export interface UseMetricsOptions {
    metrics: MetricConfig[];
    selectedService: string;
    timeRange: TimeRange;
}

export type QuickRangeFunction = () => [number, number];

export type QuickRanges = {
    [key: string]: QuickRangeFunction;
};

export interface MetricsToolbarProps {
    selectedService?: string;
    onServiceChange: (service: string) => void;
    timeRange: [number, number];
    onTimeRangeChange: (range: [number, number]) => void;
    isNowSelected: boolean;
    onNowClick: () => void;
    onRefresh: () => void;
    isLoading: boolean;
    lastRefreshTime: number;
    onGoHome?: () => void;
}


export interface TimeRangeState {
    startTime: number;
    endTime: number;
    id: string;
}

export interface SectionState {
    isVisible: boolean;
    lastFetchedTimeRangeId?: string;
}

export interface MetricsState {
    timeRange: TimeRangeState;
    sections: Record<string, SectionState>;
    isRefreshing: boolean;
}

export interface MetricDataState {
    loading: boolean;
    error: string | null;
    metricsData: VictoriaQueryRangeResponse | null;
}