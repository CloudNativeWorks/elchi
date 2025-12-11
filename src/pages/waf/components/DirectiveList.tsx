/**
 * Directive List Component
 * Displays list of directives with edit/delete/reorder actions
 */

import React from 'react';
import { List, Button, Tooltip, Input } from 'antd';
import {
    UpOutlined,
    DownOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { renderHighlightedDirective } from '../utils/directiveSyntaxHighlight';

const { TextArea } = Input;

export interface DirectiveListProps {
    directives: string[];
    setName: string;
    editingDirective: { setName: string; index: number } | null;
    editValue: string;
    onEditValueChange: (value: string) => void;
    onMoveUp: (setName: string, index: number) => void;
    onMoveDown: (setName: string, index: number) => void;
    onStartEdit: (setName: string, index: number, value: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: (setName: string, index: number) => void;
}

const DirectiveList: React.FC<DirectiveListProps> = ({
    directives,
    setName,
    editingDirective,
    editValue,
    onEditValueChange,
    onMoveUp,
    onMoveDown,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onDelete
}) => {
    if (directives.length === 0) {
        return null;
    }

    return (
        <div style={{
            maxHeight: 400,
            overflowY: 'auto',
            border: '1px solid #d9d9d9',
            borderRadius: 4
        }}>
            <List
                size="small"
                dataSource={directives}
                renderItem={(directive, index) => {
                    const isEditing = editingDirective?.setName === setName && editingDirective?.index === index;
                    const isMultiLine = directive.includes('\n');

                    return (
                        <List.Item
                            actions={
                                isEditing ? [
                                    <Button
                                        key="save"
                                        type="text"
                                        size="small"
                                        icon={<CheckOutlined />}
                                        onClick={onSaveEdit}
                                        style={{ color: '#52c41a' }}
                                    />,
                                    <Button
                                        key="cancel"
                                        type="text"
                                        size="small"
                                        icon={<CloseOutlined />}
                                        onClick={onCancelEdit}
                                        danger
                                    />
                                ] : [
                                    <Button
                                        type="default"
                                        size="small"
                                        icon={<UpOutlined />}
                                        disabled={index === 0}
                                        onClick={() => onMoveUp(setName, index)}
                                    />,
                                    <Button
                                        type="default"
                                        size="small"
                                        icon={<DownOutlined />}
                                        disabled={index === directives.length - 1}
                                        onClick={() => onMoveDown(setName, index)}
                                    />,
                                    <Tooltip key="edit" title="Edit">
                                        <Button
                                            type="default"
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={() => onStartEdit(setName, index, directive)}
                                        />
                                    </Tooltip>,
                                    <Tooltip key="delete" title="Delete">
                                        <Button
                                            danger
                                            type="primary"
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => onDelete(setName, index)}
                                        />
                                    </Tooltip>
                                ]
                            }
                        >
                            {isEditing ? (
                                <TextArea
                                    value={editValue}
                                    onChange={(e) => onEditValueChange(e.target.value)}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            onSaveEdit();
                                        }
                                    }}
                                    autoFocus
                                    autoSize={{ minRows: 1, maxRows: 20 }}
                                    style={{ fontFamily: 'monospace', fontSize: 12 }}
                                />
                            ) : (
                                <div
                                    style={{ cursor: 'pointer', width: '100%' }}
                                    onClick={() => onStartEdit(setName, index, directive)}
                                >
                                    {isMultiLine ? (
                                        <pre style={{
                                            margin: 0,
                                            fontFamily: 'monospace',
                                            fontSize: 12,
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            background: '#f5f5f5',
                                            padding: 8,
                                            borderRadius: 4
                                        }}>
                                            {directive}
                                        </pre>
                                    ) : (
                                        renderHighlightedDirective(directive)
                                    )}
                                </div>
                            )}
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default DirectiveList;
