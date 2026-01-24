import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import { SaveOutlined, CheckOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';


type LuaEditorProps = {
    value: string;
    onChange: any;
};

const ComponentLua: React.FC<LuaEditorProps> = ({ value, onChange }) => {
    const [tempLua, setTempLua] = useState(value);
    const [error, setError] = useState<string | null>(null);
    const [editorHeight, setEditorHeight] = useState(200);
    const [isSaved, setIsSaved] = useState(false);
    const editorRef = React.useRef<any>(null);

    useEffect(() => {
        setTempLua(value);
    }, [value]);

    const handleUpdate = () => {
        try {
            setError(null);
            onChange(tempLua);

            // Success animation
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);

            if (editorRef.current) {
                const lineCount = editorRef.current.getModel().getLineCount();
                const calculatedHeight = Math.min(Math.max(lineCount * 20, 200), 700);
                setEditorHeight(calculatedHeight);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
        const lineCount = editor.getModel().getLineCount();
        const calculatedHeight = Math.min(Math.max(lineCount * 20, 200), 700);
        setEditorHeight(calculatedHeight);
    };

    return (
        <div>
            {error && (
                <Alert
                    message="Invalid Lua Code"
                    description={error}
                    type="warning"
                    showIcon
                    style={{ marginBottom: '8px' }}
                />
            )}
            <MonacoEditor
                height={`${editorHeight}px`}
                width="100%"
                language="lua"
                value={tempLua}
                theme="vs-dark"
                options={{
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 10 },
                    inlineSuggest: { enabled: true },
                    bracketPairColorization: { enabled: true },
                    renderWhitespace: "all",
                    renderLineHighlight: "all",
                    smoothScrolling: true,
                }}
                onMount={handleEditorMount}
                onChange={(newValue) => setTempLua(newValue)}
            />
            <div style={{ 
                marginTop: 12,
                padding: '0px 0px',
                background: 'var(--bg-elevated)',
                borderRadius: 8,
                border: '1px solid var(--border-default)'
            }}>
                <Button 
                    onClick={handleUpdate} 
                    disabled={!!error}
                    type="primary"
                    size="large"
                    icon={isSaved ? <CheckOutlined /> : <SaveOutlined />}
                    style={{ 
                        width: "100%",
                        height: 44,
                        background: error ? 'var(--bg-disabled)' :
                                   isSaved ? 'var(--gradient-success)' :
                                   'var(--gradient-primary)',
                        border: error ? '1px solid var(--border-default)' :
                               isSaved ? '1px solid rgba(255, 255, 255, 0.2)' :
                               '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        boxShadow: error ? 'none' :
                                  isSaved ? 'var(--shadow-success)' :
                                  'var(--shadow-primary)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: error ? 'var(--text-tertiary)' : 'var(--text-on-primary)',
                        transform: isSaved ? 'scale(1.01)' : 'scale(1)'
                    }}
                    onMouseEnter={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-primary-hover)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-primary)';
                        }
                    }}
                >
                    {isSaved ? 'Saved' : 'Save LUA'}
                </Button>
                {error && (
                    <div style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: 'var(--color-danger)',
                        textAlign: 'center'
                    }}>
                        Fix Lua syntax errors to enable saving
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentLua;