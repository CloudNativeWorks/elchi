/* eslint-disable */
import React, { useState, useCallback } from 'react';
import { Input, Button, InputNumber, Tooltip, Select, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useServices } from '@/hooks/useServices';
import { debounce } from 'lodash';

interface LogLevel {
    key: string;
    label: string;
    color: string;
}

interface LogToolbarProps {
    searchText: string;
    onSearchTextChange: (v: string) => void;
    logLevels: LogLevel[];
    activeLevels: string[];
    onToggleLevel: (level: string) => void;
    pendingLogLineCount: number;
    onPendingLogLineCountChange: (v: number) => void;
    onRefresh: () => void;
    serviceLog?: boolean;
    selectedService?: string;
    onServiceChange?: (service: string) => void;
    enableServiceSearch?: boolean;
    logType?: number;
    onLogTypeChange?: (type: number) => void;
}

const LogToolbar: React.FC<LogToolbarProps> = ({
    searchText,
    onSearchTextChange,
    logLevels,
    activeLevels,
    onToggleLevel,
    pendingLogLineCount,
    onPendingLogLineCountChange,
    onRefresh,
    serviceLog = false,
    selectedService,
    onServiceChange,
    enableServiceSearch = false,
    logType,
    onLogTypeChange,
}) => {
    const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');
    const debouncedServiceSearch = useCallback(debounce((value: string) => setServiceSearchQuery(value), 300), []);
    const { data: services, isLoading: isLoadingServices } = useServices(
        serviceLog && enableServiceSearch ? serviceSearchQuery : '',
        serviceLog // Only enable when serviceLog is true
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
            {/* First Row - Service and Search */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                flexWrap: 'wrap'
            }}>
                {serviceLog && (
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
                )}
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

            {/* Second Row - Filters and Controls */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '2 1 300px', minWidth: 200 }}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={activeLevels}
                        onChange={handleLevelChange}
                        placeholder="Log Levels"
                        size="middle"
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
                
                {serviceLog && onLogTypeChange && (
                    <div style={{ flex: '1 1 160px', minWidth: 140 }}>
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

                <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                    <InputNumber
                        min={10}
                        max={10000}
                        step={10}
                        value={pendingLogLineCount}
                        onChange={v => onPendingLogLineCountChange(Number(v) || 100)}
                        style={{ width: '100%' }}
                        placeholder="Lines"
                        addonBefore="Lines"
                        size="middle"
                    />
                </div>

                <div style={{ flex: '0 0 auto' }}>
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

export default LogToolbar;
