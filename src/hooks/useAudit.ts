import { useCustomGetQuery } from '@/common/api';

export interface AuditLog {
    id: string;
    timestamp: string;
    user_id: string;
    username: string;
    user_role: string;
    groups: string[];
    client_ip: string;
    user_agent: string;
    request_id: string;
    api_type: string;
    method: string;
    path: string;
    action: string;
    resource_type: string;
    resource_id: string;
    resource_name: string;
    project: string;
    response_status: number;
    duration_ms: number;
    success: boolean;
    error_message?: string;
    changes?: Record<string, any>;
    command?: {
        command: {
            name: string;
            project: string;
        };
        sub_type: string;
        type: string;
    };
}

export interface AuditResponse {
    message: string;
    data: AuditLog[];
    pagination: {
        total: number;
        limit: number;
        skip: number;
        count: number;
        has_more: boolean;
    };
}

export interface AuditStats {
    total_entries: number;
    success_rate: number;
    error_rate: number;
    average_response_ms: number;
    top_actions: Record<string, number>;
    top_users: Record<string, number>;
    top_resources: Record<string, number>;
}

export interface AuditStatsResponse {
    message: string;
    data: AuditStats;
    filters: {
        start_time: string;
        end_time: string;
        project: string;
        resource_type: string;
    };
}

export interface UseAuditLogsProps {
    filters?: {
        user_id?: string;
        username?: string;
        action?: string;
        resource_type?: string;
        project?: string;
        success?: boolean;
        start_time?: string;
        end_time?: string;
    };
    pagination?: {
        limit?: number;
        skip?: number;
    };
    enabled?: boolean;
}

export const useAuditLogs = ({ filters = {}, pagination = {}, enabled = true }: UseAuditLogsProps) => {
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        
        // Always add project if provided in filters
        if (filters.project) params.set('project', filters.project);
        if (filters.user_id) params.set('user_id', filters.user_id);
        if (filters.username) params.set('username', filters.username);
        if (filters.action) params.set('action', filters.action);
        if (filters.resource_type) params.set('resource_type', filters.resource_type);
        if (filters.success !== undefined) params.set('success', filters.success.toString());
        if (filters.start_time) params.set('start_time', filters.start_time);
        if (filters.end_time) params.set('end_time', filters.end_time);
        if (pagination.limit) params.set('limit', pagination.limit.toString());
        if (pagination.skip) params.set('skip', pagination.skip.toString());
        
        return params.toString();
    };

    return useCustomGetQuery({
        queryKey: `audit_logs_${JSON.stringify(filters)}_${JSON.stringify(pagination)}`,
        enabled,
        path: `api/v3/audit/logs?${buildQueryParams()}`,
        directApi: true,
    });
};

export const useAuditStats = ({ filters = {}, enabled = true }: { filters?: any; enabled?: boolean }) => {
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        
        if (filters.start_time) params.set('start_time', filters.start_time);
        if (filters.end_time) params.set('end_time', filters.end_time);
        if (filters.project) params.set('project', filters.project);
        if (filters.resource_type) params.set('resource_type', filters.resource_type);
        if (filters.username) params.set('username', filters.username);
        if (filters.action) params.set('action', filters.action);
        if (filters.success !== undefined) params.set('success', filters.success.toString());
        if (filters.user_id) params.set('user_id', filters.user_id);
        
        return params.toString();
    };

    return useCustomGetQuery({
        queryKey: `audit_stats_${JSON.stringify(filters)}`,
        enabled,
        path: `api/v3/audit/stats?${buildQueryParams()}`,
        directApi: true,
    });
};