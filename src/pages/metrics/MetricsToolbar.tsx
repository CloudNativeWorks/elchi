import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { DatePicker, Button, Space, Tooltip, theme, Badge } from 'antd';
import { ReloadOutlined, SyncOutlined, FieldTimeOutlined, ClockCircleOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useServices } from '@/hooks/useServices';
import { MetricsToolbarProps, QuickRanges } from './types';
import {
    ToolbarContainer,
    TimeControls,
    QuickRangeSelect,
    ServiceSelect,
    RefreshButton
} from './styles';

declare module 'styled-components' {
    export interface DefaultTheme {
        antd?: {
            colorBgContainer: string;
            colorSuccess: string;
        }
    }
}

const DEFAULT_QUICK_RANGE = 'Last 30 minutes';
const AUTO_REFRESH_INTERVAL = 10000;
const COUNTDOWN_INTERVAL = 1000;

const getCurrentUnixTime = () => Math.floor(Date.now() / 1000);

const MetricsToolbar: React.FC<MetricsToolbarProps> = ({
    selectedService,
    onServiceChange,
    timeRange,
    onTimeRangeChange,
    isNowSelected,
    onNowClick,
    isLoading,
    lastRefreshTime,
    onGoHome
}) => {
    const { token } = theme.useToken();
    const { data: services, isLoading: isLoadingServices } = useServices();
    const selectedQuickRange = useRef<string | null>(DEFAULT_QUICK_RANGE);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);
    const nextRefreshTime = useRef<number>(Date.now() + AUTO_REFRESH_INTERVAL);
    const isInitialMount = useRef(true);
    const isUpdatingTimeRange = useRef(false);
    const lastUpdateTime = useRef<number>(Date.now());

    const quickRanges: QuickRanges = useMemo(() => ({
        'Last 5 minutes': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 5 * 60, now];
        },
        'Last 15 minutes': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 15 * 60, now];
        },
        'Last 30 minutes': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 30 * 60, now];
        },
        'Last 1 hour': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 60 * 60, now];
        },
        'Last 3 hours': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 3 * 60 * 60, now];
        },
        'Last 6 hours': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 6 * 60 * 60, now];
        },
        'Last 12 hours': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 12 * 60 * 60, now];
        },
        'Last 24 hours': (): [number, number] => {
            const now = getCurrentUnixTime();
            return [now - 24 * 60 * 60, now];
        },
    }), []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (quickRanges[DEFAULT_QUICK_RANGE]) {
                const range = quickRanges[DEFAULT_QUICK_RANGE]();
                updateTimeRange(range);
                if (!isNowSelected) {
                    onNowClick();
                }
            }
        }
    }, []);

    const updateTimeRange = useCallback((range: [number, number]) => {
        const now = Date.now();
        if (now - lastUpdateTime.current < 100) return;
        lastUpdateTime.current = now;
        onTimeRangeChange(range);
    }, [onTimeRangeChange]);

    const handleStartChange = useCallback((date: dayjs.Dayjs | null) => {
        if (!date || isUpdatingTimeRange.current) return;
        const startTime = date.unix();
        const endTime = timeRange[1];
        if (startTime >= endTime) return;

        updateTimeRange([startTime, endTime]);
        selectedQuickRange.current = null;
        setAutoRefresh(false);
    }, [timeRange, updateTimeRange]);

    const handleEndChange = useCallback((date: dayjs.Dayjs | null) => {
        if (!date || isUpdatingTimeRange.current) return;
        const startTime = timeRange[0];
        const endTime = date.unix();
        if (endTime <= startTime) return;

        updateTimeRange([startTime, endTime]);
        selectedQuickRange.current = null;
        setAutoRefresh(false);
    }, [timeRange, updateTimeRange]);

    const handleRefresh = useCallback(() => {
        if (isUpdatingTimeRange.current) return;
        isUpdatingTimeRange.current = true;

        try {
            if (selectedQuickRange.current && quickRanges[selectedQuickRange.current]) {
                const range = quickRanges[selectedQuickRange.current]();
                updateTimeRange(range);
            } else if (isNowSelected) {
                const now = getCurrentUnixTime();
                const duration = timeRange[1] - timeRange[0];
                updateTimeRange([now - duration, now]);
            }

            if (autoRefresh) {
                const now = Date.now();
                nextRefreshTime.current = now + AUTO_REFRESH_INTERVAL;
                setCountdown(10);
            }
        } finally {
            isUpdatingTimeRange.current = false;
        }
    }, [quickRanges, isNowSelected, timeRange, updateTimeRange, autoRefresh]);

    useEffect(() => {
        if (!autoRefresh) {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
            }
            return;
        }

        const updateCountdown = () => {
            const currentTime = Date.now();
            const timeLeft = Math.ceil((nextRefreshTime.current - currentTime) / 1000);

            if (timeLeft <= 0) {
                handleRefresh();
            } else {
                setCountdown(timeLeft);
            }
        };

        updateCountdown();
        countdownInterval.current = setInterval(updateCountdown, COUNTDOWN_INTERVAL);

        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
            }
        };
    }, [autoRefresh, handleRefresh]);

    const handleQuickRangeChange = useCallback((key: string | null) => {
        if (isUpdatingTimeRange.current) return;
        selectedQuickRange.current = key;

        if (!key) {
            if (isNowSelected) {
                onNowClick();
            }
            setAutoRefresh(false);
            return;
        }

        if (quickRanges[key]) {
            isUpdatingTimeRange.current = true;
            try {
                const range = quickRanges[key]();
                updateTimeRange(range);
                if (!isNowSelected) {
                    onNowClick();
                }
                const now = Date.now();
                nextRefreshTime.current = now + AUTO_REFRESH_INTERVAL;
                handleRefresh();
            } finally {
                isUpdatingTimeRange.current = false;
            }
        }
    }, [quickRanges, isNowSelected, onNowClick, updateTimeRange, handleRefresh]);

    const toggleAutoRefresh = useCallback(() => {
        const newAutoRefresh = !autoRefresh;
        setAutoRefresh(newAutoRefresh);
        if (newAutoRefresh) {
            const now = Date.now();
            nextRefreshTime.current = now + AUTO_REFRESH_INTERVAL;
            setCountdown(10);
        }
    }, [autoRefresh]);

    const canAutoRefresh = isNowSelected || selectedQuickRange.current !== null;

    return (
        <ToolbarContainer $theme={{ background: `${token.colorBgContainer}f0` }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {/* Home Button */}
                <Tooltip title="Go to metric selection">
                    <Button
                        icon={<HomeOutlined />}
                        onClick={onGoHome}
                        style={{
                            height: '38px',
                            minWidth: '38px',
                            padding: '0 0px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px'
                        }}
                    >

                    </Button>
                </Tooltip>

                {/* Service Selector */}
                <ServiceSelect
                    placeholder={
                        <span>Select a service to view metrics</span>
                    }
                    loading={isLoadingServices}
                    value={selectedService}
                    onChange={onServiceChange}
                    showSearch
                    optionFilterProp="children"
                    options={services?.map((service: string) => ({
                        label: service,
                        value: service
                    }))}
                />
            </div>

            <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginLeft: 'auto',
                minWidth: 0
            }} className="time-controls-container">
                <TimeControls>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        value={dayjs.unix(timeRange[0])}
                        onChange={handleStartChange}
                        disabledDate={current => current && current > dayjs()}
                        placeholder="Start Time"
                        style={{ width: '180px' }}
                    />
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        value={isNowSelected ? null : dayjs.unix(timeRange[1])}
                        onChange={handleEndChange}
                        disabledDate={current => current && (current > dayjs() || current < dayjs.unix(timeRange[0]))}
                        disabled={isNowSelected}
                        placeholder="End Time"
                        style={{ width: '180px' }}
                    />
                    <Tooltip title={isNowSelected ? "Disable real-time updates" : "Enable real-time updates"}>
                        <Button
                            onClick={onNowClick}
                            icon={<FieldTimeOutlined />}
                            style={isNowSelected ? {
                                background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                border: 'none',
                                color: 'white',
                                fontWeight: 600
                            } : {}}
                        >
                            <span className="btn-text">Now</span>
                        </Button>
                    </Tooltip>
                </TimeControls>

                <QuickRangeSelect
                    placeholder={
                        <Space>
                            <ClockCircleOutlined />
                            <span>Quick Ranges</span>
                        </Space>
                    }
                    value={selectedQuickRange.current}
                    onChange={handleQuickRangeChange}
                    allowClear
                    options={Object.keys(quickRanges).map(key => ({
                        label: key,
                        value: key
                    }))}
                />

                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'nowrap'
                }}>
                    <Tooltip title={`Last refreshed: ${dayjs(lastRefreshTime).format('HH:mm:ss')}`}>
                        <RefreshButton
                            icon={<ReloadOutlined spin={isLoading} />}
                            onClick={handleRefresh}
                            loading={isLoading}
                        >
                            <span className="btn-text">Refresh</span>
                        </RefreshButton>
                    </Tooltip>
                    <Tooltip title={!canAutoRefresh
                        ? "Auto refresh requires Now or Quick Range selection"
                        : (autoRefresh ? "Disable auto refresh" : "Enable auto refresh (10s)")
                    }>
                        <RefreshButton
                            icon={<SyncOutlined spin={autoRefresh} />}
                            onClick={toggleAutoRefresh}
                            disabled={!canAutoRefresh}
                            $success={autoRefresh}
                            style={autoRefresh ? {
                                background: token.colorSuccess,
                                borderColor: token.colorSuccess,
                                color: 'white'
                            } : undefined}
                        >
                            {autoRefresh ? (
                                <>
                                    <Badge
                                        count={countdown}
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                            color: 'white',
                                            boxShadow: 'none',
                                            marginRight: '4px',
                                            marginBottom: '4px'
                                        }}
                                    />
                                    <span style={{ color: 'white' }} className="btn-text">Auto</span>
                                </>
                            ) : <span className="btn-text">Auto</span>}
                        </RefreshButton>
                    </Tooltip>
                </div>
            </div>
        </ToolbarContainer>
    );
};

export default React.memo(MetricsToolbar); 