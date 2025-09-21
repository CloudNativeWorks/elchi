
import { useState, useEffect } from 'react';


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