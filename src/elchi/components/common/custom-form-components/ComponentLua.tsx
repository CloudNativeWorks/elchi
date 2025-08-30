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
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: 8,
                border: '1px solid #e2e8f0'
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
                        background: error ? '#d9d9d9' : 
                                   isSaved ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 50%, #95de64 100%)' :
                                   'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                        border: error ? '1px solid #d9d9d9' : 
                               isSaved ? '1px solid rgba(255, 255, 255, 0.2)' :
                               '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        boxShadow: error ? 'none' : 
                                  isSaved ? '0 4px 12px rgba(82, 196, 26, 0.3), 0 2px 6px rgba(0,0,0,0.1)' :
                                  '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        color: error ? '#8c8c8c' : '#ffffff',
                        transform: isSaved ? 'scale(1.01)' : 'scale(1)'
                    }}
                    onMouseEnter={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4), 0 3px 8px rgba(0,0,0,0.15)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!error && !isSaved) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(0,0,0,0.1)';
                        }
                    }}
                >
                    {isSaved ? 'Saved' : 'Save LUA'}
                </Button>
                {error && (
                    <div style={{
                        marginTop: 8,
                        fontSize: 11,
                        color: '#ff4d4f',
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