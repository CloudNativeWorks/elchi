import React, { useEffect, useState } from 'react';
import { Modal, Select, Button, Space, message, Divider, Row, Col } from 'antd';
import { useLoggerSettings } from '@/hooks/useLoggerSettings';

interface LoggerSettingsModalProps {
    open: boolean;
    onClose: () => void;
    name: string;
    project: string;
}

const LOG_LEVELS = ['trace', 'debug', 'info', 'warning', 'error', 'critical'];

const LoggerSettingsModal: React.FC<LoggerSettingsModalProps> = ({
    open,
    onClose,
    name,
    project
}) => {
    const { loading, fetchCurrentSettings, updateLoggerSettings } = useLoggerSettings({ name, project });
    const [loggers, setLoggers] = useState<Record<string, string>>({});
    const [selectedComponent, setSelectedComponent] = useState<string>();
    const [selectedLevel, setSelectedLevel] = useState<string>();
    const [globalLevel, setGlobalLevel] = useState<string>();

    useEffect(() => {
        if (open) {
            loadCurrentSettings();
        }
    }, [open]);

    const loadCurrentSettings = async () => {
        const result = await fetchCurrentSettings();
        if (result.success) {
            setLoggers(result.data);
        } else {
            message.error(result.error);
        }
    };

    const handleUpdateGlobalLevel = async () => {
        if (!globalLevel) {
            message.warning('Please select a log level');
            return;
        }

        const result = await updateLoggerSettings({
            level: globalLevel
        });

        if (result.success) {
            setLoggers(result.data);
            message.success('Successfully updated all log levels');
            setGlobalLevel(undefined);
        } else {
            message.error(result.error);
        }
    };

    const handleUpdateComponentLevel = async () => {
        if (!selectedLevel || !selectedComponent) {
            message.warning('Please select both component and log level');
            return;
        }

        const result = await updateLoggerSettings({
            component: selectedComponent,
            level: selectedLevel
        });

        if (result.success) {
            setLoggers(result.data);
            message.success('Successfully updated component log level');
            setSelectedComponent(undefined);
            setSelectedLevel(undefined);
        } else {
            message.error(result.error);
        }
    };

    const renderLogLevel = (level: string) => (
        <span style={{
            color: level === 'error' ? '#ff4d4f' :
                level === 'warning' ? '#faad14' :
                    level === 'info' ? '#40a9ff' :
                        level === 'debug' ? '#b37feb' :
                            level === 'trace' ? '#13c2c2' :
                                level === 'critical' ? '#d4380d' : '#bfbfbf'
        }}>
            {level}
        </span>
    );

    // Group components into columns
    const componentGroups = Object.entries(loggers).reduce<Array<Array<[string, string]>>>((acc, entry, index) => {
        const columnIndex = Math.floor(index / Math.ceil(Object.keys(loggers).length / 3));
        if (!acc[columnIndex]) acc[columnIndex] = [];
        acc[columnIndex].push(entry);
        return acc;
    }, []);

    return (
        <Modal
            title="Manage Log Levels"
            open={open}
            onCancel={onClose}
            width={1000}
            footer={null}
            style={{ top: 20 }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Global Level Control */}
                    <div>
                        <h4 style={{ marginBottom: 16 }}>Global Log Level</h4>
                        <Space>
                            <Select
                                style={{ width: 150 }}
                                placeholder="Select log level"
                                value={globalLevel}
                                onChange={setGlobalLevel}
                                options={LOG_LEVELS.map(level => ({
                                    label: level,
                                    value: level
                                }))}
                            />
                            <Button
                                type="primary"
                                onClick={handleUpdateGlobalLevel}
                                loading={loading}
                                style={{background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)', fontWeight: 600, border: 'none', color: '#fff'}}
                            >
                                Update All
                            </Button>
                        </Space>
                    </div>

                    {/* Component Level Control */}
                    <div>
                        <h4 style={{ marginBottom: 16, textAlign: 'right' }}>Component-Specific Log Level</h4>
                        <Space>
                            <Select
                                style={{ width: 200 }}
                                placeholder="Select component"
                                allowClear
                                value={selectedComponent}
                                onChange={setSelectedComponent}
                                options={Object.keys(loggers).map(component => ({
                                    label: component,
                                    value: component
                                }))}
                                showSearch
                            />
                            <Select
                                style={{ width: 150 }}
                                placeholder="Select log level"
                                value={selectedLevel}
                                onChange={setSelectedLevel}
                                options={LOG_LEVELS.map(level => ({
                                    label: level,
                                    value: level
                                }))}
                            />
                            <Button

                                onClick={handleUpdateComponentLevel}
                                loading={loading}
                                disabled={!selectedComponent}
                                style={selectedComponent && {background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)', fontWeight: 600, border: 'none', color: '#fff'}}
                            >
                                Update Component
                            </Button>
                        </Space>
                    </div>
                </div>

                <Divider style={{ margin: '0px 0' }} />

                <div>
                    <h4 style={{ marginBottom: 16 }}>Current Log Levels</h4>
                    <div style={{ 
                        maxHeight: '400px', 
                        overflowY: 'auto',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        padding: '16px 8px'
                    }}>
                        <Row gutter={16}>
                            {componentGroups.map((group, groupIndex) => (
                                <Col span={8} key={groupIndex}>
                                    <ul style={{ 
                                        listStyle: 'none', 
                                        padding: 0, 
                                        margin: 0
                                    }}>
                                        {group.map(([component, level]) => (
                                            <li 
                                                key={component} 
                                                style={{ 
                                                    padding: '8px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    backgroundColor: 'white'
                                                }}
                                            >
                                                <span style={{ 
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontFamily: 'monospace',
                                                    marginRight: 8,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {component}
                                                </span>
                                                {renderLogLevel(level)}
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </Space>
        </Modal>
    );
};

export default LoggerSettingsModal; 