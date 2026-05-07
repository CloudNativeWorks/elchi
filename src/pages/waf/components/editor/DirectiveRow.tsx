import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Space, Tooltip } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    HolderOutlined,
} from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Directive } from '../../types';
import { renderHighlightedDirective } from '../../utils/directiveSyntaxHighlight';

const { TextArea } = Input;

interface DirectiveRowProps {
    directive: Directive;
    onChange: (text: string) => void;
    onDelete: () => void;
}

const DirectiveRow: React.FC<DirectiveRowProps> = ({ directive, onChange, onDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: directive.id,
    });

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(directive.text);
    const taRef = useRef<any>(null);

    useEffect(() => {
        setDraft(directive.text);
    }, [directive.text]);

    useEffect(() => {
        if (editing) {
            // Focus on next tick so the textarea is mounted.
            setTimeout(() => taRef.current?.focus(), 0);
        }
    }, [editing]);

    const commit = () => {
        const next = draft.trim();
        if (next && next !== directive.text) onChange(next);
        setEditing(false);
    };

    const cancel = () => {
        setDraft(directive.text);
        setEditing(false);
    };

    const isMultiline = directive.text.includes('\n');

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        background: 'var(--card-bg)',
        border: '1px solid var(--border-default)',
        borderRadius: 8,
        padding: '6px 8px',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <button
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder"
                style={{
                    cursor: 'grab',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    paddingTop: 4,
                    touchAction: 'none',
                }}
            >
                <HolderOutlined />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                {editing ? (
                    <TextArea
                        ref={taRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoSize={{ minRows: 1, maxRows: 12 }}
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 12.5,
                            background: 'var(--bg-secondary, transparent)',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                cancel();
                            } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                commit();
                            }
                        }}
                    />
                ) : isMultiline ? (
                    <pre
                        style={{
                            margin: 0,
                            fontFamily: 'monospace',
                            fontSize: 12.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            color: 'var(--text-primary)',
                            background: 'var(--bg-secondary, transparent)',
                            padding: 4,
                            borderRadius: 4,
                        }}
                    >
                        {directive.text}
                    </pre>
                ) : (
                    <div
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 12.5,
                            wordBreak: 'break-all',
                            cursor: 'text',
                        }}
                        onDoubleClick={() => setEditing(true)}
                    >
                        {renderHighlightedDirective(directive.text)}
                    </div>
                )}
            </div>

            <Space size={2}>
                {editing ? (
                    <>
                        <Tooltip title="Save (⌘+Enter)">
                            <Button
                                type="text"
                                size="small"
                                icon={<CheckOutlined style={{ color: 'var(--color-success)' }} />}
                                onClick={commit}
                            />
                        </Tooltip>
                        <Tooltip title="Cancel (Esc)">
                            <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined style={{ color: 'var(--color-danger)' }} />}
                                onClick={cancel}
                            />
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title="Edit (double-click)">
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => setEditing(true)}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={onDelete}
                            />
                        </Tooltip>
                    </>
                )}
            </Space>
        </div>
    );
};

export default React.memo(DirectiveRow);
