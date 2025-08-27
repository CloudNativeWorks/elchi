import { useMutation } from "@tanstack/react-query";
import { MetricsApiMutationOptions, OperationsApiMutationOptions } from './types';
import { api } from "./api";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useCallback } from "react";

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