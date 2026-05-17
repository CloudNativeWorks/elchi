import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useChartTheme } from '@/utils/chartTheme';
import type { InventoryDoc } from '../types';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface Props {
    buckets: InventoryDoc['latency_buckets'];
    height?: number;
}

const BUCKET_LABELS: Array<{ key: keyof InventoryDoc['latency_buckets']; label: string }> = [
    { key: 'lt5', label: '< 5ms' },
    { key: 'lt25', label: '5–25ms' },
    { key: 'lt100', label: '25–100ms' },
    { key: 'lt500', label: '100–500ms' },
    { key: 'lt2000', label: '500ms–2s' },
    { key: 'ge2000', label: '≥ 2s' },
];

// Green → red gradient mirroring SLO-style latency tiers.
const BAR_COLORS = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ef4444', '#b91c1c'];

const LatencyBucketsChart: React.FC<Props> = ({ buckets, height = 220 }) => {
    const { options: themeOptions, isDark } = useChartTheme();

    const option = useMemo(() => {
        const data = BUCKET_LABELS.map((b) => buckets?.[b.key] ?? 0);
        const total = data.reduce((s, v) => s + v, 0);
        return {
            ...themeOptions,
            grid: { left: 80, right: 30, top: 20, bottom: 30 },
            tooltip: {
                ...themeOptions.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: (params: any) => {
                    const p = params[0];
                    const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0';
                    return `<strong>${p.name}</strong><br/>${p.value.toLocaleString()} (${pct}%)`;
                },
            },
            xAxis: {
                ...themeOptions.xAxis,
                type: 'value',
                axisLabel: {
                    ...themeOptions.xAxis.axisLabel,
                    formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`),
                },
            },
            yAxis: {
                ...themeOptions.yAxis,
                type: 'category',
                data: BUCKET_LABELS.map((b) => b.label),
                inverse: true,
            },
            series: [
                {
                    type: 'bar',
                    data: data.map((v, i) => ({
                        value: v,
                        itemStyle: { color: BAR_COLORS[i] },
                    })),
                    barWidth: 20,
                    label: {
                        show: true,
                        position: 'right',
                        color: isDark ? '#f1f5f9' : '#111827',
                        fontSize: 11,
                        formatter: (p: any) => p.value.toLocaleString(),
                    },
                },
            ],
        };
    }, [buckets, themeOptions, isDark]);

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={option}
            style={{ height, width: '100%' }}
            notMerge
        />
    );
};

export default LatencyBucketsChart;
