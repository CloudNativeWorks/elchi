/**
 * Shield Security Widget — elchi-shield (ext_proc WAF) metrics from VictoriaMetrics.
 * Shows blocked vs detected requests over the last hour, project-scoped via the
 * `listener` node-id label (listener::project::ip). Mirrors the WAF widget.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BaseWidget } from '../shared/BaseWidget';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { api } from '@/common/api';
import { useDashboardRefresh } from '../../context/DashboardRefreshContext';
import styles from './styles.module.scss';
import { useChartTheme } from '@/utils/chartTheme';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface ShieldMetrics {
    blocked: number;
    detected: number;
    requests: number;
    timeline: Array<{ time: string; blocked: number; detected: number; allowed: number }>;
}

const sumSeries = (values: Array<[number, string]>): number =>
    values.reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

export const ShieldSecurity: React.FC = () => {
    const projectContext = useProjectVariable();
    const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
    const { refreshTrigger } = useDashboardRefresh();
    const { theme: chartTheme } = useChartTheme();

    const [metrics, setMetrics] = useState<ShieldMetrics>({ blocked: 0, detected: 0, requests: 0, timeline: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!project) return;
        try {
            setLoading(true);
            setError(null);
            const now = Math.floor(Date.now() / 1000);
            const start = now - 3600; // last 1h
            const step = 300; // 5 min
            // Project scope via the Envoy node-id (listener::project::ip).
            const sel = `{listener=~".*::${project}::.*"}`;
            const qr = (metric: string) => api.get('/api/v1/query_range', {
                params: { query: `sum(increase(elchi_shield_${metric}${sel}[5m]))`, start, end: now, step },
            });

            const [reqRes, blkRes, detRes] = await Promise.all([
                qr('requests_total'), qr('requests_blocked_total'), qr('detections_total'),
            ]);

            const reqV = reqRes?.data?.data?.result?.[0]?.values || [];
            const blkV = blkRes?.data?.data?.result?.[0]?.values || [];
            const detV = detRes?.data?.data?.result?.[0]?.values || [];

            const timeline = reqV.map(([ts, totalVal]: [number, string], idx: number) => {
                const total = parseFloat(totalVal) || 0;
                const blocked = parseFloat(blkV[idx]?.[1]) || 0;
                const detected = parseFloat(detV[idx]?.[1]) || 0;
                return {
                    time: new Date(ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    blocked,
                    detected,
                    allowed: Math.max(0, total - blocked - detected),
                };
            });

            setMetrics({
                blocked: Math.round(sumSeries(blkV)),
                detected: Math.round(sumSeries(detV)),
                requests: Math.round(sumSeries(reqV)),
                timeline,
            });
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [project]);

    useEffect(() => { fetchData(); }, [fetchData, refreshTrigger]);

    const chartOptions = {
        animation: true,
        animationDuration: 300,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, textStyle: { color: chartTheme.tooltipTextColor } },
        legend: { data: ['Blocked', 'Detected', 'Allowed'], bottom: -3, textStyle: { fontSize: 11, color: chartTheme.legendTextColor } },
        grid: { left: '3%', right: '4%', bottom: '18%', top: '5%' },
        xAxis: { type: 'category', data: metrics.timeline.map(t => t.time), axisLabel: { fontSize: 10, rotate: 45, color: chartTheme.axisLabelColor }, axisLine: { lineStyle: { color: chartTheme.axisLineColor } } },
        yAxis: { type: 'value', axisLabel: { fontSize: 10, color: chartTheme.axisLabelColor }, axisLine: { lineStyle: { color: chartTheme.axisLineColor } }, splitLine: { lineStyle: { color: chartTheme.axisSplitLineColor } } },
        series: [
            { name: 'Blocked', type: 'bar', stack: 'total', data: metrics.timeline.map(t => t.blocked), itemStyle: { color: chartTheme.dangerColor } },
            { name: 'Detected', type: 'bar', stack: 'total', data: metrics.timeline.map(t => t.detected), itemStyle: { color: chartTheme.warningColor } },
            { name: 'Allowed', type: 'bar', stack: 'total', data: metrics.timeline.map(t => t.allowed), itemStyle: { color: chartTheme.successColor } },
        ],
    };

    const blockRate = metrics.requests > 0 ? (metrics.blocked / metrics.requests) * 100 : 0;

    return (
        <BaseWidget title="Shield Security - 1H" icon={<SafetyCertificateOutlined />} loading={loading} error={error} onRefresh={fetchData}>
            <div className={styles.container}>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Requests</div>
                        <div className={styles.statValue} style={{ color: chartTheme.successColor }}>{metrics.requests.toLocaleString()}</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Blocked</div>
                        <div className={styles.statValue} style={{ color: chartTheme.dangerColor }}>{metrics.blocked.toLocaleString()}</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Detected</div>
                        <div className={styles.statValue} style={{ color: chartTheme.warningColor }}>{metrics.detected.toLocaleString()}</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statLabel}>Block rate</div>
                        <div className={styles.statValue} style={{ color: blockRate > 0 ? chartTheme.dangerColor : chartTheme.successColor }}>{blockRate.toFixed(blockRate < 10 ? 2 : 1)}%</div>
                    </div>
                </div>
                <div className={styles.chart}>
                    <ReactEChartsCore echarts={echarts} option={chartOptions} style={{ height: '220px', width: '100%' }} />
                </div>
            </div>
        </BaseWidget>
    );
};
