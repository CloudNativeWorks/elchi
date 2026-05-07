import React, { useMemo, useState } from 'react';
import {
    Alert,
    Button,
    Empty,
    Modal,
    Space,
    Spin,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import {
    ClockCircleOutlined,
    EyeOutlined,
    HistoryOutlined,
    RollbackOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { wafApi } from '../../wafApi';
import { useWafMutations } from '../../hooks/useWafMutations';
import { WafConfig, WafConfigVersion } from '../../types';
import { normalizeFromApi } from '../../utils/wafAdapter';
import { serializeEditor } from '../../utils/confSerializer';
import { useWafEditor } from '../../state/wafEditorStore';
import VersionDiffModal from './VersionDiffModal';

const { Text, Title } = Typography;

interface HistoryPaneProps {
    configId: string;
    /**
     * Last server-known config. Used only as a fallback for the diff "current"
     * side when the editor state isn't usable yet. Day-to-day, the diff reads
     * from the in-memory editor state so users see their unsaved edits.
     */
    currentConfig?: WafConfig;
}

const formatTimestamp = (iso: string): string => {
    try {
        const d = new Date(iso);
        return d.toLocaleString();
    } catch {
        return iso;
    }
};

/**
 * Lists snapshot versions, allows preview/diff against the current state,
 * and offers a one-click restore that goes through the standard Update flow
 * (re-validates, propagates to WASM, records a fresh snapshot).
 */
const HistoryPane: React.FC<HistoryPaneProps> = ({ configId, currentConfig }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['waf-versions', configId],
        queryFn: () => wafApi.listWafVersions(configId, 50),
        enabled: !!configId,
    });

    const { restoreMutation } = useWafMutations(configId);
    const { state, dispatch } = useWafEditor();

    const [diffVersion, setDiffVersion] = useState<WafConfigVersion | null>(null);

    // Diff "current" side reads from the in-memory editor state so unsaved
    // edits are visible. Falls back to the last server-known config only if
    // the editor hasn't been hydrated yet.
    const currentConfText = useMemo(() => {
        if (state.editor.sets.length > 0 || state.editor.name) {
            return serializeEditor(state.editor);
        }
        if (currentConfig) {
            return serializeEditor(normalizeFromApi(currentConfig));
        }
        return '';
    }, [state.editor, currentConfig]);

    if (isLoading) {
        return (
            <div style={{ padding: 64, textAlign: 'center' }}>
                <Spin />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                type="error"
                showIcon
                style={{ margin: 16 }}
                message="Failed to load history"
                description={(error as Error).message}
            />
        );
    }

    const versions = data ?? [];

    if (versions.length === 0) {
        return (
            <Empty
                image={<HistoryOutlined style={{ fontSize: 48, color: 'var(--text-secondary)' }} />}
                imageStyle={{ height: 60 }}
                description="No snapshots yet. The next save will record the first one."
                style={{ padding: 64 }}
            />
        );
    }

    return (
        <div style={{ padding: 16, overflow: 'auto' }}>
            <Title level={5} style={{ marginTop: 0 }}>
                Version History
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Each save records a snapshot. Up to 50 most recent versions are kept.
            </Text>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {versions.map((v) => (
                    <div
                        key={v.version}
                        style={{
                            border: '1px solid var(--border-default)',
                            borderRadius: 8,
                            padding: 12,
                            background: 'var(--card-bg)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                        }}
                    >
                        <Tag color="blue" style={{ minWidth: 56, textAlign: 'center', margin: 0 }}>
                            v{v.version}
                        </Tag>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <Space size={8} wrap>
                                <Text strong>{v.name}</Text>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                    <ClockCircleOutlined /> {formatTimestamp(v.created_at)}
                                </span>
                                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                    <UserOutlined /> {v.author_name || v.author_id || 'unknown'}
                                </span>
                            </Space>
                            {v.message && (
                                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                    {v.message}
                                </div>
                            )}
                            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                                {v.data?.sets?.length ?? 0} set{(v.data?.sets?.length ?? 0) === 1 ? '' : 's'} ·{' '}
                                {v.data?.sets?.reduce((a, s) => a + (s.directives?.length ?? 0), 0) ?? 0} directives
                            </div>
                        </div>
                        <Space size={4}>
                            <Tooltip title="Compare with current">
                                <Button
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => setDiffVersion(v)}
                                />
                            </Tooltip>
                            <Tooltip title={`Restore version ${v.version}`}>
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<RollbackOutlined />}
                                    loading={restoreMutation.isPending}
                                    onClick={() => {
                                        const hasDirty = state.ui.dirty;
                                        Modal.confirm({
                                            title: `Restore version ${v.version}?`,
                                            content: hasDirty
                                                ? `You have unsaved changes that will be discarded. The restored state becomes a new snapshot; previous versions stay in history.`
                                                : `This creates a new snapshot from version ${v.version}. Previous versions stay in history.`,
                                            okText: hasDirty ? 'Discard & restore' : 'Restore',
                                            okType: hasDirty ? 'danger' : 'primary',
                                            onOk: () =>
                                                restoreMutation.mutate(v.version, {
                                                    // Force-update the editor state inline so the user
                                                    // sees the restored content immediately. Without
                                                    // this, the dirty-guard in WafDetail's hydrate
                                                    // useEffect could keep stale local edits on screen
                                                    // (the refetch then HYDRATE chain races our flag).
                                                    onSuccess: (restored) => {
                                                        dispatch({
                                                            type: 'HYDRATE',
                                                            state: normalizeFromApi(restored),
                                                        });
                                                        dispatch({ type: 'SET_ACTIVE_TAB', tab: 'editor' });
                                                    },
                                                }),
                                        });
                                    }}
                                >
                                    Restore
                                </Button>
                            </Tooltip>
                        </Space>
                    </div>
                ))}
            </div>

            <VersionDiffModal
                open={!!diffVersion}
                onClose={() => setDiffVersion(null)}
                version={diffVersion}
                currentText={currentConfText}
            />
        </div>
    );
};

export default HistoryPane;
