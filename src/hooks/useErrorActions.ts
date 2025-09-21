import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { api } from '@/common/api';
import { handleApiResponse, showErrorNotification, showSuccessNotification, showWarningNotification } from '@/common/notificationHandler';

export interface ErrorActionRequest {
    error_ids: string[];
    mode: 'clear' | 'resolve';
    project: string;
}

export const useErrorActionsMutation = () => {
    const mutationFn = async (options: ErrorActionRequest) => {
        const { error_ids, mode, project } = options;
        const params = new URLSearchParams({
            metadata_error_ids: error_ids.join(','),
            metadata_mode: mode,
            project: project
        });

        const response = await api.get(`api/v3/custom/clear_errors?${params.toString()}`);
        
        // Handle business logic errors (200 OK but with error field)
        const isSuccess = handleApiResponse(response.data, undefined, undefined, { showAutoSuccess: false });
        
        if (!isSuccess) {
            throw new Error('Operation failed');
        }
        
        return response.data;
    };

    return useMutation({
        mutationFn,
    });
};

export const useErrorActions = (project: string) => {
    const [loading, setLoading] = useState(false);
    const mutation = useErrorActionsMutation();

    const processErrors = async (errorIds: string[], mode: 'clear' | 'resolve') => {
        if (!errorIds || errorIds.length === 0) {
            showWarningNotification('Please select errors to process');
            return false;
        }

        setLoading(true);
        try {
            await mutation.mutateAsync({
                error_ids: errorIds,
                mode,
                project
            });

            const actionText = mode === 'clear' ? 'cleared' : 'resolved';
            showSuccessNotification(`${errorIds.length} error(s) ${actionText} successfully`);
            return true;
        } catch (error: any) {
            const actionText = mode === 'clear' ? 'clear' : 'resolve';
            showErrorNotification(error, `Failed to ${actionText} errors`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearErrors = (errorIds: string[]) => processErrors(errorIds, 'clear');
    const resolveErrors = (errorIds: string[]) => processErrors(errorIds, 'resolve');

    return {
        clearErrors,
        resolveErrors,
        loading
    };
};