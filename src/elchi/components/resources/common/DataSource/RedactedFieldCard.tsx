import React from 'react';
import { Button, Tooltip, Typography } from 'antd';
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { RedactionField } from './redaction';

const { Text, Paragraph } = Typography;

interface RedactedFieldCardProps {
    field: RedactionField;
    title: string;
    onReplace: () => void;
}

/**
 * Read-only placeholder shown in place of the textarea/upload when the
 * backend returned a redaction sentinel for this field.
 *
 * The card communicates two things at once:
 *   - "Your saved value is preserved if you do nothing" (no-op safety)
 *   - "Click Replace to enter a new value" (explicit affordance)
 *
 * Replace flips a parent-owned `unlockedFields` flag and clears the
 * sentinel from redux to `''`. After that, the regular `EFields` render
 * takes over. Cancel-replace lives next to the textarea (rendered by
 * the parent) — see `DataSource.tsx`.
 */
const RedactedFieldCard: React.FC<RedactedFieldCardProps> = ({ field, title, onReplace }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 14px',
            margin: '6px 0',
            border: '1px solid var(--color-warning-border)',
            background: 'var(--color-warning-bg)',
            borderRadius: 8,
        }}
        role="region"
        aria-label={`${title} (saved value preserved)`}
    >
        <LockOutlined
            style={{ color: 'var(--color-warning)', fontSize: 20, marginTop: 2 }}
            aria-hidden
        />
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong style={{ fontSize: 13 }}>
                    {title}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Saved value preserved
                </Text>
            </div>
            <Paragraph style={{ marginTop: 4, marginBottom: 0, fontSize: 12 }}>
                The stored value is hidden for security. Save without changes and the
                existing {field === 'inline_bytes' ? 'bytes' : 'string'} stay intact.
                To enter a new one, click <strong>Replace value</strong>.
            </Paragraph>
        </div>
        <Tooltip title="Clears the field so you can paste a new value. The saved value is preserved until you save.">
            <Button type="primary" icon={<EditOutlined />} onClick={onReplace}>
                Replace value
            </Button>
        </Tooltip>
    </div>
);

export default RedactedFieldCard;
