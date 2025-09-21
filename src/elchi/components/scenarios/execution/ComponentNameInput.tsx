import React from 'react';
import { Input, Typography } from 'antd';

const { Text } = Typography;

interface ComponentNameInputProps {
    originalName: string;
    currentName: string;
    onChange: (originalName: string, newName: string) => void;
    isValid: (name: string) => boolean;
}

const ComponentNameInput: React.FC<ComponentNameInputProps> = ({ originalName, currentName, onChange, isValid }) => {
    const isCurrentValid = isValid(currentName) || currentName === '';

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Text strong style={{ color: 'white' }}>
                Resource Name:
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                    value={currentName}
                    onChange={(e) => onChange(originalName, e.target.value)}
                    style={{
                        width: '200px',
                        fontWeight: 'bold'
                    }}
                    placeholder="Enter component name"
                    status={!isCurrentValid ? 'error' : ''}
                />
                {!isCurrentValid && (
                    <Text style={{ whiteSpace: 'nowrap', color: 'white', WebkitTextStroke: '0.2px red' }}>
                        !!!Only alphanumeric, dash, underscore allowed
                    </Text>
                )}
            </div>
        </div>
    );
};

export default ComponentNameInput;