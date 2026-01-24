import React, { useState } from "react";
import { Button, Table, Modal, Input, InputNumber, Switch, Popconfirm, Space, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { MapFieldProps } from "./MapField";

interface MapEntry {
    key: string;
    value: any;
    tableIndex: number;
}

const MapFieldTable: React.FC<MapFieldProps> = ({
    version,
    reduxStore,
    keyPrefix,
    reduxAction,
    title,
    valueType = 'component',
    ValueComponent,
    keyPlaceholder = "Enter key",
    valuePlaceholder = "Enter value",
    gtype,
    id
}) => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState<any>("");
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    // Convert Map or Record to array for table display
    const getEntries = (): MapEntry[] => {
        if (!reduxStore) return [];

        if (reduxStore instanceof Map) {
            return Array.from(reduxStore.entries()).map(([key, value], index) => ({
                key,
                value,
                tableIndex: index
            }));
        }

        // Handle plain object
        return Object.entries(reduxStore).map(([key, value], index) => ({
            key,
            value,
            tableIndex: index
        }));
    };

    const entries = getEntries();

    const handleAdd = () => {
        if (!newKey.trim()) {
            Modal.error({ title: "Error", content: "Key cannot be empty" });
            return;
        }

        // Check for duplicate keys
        const exists = entries.some(entry => entry.key === newKey);
        if (exists) {
            Modal.error({ title: "Error", content: `Key "${newKey}" already exists` });
            return;
        }

        // Determine initial value based on valueType
        let initialValue: any = {};
        if (valueType === 'string') initialValue = newValue || "";
        else if (valueType === 'number') initialValue = newValue || 0;
        else if (valueType === 'boolean') initialValue = newValue || false;

        handleChangeResources(
            {
                version,
                type: ActionType.Update,
                keys: `${keyPrefix}.${newKey}`,
                val: initialValue,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );

        setNewKey("");
        setNewValue("");
        setIsModalVisible(false);
    };

    const handleDelete = (key: string) => {
        handleChangeResources(
            {
                version,
                type: ActionType.Delete,
                keys: `${keyPrefix}.${key}`,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );
    };

    const handleValueChange = (key: string, value: any) => {
        handleChangeResources(
            {
                version,
                type: ActionType.Update,
                keys: `${keyPrefix}.${key}`,
                val: value,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );
    };

    const renderValueEditor = (value: any, key: string) => {
        if (valueType === 'string') {
            return (
                <Input
                    value={value}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    placeholder={valuePlaceholder}
                />
            );
        } else if (valueType === 'number') {
            return (
                <InputNumber
                    value={value}
                    onChange={(val) => handleValueChange(key, val)}
                    placeholder={valuePlaceholder}
                    style={{ width: '100%' }}
                />
            );
        } else if (valueType === 'boolean') {
            return (
                <Switch
                    checked={value}
                    onChange={(checked) => handleValueChange(key, checked)}
                />
            );
        }

        return null; // Complex types handled in expanded row
    };

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
            width: valueType !== 'component' ? '30%' : '80%',
        },
        ...(valueType !== 'component' ? [{
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '50%',
            render: (value: any, record: MapEntry) => renderValueEditor(value, record.key)
        }] : []),
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            fixed: 'right' as const,
            render: (_: any, record: MapEntry) => (
                <Popconfirm
                    title="Delete this entry?"
                    onConfirm={() => handleDelete(record.key)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const expandedRowRender = (record: MapEntry) => {
        if (valueType !== 'component' || !ValueComponent) return null;

        return (
            <div style={{ padding: '0px', background: 'var(--bg-elevated)' }}>
                <ValueComponent
                    veri={{
                        version: version,
                        reduxStore: record.value,
                        keyPrefix: `${keyPrefix}.${record.key}`,
                        reduxAction: reduxAction
                    }}
                />
            </div>
        );
    };

    return (
        <CCard
            toJSON={undefined}
            reduxStore={reduxStore}
            keys={keyPrefix}
            Paste={undefined}
            ctype="map_field"
            version={version}
            title={title}
            gtype={gtype}
            id={id}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Add Entry
                </Button>

                <Table
                    columns={columns}
                    dataSource={entries}
                    rowKey="key"
                    pagination={false}
                    expandable={valueType === 'component' ? {
                        expandedRowRender,
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            setExpandedRowKeys(expanded ? [record.key] : []);
                        },
                    } : undefined}
                    locale={{ emptyText: 'No entries. Click "Add Entry" to create one.' }}
                />

                <Modal
                    title={`Add New ${title} Entry`}
                    open={isModalVisible}
                    onOk={handleAdd}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setNewKey("");
                        setNewValue("");
                    }}
                    okText="Add"
                >
                    <Form layout="vertical">
                        <Form.Item label="Key" required>
                            <Input
                                value={newKey}
                                onChange={(e) => setNewKey(e.target.value)}
                                placeholder={keyPlaceholder}
                                onPressEnter={handleAdd}
                            />
                        </Form.Item>
                        {valueType !== 'component' && (
                            <Form.Item label="Value">
                                {valueType === 'string' && (
                                    <Input
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        placeholder={valuePlaceholder}
                                    />
                                )}
                                {valueType === 'number' && (
                                    <InputNumber
                                        value={newValue}
                                        onChange={(val) => setNewValue(val)}
                                        placeholder={valuePlaceholder}
                                        style={{ width: '100%' }}
                                    />
                                )}
                                {valueType === 'boolean' && (
                                    <Switch
                                        checked={newValue}
                                        onChange={(checked) => setNewValue(checked)}
                                    />
                                )}
                            </Form.Item>
                        )}
                    </Form>
                </Modal>
            </Space>
        </CCard>
    );
};

export default MapFieldTable;
