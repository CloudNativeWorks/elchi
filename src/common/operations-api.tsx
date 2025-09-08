import { useMutation } from "@tanstack/react-query";
import { MetricsApiMutationOptions, OperationsApiMutationOptions } from './types';
import { api } from "./api";
import { handleApiResponse } from './notificationHandler';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useCallback } from "react";

// Read-only operations that should not show notifications (matching backend)
const readOnlySubTypes: Record<string, Record<string, boolean>> = {
    SERVICE: {
        "SUB_STATUS": true,
        "SUB_LOGS": true,
    },
    NETWORK: {
        "SUB_NETPLAN_GET": true,
        "SUB_ROUTE_LIST": true,
        "SUB_POLICY_LIST": true,
        "SUB_TABLE_LIST": true,
        "SUB_GET_NETWORK_STATE": true,
    },
};

// Read-only operation types (entire types that are read-only)
const readOnlyTypes: Record<string, boolean> = {
    "CLIENT_LOGS": true,
    "CLIENT_STATS": true,
    "FRR_LOGS": true,
};

// Read-only BGP operations that should not show notifications
const readOnlyBGPOperations: Record<string, boolean> = {
    "BGP_GET_CONFIG": true,
    "BGP_LIST_NEIGHBORS": true,
    "BGP_GET_NEIGHBOR": true,
    "BGP_GET_POLICY_CONFIG": true,
    "BGP_SHOW_ROUTES": true,
    "BGP_GET_SUMMARY": true,
};

// Read-only Envoy Version operations that should not show notifications
const readOnlyEnvoyVersionOperations: Record<string, boolean> = {
    "GET_VERSIONS": true,
};

export const useOperationsApiMutation = (hookVersion?: string) => {
    const mutationFn = async (options: OperationsApiMutationOptions) => {
        const { data, project, version } = options;
        let url = 'api/op/clients';
        
        // Build query parameters - prefer version from options, fallback to hook version
        const params = new URLSearchParams();
        const finalVersion = version || hookVersion;
        if (finalVersion) params.set('version', finalVersion);
        if (project) params.set('project', project);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await api.post(url, data);
        
        // Check if this is a read-only operation that should not show notifications
        let shouldShowNotification = true;
        
        // Check if entire operation type is read-only
        if (data.type && readOnlyTypes[data.type]) {
            shouldShowNotification = false;
        }
        
        if (data.type && data.sub_type) {
            // Check standard read-only operations
            const typeReadOnlyOps = readOnlySubTypes[data.type];
            if (typeReadOnlyOps && typeReadOnlyOps[data.sub_type]) {
                shouldShowNotification = false;
            }
        }
        
        // Check BGP read-only operations (FRR type)
        if (data.type === 'FRR' && (data as any).command?.bgp?.operation) {
            const bgpOperation = (data as any).command.bgp.operation;
            if (readOnlyBGPOperations[bgpOperation]) {
                shouldShowNotification = false;
            }
        }
        
        // Check Envoy Version read-only operations (if ENVOY_VERSION exists in enum)
        if ((data as any).type === 'ENVOY_VERSION' && (data as any).command?.operation) {
            const envoyOperation = (data as any).command.operation;
            if (readOnlyEnvoyVersionOperations[envoyOperation]) {
                shouldShowNotification = false;
            }
        }
        
        // Check PROXY type with specific endpoints - should not show notifications
        // Both conditions must be met: type is PROXY AND path matches excluded endpoints
        if (data.type === 'PROXY' && (data as any).command?.path) {
            const excludedPaths = ['/logging', '/clusters', '/envoy'];
            if (excludedPaths.includes((data as any).command.path)) {
                shouldShowNotification = false;
            }
        }
        
        // Handle business logic errors (200 OK but with error field)
        const isSuccess = handleApiResponse(response.data, undefined, undefined, { 
            showAutoSuccess: shouldShowNotification 
        });
        
        if (!isSuccess) {
            throw new Error('Operation failed'); // This will be caught by component's try-catch
        }
        
        return response.data;
    };

    return useMutation({
        mutationFn,
    });
};

export const useMetricsApiMutation = () => {
    const { project } = useProjectVariable();

    const mutationFn = useCallback(async (options: MetricsApiMutationOptions) => {
        const { name, metric, start, end, metricConfig } = options;
        const sanitizedName = name.replace(/[.:\-\[\]/\\]/g, '_');
        const range = end - start;

        let windowSec = metricConfig?.windowSecs?.default || 15;
        if (metricConfig?.windowSecs?.ranges) {
            for (const { threshold, value } of metricConfig.windowSecs.ranges) {
                if (range > threshold) {
                    windowSec = value;
                    break;
                }
            }
        }

        const step = Math.floor(windowSec / 2);
        let query = metricConfig.queryTemplate
            .replace(/%{name}/g, sanitizedName)
            .replace(/%{project}/g, project)
            .replace(/%{metric}/g, metric)
            .replace(/%{window}/g, windowSec.toString())
            .replace(/\s+/g, ' ')
            .trim();

        const response = await api.get('/api/v1/query_range', {
            params: { query, start, end, step }
        });

        return {
            ...response.data,
            windowSec
        };
    }, [project]);

    return useMutation({
        mutationFn,
    });
};