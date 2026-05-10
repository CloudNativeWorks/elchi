import React, { useState } from 'react';
import { Button, Form, Input, Tooltip, Typography } from 'antd';
import { EditOutlined, LockOutlined, RollbackOutlined } from '@ant-design/icons';
import {
    REDACTION_SENTINEL,
    isRedactedValue,
} from '@/elchi/components/resources/common/DataSource/redaction';

const { Text } = Typography;

interface PemFieldProps {
    /** Human-readable label rendered above the field. */
    label: string;
    /** Form.Item `name` for this PEM (e.g. `'ca_cert'`). */
    formItemName: string;
    /**
     * `true` when the backend reported a stored cert via `has_*_cert`.
     * Drives the "stored ✓" lock state.
     */
    hasStored: boolean;
    /** Current form value for this field — read by the parent via Form. */
    formValue: string | undefined;
    /** Force-replace setter the parent invokes via `form.setFieldValue`. */
    setFormValue: (value: string) => void;
    /** Optional helper hint shown under the field. */
    hint?: string;
}

/**
 * PEM textarea with a "stored ✓" lock state for sentinel-redacted values.
 *
 * GET on `/api/v3/setting/syslog-config` returns `***REDACTED***` for the
 * three cert fields. Sending the sentinel back unchanged is the backend's
 * preserve-on-empty contract — so we never strip it. Visually we show a
 * compact "stored ✓ — Replace value" card instead of dumping the literal
 * sentinel into a textarea (confusing) or stripping it (would clobber the
 * stored cert).
 *
 * Reuses `REDACTION_SENTINEL` and `isRedactedValue` from the WAF DataSource
 * redaction helper — same sentinel string, same semantics. We don't reuse
 * `RedactedFieldCard` itself because its prop surface is tied to DataSource
 * specifier types (`inline_string` / `inline_bytes`) that don't apply here.
 */
const PemField: React.FC<PemFieldProps> = ({
    label,
    formItemName,
    hasStored,
    formValue,
    setFormValue,
    hint,
}) => {
    const [overrideMode, setOverrideMode] = useState(false);
    // Lock state: backend says cert is stored, the form still holds the
    // sentinel, and the user hasn't clicked Replace.
    const isLocked = hasStored && isRedactedValue(formValue) && !overrideMode;

    const handleReplace = () => {
        // Clear the sentinel so the textarea opens empty; an empty body
        // sent back to the backend is treated as "preserve" too, but the
        // field becomes editable for a new PEM paste.
        setFormValue('');
        setOverrideMode(true);
    };

    const handleCancelReplace = () => {
        // Restore the sentinel so the next save round-trips a no-op.
        setFormValue(REDACTION_SENTINEL);
        setOverrideMode(false);
    };

    if (isLocked) {
        return (
            <Form.Item label={label}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 12px',
                        border: '1px solid var(--color-warning-border)',
                        background: 'var(--color-warning-bg)',
                        borderRadius: 8,
                    }}
                >
                    <LockOutlined
                        style={{ color: 'var(--color-warning)', fontSize: 18 }}
                        aria-hidden
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ fontSize: 13 }}>
                            Certificate stored
                        </Text>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                            The PEM is hidden for security. Save without changes and the existing
                            value stays intact.
                        </div>
                    </div>
                    <Tooltip title="Open an empty textarea to paste a new PEM">
                        <Button type="primary" icon={<EditOutlined />} onClick={handleReplace}>
                            Replace value
                        </Button>
                    </Tooltip>
                </div>
                {/* Keep the actual Form.Item input bound so validation still
                    sees the sentinel value. Hidden so it doesn't render. */}
                <Form.Item name={formItemName} hidden noStyle>
                    <Input />
                </Form.Item>
            </Form.Item>
        );
    }

    return (
        <Form.Item
            label={
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {label}
                    {hasStored && overrideMode && (
                        <Button
                            type="link"
                            size="small"
                            icon={<RollbackOutlined />}
                            onClick={handleCancelReplace}
                            style={{ padding: 0, height: 'auto', fontSize: 12 }}
                        >
                            Cancel replace
                        </Button>
                    )}
                </span>
            }
            name={formItemName}
            extra={hint}
        >
            <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 14 }}
                placeholder={'-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----'}
                style={{ fontFamily: 'monospace', fontSize: 12.5 }}
            />
        </Form.Item>
    );
};

export default PemField;
