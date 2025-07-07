
import { useState, useEffect } from 'react';


export const successMessage = (message: any, msg: string) => {
    message.open({
        type: 'success',
        content: msg,
    });
};

export const errorMessage = (message: any, msg: string) => {
    if (msg.startsWith('Resource has dependencies')) {
        const dependencies = msg.replace('Resource has dependencies:', '').split(',').map(dep => dep.trim());

        const content = (
            <span>
                <strong>Resource could not be deleted have dependencies:</strong>
                
                <ul style={{ paddingLeft: '20px', margin: 0, listStylePosition: 'outside' }}>
                    {dependencies.map((dep) => (
                        <li key={dep} style={{ marginLeft: '0', paddingLeft: '0' }}>{dep}</li>
                    ))}
                </ul>
            </span>
        );

        message.open({
            type: 'error',
            content: content,
            className: 'custom-message',
            duration: 5,
        });
    } else {
        message.open({
            type: 'error',
            content: msg,
        });
    }
};




export const useCustomMessage = (messageApi: any) => {
    const [messageConfig, setMessageConfig] = useState<{ type: 'success' | 'error' | 'warning', content: string } | null>(null);

    useEffect(() => {
        if (messageConfig) {
            messageApi.open(messageConfig);
            setMessageConfig(null);  // Resetting the message config to avoid re-rendering the same message
        }
    }, [messageConfig, messageApi]);

    const successMessage = (msg: string) => {
        setMessageConfig({
            type: 'success',
            content: msg
        });
    };

    const errorMessage = (msg: string) => {
        setMessageConfig({
            type: 'error',
            content: msg
        });
    };

    const warningMessage = (msg: string) => {
        setMessageConfig({
            type: 'warning',
            content: msg
        });
    };

    return { successMessage, errorMessage, warningMessage };
};