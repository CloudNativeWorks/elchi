import React from 'react';
import { Alert } from 'antd';


interface ErrorEntry {
    message: string;
    resource_id: string;
    response_nonce: string;
    count: number;
    timestamp: string;
}

interface NodeWarningsProps {
    err: any;
}

const NodeWarnings: React.FC<NodeWarningsProps> = ({ err }) => {

    if (!err || err.length === 0) return null;

    return (
        <div >
            {err.filter((field: any) => !field?.resolved)
                .map((error: ErrorEntry, index: number) => (
                    <Alert
                        key={index}
                        message={`Warning: ${error.message}`}
                        description={`Resource Type: ${error.resource_id.replace("type.googleapis.com/", "")}, Nonce: ${error.response_nonce}, Repeat: ${error.count}, Timestamp: ${new Date(error.timestamp).toLocaleString()}`}
                        type="warning"
                        showIcon
                        closable
                        style={{ marginBottom: 3 }}
                    />
                ))}
        </div>
    );
};

export default NodeWarnings;