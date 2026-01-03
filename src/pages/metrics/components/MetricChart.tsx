import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { Card, Spin, Modal, Button, Tooltip } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { ChartProps } from '../types';
import { VictoriaQueryRangeResponse } from '@/hooks/useMetrics';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import cloneDeep from 'lodash/cloneDeep';
import { formatDuration } from '../utils';
import { formatBytes } from '../utils';
import { marked } from 'marked';


interface ExtendedChartProps extends ChartProps {
    onVisibilityChange?: (isVisible: boolean) => void;//eslint-disable-line
    isUpdated: boolean;
}

const MetricChart: React.FC<ExtendedChartProps> = ({ data, title, metricConfig, height, onVisibilityChange, isUpdated }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const echartsRef = useRef<ReactEChartsCore>(null);
    const isVisible = useIntersectionObserver(chartRef);
    const hasLoadedData = useRef(false);
    const prevIsVisible = useRef(isVisible);
    const prevIsUpdated = useRef(isUpdated);
    const prevData = useRef<VictoriaQueryRangeResponse | null>(null);
    const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalReady, setIsModalReady] = useState(false);
    const modalChartRef = useRef<ReactEChartsCore>(null);
    const chartStateRef = useRef<{
        legendSelected: Record<string, boolean>;
        dataZoom: Array<{ start: number; end: number }>;
    }>({
        legendSelected: {},
        dataZoom: [{ start: 0, end: 100 }]
    });

    useEffect(() => {
        if (prevIsUpdated.current !== isUpdated && !isUpdated) {
            hasLoadedData.current = false;
            prevIsUpdated.current = isUpdated;
        }

        if (isVisible !== prevIsVisible.current || (!isUpdated && isVisible)) {
            prevIsVisible.current = isVisible;

            if (isVisible && (!hasLoadedData.current || !isUpdated)) {
                hasLoadedData.current = true;
                onVisibilityChange?.(true);
            } else if (!isVisible && hasLoadedData.current) {
                onVisibilityChange?.(false);
            }
        }
    }, [isVisible, onVisibilityChange, isUpdated]);

    useEffect(() => {
        hasLoadedData.current = false;
        prevIsUpdated.current = false;
    }, [data.timeRange]);

    const prepareChartSeries = useCallback((chartData: VictoriaQueryRangeResponse | null) => {
        if (data.loading && prevData.current?.data?.result?.length) {
            chartData = prevData.current;
        } else if (chartData?.data?.result?.length) {
            prevData.current = cloneDeep(chartData);
        }

        if (!chartData?.data?.result?.length) {
            const now = Date.now();
            const thirtyMinutesAgo = now - 30 * 60 * 1000;
            const timeValues = [];
            for (let time = thirtyMinutesAgo; time <= now; time += 60 * 1000) {
                timeValues.push(time);
            }

            return [{
                name: metricConfig.legendMapping[0]?.template.replace('%s', 'No Data') || 'No Data',
                type: 'line',
                showSymbol: false,
                data: timeValues.map(time => [time, 0]),
                areaStyle: {
                    opacity: 0.1
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 3,
                    },
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                blur: {
                    lineStyle: {
                        opacity: 0.3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                }
            }];
        }

        return chartData.data.result.map((series) => {
            const timeValues = series.values.map(point => point[0] * 1000);
            const dataValues = series.values.map(point => {
                const value = Number(point[1]);
                return value;
            });

            const labelParts = Object.entries(series.metric)
                .filter(([key]) => key !== '__name__')
                .map(([key, value]) => `${key}=${value}`);

            const mapping = metricConfig.legendMapping.find(m => {
                if (!m.extraLabels) {
                    return true;
                }
                return Object.entries(m.extraLabels).every(([key, value]) =>
                    series.metric[key] === value
                );
            });

            let seriesName = labelParts.join(', ');
            if (mapping) {
                const labelValues = mapping.labelKeys
                    .map(key => series.metric[key])
                    .filter(Boolean);

                if (labelValues.length > 0) {
                    seriesName = mapping.template.replace('%s', labelValues.join(' - '));
                }
            }

            return {
                name: seriesName,
                type: 'line',
                showSymbol: false,
                connectNulls: false,
                data: timeValues.map((time, index) => [time, dataValues[index]]),
                areaStyle: {
                    opacity: 0.2
                },
                lineStyle: {
                    width: 1,
                    join: 'round',
                    cap: 'round'
                },
                smooth: 0.5,
                smoothMonotone: 'x',
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 2,
                    },
                    areaStyle: {
                        opacity: 0.3
                    }
                },
                blur: {
                    lineStyle: {
                        opacity: 0.3
                    },
                    areaStyle: {
                        opacity: 0.1
                    }
                }
            };
        });
    }, [metricConfig, data.loading]);

    const options = useMemo(() => {
        const series = prepareChartSeries(data.metricsData);
        const baseOptions = {
            animation: false,
            animationDuration: 0,
            animationDurationUpdate: 0,
            animationEasingUpdate: 'linear',
            renderer: 'canvas',
            title: {
                text: title,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#1890ff',
                borderWidth: 1,
                textStyle: {
                    color: '#333'
                },
                extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 6px;',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#1890ff'
                    },
                    lineStyle: {
                        color: '#1890ff',
                        width: 1,
                        type: 'dashed'
                    }
                },
                formatter: (params: any) => {
                    const time = dayjs(params[0].value[0]).format('YYYY-MM-DD HH:mm:ss');
                    let result = `<div style="font-weight: 600; color: #1890ff; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #f0f0f0;">${time}</div>`;

                    const sortedParams = [...params].sort((a, b) => {
                        const valueA = Number(a.value[1]) || 0;
                        const valueB = Number(b.value[1]) || 0;
                        return valueB - valueA;
                    });

                    sortedParams.forEach((param: any) => {
                        let value;
                        if (metricConfig.formatType === 'bytes') {
                            value = formatBytes(param.value[1]);
                        } else if (metricConfig.formatType === 'duration') {
                            value = formatDuration(
                                param.value[1],
                                metricConfig.formatConfig?.inputUnit,
                                metricConfig.formatConfig?.units
                            );
                        } else {
                            value = param.value[1].toFixed(2);
                        }

                        const isHighlighted = param.seriesName === hoveredSeries;
                        const style = isHighlighted
                            ? 'background: linear-gradient(90deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%); border-left: 3px solid #1890ff; padding: 4px 8px; margin: 2px 0; border-radius: 4px; font-weight: 600;'
                            : 'padding: 4px 8px; margin: 2px 0; border-radius: 4px; transition: all 0.2s ease;';

                        result += `<div style="${style}">
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                            <span style="color: #333; font-weight: ${isHighlighted ? '600' : '400'};">${param.seriesName}:</span> 
                            <span style="color: ${isHighlighted ? '#1890ff' : '#666'}; font-weight: 600; margin-left: 8px;">${value}</span>
                        </div>`;
                    });
                    return result;
                }
            },
            grid: {
                left: '0%',
                right: '1%',
                bottom: '40px',
                top: '40px'
            },
            xAxis: {
                type: 'time',
                min: data.timeRange.from.valueOf(),
                max: data.timeRange.to.valueOf(),
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: (value: number) => {
                        if (metricConfig.formatType === 'bytes') {
                            return formatBytes(value);
                        } else if (metricConfig.formatType === 'duration') {
                            return formatDuration(
                                value,
                                metricConfig.formatConfig?.inputUnit,
                                metricConfig.formatConfig?.units
                            );
                        }
                        return value.toFixed(2);
                    }
                }
            },
            series,
            toolbox: {
                show: true,
                itemSize: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: "none"
                    },
                    dataView: {
                        readOnly: false,
                    },
                    saveAsImage: {
                        name: 'metric-chart',
                        type: 'png',
                        backgroundColor: '#fff',
                        imageWidth: 1200,
                        imageHeight: 600
                    },
                    myInfo: {
                        show: !!metricConfig.description,
                        icon: 'path://M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm32-588c0-17.7-14.3-32-32-32s-32 14.3-32 32v248c0 17.7 14.3 32 32 32s32-14.3 32-32V296zm-32 392c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z',
                        title: 'Metric Info',
                        onclick: async () => {
                            const description = metricConfig.description || 'No description available';
                            const htmlDescription = await marked(description);

                            const infoDiv = document.createElement('div');
                            infoDiv.style.cssText = `
                                position: fixed;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: white;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                                z-index: 1000;
                                max-width: 900px;
                                width: 90%;
                                overflow-y: auto;
                                max-height: 80vh;
                            `;

                            const closeButton = document.createElement('button');
                            closeButton.textContent = '×';
                            closeButton.style.cssText = `
                                position: absolute;
                                right: 10px;
                                top: 10px;
                                border: none;
                                background: none;
                                font-size: 20px;
                                cursor: pointer;
                                color: #666;
                            `;
                            closeButton.onclick = () => {
                                document.body.removeChild(infoDiv);
                                document.body.removeChild(overlay);
                            };

                            const descriptionElement = document.createElement('div');
                            descriptionElement.innerHTML = htmlDescription;
                            descriptionElement.style.cssText = `
                                margin: 0;
                                line-height: 1.5;
                                color: #444;
                                font-size: 14px;
                            `;

                            const overlay = document.createElement('div');
                            overlay.style.cssText = `
                                position: fixed;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: rgba(0,0,0,0.4);
                                z-index: 999;
                            `;
                            overlay.onclick = () => {
                                document.body.removeChild(infoDiv);
                                document.body.removeChild(overlay);
                            };

                            infoDiv.appendChild(closeButton);
                            infoDiv.appendChild(descriptionElement);
                            document.body.appendChild(overlay);
                            document.body.appendChild(infoDiv);
                        }
                    }
                },
            },
            dataZoom: [{
                type: 'inside',
                start: chartStateRef.current.dataZoom?.[0]?.start || 0,
                end: chartStateRef.current.dataZoom?.[0]?.end || 100
            }],
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                bottom: 5,
                padding: [0, 0, 0, 0],
                pageButtonPosition: 'end',
                selected: chartStateRef.current.legendSelected,
                formatter: (name: string) => {
                    const maxLength = 30;
                    if (name.length > maxLength) {
                        return name.substring(0, maxLength) + '...';
                    }
                    return name;
                }
            }
        };

        const chartInstance = echartsRef.current?.getEchartsInstance();
        if (chartInstance) {
            const currentOption = chartInstance.getOption();
            if (currentOption?.dataZoom?.[0] && baseOptions.dataZoom[0]) {
                baseOptions.dataZoom[0].start = currentOption.dataZoom[0].start;
                baseOptions.dataZoom[0].end = currentOption.dataZoom[0].end;
            }
        }

        return baseOptions;
    }, [data.metricsData, title, metricConfig, prepareChartSeries, hoveredSeries]);

    const modalOptions = useMemo(() => {
        return {
            ...options,
            title: {
                ...options.title,
                left: 'center',
                top: 5,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            toolbox: {
                ...options.toolbox,
                top: 35,
                right: 15,
                itemSize: 12
            },
            grid: {
                left: '2%',
                right: '2%',
                bottom: '8%',
                top: '10%'
            },
            legend: {
                ...options.legend,
                bottom: 5,
                height: 30,
                itemHeight: 12,
                textStyle: {
                    fontSize: 12
                },
                selected: chartStateRef.current?.legendSelected || {}
            },
            xAxis: {
                ...options.xAxis,
                min: data.timeRange.from.valueOf(),
                max: data.timeRange.to.valueOf()
            },
            dataZoom: [{
                type: 'inside',
                start: chartStateRef.current.dataZoom?.[0]?.start || 0,
                end: chartStateRef.current.dataZoom?.[0]?.end || 100
            }]
        };
    }, [options, data.timeRange]);

    const handleModalAfterOpen = useCallback(() => {
        setIsModalReady(true);
        setTimeout(() => {
            if (modalChartRef.current) {
                const chartInstance = modalChartRef.current.getEchartsInstance();
                chartInstance?.resize();
            }
        }, 100);
    }, []);

    const handleModalClose = useCallback(() => {
        setIsModalVisible(false);
        setIsModalReady(false);
    }, []);

    return (
        <>
            <Card style={{ position: 'relative' }}>
                <Tooltip title="Full Screen View">
                    <Button
                        icon={<ExpandOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        size="small"
                        style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            zIndex: 10,
                            border: 'none',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                        }}
                    />
                </Tooltip>

                {data.metricsData?.windowSec && metricConfig.windowSecs && (
                    <Tooltip title={`Data is aggregated over ${data.metricsData.windowSec}s windows with ${Math.floor(data.metricsData.windowSec / 2)}s steps`}>
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '38px',
                            zIndex: 10,
                            background: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            color: '#333',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '500',
                            lineHeight: '1.2',
                            cursor: 'default'
                        }}>
                            {data.metricsData.windowSec}s/{Math.floor(data.metricsData.windowSec / 2)}s
                        </div>
                    </Tooltip>
                )}

                <div ref={chartRef} style={{ position: 'relative', height }}>
                    {!isVisible ? (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#fff'
                        }}>
                            <Spin />
                        </div>
                    ) : (
                        <>
                            <ReactEChartsCore
                                ref={echartsRef}
                                echarts={echarts}
                                option={options}
                                style={{ height }}
                                notMerge={false}
                                lazyUpdate={true}
                                theme="light"
                                onEvents={{
                                    'mouseover': (params: any) => {
                                        if (params.componentType === 'series') {
                                            const chartInstance = echartsRef.current?.getEchartsInstance();
                                            if (chartInstance) {
                                                const option = chartInstance.getOption();
                                                const legendSelected = option.legend?.[0]?.selected || {};
                                                const currentDataZoom = option.dataZoom;
                                                if (legendSelected[params.seriesName] !== false) {
                                                    setHoveredSeries(params.seriesName);
                                                    chartInstance.setOption({
                                                        dataZoom: currentDataZoom
                                                    }, {
                                                        replaceMerge: ['dataZoom']
                                                    });
                                                }
                                            }
                                        }
                                    },
                                    'mouseout': () => {
                                        setHoveredSeries(null);
                                    },
                                    'globalout': () => {
                                        setHoveredSeries(null);
                                    },
                                    'legendselectchanged': (params: any) => {
                                        chartStateRef.current.legendSelected = params.selected;
                                    },
                                    'datazoom': (params: any) => {
                                        const zoomInfo = Array.isArray(params) ? params[0] : params;
                                        chartStateRef.current.dataZoom = [{
                                            start: zoomInfo.start,
                                            end: zoomInfo.end
                                        }];
                                    }
                                }}
                            />
                            {data.loading && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(255, 255, 255, 0.7)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1,
                                    cursor: 'not-allowed',
                                    pointerEvents: 'none'
                                }}>
                                    <div style={{ marginBottom: '60px' }}>
                                        <Spin size="small" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>

            <Modal
                title={title}
                open={isModalVisible}
                onCancel={handleModalClose}
                afterOpenChange={(open) => {
                    if (open) {
                        handleModalAfterOpen();
                    }
                }}
                width="90vw"
                style={{ top: 65 }}
                footer={null}
                destroyOnHidden
                centered={false}
                styles={{
                    body: { padding: '0 8px 8px 8px' }
                }}
            >
                <div style={{ height: '80vh', width: '100%' }}>
                    {isModalReady ? (
                        <ReactEChartsCore
                            ref={modalChartRef}
                            echarts={echarts}
                            option={modalOptions}
                            style={{ height: '100%', width: '100%' }}
                            notMerge={false}
                            lazyUpdate={true}
                            theme="light"
                            onEvents={{
                                'mouseover': (params: any) => {
                                    if (params.componentType === 'series') {
                                        const chartInstance = modalChartRef.current?.getEchartsInstance();
                                        if (chartInstance) {
                                            const option = chartInstance.getOption();
                                            const legendSelected = option.legend?.[0]?.selected || {};
                                            const currentDataZoom = option.dataZoom;
                                            if (legendSelected[params.seriesName] !== false) {
                                                setHoveredSeries(params.seriesName);
                                                chartInstance.setOption({
                                                    dataZoom: currentDataZoom
                                                }, {
                                                    replaceMerge: ['dataZoom']
                                                });
                                            }
                                        }
                                    }
                                },
                                'mouseout': () => {
                                    setHoveredSeries(null);
                                },
                                'globalout': () => {
                                    setHoveredSeries(null);
                                },
                                'legendselectchanged': (params: any) => {
                                    chartStateRef.current.legendSelected = params.selected;
                                },
                                'datazoom': (params: any) => {
                                    const zoomInfo = Array.isArray(params) ? params[0] : params;
                                    chartStateRef.current.dataZoom = [{
                                        start: zoomInfo.start,
                                        end: zoomInfo.end
                                    }];
                                }
                            }}
                        />
                    ) : (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <Spin size="large" />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default React.memo(MetricChart); 