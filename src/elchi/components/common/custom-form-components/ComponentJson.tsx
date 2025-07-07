import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import MonacoEditor from '@monaco-editor/react';


type JsonEditorProps = {
    value: any;
    onChange: any;
};

const ComponentJson: React.FC<JsonEditorProps> = ({ value, onChange }) => {
    const [tempJson, setTempJson] = useState(JSON.stringify(value, null, 2));
    const [error, setError] = useState<string | null>(null);
    const [editorHeight, setEditorHeight] = useState(200);
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
            <Button onClick={handleFormatJson} disabled={!!error} style={{ marginTop: '3px', width: "100%", background: "linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)", color: "#fff" }}>
                Update
            </Button>
        </div>
    );
};

export default ComponentJson;