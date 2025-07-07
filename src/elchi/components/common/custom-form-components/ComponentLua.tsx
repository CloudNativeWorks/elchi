import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import MonacoEditor from '@monaco-editor/react';


type LuaEditorProps = {
    value: string;
    onChange: any;
};

const ComponentLua: React.FC<LuaEditorProps> = ({ value, onChange }) => {
    const [tempLua, setTempLua] = useState(value);
    const [error, setError] = useState<string | null>(null);
    const [editorHeight, setEditorHeight] = useState(200);
    const editorRef = React.useRef<any>(null);

    useEffect(() => {
        setTempLua(value);
    }, [value]);

    const handleUpdate = () => {
        try {
            setError(null);
            onChange(tempLua);

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
            <Button
                onClick={handleUpdate}
                disabled={!!error}
                style={{ marginTop: '3px', width: "100%", background: "linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)", color: "#fff" }}
            >
                Update
            </Button>
        </div>
    );
};

export default ComponentLua;