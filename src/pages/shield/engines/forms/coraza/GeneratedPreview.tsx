/**
 * Read-only Monaco preview of the SecLang the edge will effectively load —
 * the "see exactly what ships" panel at the bottom of WAF Studio. Collapsible
 * so it stays out of the way until the user wants to verify the output.
 */

import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import { CaretRightOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { CorazaSpec } from '../../../state/model';
import { buildGeneratedConf } from './directivesCodec';

const { Text } = Typography;

const GeneratedPreview: React.FC<{ spec: CorazaSpec }> = ({ spec }) => {
    const { isDark } = useTheme();
    const [open, setOpen] = useState(false);
    const conf = buildGeneratedConf(spec);

    return (
        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12 }}>
            <Button
                type="text"
                size="small"
                icon={open ? <DownOutlined /> : <CaretRightOutlined />}
                onClick={() => setOpen((v) => !v)}
            >
                <EyeOutlined style={{ marginRight: 4 }} />
                Generated configuration
                <Text type="secondary" style={{ fontSize: 12, marginLeft: 6 }}>
                    (what the edge loads)
                </Text>
            </Button>
            {open && (
                <div style={{ marginTop: 8, border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
                    <MonacoEditor
                        height="240px"
                        language="ini"
                        theme={isDark ? 'vs-dark' : 'light'}
                        value={conf}
                        options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            fontSize: 12,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default GeneratedPreview;
