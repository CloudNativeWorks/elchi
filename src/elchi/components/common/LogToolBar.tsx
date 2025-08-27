/* eslint-disable */
import React from 'react';
import { Input, Button, InputNumber, Tooltip, Select, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useServices } from '@/hooks/useServices';

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
}) => {
    const { data: services, isLoading: isLoadingServices } = useServices();
    const handleLevelChange = (values: string[]) => {
        const changedLevel = values.find(v => !activeLevels.includes(v)) || activeLevels.find(v => !values.includes(v));
        if (changedLevel) {
            onToggleLevel(changedLevel);
        }
    };

    return (
        <div style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {serviceLog && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Select
                        placeholder="Select a service to view logs"
                        loading={isLoadingServices}
                        value={selectedService}
                        onChange={onServiceChange}
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        style={{ minWidth: 250 }}
                        options={services?.map((service: string) => ({
                            label: service,
                            value: service
                        }))}
                    />
                </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Input.Search
                    placeholder="Search in logs..."
                    allowClear
                    value={searchText}
                    onChange={e => onSearchTextChange(e.target.value)}
                    style={{ width: 265 }}
                />
                <Select
                    mode="multiple"
                    style={{ minWidth: 200 }}
                    value={activeLevels}
                    onChange={handleLevelChange}
                    placeholder="Log Levels"
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
                    tagRender={({ label, value, closable, onClose }) => {
                        const level = logLevels.find(lvl => lvl.key === value);
                        return (
                            <Tag
                                color={level?.color}
                                closable={closable}
                                onClose={onClose}
                                style={{
                                    fontWeight: 600,
                                    marginRight: 3
                                }}
                            >
                                {level?.label}
                            </Tag>
                        );
                    }}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <InputNumber
                    min={10}
                    max={10000}
                    step={10}
                    value={pendingLogLineCount}
                    onChange={v => onPendingLogLineCountChange(Number(v) || 100)}
                    style={{ width: 140 }}
                    placeholder="Log Line"
                    addonBefore="Log Line"
                />
                <Tooltip title="Refresh logs">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onRefresh}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default LogToolbar;
