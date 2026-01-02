import { useState, useCallback, useRef } from 'react';
import * as dynamicModules from "@/VersionedComponent";
import { showErrorNotification } from '@/common/notificationHandler';

// Extend LazyExoticComponent to include preload method (used by some bundlers)
type PreloadableLazyComponent<T extends React.ComponentType<any>> = React.LazyExoticComponent<T> & {
    preload?: () => Promise<{ default: T }>;
};

export interface ComponentLoaderState {
    component: PreloadableLazyComponent<React.ComponentType<any>> | null;
    isLoading: boolean;
    error: string | null;
    retryCount: number;
}

export interface ComponentLoaderOptions {
    maxRetries?: number;
    timeout?: number;
    retryDelay?: number;
    onError?: (error: string, retryCount: number) => void;
    onSuccess?: () => void;
}

const DEFAULT_OPTIONS: Required<ComponentLoaderOptions> = {
    maxRetries: 3,
    timeout: 10000, // 10 seconds
    retryDelay: 1000, // 1 second
    onError: () => {},
    onSuccess: () => {},
};

export const useComponentLoader = (options: ComponentLoaderOptions = {}) => {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const timeoutRef = useRef<NodeJS.Timeout>();
    const retryTimeoutRef = useRef<NodeJS.Timeout>();
    
    const [state, setState] = useState<ComponentLoaderState>({
        component: null,
        isLoading: false,
        error: null,
        retryCount: 0,
    });

    const clearTimeouts = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = undefined;
        }
    }, []);

    const loadComponentWithTimeout = useCallback(async (moduleName: string): Promise<PreloadableLazyComponent<React.ComponentType<any>>> => {
        return new Promise((resolve, reject) => {
            // Set timeout
            timeoutRef.current = setTimeout(() => {
                reject(new Error(`Component loading timeout: ${moduleName}`));
            }, config.timeout);

            try {
                const module = dynamicModules.availableModule(moduleName);
                
                // Test if the lazy component can be resolved
                module.VersionedComponent.preload?.()
                    .then(() => {
                        clearTimeout(timeoutRef.current!);
                        resolve(module.VersionedComponent);
                    })
                    .catch((error) => {
                        clearTimeout(timeoutRef.current!);
                        reject(error);
                    });
                
                // If preload is not available, resolve immediately
                if (!module.VersionedComponent.preload) {
                    clearTimeout(timeoutRef.current!);
                    resolve(module.VersionedComponent);
                }
                
            } catch (error) {
                clearTimeout(timeoutRef.current!);
                reject(error);
            }
        });
    }, [config.timeout]);

    const loadComponent = useCallback(async (moduleName: string, currentRetry = 0): Promise<void> => {
        if (!moduleName) {
            const error = 'Module name is required';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error,
                retryCount: currentRetry,
            }));
            config.onError(error, currentRetry);
            return;
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            retryCount: currentRetry,
        }));

        try {
            const component = await loadComponentWithTimeout(moduleName);
            
            setState(prev => ({
                ...prev,
                component,
                isLoading: false,
                error: null,
                retryCount: currentRetry,
            }));
            
            config.onSuccess();
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown component loading error';
            
            if (currentRetry < config.maxRetries) {
                // Retry after delay
                retryTimeoutRef.current = setTimeout(() => {
                    loadComponent(moduleName, currentRetry + 1);
                }, config.retryDelay * (currentRetry + 1)); // Exponential backoff
                
                setState(prev => ({
                    ...prev,
                    error: `${errorMessage} (Retrying ${currentRetry + 1}/${config.maxRetries})`,
                    retryCount: currentRetry + 1,
                }));
            } else {
                // Max retries reached
                const finalError = `Failed to load component "${moduleName}" after ${config.maxRetries} retries: ${errorMessage}`;
                
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: finalError,
                    retryCount: currentRetry,
                }));
                
                config.onError(finalError, currentRetry);
                showErrorNotification('Component Loading Failed', finalError);
            }
        }
    }, [config, loadComponentWithTimeout]);

    const retryLoad = useCallback((moduleName: string) => {
        clearTimeouts();
        loadComponent(moduleName, 0);
    }, [loadComponent, clearTimeouts]);

    const reset = useCallback(() => {
        clearTimeouts();
        setState({
            component: null,
            isLoading: false,
            error: null,
            retryCount: 0,
        });
    }, [clearTimeouts]);

    return {
        ...state,
        loadComponent,
        retryLoad,
        reset,
        isComponentReady: state.component !== null && !state.isLoading && !state.error,
    };
};