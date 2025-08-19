import React, { useEffect, useState } from "react";
import { Typography, Select, Modal, Space } from 'antd';
import { ClearResources } from "@/redux/reducers/slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GTypeFieldsBase } from "@/common/statics/gtypes";
import { multipleResource } from "@/common/statics/multiple-resources";
import ElchiButton from "./ElchiButton";


const { Title, Text } = Typography;

interface RenderFormItemProps<T> {
    setState: React.Dispatch<React.SetStateAction<T>>;
    currentState: T;
    GType: GTypeFieldsBase;
}

const SelectVersion = <T,>({ setState, currentState, GType }: RenderFormItemProps<T>): JSX.Element => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initValue, setInitValue] = useState(GType.initialValue);
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [selectedGType, setSelectedGType] = useState<string>('');

    useEffect(() => {
        if (GType.module && multipleResource[GType.module]) {
            const defaultGType = multipleResource[GType.module].defaultValue;
            setSelectedGType(defaultGType);
        }
        
        // Auto-select and auto-submit if only version needed and only one available
        if (GType.availableVersions && GType.availableVersions.length === 1) {
            const singleVersion = GType.availableVersions[0];
            setSelectedVersion(singleVersion);
            
            // If no GType selection needed, auto-submit
            if (!GType.module || !multipleResource[GType.module]) {
                if (initValue) {
                    dispatch(ClearResources({ version: singleVersion, initialValue: initValue }));
                }
                setState({ ...currentState, version: singleVersion });
            }
        }
    }, [GType, initValue, dispatch, currentState, setState]);

    const handleChangeGtype = (gtype: string) => {
        setSelectedGType(gtype);
        if (gtype === 'envoy.extensions.transport_sockets.tls.v3.TlsCertificate') {
            setInitValue([]);
        }
    };

    const handleVersionChange = (version: string) => {
        setSelectedVersion(version);
    };

    const handleOk = () => {
        // Apply selected values to state
        if (initValue) {
            dispatch(ClearResources({ version: selectedVersion, initialValue: initValue }));
        }
        
        const updatedState: any = { ...currentState, version: selectedVersion };
        if (selectedGType) {
            updatedState.gtype = selectedGType;
        }
        
        setState(updatedState);
    };

    // Check if all required selections are made
    const isReadyToSubmit = selectedVersion && (!GType.module || !multipleResource[GType.module] || selectedGType);

    const renderGTypeSelect = () => {
        if (GType.module && multipleResource[GType.module]) {
            const config = multipleResource[GType.module];
            return (
                <div style={{ 
                    padding: '20px', 
                    background: '#fafafa', 
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    marginBottom: '16px'
                }}>
                    <Text strong style={{ 
                        fontSize: '15px',
                        color: '#262626',
                        marginBottom: 12, 
                        display: 'block' 
                    }}>
                        🔧 {config.name}
                    </Text>
                    <Select
                        placeholder={`Select ${config.name}`}
                        value={selectedGType}
                        onChange={handleChangeGtype}
                        style={{ width: '100%' }}
                        size="large"
                        options={config.options}
                    />
                </div>
            );
        }
        return null;
    };

    return (
        <Modal
            open={true}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: true }}
            closable={false}
            onCancel={() => navigate(-1)}
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
                <div key={`footer_${GType.module}`} style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 12,
                    paddingTop: 16,
                    borderTop: '1px solid #f0f0f0',
                    marginTop: 24
                }}>
                    <ElchiButton onlyText onClick={() => navigate(-1)}>Cancel</ElchiButton>
                    <ElchiButton onlyText onClick={handleOk} disabled={!isReadyToSubmit}>OK</ElchiButton>
                </div>
            ]}
        >
            <div style={{ padding: '8px 0' }}>
                <div style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ marginBottom: 8, color: '#262626' }}>
                        Configure Resource Creation
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        Select proxy version and resource type for your configuration
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
                            {GType.availableVersions.length === 1 && selectedVersion && (
                                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '8px' }}>
                                    (Pre-selected)
                                </Text>
                            )}
                        </Text>
                        <Select
                            placeholder="Select Version"
                            value={selectedVersion || undefined}
                            onChange={handleVersionChange}
                            style={{ width: '100%' }}
                            size="large"
                            options={GType.availableVersions.map(v => ({
                                value: v,
                                label: v
                            }))}
                        />
                    </div>

                    {/* Resource Type Selection */}
                    {renderGTypeSelect()}
                </Space>
            </div>
        </Modal>
    );
};

export default SelectVersion;