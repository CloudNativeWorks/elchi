/* eslint-disable */
import React, { useState, useCallback } from 'react';
import { Input, Button, InputNumber, Tooltip, Select, Tag } from 'antd';
import { ReloadOutlined, RobotOutlined, SettingOutlined } from '@ant-design/icons';
import { useServices } from '@/hooks/useServices';
import { debounce } from 'lodash';

interface LogLevel {
    key: string;
    label: string;
    color: string;
}

interface ServiceLogToolbarProps {
    searchText: string;
    onSearchTextChange: (v: string) => void;
    logLevels: LogLevel[];
    activeLevels: string[];
    onToggleLevel: (level: string) => void;
    pendingLogLineCount: number;
    onPendingLogLineCountChange: (v: number) => void;
    onRefresh: () => void;
    selectedService?: string;
    onServiceChange?: (service: string) => void;
    enableServiceSearch?: boolean;
    logType?: number;
    onLogTypeChange?: (type: number) => void;
    // Component filter props
    availableComponents?: string[];
    activeComponents?: string[];
    onComponentsChange?: (components: string[]) => void;
    // Action button props
    onAIAnalysis?: () => void;
    aiAnalysisLoading?: boolean;
    aiAnalysisDisabled?: boolean;
    aiAnalysisResult?: any;
    onSettingsClick?: () => void;
    settingsDisabled?: boolean;
}

const ServiceLogToolbar: React.FC<ServiceLogToolbarProps> = ({
    searchText,
    onSearchTextChange,
    logLevels,
    activeLevels,
    onToggleLevel,
    pendingLogLineCount,
    onPendingLogLineCountChange,
    onRefresh,
    selectedService,
    onServiceChange,
    enableServiceSearch = false,
    logType,
    onLogTypeChange,
    availableComponents = [],
    activeComponents = [],
    onComponentsChange,
    onAIAnalysis,
    aiAnalysisLoading = false,
    aiAnalysisDisabled = false,
    aiAnalysisResult = null,
    onSettingsClick,
    settingsDisabled = false,
}) => {
    const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');
    const debouncedServiceSearch = useCallback(debounce((value: string) => setServiceSearchQuery(value), 300), []);
    const { data: services, isLoading: isLoadingServices } = useServices(
        enableServiceSearch ? serviceSearchQuery : '',
        true // Always enabled for service logs
    );
    const handleLevelChange = (values: string[]) => {
        const changedLevel = values.find(v => !activeLevels.includes(v)) || activeLevels.find(v => !values.includes(v));
        if (changedLevel) {
            onToggleLevel(changedLevel);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 12,
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8'
        }}>
            {/* First Row - Log Type, Service and Search */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                flexWrap: 'wrap'
            }}>
                {onLogTypeChange && (
                    <div style={{ flex: '0 0 160px', minWidth: 140 }}>
                        <Select
                            value={logType}
                            onChange={onLogTypeChange}
                            style={{ width: '100%' }}
                            placeholder="Log Type"
                            size="middle"
                            options={[
                                { label: '📋 All Logs', value: 0 },
                                { label: '⚙️ System', value: 1 },
                                { label: '🌐 Access', value: 2 }
                            ]}
                        />
                    </div>
                )}
                <div style={{ flex: '1 1 250px', minWidth: 250 }}>
                    <Select
                        placeholder="Select a service to view logs"
                        loading={isLoadingServices}
                        value={selectedService}
                        onChange={onServiceChange}
                        showSearch
                        allowClear
                        onSearch={enableServiceSearch ? debouncedServiceSearch : undefined}
                        filterOption={enableServiceSearch ? false : true}
                        style={{ width: '100%' }}
                        size="middle"
                        options={services?.map((service: string) => ({
                            label: service,
                            value: service
                        }))}
                    />
                </div>
                <div style={{ flex: '1 1 300px', minWidth: 200 }}>
                    <Input.Search
                        placeholder="Search in logs..."
                        allowClear
                        value={searchText}
                        onChange={e => onSearchTextChange(e.target.value)}
                        style={{ width: '100%' }}
                        size="middle"
                    />
                </div>
            </div>

            {/* Second Row - Component filter and action buttons on same line */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 12, 
                flexWrap: 'wrap'
            }}>
                {/* Left side - Component filter */}
                <div style={{ display: 'flex', gap: 12, flex: '1 1 auto', alignItems: 'center' }}>
                    {availableComponents.length > 0 && (
                        <div style={{ flex: '1 1 500px', minWidth: 300, maxWidth: 800 }}>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Filter by components..."
                                value={activeComponents}
                                onChange={onComponentsChange}
                                options={availableComponents.map(comp => ({
                                    label: comp,
                                    value: comp
                                }))}
                                maxTagCount="responsive"
                                size="middle"
                                disabled={logType === 2} // Disable when ACCESS logs selected
                            />
                        </div>
                    )}
                    
                    <div style={{ minWidth: 200, maxWidth: 400 }}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            value={activeLevels}
                            onChange={handleLevelChange}
                            placeholder="Log Levels"
                            size="middle"
                            disabled={logType === 2} // Disable when ACCESS logs selected
                            options={logLevels.map(lvl => ({
                                label: (
                                    <span style={{
                                        color: lvl.color,
                                        fontWeight: 600
                                    }}>
                                        {lvl.label}
                                    </span>
                                ),
                                value: lvl.key
                            }))}
                            tagRender={({ value, closable, onClose }) => {
                                const level = logLevels.find(lvl => lvl.key === value);
                                return (
                                    <Tag
                                        color={level?.color}
                                        closable={closable}
                                        onClose={onClose}
                                        style={{
                                            fontWeight: 600,
                                            marginRight: 3,
                                            fontSize: 11
                                        }}
                                    >
                                        {level?.label}
                                    </Tag>
                                );
                            }}
                        />
                    </div>
                </div>

                {/* Right side - Action buttons */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: '0 0 auto' }}>
                    <InputNumber
                        min={10}
                        max={10000}
                        step={10}
                        value={pendingLogLineCount}
                        onChange={v => onPendingLogLineCountChange(Number(v) || 100)}
                        style={{ width: 120 }}
                        placeholder="Lines"
                        addonBefore="Lines"
                        size="middle"
                    />

                    {onAIAnalysis && (
                        <Button
                            icon={<RobotOutlined />}
                            onClick={onAIAnalysis}
                            type="primary"
                            disabled={aiAnalysisDisabled}
                            loading={aiAnalysisLoading}
                            size="middle"
                            style={{
                                background: 'linear-gradient(90deg, #722ed1 0%, #1890ff 100%)',
                                border: 'none',
                                boxShadow: '0 2px 4px rgba(114, 46, 209, 0.3)',
                                color: 'white'
                            }}
                        >
                            {aiAnalysisResult ? 'New Analysis' : 'AI Analysis'}
                        </Button>
                    )}

                    {onSettingsClick && (
                        <Button
                            icon={<SettingOutlined />}
                            onClick={onSettingsClick}
                            disabled={settingsDisabled}
                            size="middle"
                        >
                            Log Settings
                        </Button>
                    )}

                    <Tooltip title="Refresh logs">
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                            size="middle"
                            style={{ minWidth: 48 }}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default ServiceLogToolbar;