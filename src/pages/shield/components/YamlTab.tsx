/**
 * Two-way YAML view of the policy. Normally the editor mirrors the builder
 * (modelToYaml) and edits parse straight back into it. Content the builder
 * can't represent (unsupported keys / legacy bundles) flips the policy into
 * YAML mode: the raw text becomes the source of truth, with a banner.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Space, Typography } from 'antd';
import MonacoEditor from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { usePolicyEditor } from '../state/policyStore';
import { modelToYaml, yamlToModel } from '../utils/policyYaml';

const { Text } = Typography;

const YamlTab: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
    const { isDark } = useTheme();
    const { state, dispatch } = usePolicyEditor();
    const [text, setText] = useState('');
    const [parseError, setParseError] = useState<string | null>(null);
    const [valueWarnings, setValueWarnings] = useState<string[]>([]);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    // Tracks whether the current text came from the user (vs. regenerated).
    const userEditRef = useRef(false);

    // (Re)generate the document whenever the underlying state changes from
    // outside this tab (builder edits, hydrate, undo) — not while typing here.
    useEffect(() => {
        if (userEditRef.current) {
            userEditRef.current = false;
            return;
        }
        setText(state.yamlMode ? state.rawYaml : modelToYaml(state.model));
        setParseError(null);
        setValueWarnings([]);
    }, [state.model, state.yamlMode, state.rawYaml]);

    const handleChange = (value?: string) => {
        const next = value ?? '';
        setText(next);
        if (disabled) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            userEditRef.current = true;
            const parsed = yamlToModel(next);
            if (parsed.errors.length > 0) {
                // Invalid YAML: keep the text local, surface the error, leave the
                // store untouched until it parses again.
                setParseError(parsed.errors[0]);
                if (state.yamlMode) dispatch({ type: 'SET_RAW_YAML', rawYaml: next });
                return;
            }
            setParseError(null);
            setValueWarnings(parsed.invalidValues);
            if (parsed.unsupportedPaths.length > 0) {
                dispatch({ type: 'ENTER_YAML_MODE', rawYaml: next, reason: parsed.unsupportedPaths.map(p => `Unsupported field: ${p}`) });
                return;
            }
            if (state.yamlMode) {
                // Everything is representable again — return control to the builder.
                dispatch({ type: 'EXIT_YAML_MODE', model: parsed.model! });
            } else {
                dispatch({ type: 'PATCH', update: () => parsed.model! });
            }
        }, 600);
    };

    return (
        <>
            {state.yamlMode && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 8 }}
                    message="YAML mode — the builder is disabled for this policy"
                    description={
                        <>
                            <ul style={{ margin: '4px 0 8px 18px', padding: 0 }}>
                                {state.yamlModeReason.slice(0, 6).map((r, i) => (
                                    <li key={i}><Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{r}</Text></li>
                                ))}
                                {state.yamlModeReason.length > 6 && (
                                    <li><Text type="secondary" style={{ fontSize: 12 }}>+{state.yamlModeReason.length - 6} more</Text></li>
                                )}
                            </ul>
                            <Space>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Note: shield strict-decodes its config — unknown fields are rejected on the edge too.
                                </Text>
                                {!disabled && (
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            // Re-parse; if it is clean now, hand back to the builder.
                                            const parsed = yamlToModel(text);
                                            if (parsed.errors.length === 0 && parsed.unsupportedPaths.length === 0) {
                                                dispatch({ type: 'EXIT_YAML_MODE', model: parsed.model! });
                                            } else if (parsed.model) {
                                                // Drop whatever the builder can't represent.
                                                dispatch({ type: 'EXIT_YAML_MODE', model: parsed.model });
                                            }
                                        }}
                                    >
                                        Back to Builder (drops unsupported fields)
                                    </Button>
                                )}
                            </Space>
                        </>
                    }
                />
            )}

            {parseError && (
                <Alert
                    type="error"
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 8 }}
                    message="YAML parse error — changes are not applied until it parses"
                    description={<Text style={{ fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{parseError}</Text>}
                />
            )}

            {valueWarnings.length > 0 && (
                <Alert
                    type="error"
                    showIcon
                    style={{ marginBottom: 12, borderRadius: 8 }}
                    message="Invalid value(s) — shield will reject this config on the edge"
                    description={
                        <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                            {valueWarnings.map((w, i) => (
                                <li key={i}><Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{w}</Text></li>
                            ))}
                        </ul>
                    }
                />
            )}

            <MonacoEditor
                height="560px"
                language="yaml"
                theme={isDark ? 'vs-dark' : 'light'}
                value={text}
                onChange={handleChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    folding: true,
                    readOnly: !!disabled,
                }}
            />
        </>
    );
};

export default YamlTab;
