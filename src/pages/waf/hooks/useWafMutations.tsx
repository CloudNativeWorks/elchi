/**
 * WAF Mutations Hook
 * Handles Create, Update, Delete operations for WAF configs
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { wafApi } from '../wafApi';
import { CreateWafConfigRequest, UpdateWafConfigRequest } from '../types';

export const useWafMutations = (id?: string, project?: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const createMutation = useMutation({
        mutationFn: (data: CreateWafConfigRequest) => wafApi.createWafConfig(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['waf-configs'] });
            navigate(`/waf/${data.id}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateWafConfigRequest) => {
            if (!id || !project) {
                throw new Error('ID and project are required for update');
            }
            return wafApi.updateWafConfig(id, data, project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['waf-config', id] });
            queryClient.invalidateQueries({ queryKey: ['waf-configs'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!id || !project) {
                throw new Error('ID and project are required for delete');
            }
            return wafApi.deleteWafConfig(id, project);
        },
        onSuccess: () => {
            navigate('/waf');
        },
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
    };
};
