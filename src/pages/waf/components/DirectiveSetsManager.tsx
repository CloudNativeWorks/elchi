/**
 * Directive Sets Manager Component
 * Container for managing all directive sets
 */

import React from 'react';
import { Typography, Badge, Button, Input, Space, Modal, List } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import DirectiveSetCard from './DirectiveSetCard';
import { CrsRule } from '../types';

const { Text } = Typography;

export interface DirectiveSetsManagerProps {
    form: FormInstance;
    directiveSets: { [key: string]: string[] };
    newSetName: string;
    setNewSetName: (name: string) => void;
    onAddDirectiveSet: () => void;
    onRemoveDirectiveSet: (setName: string) => void;
    newDirective: { [key: string]: string };
    setNewDirective: (directive: { [key: string]: string }) => void;
    onAddDirective: (setName: string) => void;
    onQuickAddDirective: (setName: string, directive: string) => void;
    editingDirective: { setName: string; index: number } | null;
    editValue: string;
    setEditValue: (value: string) => void;
    onMoveUp: (setName: string, index: number) => void;
    onMoveDown: (setName: string, index: number) => void;
    onStartEdit: (setName: string, index: number, value: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (setName: string, index: number) => void;
    pendingCrsItem: { type: 'rule' | 'file'; data: CrsRule | string } | null;
    setPendingCrsItem: (item: { type: 'rule' | 'file'; data: CrsRule | string } | null) => void;
    selectSetModalVisible: boolean;
    setSelectSetModalVisible: (visible: boolean) => void;
    onConfirmSetSelection: (setName: string) => void;
}

const DirectiveSetsManager: React.FC<DirectiveSetsManagerProps> = ({
    form,
    directiveSets,
    newSetName,
    setNewSetName,
    onAddDirectiveSet,
    onRemoveDirectiveSet,
    newDirective,
    setNewDirective,
    onAddDirective,
    onQuickAddDirective,
    editingDirective,
    editValue,
    setEditValue,
    onMoveUp,
    onMoveDown,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete,
    setPendingCrsItem,
    selectSetModalVisible,
    setSelectSetModalVisible,
    onConfirmSetSelection
}) => {
    return (
        <>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: 12,
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                marginBottom: 16
            }}>
                {/* Header */}
                <div style={{
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-default)',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>Directive Sets</Text>
                    <Badge count={Object.keys(directiveSets).length} style={{ backgroundColor: 'var(--color-primary)' }} />
                </div>

                {/* Body */}
                <div style={{ padding: '16px 20px' }}>
                    <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
                        <Input
                            placeholder="New directive set name (e.g., strict, permissive)"
                            value={newSetName}
                            onChange={(e) => setNewSetName(e.target.value)}
                            onPressEnter={onAddDirectiveSet}
                            size="large"
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={onAddDirectiveSet}
                            disabled={!newSetName || !!directiveSets[newSetName]}
                            size="large"
                        >
                            Add Set
                        </Button>
                    </Space.Compact>

                    {Object.keys(directiveSets).length === 0 ? (
                        <Text type="secondary">No directive sets yet. Add your first set above.</Text>
                    ) : (
                        <>
                            {Object.entries(directiveSets).map(([setName, directives]) => (
                                <DirectiveSetCard
                                    key={setName}
                                    setName={setName}
                                    directives={directives}
                                    isDefault={form.getFieldValue('default_directives') === setName}
                                    newDirective={newDirective[setName] || ''}
                                    onNewDirectiveChange={(value) => setNewDirective({ ...newDirective, [setName]: value })}
                                    onAddDirective={() => onAddDirective(setName)}
                                    onQuickAdd={(directive) => onQuickAddDirective(setName, directive)}
                                    onRemoveSet={() => onRemoveDirectiveSet(setName)}
                                    editingDirective={editingDirective}
                                    editValue={editValue}
                                    onEditValueChange={setEditValue}
                                    onMoveUp={onMoveUp}
                                    onMoveDown={onMoveDown}
                                    onStartEdit={onStartEdit}
                                    onSaveEdit={onSaveEdit}
                                    onCancelEdit={onCancelEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* CRS Set Selection Modal */}
            <Modal
                title="Select Directive Set"
                open={selectSetModalVisible}
                onCancel={() => {
                    setSelectSetModalVisible(false);
                    setPendingCrsItem(null);
                }}
                footer={null}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>Select which directive set to add this CRS rule to:</Text>
                    <List
                        dataSource={Object.keys(directiveSets)}
                        renderItem={(setName) => (
                            <List.Item>
                                <Button
                                    type="primary"
                                    block
                                    onClick={() => onConfirmSetSelection(setName)}
                                >
                                    {setName}
                                    {form.getFieldValue('default_directives') === setName && (
                                        <span style={{ marginLeft: 8, background: 'var(--color-success)', color: 'var(--text-on-primary)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                                            Default
                                        </span>
                                    )}
                                </Button>
                            </List.Item>
                        )}
                    />
                </Space>
            </Modal>
        </>
    );
};

export default DirectiveSetsManager;
