import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    MarkLineComponent,
    BrushComponent,
    ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import dayjs from 'dayjs';
import { useChartTheme } from '@/utils/chartTheme';

echarts.use([
    LineChart,
    PieChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    MarkLineComponent,
    BrushComponent,
    ToolboxComponent,
    CanvasRenderer,
]);

export interface MetricLineSeries {
    name: string;
    data: Array<[string | number, number]>; // [x (ISO or timestamp), y]
    color?: string;
    /** Stack id for area-stacked series (set on all members of the stack). */
    stack?: string;
    /** Area fill. Defaults true when `stack` is set. */
    area?: boolean;
}

/** Horizontal reference line at a fixed y value (e.g. a latency budget). */
export interface RefLine {
    y: number;
    label?: string;
    color?: string;
}

/** Vertical marker at an x timestamp in ms (e.g. a config reload). */
export interface EventMarker {
    x: number;
    label?: string;
    color?: string;
}

interface Props {
    series: MetricLineSeries[];
    height?: number;
    unit?: string;
    /** Y-axis formatter; receives raw numeric value. */
    // eslint-disable-next-line no-unused-vars
    yFormatter?: (v: number) => string;
    /** Whether x-axis renders as time. Defaults true. */
    timeAxis?: boolean;
    /** When true, all series share a stack — convenience for stacked area. */
    stackAll?: string;
    /** Horizontal dashed reference lines (e.g. timeout budget). */
    refLines?: RefLine[];
    /** Vertical dotted event markers at x-timestamps (e.g. config reloads). */
    eventMarkers?: EventMarker[];
    /** Connect crosshair/tooltip with other charts sharing this group id. */
    syncGroup?: string;
    /** Text shown when every series is empty. */
    emptyText?: string;
    /**
     * Enables drag-to-select on the x-axis (echarts brush). Called with the
     * selected [from, to] in epoch ms once the drag ends; the selection overlay
     * is cleared automatically. Only meaningful with timeAxis.
     */
    // eslint-disable-next-line no-unused-vars
    onRangeSelect?: (from: number, to: number) => void;
}

const MetricLineChart: React.FC<Props> = ({
    series,
    height = 260,
    unit,
    yFormatter,
    timeAxis = true,
    stackAll,
    refLines,
    eventMarkers,
    syncGroup,
    emptyText = 'No data in this window',
    onRangeSelect,
}) => {
    const { options: themeOptions } = useChartTheme();
    // Minimal instance surface we use — avoids the type clash between
    // echarts-for-react's ECharts and echarts/core's EChartsType.
    type ChartInstance = {
        group?: string;
        // eslint-disable-next-line no-unused-vars
        dispatchAction: (payload: Record<string, unknown>) => void;
        isDisposed: () => boolean;
    };
    const instRef = useRef<ChartInstance | null>(null);

    const option = useMemo(() => {
        // Charts with many series (e.g. findings-by-engine, ~18 engines) need the
        // legend bounded to a single scrollable row; otherwise it wraps onto a
        // second row that overlaps the plot and the top y-axis label. We also
        // give the grid extra top room as a guaranteed fallback.
        const manySeries = series.length > 6;
        const markLine = (refLines?.length || eventMarkers?.length)
            ? {
                silent: true,
                symbol: 'none' as const,
                data: [
                    ...(refLines ?? []).map((r) => ({
                        yAxis: r.y,
                        lineStyle: { color: r.color ?? '#f59e0b', type: 'dashed' as const, width: 1 },
                        label: { formatter: r.label ?? '', position: 'insideEndTop' as const, color: r.color ?? '#f59e0b', fontSize: 10 },
                    })),
                    ...(eventMarkers ?? []).map((m) => ({
                        xAxis: m.x,
                        lineStyle: { color: m.color ?? '#8c8c8c', type: 'dotted' as const, width: 1 },
                        label: { formatter: m.label ?? '', position: 'insideEndTop' as const, color: m.color ?? '#8c8c8c', fontSize: 10 },
                    })),
                ],
            }
            : undefined;
        return {
            ...themeOptions,
            // Brush needs the (hidden) toolbox component to be configured, and the
            // brush itself is armed via takeGlobalCursor below so plain drag works.
            ...(onRangeSelect ? {
                toolbox: { show: false, feature: { brush: { type: ['lineX'] } } },
                brush: {
                    xAxisIndex: 0,
                    brushType: 'lineX',
                    brushMode: 'single',
                    transformable: false,
                    brushStyle: {
                        borderWidth: 1,
                        color: 'rgba(59, 158, 255, 0.12)',
                        borderColor: 'rgba(59, 158, 255, 0.6)',
                    },
                },
            } : {}),
            grid: { left: 56, right: 24, top: manySeries ? 56 : 36, bottom: 32 },
            legend: {
                ...themeOptions.legend,
                type: 'scroll',
                top: 6,
                // Bound the width so the scroll legend paginates in one row.
                // Small-legend charts keep their compact top-right placement.
                ...(manySeries ? { left: 8, right: 8 } : { right: 8 }),
                itemWidth: 12,
                itemHeight: 8,
                textStyle: { ...themeOptions.legend.textStyle, fontSize: 11 },
            },
            tooltip: {
                ...themeOptions.tooltip,
                trigger: 'axis',
                axisPointer: { type: 'line' },
                // Render the tooltip in <body> so it always sits above the legend
                // and surrounding cards instead of being clipped/occluded by them.
                appendToBody: true,
                confine: true,
                valueFormatter: (v: number) =>
                    `${yFormatter ? yFormatter(v) : v.toLocaleString()}${unit ? ` ${unit}` : ''}`,
            },
            xAxis: {
                ...themeOptions.xAxis,
                type: timeAxis ? 'time' : 'category',
                boundaryGap: false,
            },
            yAxis: {
                ...themeOptions.yAxis,
                type: 'value',
                axisLabel: {
                    ...themeOptions.yAxis.axisLabel,
                    formatter: yFormatter ?? ((v: number) => v.toLocaleString()),
                },
            },
            series: series.map((s, i) => {
                const stackId = s.stack ?? stackAll;
                return {
                    name: s.name,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    showSymbol: false,
                    stack: stackId,
                    areaStyle: stackId || s.area ? { opacity: 0.18 } : undefined,
                    lineStyle: { width: 1.5 },
                    itemStyle: s.color ? { color: s.color } : undefined,
                    // markLine lives on one series only (echarts renders it once).
                    ...(i === 0 && markLine ? { markLine } : {}),
                    data: s.data.map(([x, y]) => [
                        timeAxis && typeof x === 'string' ? dayjs(x).valueOf() : x,
                        y,
                    ]),
                };
            }),
        };
    }, [series, themeOptions, unit, yFormatter, timeAxis, stackAll, refLines, eventMarkers, onRangeSelect]);

    // Arm the brush cursor so a plain drag selects a range (no toolbox click
    // needed). Must re-run after every option change: notMerge recreates the
    // brush component, dropping the armed cursor.
    const armBrush = useCallback((inst: ChartInstance) => {
        inst.dispatchAction({
            type: 'takeGlobalCursor',
            key: 'brush',
            brushOption: { brushType: 'lineX', brushMode: 'single' },
        });
    }, []);
    useEffect(() => {
        if (onRangeSelect && instRef.current && !instRef.current.isDisposed()) {
            armBrush(instRef.current);
        }
    }, [option, onRangeSelect, armBrush]);

    // Connect this chart to others in the same group so hovering one moves the
    // crosshair on all of them (shared time cursor across the dashboard).
    const onReady = useCallback((inst: ChartInstance) => {
        instRef.current = inst;
        if (syncGroup) {
            inst.group = syncGroup;
            echarts.connect(syncGroup);
        }
        if (onRangeSelect) armBrush(inst);
    }, [syncGroup, onRangeSelect, armBrush]);

    const onEvents = useMemo(() => {
        if (!onRangeSelect) return undefined;
        return {
            brushEnd: (params: { areas?: Array<{ coordRange?: [number, number] }> }) => {
                const range = params?.areas?.[0]?.coordRange;
                // Clear the selection overlay after the drag; deferred so we don't
                // dispatch inside echarts' own event flush.
                setTimeout(() => {
                    if (instRef.current && !instRef.current.isDisposed()) {
                        instRef.current.dispatchAction({ type: 'brush', areas: [] });
                    }
                }, 0);
                if (range && range.length === 2 && range[1] > range[0]) {
                    onRangeSelect(Math.round(range[0]), Math.round(range[1]));
                }
            },
        };
    }, [onRangeSelect]);

    const isEmpty = series.every((s) => !s.data || s.data.length === 0);
    if (isEmpty) {
        return (
            <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 12 }}>
                {emptyText}
            </div>
        );
    }

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={option}
            style={{ height, width: '100%' }}
            notMerge
            onChartReady={onReady}
            onEvents={onEvents}
        />
    );
};

/**
 * Sparkline — a tiny inline SVG trend line for stat tiles. Deliberately not an
 * ECharts instance (4+ per dashboard would be wasteful); it's a single path.
 */
export const Sparkline: React.FC<{ data: number[]; color?: string; width?: number; height?: number }> = ({
    data,
    color = '#3b9eff',
    width = 96,
    height = 26,
}) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const stepX = width / (data.length - 1);
    const y = (v: number) => (height - 2) - ((v - min) / span) * (height - 4) + 1;
    const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${y(v).toFixed(1)}`);
    const line = `M${pts.join(' L')}`;
    const area = `${line} L${width.toFixed(1)},${height} L0,${height} Z`;
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }} aria-hidden>
            <path d={area} fill={color} opacity={0.12} />
            <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
};

export default MetricLineChart;
