import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row, Tag, Typography } from 'antd';
import { CheckCircleFilled, FireOutlined } from '@ant-design/icons';
import { STARTER_PRESETS, StarterPreset } from '../../constants/starterPresets';

const { Title, Text } = Typography;

interface PresetPickerModalProps {
    open: boolean;
    onPick: (preset: StarterPreset) => void;
    onClose: () => void;
}

/**
 * Shown once when creating a brand new WAF: pick a starter preset (or Blank).
 * Picking a preset hydrates the editor with a single set named after the preset.
 */
const PresetPickerModal: React.FC<PresetPickerModalProps> = ({ open, onPick, onClose }) => {
    const [selected, setSelected] = useState<string>(STARTER_PRESETS[0].id);

    const apply = () => {
        const preset = STARTER_PRESETS.find((p) => p.id === selected);
        if (preset) onPick(preset);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={780}
            title={
                <span>
                    <FireOutlined style={{ color: 'var(--color-danger)' }} /> Choose a starting point
                </span>
            }
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="apply" type="primary" onClick={apply}>
                    Use preset
                </Button>,
            ]}
        >
            <Text type="secondary">
                Each preset creates a single directive set you can rename or extend afterwards.
            </Text>
            <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                {STARTER_PRESETS.map((preset) => {
                    const isSelected = selected === preset.id;
                    return (
                        <Col span={12} key={preset.id}>
                            <Card
                                hoverable
                                onClick={() => setSelected(preset.id)}
                                style={{
                                    borderColor: isSelected ? 'var(--color-primary)' : undefined,
                                    boxShadow: isSelected ? '0 0 0 2px var(--color-primary-bg)' : undefined,
                                    cursor: 'pointer',
                                    height: '100%',
                                }}
                                styles={{ body: { padding: 14 } }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                    <div style={{ flex: 1 }}>
                                        <Title level={5} style={{ margin: 0 }}>
                                            {preset.name}
                                        </Title>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {preset.description}
                                        </Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Tag>{preset.directives.length} directive{preset.directives.length === 1 ? '' : 's'}</Tag>
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <CheckCircleFilled
                                            style={{ color: 'var(--color-primary)', fontSize: 20, marginTop: 2 }}
                                        />
                                    )}
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Modal>
    );
};

export default PresetPickerModal;
