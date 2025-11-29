import { useQuery } from '@tanstack/react-query';
import { api } from '@/common/api';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef } from 'react';

interface UseErrorSummaryProps {
    project: string;
    enabled?: boolean;
    triggerRefresh?: boolean; // External trigger for immediate refresh
}

interface ErrorSummaryData {
    total_error: number;
    errors: any[];
    services: any[];
    last_updated: string;
}

// Global error summary manager
class ErrorSummaryManager {
    private static instance: ErrorSummaryManager;
    private lastErrorCount = 0;
    private lastCheckTime = 0;
    private hasRecentErrors = false;
    private subscribers = new Set<() => void>();

    static getInstance(): ErrorSummaryManager {
        if (!ErrorSummaryManager.instance) {
            ErrorSummaryManager.instance = new ErrorSummaryManager();
        }
        return ErrorSummaryManager.instance;
    }

    subscribe(callback: () => void) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notifyNewErrors() {
        this.hasRecentErrors = true;
        this.subscribers.forEach(callback => callback());
    }

    updateErrorState(errorCount: number) {
        const hadErrors = this.lastErrorCount > 0;
        const hasErrors = errorCount > 0;
        
        // If errors increased or new errors appeared
        if (errorCount > this.lastErrorCount || (!hadErrors && hasErrors)) {
            this.hasRecentErrors = true;
        }
        
        this.lastErrorCount = errorCount;
        this.lastCheckTime = Date.now();
    }

    getPollingInterval(): number {
        const timeSinceLastCheck = Date.now() - this.lastCheckTime;
        
        // If there are recent errors, poll more frequently
        if (this.hasRecentErrors && timeSinceLastCheck < 5 * 60 * 1000) { // 5 minutes
            return 30 * 1000; // 30 seconds
        }
        
        // If there were errors in last check, poll moderately
        if (this.lastErrorCount > 0) {
            return 2 * 60 * 1000; // 2 minutes
        }
        
        // Default polling for no errors
        return 5 * 60 * 1000; // 5 minutes
    }

    resetRecentErrorFlag() {
        this.hasRecentErrors = false;
    }
}

export const useErrorSummary = ({ project, enabled = true, triggerRefresh }: UseErrorSummaryProps) => {
    const hasToken = !!Cookies.get('bb_token');
    const errorManager = ErrorSummaryManager.getInstance();
    const triggerCountRef = useRef(0);
    
    // Smart polling interval based on error state
    const getRefreshInterval = useCallback(() => {
        return errorManager.getPollingInterval();
    }, [errorManager]);

    const query = useQuery({
        queryKey: ['error_summary', project, triggerCountRef.current],
        enabled: enabled && !!project && hasToken,
        refetchInterval: getRefreshInterval,
        refetchIntervalInBackground: false, // Don't poll when tab is not active
        refetchOnWindowFocus: true, // Refresh when user comes back to tab
        retry: (failureCount, error: any) => {
            // Don't retry on auth errors
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        queryFn: async (): Promise<ErrorSummaryData> => {
            try {
                const response = await api.get(`/api/v3/custom/error_summary?project=${project}`);
                const data = response.data as ErrorSummaryData;
                
                // Update error manager state
                errorManager.updateErrorState(data.total_error || 0);
                
                return data;
            } catch (error: any) {
                // Only show notification for non-auth errors
                if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                    console.warn('Error fetching error summary:', error);
                }
                throw error;
            }
        },
    });

    // Handle external trigger refresh
    useEffect(() => {
        if (triggerRefresh) {
            triggerCountRef.current++;
            query.refetch();
        }
    }, [triggerRefresh, query]);

    // Subscribe to error manager for immediate updates
    useEffect(() => {
        const unsubscribe = errorManager.subscribe(() => {
            // Immediate refetch when new errors are reported
            query.refetch();
        });

        return () => {
            unsubscribe();
        };
    }, [errorManager, query]);

    // Reset recent error flag after successful fetch
    useEffect(() => {
        if (query.data) {
            // Reset flag after 1 minute to reduce polling frequency
            const timer = setTimeout(() => {
                errorManager.resetRecentErrorFlag();
            }, 60 * 1000);

            return () => clearTimeout(timer);
        }
    }, [query.data, errorManager]);

    return {
        ...query,
        // Expose method to trigger immediate refresh
        triggerRefresh: () => {
            errorManager.notifyNewErrors();
            query.refetch();
        }
    };
};

// Global function to trigger error summary refresh (can be called from anywhere)
export const triggerErrorSummaryRefresh = () => {
    const errorManager = ErrorSummaryManager.getInstance();
    errorManager.notifyNewErrors();
};

export default useErrorSummary;