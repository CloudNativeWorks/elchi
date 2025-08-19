import { Typography, Select, Modal, Space, Radio } from 'antd';
import { useState } from 'react';
import ElchiButton from '../common/ElchiButton';

const { Title, Text } = Typography;

interface SelectVersionProps {
    open: boolean;
    onVersionSelect: (version: string, managed: boolean) => void;
    onCancel: () => void;
}

const SelectVersion = ({ open, onVersionSelect, onCancel }: SelectVersionProps): JSX.Element => {
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [isVersionSelected, setIsVersionSelected] = useState<boolean>(false);
    const [managed, setManaged] = useState<boolean>(true); // Default to true

    const handleVersionChange = (version: string) => {
        setSelectedVersion(version);
        setIsVersionSelected(!!version);
    };

    const handleOk = () => {
        if (isVersionSelected) {
            onVersionSelect(selectedVersion, managed);
        }
    };

    const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || ['v1.33.5', 'v1.34.2'];


    return (
        <Modal
            open={open}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
            onCancel={onCancel}
            width={520}
            centered={true}
            destroyOnHidden={true}
            styles={{
                body: {
                    paddingBottom: 0
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
            footer={[
                <div key={"scenario_select_version_footer"} style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 12,
                    paddingTop: 16,
                    borderTop: '1px solid #f0f0f0',
                    marginTop: 24
                }}>
                    <ElchiButton onlyText onClick={onCancel}>Cancel</ElchiButton>
                    <ElchiButton onlyText onClick={handleOk} disabled={!isVersionSelected}>Continue</ElchiButton>
                </div>
            ]}
        >
            <div style={{ padding: '8px 0' }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ marginBottom: 8, color: '#262626' }}>
                        Configure Scenario Execution
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        Select proxy version and deployment mode for your scenario
                    </Text>
                </div>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Version Selection */}
                    <div style={{ 
                        padding: '20px', 
                        background: '#fafafa', 
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Text strong style={{ 
                            fontSize: '15px',
                            color: '#262626',
                            marginBottom: 12, 
                            display: 'block' 
                        }}>
                            🚀 Version
                        </Text>
                        <Select
                            placeholder="Select Version"
                            onChange={handleVersionChange}
                            style={{ width: '100%' }}
                            size="large"
                            options={availableVersions.map(v => ({
                                value: v,
                                label: v
                            }))}
                        />
                    </div>

                    {/* Management Mode */}
                    <div style={{ 
                        padding: '20px', 
                        background: '#fafafa', 
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0'
                    }}>
                        <Text strong style={{ 
                            fontSize: '15px',
                            color: '#262626',
                            marginBottom: 16, 
                            display: 'block' 
                        }}>
                            ⚙️ Management Mode
                        </Text>
                        <Radio.Group
                            value={managed}
                            onChange={(e) => setManaged(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Radio value={true} style={{ 
                                    padding: '12px',
                                    border: managed === true ? '2px solid #52c41a' : '1px solid #e8e8e8',
                                    borderRadius: '8px',
                                    backgroundColor: managed === true ? '#f6ffed' : 'white',
                                    width: '100%',
                                    margin: 0
                                }}>
                                    <div style={{ paddingLeft: '8px' }}>
                                        <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>
                                            🔧 Managed by Elchi
                                        </Text>
                                        <br />
                                        <Text type="secondary" style={{ 
                                            fontSize: '12px', 
                                            lineHeight: '1.4',
                                            marginTop: '4px'
                                        }}>
                                            Full deployment management: saves configs, deploys to clients, manages networking
                                        </Text>
                                    </div>
                                </Radio>
                                <Radio value={false} style={{ 
                                    padding: '12px',
                                    border: managed === false ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                    borderRadius: '8px',
                                    backgroundColor: managed === false ? '#f6ffed' : 'white',
                                    width: '100%',
                                    margin: 0
                                }}>
                                    <div style={{ paddingLeft: '8px' }}>
                                        <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
                                            📡 Control-Plane Only
                                        </Text>
                                        <br />
                                        <Text type="secondary" style={{ 
                                            fontSize: '12px', 
                                            lineHeight: '1.4',
                                            marginTop: '4px'
                                        }}>
                                            Configs served via control-plane only, no deployment or IP management
                                        </Text>
                                    </div>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </Space>
            </div>
        </Modal>
    );
};

export default SelectVersion;