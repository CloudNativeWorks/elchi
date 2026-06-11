/**
 * Shield policy mutations (create/update/delete/sync) + the deploy toast.
 *
 * Every mutation response carries an async deploy outcome (`deploy`): the actual
 * push to the edges runs as a SHIELD_DEPLOY background job. The toast surfaces
 * the job id with a link to /jobs/<EC-id> where per-client results live
 * (applied version, reload confirmation, precise config errors).
 */

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp, Button } from 'antd';
import { shieldApi } from '../shieldApi';
import { ShieldPolicyRequest, DeployInfo } from '../types';

export const useShieldMutations = (id?: string, project?: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { notification } = AntdApp.useApp();

    const notifyDeploy = (deploy?: DeployInfo, action = 'saved') => {
        if (!deploy) {
            notification.success({ message: `Shield policy ${action}`, placement: 'topRight' });
            return;
        }
        if (deploy.deploy_job) {
            notification.success({
                message: `Shield policy ${action}`,
                description: (
                    <span>
                        Deploy queued as <b>{deploy.deploy_job}</b>.{' '}
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 0, height: 'auto' }}
                            onClick={() => navigate(`/jobs/${deploy.deploy_job}`)}
                        >
                            View per-client results
                        </Button>
                    </span>
                ),
                placement: 'topRight',
                duration: 8,
            });
            return;
        }
        if (deploy.deduped) {
            notification.info({
                message: `Shield policy ${action}`,
                description: deploy.message || 'A deploy for this project is already queued; it will carry this change too.',
                placement: 'topRight',
            });
            return;
        }
        notification.warning({
            message: `Shield policy ${action}, but the deploy could not be queued`,
            description: deploy.error || 'Check the controller logs and use Sync to retry.',
            placement: 'topRight',
        });
    };

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['shield-policies'] });
        if (id) queryClient.invalidateQueries({ queryKey: ['shield-policy', id] });
    };

    const createMutation = useMutation({
        mutationFn: (data: ShieldPolicyRequest) => shieldApi.createPolicy(data),
        onSuccess: (res) => {
            invalidate();
            notifyDeploy(res.deploy, 'created');
            if (res.data?.id) navigate(`/shield/${res.data.id}`);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: ShieldPolicyRequest) => {
            if (!id) throw new Error('ID is required for update');
            return shieldApi.updatePolicy(id, data);
        },
        onSuccess: (res) => {
            invalidate();
            notifyDeploy(res.deploy, 'updated');
        },
    });

    // create/update errors surface as the detail page's inline Alert (handleSave
    // catches them); delete/sync have no inline surface, and the global error
    // toast is suppressed for shield mutations — so they MUST notify here or a
    // failure would be silent.
    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!id || !project) throw new Error('ID and project are required for delete');
            return shieldApi.deletePolicy(id, project);
        },
        onSuccess: (res) => {
            invalidate();
            notifyDeploy(res.deploy, 'deleted');
            navigate('/shield');
        },
        onError: (err: Error) => {
            notification.error({ message: 'Delete failed', description: err.message, placement: 'topRight' });
        },
    });

    const syncMutation = useMutation({
        mutationFn: () => {
            if (!project) throw new Error('Project is required for sync');
            return shieldApi.syncProject(project);
        },
        onSuccess: (deploy) => {
            notifyDeploy(deploy, 'sync requested');
        },
        onError: (err: Error) => {
            notification.error({ message: 'Sync failed', description: err.message, placement: 'topRight' });
        },
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        syncMutation,
        notifyDeploy,
        isLoading:
            createMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending ||
            syncMutation.isPending,
    };
};
