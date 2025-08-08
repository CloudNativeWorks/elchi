import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Card, Row, Col, Collapse } from 'antd';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    GraphicComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useMetricsData } from '@/hooks/useMetricsData';
import { useMetricsApiMutation } from '@/common/operations-api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { METRICS } from './metricConfigs/MetricConfig';
import MetricsToolbar from './MetricsToolbar';
import { dateTime } from '@grafana/data';
import MetricChart from './components/MetricChart';
import { EmptyStateCard } from './components/EmptyStateCard';
import MetricsNavigator from './components/MetricsNavigator';
import { MetricDataState, MetricsProps, MetricsState, TimeRangeState } from './types';
import { calculateDefaultTimeRange, createTimeRange } from './utils';

dayjs.extend(utc);
dayjs.extend(timezone);

echarts.use([
    LineChart,
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    GraphicComponent,
    CanvasRenderer
]);

const CHART_HEIGHT = 250;

const Metrics: React.FC<MetricsProps> = () => {
    // URL search params

    
    // Group state - merkezi yönetim
    const [selectedGroup, setSelectedGroup] = useState<string>('all');

    // Main State
    const [metricsState, setMetricsState] = useState<MetricsState>(() => ({
        timeRange: calculateDefaultTimeRange(),
        sections: {},
        isRefreshing: false
    }));

    const [selectedService, setSelectedService] = useState<string>();
    const [isNowSelected, setIsNowSelected] = useState(true);

    // Fresh metric data state - our own state for chart data
    const [freshMetricData, setFreshMetricData] = useState<Record<number, MetricDataState>>({});

    // Refs for stable references
    const intersectionObserver = useRef<IntersectionObserver | null>(null);
    const pendingFetches = useRef<Set<string>>(new Set());
    const isInitialMount = useRef(true);
    const fetchDebounceTimeout = useRef<NodeJS.Timeout | null>(null);
    //const lastFetchTrigger = useRef<string>('');

    // API mutation for fresh calls
    const metricsApiMutation = useMetricsApiMutation();

    // Stable timeRange object
    const timeRangeObject = useMemo(() => ({
        from: dateTime(metricsState.timeRange.startTime * 1000),
        to: dateTime(metricsState.timeRange.endTime * 1000),
        raw: {
            from: dateTime(metricsState.timeRange.startTime * 1000),
            to: dateTime(metricsState.timeRange.endTime * 1000)
        }
    }), [metricsState.timeRange.startTime, metricsState.timeRange.endTime]);

    const filteredMetrics = useMemo(() => {
        if (selectedGroup === 'all') {
            return METRICS;
        }
        return METRICS.filter(metric => 
            metric.groups && metric.groups.includes(selectedGroup)
        );
    }, [selectedGroup]);

    const handleGroupChange = useCallback((group: string) => {
        setSelectedGroup(group);
        
        if (selectedService) {
            setFreshMetricData({});
            setMetricsState(prev => ({
                ...prev,
                sections: {},
                isRefreshing: false
            }));
        }
    }, [selectedService]);

    const metricsData = useMetricsData({
        metrics: selectedService ? filteredMetrics : [],
        selectedService: selectedService || '',
        timeRange: timeRangeObject
    });

    const combinedMetricsData = useMemo(() => {
        return filteredMetrics.map((_, index) => {
            const freshData = freshMetricData[index];
            const hookData = metricsData[index];

            if (freshData) {
                return {
                    ...hookData,
                    loading: freshData.loading,
                    error: freshData.error,
                    metricsData: freshData.metricsData,
                    timeRange: timeRangeObject
                };
            }

            return hookData || {
                loading: false,
                error: null,
                metricsData: null,
                timeRange: timeRangeObject,
                enabled: true,
                fetchMetrics: async () => ({ success: false, data: null }),
                severity: 'info' as const
            };
        });
    }, [metricsData, freshMetricData, timeRangeObject, filteredMetrics]);

    const sectionMetrics = useMemo(() => {
        return filteredMetrics.reduce((acc, metric, index) => {
            if (!acc[metric.section]) {
                acc[metric.section] = [];
            }
            acc[metric.section].push(index);
            return acc;
        }, {} as { [key: string]: number[] });
    }, [filteredMetrics]);

    const fetchMetricWithFreshTimeRange = useCallback(async (
        metricConfig: typeof filteredMetrics[0],
        metricIndex: number,
        serviceName: string,
        startTime: number,
        endTime: number
    ) => {
        setFreshMetricData(prev => ({
            ...prev,
            [metricIndex]: {
                loading: true,
                error: null,
                metricsData: prev[metricIndex]?.metricsData || null
            }
        }));

        const options = {
            name: serviceName,
            metric: metricConfig.metric,
            start: startTime,
            end: endTime,
            metricConfig
        };

        try {
            const response = await metricsApiMutation.mutateAsync(options);

            setFreshMetricData(prev => ({
                ...prev,
                [metricIndex]: {
                    loading: false,
                    error: null,
                    metricsData: response
                }
            }));

            return response;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to fetch metrics';
            console.error(`[FreshFetch] Error fetching ${metricConfig.metric}:`, errorMessage);

            setFreshMetricData(prev => ({
                ...prev,
                [metricIndex]: {
                    loading: false,
                    error: errorMessage,
                    metricsData: null
                }
            }));

            throw error;
        }
    }, [metricsApiMutation]);

    const fetchMetricsForSection = useCallback(async (
        sectionName: string,
        timeRangeId: string,
        serviceName: string,
        startTime: number,
        endTime: number,
        currentSectionMetrics: typeof sectionMetrics
    ) => {
        const fetchKey = `${sectionName}_${timeRangeId}`;

        if (pendingFetches.current.has(fetchKey)) {
            return false;
        }

        pendingFetches.current.add(fetchKey);

        try {
            const metricIndices = currentSectionMetrics[sectionName] || [];

            const requests = metricIndices.map(async (metricIndex) => {
                const metricConfig = filteredMetrics[metricIndex];

                return await fetchMetricWithFreshTimeRange(metricConfig, metricIndex, serviceName, startTime, endTime);
            });

            const results = await Promise.all(requests);

            const successCount = results.filter(r => r).length;

            setMetricsState(prev => ({
                ...prev,
                sections: {
                    ...prev.sections,
                    [sectionName]: {
                        ...prev.sections[sectionName],
                        lastFetchedTimeRangeId: timeRangeId
                    }
                }
            }));

            return true;
        } catch (error) {
            console.error(`[Fetch] Error fetching section ${sectionName}:`, error);
            return false;
        } finally {
            pendingFetches.current.delete(fetchKey);
        }
    }, [fetchMetricWithFreshTimeRange]);

    const debouncedFetchVisibleSections = useCallback(() => {
        if (fetchDebounceTimeout.current) {
            clearTimeout(fetchDebounceTimeout.current);
        }

        fetchDebounceTimeout.current = setTimeout(async () => {
            if (!selectedService) {
                return;
            }

            // Get current state values at execution time
            setMetricsState(currentState => {
                const currentTimeRangeId = currentState.timeRange.id;
                const visibleSections = Object.entries(currentState.sections)
                    .filter(([_, state]) => state.isVisible)//eslint-disable-line
                    .filter(([_, state]) => state.lastFetchedTimeRangeId !== currentTimeRangeId)//eslint-disable-line
                    .map(([sectionName]) => sectionName);

                if (visibleSections.length === 0) {
                    return currentState;
                }

                // Start fetching async with fresh timeRange values
                Promise.all(
                    visibleSections.map(sectionName =>
                        fetchMetricsForSection(
                            sectionName,
                            currentTimeRangeId,
                            selectedService,
                            currentState.timeRange.startTime,
                            currentState.timeRange.endTime,
                            sectionMetrics
                        )
                    )
                ).then(() => {
                    setMetricsState(prev => ({ ...prev, isRefreshing: false }));
                }).catch(error => {
                    console.error(`[DebounceExecute] Error in parallel fetch:`, error);
                    setMetricsState(prev => ({ ...prev, isRefreshing: false }));
                });

                return { ...currentState, isRefreshing: true };
            });
        }, 100);
    }, [selectedService, fetchMetricsForSection, sectionMetrics]); // STABLE dependencies

    // Time Range Management
    const updateTimeRange = useCallback((newTimeRange: TimeRangeState) => {
        // Set loading state for all existing fresh metric data instead of clearing
        setFreshMetricData(prev => {
            const updatedData: Record<number, MetricDataState> = {};
            Object.keys(prev).forEach(key => {
                const index = parseInt(key);
                updatedData[index] = {
                    ...prev[index],
                    loading: true,
                    error: null
                };
            });
            return updatedData;
        });

        setMetricsState(prev => ({
            ...prev,
            timeRange: newTimeRange,
            sections: Object.keys(prev.sections).reduce((acc, sectionKey) => ({
                ...acc,
                [sectionKey]: {
                    ...prev.sections[sectionKey],
                    lastFetchedTimeRangeId: undefined
                }
            }), {})
        }));

        debouncedFetchVisibleSections();
    }, [debouncedFetchVisibleSections]);

    // Section Visibility Management - STABLE reference
    const updateSectionVisibility = useCallback((sectionName: string, isVisible: boolean) => {
        setMetricsState(prev => {
            const newState = {
                ...prev,
                sections: {
                    ...prev.sections,
                    [sectionName]: {
                        ...prev.sections[sectionName],
                        isVisible
                    }
                }
            };
            return newState;
        });

        // If section becomes visible, trigger fetch
        if (isVisible && selectedService) {
            setTimeout(() => {
                debouncedFetchVisibleSections();
            }, 50);
        }
    }, [selectedService, debouncedFetchVisibleSections]); // MINIMAL dependencies

    // Event Handlers
    const handleServiceChange = useCallback((service: string) => {
        // Clear any pending fetches and fresh data
        pendingFetches.current.clear();
        setFreshMetricData({});
        if (fetchDebounceTimeout.current) {
            clearTimeout(fetchDebounceTimeout.current);
        }

        // Reset everything when service changes
        setSelectedService(service);
        const newTimeRange = calculateDefaultTimeRange();
        setMetricsState({
            timeRange: newTimeRange,
            sections: {},
            isRefreshing: false
        });
    }, []);

    const handleRefresh = useCallback(() => {
        //console.log('[Refresh] Manual refresh triggered - MetricsToolbar handles the actual refresh logic');
        // MetricsToolbar zaten timeRange'i güncelliyor ve bu da otomatik fetch tetikliyor
        // Bu fonksiyonda ek bir işlem yapmaya gerek yok
    }, []);

    const handleTimeRangeChange = useCallback((range: [number, number]) => {
        const newTimeRange = createTimeRange(range[0], range[1]);
        updateTimeRange(newTimeRange);
    }, [updateTimeRange]);

    const handleNowClick = useCallback(() => {
        const newNowSelected = !isNowSelected;
        setIsNowSelected(newNowSelected);

        if (newNowSelected) {
            const newTimeRange = calculateDefaultTimeRange();
            updateTimeRange(newTimeRange);
        }
    }, [isNowSelected, updateTimeRange]);

    // Home button handler
    const handleGoHome = useCallback(() => {
        setSelectedService(undefined);
        setFreshMetricData({});
        setMetricsState(prev => ({
            ...prev,
            sections: {},
            isRefreshing: false
        }));
    }, []);

    const handleMetricNavigate = useCallback((metricIndex: number, sectionName: string) => {
        const sectionElement = document.querySelector(`[data-section="${sectionName}"]`);
        if (!sectionElement) {
            console.warn(`Section not found: ${sectionName}`);
            return;
        }

        const collapseHeader = document.querySelector(`[data-section="${sectionName}"]`)?.closest('.ant-collapse-item');
        if (collapseHeader && !collapseHeader.classList.contains('ant-collapse-item-active')) {
            const headerButton = collapseHeader.querySelector('.ant-collapse-header') as HTMLElement;
            if (headerButton) {
                headerButton.click();
            }
        }

        setTimeout(() => {
            const metricConfig = filteredMetrics[metricIndex];
            const sectionElement = document.querySelector(`[data-section="${sectionName}"]`);
            
            if (sectionElement) {
                const metricCards = sectionElement.querySelectorAll('.ant-col');
                const targetMetrics = filteredMetrics.filter(m => m.section === sectionName);
                const indexInSection = targetMetrics.findIndex(m => m.metric === metricConfig.metric);
                
                if (metricCards[indexInSection]) {
                    const targetCard = metricCards[indexInSection];
                    
                    targetCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });

                    const cardElement = targetCard.querySelector('.ant-card') as HTMLElement;
                    if (cardElement) {
                        cardElement.style.transition = 'all 0.3s ease';
                        cardElement.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
                        cardElement.style.transform = 'scale(1.02)';
                        
                        setTimeout(() => {
                            cardElement.style.boxShadow = '';
                            cardElement.style.transform = '';
                        }, 2000);
                    }
                }
            }
        }, 200);
    }, []);

    // Effects

    // Intersection Observer Effect - ONLY depends on selectedService
    useEffect(() => {
        if (!selectedService) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const sectionName = entry.target.getAttribute('data-section');
                    if (sectionName) {
                        updateSectionVisibility(sectionName, entry.isIntersecting);
                    }
                });
            },
            { threshold: 0.1 }
        );

        intersectionObserver.current = observer;

        // Observe all section elements
        const observedElements: string[] = [];
        Object.keys(sectionMetrics).forEach(sectionName => {
            const element = document.querySelector(`[data-section="${sectionName}"]`);
            if (element) {
                observer.observe(element);
                observedElements.push(sectionName);
            } /* else {
                console.log(`[IntersectionObserver] Element not found for section: ${sectionName}`);
            } */
        });

        return () => {
            observer.disconnect();
        };
    }, [selectedService]); // ONLY selectedService dependency

    // Initial mount effect
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (fetchDebounceTimeout.current) {
                clearTimeout(fetchDebounceTimeout.current);
            }
            pendingFetches.current.clear();
        };
    }, []);

    const getSectionDataStatus = useCallback((sectionName: string) => {
        const metricIndices = sectionMetrics[sectionName] || [];
        let hasData = false;
        let hasLoading = false;
        
        for (const metricIndex of metricIndices) {
            const metricData = combinedMetricsData[metricIndex];
            
            if (metricData?.loading) {
                hasLoading = true;
            }
            
            if (metricData?.metricsData?.data?.result?.length > 0) {
                for (const series of metricData.metricsData.data.result) {
                    if (series.values && series.values.length > 0) {
                        const hasNonZeroValue = series.values.some((point) => 
                            Number(point[1]) > 0
                        );
                        if (hasNonZeroValue) {
                            hasData = true;
                            break;
                        }
                    }
                }
                if (hasData) break;
            }
        }
        
        return { hasData, hasLoading };
    }, [sectionMetrics, combinedMetricsData]);

    // Render
    const groupedMetrics = filteredMetrics.reduce((acc, metric, index) => {
        if (!acc[metric.section]) {
            acc[metric.section] = [];
        }
        acc[metric.section].push({ metric, index });
        return acc;
    }, {} as { [key: string]: { metric: typeof filteredMetrics[0], index: number }[] });

    return (
        <>
            <Card>
                <MetricsToolbar
                    selectedService={selectedService}
                    onServiceChange={handleServiceChange}
                    timeRange={[metricsState.timeRange.startTime, metricsState.timeRange.endTime]}
                    onTimeRangeChange={handleTimeRangeChange}
                    isNowSelected={isNowSelected}
                    onNowClick={handleNowClick}
                    onRefresh={handleRefresh}
                    isLoading={metricsState.isRefreshing}
                    lastRefreshTime={Date.now()}
                    onGoHome={handleGoHome}
                />

                {!selectedService ? (
                    <EmptyStateCard 
                        selectedGroup={selectedGroup}
                        onGroupSelect={handleGroupChange}
                    />
                ) : (
                    <Collapse
                        defaultActiveKey={Object.keys(groupedMetrics)}
                        style={{ border: 'none' }}
                        items={Object.entries(groupedMetrics).map(([section, metrics]) => {
                            const { hasData, hasLoading } = getSectionDataStatus(section);
                            
                            let extraLabel = `${metrics.length} metrics`;
                            if (!hasData && !hasLoading) {
                                extraLabel += ' • No Data';
                            }
                            
                            return {
                                key: section,
                                label: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{section}</span>,
                                extra: <span style={{ 
                                    fontSize: '12px', 
                                    color: !hasData && !hasLoading ? '#ff4d4f' : 'gray'
                                }}>{extraLabel}</span>,
                                children: (
                                    <div data-section={section}>
                                        <Row gutter={[16, 16]}>
                                            {metrics.map(({ metric, index }) => (
                                                <Col span={metric.span} key={metric.metric}>
                                                    <MetricChart
                                                        data={combinedMetricsData[index]}
                                                        title={metric.title}
                                                        metricConfig={metric}
                                                        height={CHART_HEIGHT}
                                                        isUpdated={
                                                            metricsState.sections[section]?.lastFetchedTimeRangeId ===
                                                            metricsState.timeRange.id
                                                        }
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                ),
                            };
                        })}
                    />
                )}
            </Card>

            <MetricsNavigator
                selectedService={selectedService}
                onMetricClick={handleMetricNavigate}
                metrics={filteredMetrics}
            />
        </>
    );
};

export default React.memo(Metrics);
