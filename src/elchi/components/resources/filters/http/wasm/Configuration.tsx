import React, { useMemo, useState, useEffect } from "react";
import { Col, Divider, Input, Select, Form } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useModels } from "@/hooks/useModels";
import { modtag_config } from "./_modtag_";

const { TextArea } = Input;

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentConfiguration: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_config);
    const { handleChangeRedux } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // Local state for the input value (plain text)
    const [inputValue, setInputValue] = useState('');

    // Decode value from Redux and sync to local state
    useEffect(() => {
        const config = veri.reduxStore?.configuration;

        if (!config || !config.value) {
            setInputValue('');
            return;
        }

        // Redux stores value as Uint8Array (from protobuf model)
        // When it's displayed, it's already the actual bytes
        if (config.value instanceof Uint8Array) {
            const decoder = new TextDecoder('utf-8');
            setInputValue(decoder.decode(config.value));
        } else {
            // Fallback - shouldn't happen
            setInputValue(String(config.value || ''));
        }
    }, [veri.reduxStore?.configuration]);

    // Get current type_url
    const currentTypeUrl = useMemo(() => {
        return veri.reduxStore?.configuration?.type_url || '';
    }, [veri.reduxStore?.configuration?.type_url]);

    // Determine selected type based on type_url
    const selectedType = useMemo(() => {
        if (currentTypeUrl.includes('google.protobuf.Struct')) return 'Struct';
        if (currentTypeUrl.includes('google.protobuf.BytesValue')) return 'BytesValue';
        if (currentTypeUrl.includes('google.protobuf.StringValue')) return 'StringValue';
        return 'Struct'; // Default
    }, [currentTypeUrl]);

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    // Handle type change
    const handleTypeChange = (type: string) => {
        let type_url = '';
        switch (type) {
            case 'Struct':
                type_url = 'type.googleapis.com/google.protobuf.Struct';
                break;
            case 'BytesValue':
                type_url = 'type.googleapis.com/google.protobuf.BytesValue';
                break;
            case 'StringValue':
                type_url = 'type.googleapis.com/google.protobuf.StringValue';
                break;
        }

        // Encode to base64 (protobuf requirement for bytes field)
        // Use proper UTF-8 encoding
        const encoder = new TextEncoder();
        const bytes = encoder.encode(inputValue);
        const binaryString = String.fromCharCode(...bytes);
        const base64Value = btoa(binaryString);

        handleChangeRedux(`${veri.keyPrefix}.configuration`, {
            $type: 'google.protobuf.Any',
            type_url,
            value: base64Value
        });
    };

    // Handle value change
    const handleValueChange = (value: string) => {
        // Update local state immediately for responsive UI
        setInputValue(value);

        // Encode to base64 (protobuf requirement for bytes field)
        // Use proper UTF-8 encoding
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);
        const binaryString = String.fromCharCode(...bytes);
        const base64Value = btoa(binaryString);

        handleChangeRedux(`${veri.keyPrefix}.configuration`, {
            $type: 'google.protobuf.Any',
            type_url: currentTypeUrl || 'type.googleapis.com/google.protobuf.Struct',
            value: base64Value
        });
    };

    return (
        <ECard
            title={veri.title}
            reduxStore={veri.reduxStore}
            ctype="wasm_configuration"
            toJSON={vModels.cnfg?.PluginConfig.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <Form layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        label="Configuration Type"
                        tooltip="Type of configuration data. Struct is JSON, BytesValue/StringValue are passed directly."
                    >
                        <Select
                            value={selectedType}
                            onChange={handleTypeChange}
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: 'Struct',
                                    label: 'google.protobuf.Struct (JSON)',
                                },
                                {
                                    value: 'BytesValue',
                                    label: 'google.protobuf.BytesValue (Direct)',
                                },
                                {
                                    value: 'StringValue',
                                    label: 'google.protobuf.StringValue (Direct)',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Configuration Value"
                        tooltip={
                            selectedType === 'Struct'
                                ? 'Enter JSON configuration. Will be serialized before passing to plugin.'
                                : 'Enter configuration value. Will be passed directly to plugin.'
                        }
                    >
                        <TextArea
                            rows={12}
                            value={inputValue}
                            onChange={(e) => handleValueChange(e.target.value)}
                            placeholder={
                                selectedType === 'Struct'
                                    ? '{\n  "key": "value",\n  "another_key": "another_value"\n}'
                                    : 'Enter your configuration value here...'
                            }
                            style={{ fontFamily: 'monospace', fontSize: '13px' }}
                        />
                    </Form.Item>
                </Form>
            </Col>
        </ECard>
    );
};

export default memorizeComponent(ComponentConfiguration, compareVeri);
