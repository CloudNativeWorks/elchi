/**
 * Project-level Shield tools that reason across ALL policies (shield merges them
 * before resolving):
 *   • a host-conflict banner — the same host in two policies makes shield reject the
 *     whole config, so we surface it before a deploy blackholes the last-good config;
 *   • a "resolution tester" — type a request (host / method / path) and see exactly
 *     which policy → domain → route it hits and what protection applies.
 *
 * Both read every policy's full content (the list endpoint omits it), so this fetches
 * each policy once and memoizes the merged view.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Button, Divider, Drawer, Empty, Input, Select, Space, Typography } from 'antd';
import { AimOutlined, ThunderboltOutlined, WarningOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

import { shieldApi } from '../shieldApi';
import {
    PolicyEntry, ProjectResolveResult, findHostConflicts, mergeProject, parsePolicyForResolution, resolveProject,
} from '../utils/resolveProject';
import ResolutionResultView from './ResolutionResultView';

interface ProjectData { entries: PolicyEntry[]; warnings: string[] }

const { Text } = Typography;
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const ProjectResolutionTools: React.FC<{ project: string }> = ({ project }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['shield-policy-entries', project],
        enabled: !!project,
        // Fetches every policy's full content — keep it cached briefly so it doesn't
        // refire on every window focus / list remount.
        staleTime: 30_000,
        queryFn: async (): Promise<ProjectData> => {
            const list = await shieldApi.listPolicies(project);
            // allSettled: one unreadable policy must not blind the tools to the rest.
            const settled = await Promise.allSettled(list.map(p => shieldApi.getPolicy(p.id, project)));
            const entries: PolicyEntry[] = [];
            const warnings: string[] = [];
            settled.forEach((s, i) => {
                if (s.status === 'rejected') {
                    warnings.push(`${list[i]?.name ?? 'a policy'}: could not be loaded, excluded from analysis`);
                    return;
                }
                const { entry, error } = parsePolicyForResolution(s.value);
                if (error) warnings.push(error);
                if (entry) entries.push(entry);
            });
            return { entries, warnings };
        },
    });

    const entries = data?.entries;
    const warnings = data?.warnings ?? [];
    const conflicts = useMemo(() => (entries ? findHostConflicts(entries) : []), [entries]);
    const merged = useMemo(() => (entries ? mergeProject(entries) : undefined), [entries]);

    const [open, setOpen] = useState(false);
    const [host, setHost] = useState('');
    const [method, setMethod] = useState('GET');
    const [path, setPath] = useState('/');

    const result = useMemo<ProjectResolveResult | undefined>(
        () => (merged && host.trim() ? resolveProject(merged, { host, method, path }) : undefined),
        [merged, host, method, path],
    );

    return (
        <>
            {conflicts.length > 0 && (
                <Alert
                    type="error" showIcon icon={<WarningOutlined />} style={{ marginBottom: 12 }}
                    message={`${conflicts.length} host conflict${conflicts.length > 1 ? 's' : ''} — Shield rejects the whole config until fixed`}
                    description={
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {conflicts.map(c => {
                                const names = Array.from(new Set(c.where.map(w => w.policyName)));
                                return (
                                    <li key={c.host}>
                                        <code>{c.host}</code>{' '}
                                        {names.length > 1
                                            ? <>is defined in <Text strong>{names.join(', ')}</Text></>
                                            : <>is defined more than once in <Text strong>{names[0]}</Text></>}
                                        {' '}— each host (including <code>*</code>) may appear only once across all policies.
                                    </li>
                                );
                            })}
                        </ul>
                    }
                />
            )}

            {warnings.length > 0 && (
                <Alert
                    type="warning" showIcon style={{ marginBottom: 12 }}
                    message={`${warnings.length} policy${warnings.length > 1 ? ' files' : ' file'} could not be analyzed — excluded from conflict detection and the tester`}
                    description={<ul style={{ margin: 0, paddingLeft: 18 }}>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>}
                />
            )}

            <Button icon={<ThunderboltOutlined />} onClick={() => setOpen(true)} disabled={isLoading || !entries?.length}>
                Resolution tester
            </Button>

            <Drawer
                title={<Space><AimOutlined />Domain resolution tester</Space>}
                width={540} open={open} onClose={() => setOpen(false)} destroyOnClose
            >
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Enter a request and see which policy, domain and route it hits across all {entries?.length ?? 0} policies —
                        the most-specific host wins (exact ≫ <code>*.suffix</code> &gt; <code>*</code>), then the most-specific route.
                    </Text>
                    <Space.Compact style={{ width: '100%' }}>
                        <Select value={method} onChange={setMethod} style={{ width: 110 }} options={METHODS.map(m => ({ value: m }))} />
                        <Input placeholder="api.example.com" value={host} onChange={e => setHost(e.target.value)} allowClear />
                    </Space.Compact>
                    <Input addonBefore="path" placeholder="/v1/users" value={path} onChange={e => setPath(e.target.value)} />

                    <Divider style={{ margin: '4px 0' }} />

                    {!host.trim()
                        ? <Empty description="Type a host to test" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        : result
                            ? <>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Normalized: <code>{result.normalizedHost || '(empty)'}</code> <code>{result.normalizedPath}</code>
                                </Text>
                                <ResolutionResultView r={result} />
                              </>
                            : null}
                </Space>
            </Drawer>
        </>
    );
};

export default ProjectResolutionTools;
