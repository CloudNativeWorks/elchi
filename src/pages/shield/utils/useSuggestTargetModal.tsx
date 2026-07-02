/**
 * useSuggestTargetModal — when the user asks for a policy suggestion from API
 * Discovery, let them choose the destination: a brand-new draft policy, or an
 * EXISTING policy in the project (the suggestion's routes are then merged into
 * it). Either way the result opens in the Builder for review — nothing is saved
 * automatically. Returns an imperative `openModal(ids)` plus the modal node to
 * render at the call site.
 */

import React, { useState } from 'react';
import { Modal, Radio, Select, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from '../shieldApi';
import { suggestPolicyFromEndpoints, stashDiscoveryDraft } from './suggestPolicy';

export function useSuggestTargetModal() {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const [ids, setIds] = useState<string[] | null>(null);
    const [mode, setMode] = useState<'new' | 'existing'>('new');
    const [policyId, setPolicyId] = useState<string>();
    const [busy, setBusy] = useState(false);

    const { data: policies, isLoading } = useQuery({
        queryKey: ['shield-policies', project],
        queryFn: () => shieldApi.listPolicies(project),
        enabled: !!project && ids != null,
    });

    const openModal = (endpointIds: string[]) => {
        if (!endpointIds.length) return;
        setIds(endpointIds);
        setMode('new');
        setPolicyId(undefined);
    };
    const close = () => {
        setIds(null);
        setBusy(false);
    };

    const confirm = async () => {
        if (!ids || !project) return;
        setBusy(true);
        try {
            const draft = await suggestPolicyFromEndpoints(ids, project);
            if (!draft?.yaml) {
                message.error('No suggestion was returned for the selected endpoints');
                setBusy(false);
                return;
            }
            // Carry the (potentially large) draft via sessionStorage, not router
            // state, to avoid the history.pushState size cap; pass only a small key.
            // If stashing fails (quota), fall back to the inline draft. ShieldDetail
            // REPLACES on create and MERGES on an existing policy.
            const key = stashDiscoveryDraft(draft);
            const state = key ? { discoveryDraftKey: key } : { discoveryDraft: draft };
            navigate(mode === 'new' ? '/shield/create' : `/shield/${policyId}`, { state });
            close();
        } catch (e: any) {
            message.error(e?.response?.data?.error || 'Failed to build a suggested policy');
            setBusy(false);
        }
    };

    const modal = (
        <Modal
            open={ids != null}
            title="Suggest Shield Policy"
            okText={mode === 'new' ? 'Create draft' : 'Add to policy'}
            confirmLoading={busy}
            onOk={confirm}
            onCancel={close}
            okButtonProps={{ disabled: mode === 'existing' && !policyId }}
            destroyOnClose
        >
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                Generate protections for {ids?.length ?? 0} endpoint(s). Open them as a new draft
                policy, or add them to a policy you already have — you'll review &amp; save either way.
            </Typography.Paragraph>
            <Radio.Group
                value={mode}
                onChange={e => setMode(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
                <Radio value="new">Create a new policy</Radio>
                <Radio value="existing">Add to an existing policy</Radio>
            </Radio.Group>
            {mode === 'existing' && (
                <Select
                    style={{ width: '100%', marginTop: 12 }}
                    loading={isLoading}
                    placeholder="Select a policy to extend"
                    value={policyId}
                    onChange={setPolicyId}
                    showSearch
                    optionFilterProp="label"
                    options={(policies ?? []).map(p => ({ label: p.name, value: p.id }))}
                    notFoundContent={isLoading ? 'Loading…' : 'No policies in this project yet'}
                />
            )}
        </Modal>
    );

    return { openModal, modal };
}
