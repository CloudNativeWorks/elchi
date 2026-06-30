import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
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
}

const MetricLineChart: React.FC<Props> = ({
    series,
    height = 260,
    unit,
    yFormatter,
    timeAxis = true,
    stackAll,
}) => {
    const { options: themeOptions } = useChartTheme();

    const option = useMemo(() => {
        // Charts with many series (e.g. findings-by-engine, ~18 engines) need the
        // legend bounded to a single scrollable row; otherwise it wraps onto a
        // second row that overlaps the plot and the top y-axis label. We also
        // give the grid extra top room as a guaranteed fallback.
        const manySeries = series.length > 6;
        return {
            ...themeOptions,
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
            series: series.map((s) => {
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
                    data: s.data.map(([x, y]) => [
                        timeAxis && typeof x === 'string' ? dayjs(x).valueOf() : x,
                        y,
                    ]),
                };
            }),
        };
    }, [series, themeOptions, unit, yFormatter, timeAxis, stackAll]);

    return (
        <ReactEChartsCore
            echarts={echarts}
            option={option}
            style={{ height, width: '100%' }}
            notMerge
        />
    );
};

export default MetricLineChart;
