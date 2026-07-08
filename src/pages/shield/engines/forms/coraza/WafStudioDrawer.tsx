/**
 * WAF Studio — a full-screen, NetScaler-style rule builder for the Coraza WAF
 * engine. Opened from the Coraza card in the Shield policy builder, it lets a
 * user tune the OWASP CRS with explained controls, browse/copy CRS rules from
 * the shared library, and assemble custom SecLang rules as a sortable,
 * lint-checked, syntax-highlighted list — never hand-typing into a blob.
 *
 * It edits a working copy of the engine's `CorazaSpec` and commits on Apply.
 * Custom rules round-trip through `directivesCodec` to/from `spec.directives`.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Button, Drawer, Space, Tag, Typography } from 'antd';
import { CheckOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { shieldApi } from '../../../shieldApi';
import { CorazaSpec, DataFileModel } from '../../../state/model';
import { DataFilePathField } from '../../fields';
import {
    CrsLibraryPane,
    Directive,
    VisualRuleBuilder,
} from '@/components/waf-studio';
import CrsTuningSection from './CrsTuningSection';
import CustomRulesSection from './CustomRulesSection';
import GeneratedPreview from './GeneratedPreview';
import { joinDirectives, newRuleRow, parseDirectives, toggleExcludeId } from './directivesCodec';

const { Text, Title } = Typography;

/** Numeric rule id of a SecRule line, if any (`id:942100`, `id:'942100'`). */
const ruleIdOf = (text: string): number | null => {
    const m = text.match(/\bid\s*:\s*['"]?(\d+)/i);
    return m ? Number(m[1]) : null;
};

interface WafStudioDrawerProps {
    open: boolean;
    value: CorazaSpec;
    onApply: (next: CorazaSpec) => void;
    onClose: () => void;
    disabled?: boolean;
    /** The policy's data files, for the "rules from a file" picker. */
    dataFiles: DataFileModel[];
}

const Panel: React.FC<{ title: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({
    title,
    children,
    style,
}) => (
    <div
        style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-default)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            ...style,
        }}
    >
        <div style={{ marginBottom: 12 }}>{title}</div>
        {children}
    </div>
);

const WafStudioDrawer: React.FC<WafStudioDrawerProps> = ({ open, value, onApply, onClose, disabled, dataFiles }) => {
    const [draft, setDraft] = useState<CorazaSpec>(value);
    const [rules, setRules] = useState<Directive[]>([]);
    const [templateOpen, setTemplateOpen] = useState(false);
    const wasOpen = useRef(false);

    // Shield's CRS is embedded per binary, so the library must match the version the
    // project's edges actually run — not the WASM path's fixed 4.14.0. Fetch the fleet
    // to auto-pin the library to its primary version and warn when the fleet is mixed.
    const { project } = useProjectVariable();
    const { data: crsFleet } = useQuery({
        queryKey: ['shield-crs-fleet', project],
        queryFn: () => shieldApi.getShieldCrsFleet(project),
        enabled: open && !!project,
    });
    // Shares the CRS-library pane's query key so it's a single fetch. Used to detect the
    // case where the fleet runs a version the backend has no generated library for yet.
    const { data: crsVersions } = useQuery({
        queryKey: ['crs-versions', 'shield'],
        queryFn: () => shieldApi.getShieldCrsVersions(),
        enabled: open,
    });
    const primaryLibraryMissing = useMemo(() => {
        if (!crsFleet?.primary || !crsVersions?.versions) return false;
        return !crsVersions.versions.some((v) => v.crs_version === crsFleet.primary);
    }, [crsFleet, crsVersions]);

    // Re-seed the working copy on the open transition only — not on every parent
    // re-render (which would clobber in-progress edits).
    useEffect(() => {
        if (open && !wasOpen.current) {
            setDraft(value);
            setRules(parseDirectives(value.directives));
        }
        wasOpen.current = open;
    }, [open, value]);

    const patch = (p: Partial<CorazaSpec>) => setDraft((d) => ({ ...d, ...p }));

    // CRS exclude list ↔ the library's per-rule Disable toggle.
    const excludedIdSet = useMemo(
        () => new Set((draft.exclude_rule_ids ?? []).map(Number).filter((n) => Number.isFinite(n))),
        [draft.exclude_rule_ids],
    );
    const toggleExclude = (id: number) =>
        setDraft((d) => ({ ...d, exclude_rule_ids: toggleExcludeId(d.exclude_rule_ids, String(id)) }));

    // Flag excluded rule ids that don't exist in the CRS version the fleet runs — on
    // that edge the exclusion is a silent SecRuleRemoveById no-op, so the rule stays on.
    const { data: crsIds } = useQuery({
        queryKey: ['shield-crs-ids', crsFleet?.primary],
        queryFn: () => shieldApi.getShieldCrsRuleIds(crsFleet!.primary),
        enabled: open && draft.include_owasp && !!crsFleet?.primary && excludedIdSet.size > 0 && !primaryLibraryMissing,
    });
    const unknownExcludedIds = useMemo(() => {
        if (!crsIds?.ids) return [];
        const known = new Set(crsIds.ids);
        return [...excludedIdSet].filter((id) => !known.has(id));
    }, [crsIds, excludedIdSet]);

    const addRules = (texts: string[]) => {
        setRules((prev) => {
            const existingText = new Set(prev.map((r) => r.text));
            const existingIds = new Set(prev.map((r) => ruleIdOf(r.text)).filter((v): v is number => v !== null));
            const fresh = texts
                .filter((t) => {
                    if (!t.trim() || existingText.has(t)) return false;
                    const rid = ruleIdOf(t);
                    return rid === null || !existingIds.has(rid); // never add a duplicate rule id
                })
                .map(newRuleRow);
            return [...prev, ...fresh];
        });
    };

    const specForPreview: CorazaSpec = { ...draft, directives: joinDirectives(rules) };

    // Rule ids already in the custom list, so the visual builder suggests a free
    // one and warns on a clash. Memoized so the CRS pane's "already added" scan
    // (which keys off the target's existing texts) doesn't re-run every render.
    const existingIds = useMemo(
        () => rules.map((r) => ruleIdOf(r.text)).filter((v): v is number => v !== null),
        [rules],
    );

    const existingTexts = useMemo(() => rules.map((r) => r.text), [rules]);
    const crsTarget = useMemo(
        () => ({ id: 'custom', name: 'Custom Rules', existingTexts }),
        [existingTexts],
    );

    const apply = () => {
        onApply({ ...draft, directives: joinDirectives(rules) });
        onClose();
    };

    const ruleCount = rules.filter((r) => !r.text.trim().startsWith('#')).length;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width="100%"
            destroyOnHidden
            title={
                <Space size={10} align="center">
                    <SafetyCertificateOutlined style={{ color: 'var(--color-primary)', fontSize: 20 }} />
                    <Title level={5} style={{ margin: 0 }}>WAF Studio</Title>
                    <Tag color={draft.include_owasp ? 'green' : 'default'}>
                        {draft.include_owasp ? 'OWASP CRS on' : 'CRS off'}
                    </Tag>
                    <Tag>{ruleCount} custom rule{ruleCount === 1 ? '' : 's'}</Tag>
                </Space>
            }
            extra={
                <Space>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" icon={<CheckOutlined />} onClick={apply} disabled={disabled}>
                        Apply
                    </Button>
                </Space>
            }
            styles={{ body: { padding: 0, background: 'var(--bg-secondary, transparent)' } }}
        >
            <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
                {/* Left: tuning + custom rules + preview */}
                <div style={{ flex: '1 1 60%', minWidth: 0, overflow: 'auto', padding: 20 }}>
                    <Panel
                        title={
                            <Space>
                                <SafetyCertificateOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: 15 }}>Core Rule Set</Text>
                            </Space>
                        }
                    >
                        <CrsTuningSection value={draft} onChange={patch} disabled={disabled} />
                    </Panel>

                    <Panel
                        title={
                            <Space>
                                <ThunderboltOutlined style={{ color: 'var(--color-primary)' }} />
                                <Text strong style={{ fontSize: 15 }}>Custom Rules</Text>
                            </Space>
                        }
                    >
                        <CustomRulesSection
                            rules={rules}
                            onChange={setRules}
                            onOpenTemplate={() => setTemplateOpen(true)}
                            disabled={disabled}
                        />
                        <div style={{ marginTop: 12 }}>
                            <DataFilePathField
                                label="Or load rules from a file"
                                tooltip="A SecLang rules file on the edge (upload it in the Data Files tab). Its rules are APPENDED after the rules above."
                                disabled={disabled}
                                value={draft.directives_file}
                                onChange={(v) => patch({ directives_file: v })}
                                dataFiles={dataFiles}
                            />
                            {draft.directives_file && rules.length > 0 && (
                                <Alert
                                    type="warning"
                                    showIcon
                                    style={{ marginTop: 4, borderRadius: 8 }}
                                    message={<span style={{ fontSize: 12 }}>Both inline rules and a rules file are set — the file is appended after them. Make sure their rule ids don&apos;t collide, or the edge rejects the config.</span>}
                                />
                            )}
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <GeneratedPreview spec={specForPreview} />
                        </div>
                    </Panel>
                </div>

                {/* Right: CRS rule library (copy rules into the custom list) */}
                <div
                    style={{
                        flex: '1 1 40%',
                        minWidth: 360,
                        maxWidth: 560,
                        borderLeft: '1px solid var(--border-default)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        background: 'var(--card-bg)',
                    }}
                >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
                        <Space size={8} wrap>
                            <Text strong style={{ fontSize: 14 }}>CRS Rule Library</Text>
                            {crsFleet?.primary
                                ? <Tag color="blue" style={{ margin: 0 }}>CRS {crsFleet.primary} — what your edges run</Tag>
                                : <Tag style={{ margin: 0 }}>no deployed shield detected</Tag>}
                        </Space>
                        <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {draft.include_owasp
                                    ? 'CRS is on — Disable a noisy rule (adds it to the exclude list), or copy a rule into your custom rules.'
                                    : 'Browse the Core Rule Set and copy a rule into your custom rules as a starting point.'}
                            </Text>
                        </div>
                        {crsFleet?.mixed && (
                            <Alert
                                type="warning" showIcon style={{ marginTop: 8 }}
                                message="Your shield fleet runs multiple CRS versions"
                                description={
                                    <span style={{ fontSize: 12 }}>
                                        {crsFleet.versions.map(v => `${v.version} (${v.nodes} node${v.nodes === 1 ? '' : 's'})`).join(', ')}
                                        {' — tuning applies to every edge; the library below shows '}
                                        <b>{crsFleet.primary}</b>. Rule IDs are stable across versions, but new/removed rules differ per edge.
                                    </span>
                                }
                            />
                        )}
                        {!crsFleet?.primary && (
                            <Alert
                                type="info" showIcon style={{ marginTop: 8 }}
                                message="No deployed shield detected for this project"
                                description={<span style={{ fontSize: 12 }}>Showing the latest CRS library the backend has; it auto-pins to your fleet&apos;s version once an edge reports in.</span>}
                            />
                        )}
                        {primaryLibraryMissing && (
                            <Alert
                                type="warning" showIcon style={{ marginTop: 8 }}
                                message={`No CRS library for ${crsFleet?.primary} in this backend yet`}
                                description={
                                    <span style={{ fontSize: 12 }}>
                                        Your edges run <b>{crsFleet?.primary}</b>, but its rule library hasn&apos;t been generated here — the browser below shows the nearest available version <b>for reference only</b>. Regenerate it (CRS version runbook) so tuning matches enforcement.
                                    </span>
                                }
                            />
                        )}
                        {crsFleet?.primary && (crsFleet.unreported ?? 0) > 0 && (
                            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 6 }}>
                                {crsFleet.unreported} node(s) in this project don&apos;t report a CRS version (not running shield, or an older build).
                            </Text>
                        )}
                        {unknownExcludedIds.length > 0 && (
                            <Alert
                                type="warning" showIcon style={{ marginTop: 8 }}
                                message={`${unknownExcludedIds.length} excluded rule id(s) are not in CRS ${crsFleet?.primary}`}
                                description={
                                    <span style={{ fontSize: 12 }}>
                                        {unknownExcludedIds.join(', ')} — not present in this version, so the exclusion is a no-op on those edges. Remove them or verify the id.
                                    </span>
                                }
                            />
                        )}
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <CrsLibraryPane
                            activeTarget={crsTarget}
                            onAdd={(texts) => addRules(texts)}
                            disabled={disabled}
                            excludedIds={draft.include_owasp ? excludedIdSet : undefined}
                            onToggleExclude={draft.include_owasp ? toggleExclude : undefined}
                            libraryOptions={{ source: 'shield', pinnedVersion: crsFleet?.primary || undefined }}
                        />
                    </div>
                </div>
            </div>

            <VisualRuleBuilder
                open={templateOpen}
                existingIds={existingIds}
                crsActive={draft.include_owasp}
                onClose={() => setTemplateOpen(false)}
                onAdd={(directive) => {
                    addRules([directive]);
                    setTemplateOpen(false);
                }}
            />
        </Drawer>
    );
};

export default WafStudioDrawer;
