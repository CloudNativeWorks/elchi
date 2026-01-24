/* eslint-disable */
import React from 'react';
import { Input, Button, InputNumber, Tooltip, Select, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

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
}) => {
    const handleLevelChange = (values: string[]) => {
        const changedLevel = values.find(v => !activeLevels.includes(v)) || activeLevels.find(v => !values.includes(v));
        if (changedLevel) {
            onToggleLevel(changedLevel);
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            background: 'var(--bg-surface)',
            borderRadius: 8,
            border: '1px solid var(--border-default)',
            flexWrap: 'wrap'
        }}>
            {/* Search Input */}
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

            {/* Log Level Filter */}
            <div style={{ flex: '1 1 250px', minWidth: 200 }}>
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

            {/* Line Count */}
            <div style={{ flex: '0 0 auto', minWidth: 140 }}>
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

            {/* Refresh Button */}
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
    );
};

export default LogToolbar;
