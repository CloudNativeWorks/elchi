import { useCustomGetQuery } from '@/common/api';

interface ServiceError {
    name: string;
    status: 'Critical' | 'Error' | 'Warning';
    count: number;
}

interface ErrorSummaryResponse {
    total_error: number;
    services: ServiceError[];
}

interface UseErrorSummaryProps {
    project: string;
    enabled?: boolean;
}

export const useErrorSummary = ({ project, enabled = true }: UseErrorSummaryProps) => {
    return useCustomGetQuery<ErrorSummaryResponse>({
        queryKey: `error_summary_${project}`,
        enabled: enabled && !!project,
        path: `api/v3/custom/error_summary?project=${project}`,
        directApi: true,
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // 1 minute
    });
};