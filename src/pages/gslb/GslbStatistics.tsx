/**
 * GSLB Statistics Page
 * Displays GSLB health check metrics and statistics
 */

import React, { useState } from 'react';
import { Row, Col, Typography, Space, Tag, Spin, Select, Button, Progress, Tooltip } from 'antd';
import {
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  ReloadOutlined,
  ApiOutlined,
  FieldTimeOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart, GaugeChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useGslbMetrics } from './hooks/useGslbMetrics';

echarts.use([LineChart, PieChart, BarChart, GaugeChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const { Title, Text } = Typography;

// Time range options
const TIME_RANGES = [
  { label: 'Last 15 minutes', value: 900 },
  { label: 'Last 1 hour', value: 3600 },
  { label: 'Last 6 hours', value: 21600 },
  { label: 'Last 24 hours', value: 86400 },
];

// Card header style
const cardHeaderStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  borderBottom: '1px solid var(--border-default)',
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// Card container style
const cardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  borderRadius: '8px',
  border: '1px solid var(--border-default)',
  overflow: 'hidden',
};

// Card body style
const cardBodyStyle: React.CSSProperties = {
  padding: '16px',
};

// Stat card style
const statCardStyle = (borderColor: string): React.CSSProperties => ({
  background: 'var(--card-bg)',
  borderRadius: '8px',
  border: '1px solid var(--border-default)',
  borderTop: `3px solid ${borderColor}`,
  padding: '16px',
});

const GslbStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState(3600);
  const [controller, setController] = useState('all');
  const { metrics, controllers, loading, refetch } = useGslbMetrics(timeRange, controller);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toFixed(0);
  };

  // Detect if dark mode is active by checking the document body class
  const isDarkMode = document.body.classList.contains('dark') ||
                     document.documentElement.getAttribute('data-theme') === 'dark' ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Theme-aware colors for ECharts (which doesn't support CSS variables directly)
  const textColor = isDarkMode ? '#e0e0e0' : '#333333';
  const textSecondaryColor = isDarkMode ? '#a0a0a0' : '#666666';
  const gridLineColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // IP Health Distribution Pie Chart
  const ipHealthChartOptions = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { fontSize: 11, color: textSecondaryColor } },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      label: { show: true, formatter: '{c}', fontSize: 12, color: textColor },
      data: [
        { value: metrics.healthyIps, name: 'Healthy', itemStyle: { color: '#52c41a' } },
        { value: metrics.warningIps, name: 'Warning', itemStyle: { color: '#faad14' } },
        { value: metrics.criticalIps, name: 'Critical', itemStyle: { color: '#ff4d4f' } },
      ].filter(d => d.value > 0),
    }],
  };

  // Error Breakdown Pie Chart - dynamic from metrics.errors
  // Filter out values < 1 (too small to display meaningfully)
  const visibleErrors = metrics.errors.filter(e => e.value >= 1);
  const totalErrors = metrics.errors.reduce((sum, e) => sum + e.value, 0);
  const errorBreakdownChartOptions = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: { fontSize: 10, color: textSecondaryColor },
      data: visibleErrors.map(e => e.type.replace(/_/g, ' ')),
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '42%'],
      minAngle: 5, // Minimum angle for small slices to be visible
      label: { show: false },
      data: visibleErrors.map(e => ({
        value: Math.round(e.value),
        name: e.type.replace(/_/g, ' '),
        itemStyle: { color: e.color },
      })),
    }],
  };

  // Success Rate Timeline Chart
  const successRateChartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        const date = new Date(data.value[0]);
        return `${date.toLocaleTimeString()}<br/>Success Rate: ${data.value[1].toFixed(2)}%`;
      },
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'time',
      axisLabel: { fontSize: 10, color: textSecondaryColor, formatter: (value: number) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
      axisLine: { lineStyle: { color: gridLineColor } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: { fontSize: 10, color: textSecondaryColor, formatter: '{value}%' },
      axisLine: { lineStyle: { color: gridLineColor } },
      splitLine: { lineStyle: { color: gridLineColor } },
    },
    series: [{
      type: 'line',
      data: metrics.successRateTrend,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#52c41a', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(82, 196, 26, 0.4)' },
          { offset: 1, color: 'rgba(82, 196, 26, 0.05)' },
        ]),
      },
    }],
  };

  // Latency Timeline Chart
  const latencyChartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0];
        const date = new Date(data.value[0]);
        return `${date.toLocaleTimeString()}<br/>Avg Latency: ${(data.value[1] * 1000).toFixed(0)}ms`;
      },
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'time',
      axisLabel: { fontSize: 10, color: textSecondaryColor, formatter: (value: number) => new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) },
      axisLine: { lineStyle: { color: gridLineColor } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: textSecondaryColor, formatter: (value: number) => `${(value * 1000).toFixed(0)}ms` },
      axisLine: { lineStyle: { color: gridLineColor } },
      splitLine: { lineStyle: { color: gridLineColor } },
    },
    series: [{
      type: 'line',
      data: metrics.latencyTrend,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: '#1890ff', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(24, 144, 255, 0.4)' },
          { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
        ]),
      },
    }],
  };

  // Success Rate Gauge
  const successRateGaugeOptions = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      radius: '100%',
      center: ['50%', '70%'],
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [0.3, '#ff4d4f'],
            [0.7, '#faad14'],
            [1, '#52c41a'],
          ],
        },
      },
      pointer: { show: true, length: '60%', width: 6 },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 20,
        fontWeight: 'bold',
        offsetCenter: [0, '45%'],
        color: metrics.successRate >= 70 ? '#52c41a' : metrics.successRate >= 30 ? '#faad14' : '#ff4d4f',
      },
      data: [{ value: Math.round(metrics.successRate * 100) / 100 }],
    }],
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading GSLB Statistics...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <GlobalOutlined style={{ fontSize: 28, color: 'var(--color-primary)' }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>GSLB Statistics</Title>
            <Text type="secondary">Health check metrics and probe statistics</Text>
          </div>
        </Space>
        <Space>
          <Select
            value={controller}
            onChange={setController}
            style={{ width: 180 }}
            options={[
              { label: 'All Controllers', value: 'all' },
              ...controllers.map(c => ({ label: c, value: c }))
            ]}
          />
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={TIME_RANGES}
            style={{ width: 160 }}
          />
          <Button icon={<ReloadOutlined />} onClick={refetch}>Refresh</Button>
        </Space>
      </div>

      {/* IP Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <div style={statCardStyle('#1890ff')}>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <CloudServerOutlined style={{ color: 'var(--color-primary)' }} />
                <Text type="secondary">Total IPs</Text>
              </Space>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-primary)' }}>
              {metrics.totalIps}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={statCardStyle('#52c41a')}>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                <Text type="secondary">Healthy IPs</Text>
              </Space>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-success)' }}>
              {metrics.healthyIps}
              <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>/ {metrics.totalIps}</Text>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={statCardStyle('#ff4d4f')}>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <CloseCircleOutlined style={{ color: 'var(--color-danger)' }} />
                <Text type="secondary">Critical IPs</Text>
              </Space>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-danger)' }}>
              {metrics.criticalIps}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={statCardStyle('#faad14')}>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <SyncOutlined style={{ color: 'var(--color-warning)' }} />
                <Text type="secondary">Backoff Active</Text>
              </Space>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-warning)' }}>
              {metrics.backoffActiveIps}
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Success Rate Gauge */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '320px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <ThunderboltOutlined style={{ color: 'var(--color-success)' }} />
                <Text strong>Probe Success Rate</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <ReactEChartsCore
                echarts={echarts}
                option={successRateGaugeOptions}
                style={{ height: '180px' }}
              />
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <Space split={<span style={{ color: 'var(--border-default)' }}>|</span>}>
                  <Text type="secondary">Success: <Text strong style={{ color: 'var(--color-success)' }}>{formatNumber(metrics.probesSuccess)}</Text></Text>
                  <Text type="secondary">Failure: <Text strong style={{ color: 'var(--color-danger)' }}>{formatNumber(metrics.probesFailure)}</Text></Text>
                </Space>
              </div>
            </div>
          </div>
        </Col>

        {/* IP Health Distribution */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '320px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <CloudServerOutlined style={{ color: 'var(--color-primary)' }} />
                <Text strong>IP Health Distribution</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <ReactEChartsCore
                echarts={echarts}
                option={ipHealthChartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </Col>

        {/* Error Breakdown */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '320px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <WarningOutlined style={{ color: 'var(--color-danger)' }} />
                <Text strong>Error Breakdown</Text>
              </Space>
              <Tag color="red">{formatNumber(totalErrors)} total</Tag>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <ReactEChartsCore
                echarts={echarts}
                option={errorBreakdownChartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Timeline Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <div style={{ ...cardStyle, height: '320px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <ThunderboltOutlined style={{ color: 'var(--color-success)' }} />
                <Text strong>Success Rate Timeline</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <ReactEChartsCore
                echarts={echarts}
                option={successRateChartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ ...cardStyle, height: '320px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <ClockCircleOutlined style={{ color: 'var(--color-primary)' }} />
                <Text strong>Probe Latency Timeline</Text>
              </Space>
              <Space>
                <Tag color="green">Min: {(metrics.latencyMin * 1000).toFixed(0)}ms</Tag>
                <Tag color="blue">Avg: {(metrics.latencyAvg * 1000).toFixed(0)}ms</Tag>
                <Tag color="orange">Max: {(metrics.latencyMax * 1000).toFixed(0)}ms</Tag>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <ReactEChartsCore
                echarts={echarts}
                option={latencyChartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* System Stats */}
      <Row gutter={[16, 16]}>
        {/* Worker Stats */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '240px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <ApiOutlined style={{ color: 'var(--color-purple)' }} />
                <Text strong>Worker Pool</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Active Workers</Text>
                  <Tag color="purple">{metrics.workersActive}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Queue Depth</Text>
                  <Tag color={metrics.workersQueueDepth > 0 ? 'orange' : 'green'}>{metrics.workersQueueDepth}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Result Queue</Text>
                  <Tag color={metrics.resultQueueDepth > 0 ? 'orange' : 'green'}>{metrics.resultQueueDepth}</Tag>
                </div>
                <div>
                  <Text type="secondary">Result Queue Capacity</Text>
                  <Progress
                    percent={metrics.resultQueueCapacityPct}
                    size="small"
                    status={metrics.resultQueueCapacityPct > 80 ? 'exception' : 'normal'}
                  />
                </div>
              </Space>
            </div>
          </div>
        </Col>

        {/* Timewheel Stats */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '240px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <FieldTimeOutlined style={{ color: 'var(--color-cyan)' }} />
                <Text strong>Timewheel Scheduler</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Current Load</Text>
                  <Tag color="cyan">{metrics.timewheelCurrentLoad}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Current Slot</Text>
                  <Tag color="blue">{metrics.timewheelCurrentSlot}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Scheduled Total</Text>
                  <Tag color="geekblue">{formatNumber(metrics.timewheelScheduled)}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Executed Total</Text>
                  <Tag color="green">{formatNumber(metrics.timewheelExecuted)}</Tag>
                </div>
              </Space>
            </div>
          </div>
        </Col>

        {/* Write Buffer Stats */}
        <Col xs={24} md={8}>
          <div style={{ ...cardStyle, height: '240px' }}>
            <div style={cardHeaderStyle}>
              <Space>
                <DatabaseOutlined style={{ color: 'var(--color-pink)' }} />
                <Text strong>Write Buffer</Text>
              </Space>
            </div>
            <div style={{ ...cardBodyStyle, height: 'calc(100% - 49px)' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Buffer Size</Text>
                  <Tag color={metrics.writeBufferSize > 0 ? 'orange' : 'green'}>{metrics.writeBufferSize}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Flush Total</Text>
                  <Tag color="blue">{formatNumber(metrics.writeBufferFlushTotal)}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tooltip title="Errors during flush operations">
                    <Text>Flush Errors</Text>
                  </Tooltip>
                  <Tag color={metrics.writeBufferFlushErrors > 0 ? 'red' : 'green'}>{metrics.writeBufferFlushErrors}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Avg Flush Duration</Text>
                  <Tag color="purple">{(metrics.writeBufferAvgFlushDuration * 1000).toFixed(1)}ms</Tag>
                </div>
                <div>
                  <Text type="secondary">Buffer Capacity</Text>
                  <Progress
                    percent={metrics.writeBufferCapacityPct}
                    size="small"
                    status={metrics.writeBufferCapacityPct > 80 ? 'exception' : 'normal'}
                  />
                </div>
              </Space>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Info */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <div style={cardStyle}>
            <div style={{ ...cardBodyStyle, padding: '12px 16px' }}>
              <Space split={<span style={{ color: 'var(--border-default)', margin: '0 16px' }}>|</span>} wrap>
                <Text type="secondary">
                  Owned Shards: <Text strong>{metrics.ownedShards}</Text>
                </Text>
                <Text type="secondary">
                  Write Buffer Updates: <Text strong>{formatNumber(metrics.writeBufferUpdatesTotal)}</Text>
                </Text>
                <Text type="secondary">
                  Warning IPs: <Text strong style={{ color: 'var(--color-warning)' }}>{metrics.warningIps}</Text>
                </Text>
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GslbStatistics;
