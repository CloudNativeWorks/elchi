import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import { SaveOutlined, CheckOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';


type JsonEditorProps = {
    value: any;
    onChange: any;
};

const ComponentJson: React.FC<JsonEditorProps> = ({ value, onChange }) => {
    const [tempJson, setTempJson] = useState(JSON.stringify(value, null, 2));
    const [error, setError] = useState<string | null>(null);
    const [editorHeight, setEditorHeight] = useState(200);
    const [isSaved, setIsSaved] = useState(false);
    const editorRef = React.useRef<any>(null);


    useEffect(() => {
        try {
            const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
            setTempJson(JSON.stringify(parsedValue, null, 2));
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError("Invalid JSON data provided to the editor.");
        }
    }, [value]);

    const handleFormatJson = () => {
        try {
            const parsedJson = JSON.parse(tempJson);
            setTempJson(JSON.stringify(parsedJson, null, 2));
            setError(null);
            onChange(parsedJson);

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
                    message="Invalid JSON"
                    description={error}
                    type="warning"
                    showIcon
                    style={{ marginBottom: '8px' }}
                />
            )}
            <MonacoEditor
                height={`${editorHeight}px`}
                width="100%"
                language="json"
                value={tempJson}
                theme="vs-dark"
                options={{
                    minimap: { enabled: true },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    padding: { top: 10 },
                    bracketPairColorization: { enabled: true },
                    renderWhitespace: "all",
                    renderLineHighlight: "all",
                    cursorBlinking: "smooth",
                    selectionHighlight: true,
                }}
                onMount={handleEditorMount}
                onChange={(newValue) => {
                    setTempJson(newValue || '');
                    try {
                        JSON.parse(newValue || '{}');
                        setError(null);
                    } catch (err: any) {
                        setError(err.message);
                    }
                }}
            />
            <div style={{
                marginTop: 12,
                padding: '0px 0px',
                background: 'var(--gradient-background)',
                borderRadius: 8,
                border: '1px solid var(--border-default)'
            }}>
                <Button 
                    onClick={handleFormatJson} 
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
                               isSaved ? '1px solid var(--collapse-btn-border)' :
                               '1px solid var(--collapse-btn-border)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        boxShadow: error ? 'none' :
                                  isSaved ? '0 4px 12px var(--shadow-success-color), 0 2px 6px var(--shadow-color)' :
                                  '0 4px 12px var(--shadow-blue-color), 0 2px 6px var(--shadow-color)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: error ? 'var(--text-disabled)' : 'var(--text-on-primary)',
                        transform: isSaved ? 'scale(1.01)' : 'scale(1)'
                    }}
                    onMouseEnter={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 6px 16px var(--shadow-blue-color-hover), 0 3px 8px var(--shadow-color)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow-blue-color), 0 2px 6px var(--shadow-color)';
                        }
                    }}
                >
                    {isSaved ? 'Saved' : 'Save JSON'}
                </Button>
                {error && (
                    <div style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: 'var(--color-danger)',
                        textAlign: 'center'
                    }}>
                        Fix JSON syntax errors to enable saving
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComponentJson;