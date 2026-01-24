import React, { useState, useMemo } from 'react';
import {
    Input,
    Select,
    Row,
    Col,
    Tag,
    Space,
    Button,
    Tooltip,
    Typography,
    Collapse,
    Badge,
    List
} from 'antd';
import {
    SearchOutlined,
    PlusOutlined,
    FilterOutlined,
    FileOutlined,
    DownOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { wafApi } from './wafApi';
import { CrsRule, CrsFilter } from './types';

const { Text } = Typography;

interface CrsRuleBrowserProps {
    onSelectRule: (_rule: CrsRule) => void;
    onSelectFile: (_filename: string) => void;
    selectedSetName?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
    'CRITICAL': 'red',
    'ERROR': 'orange',
    'WARNING': 'gold',
    'NOTICE': 'blue'
};

const PHASE_NAMES: Record<number, string> = {
    1: 'Request Headers',
    2: 'Request Body',
    3: 'Response Headers',
    4: 'Response Body',
    5: 'Logging'
};

const CrsRuleBrowser: React.FC<CrsRuleBrowserProps> = ({ onSelectRule, onSelectFile, selectedSetName }) => {
    const [filters, setFilters] = useState<CrsFilter>({
        crs_version: '4.14.0'
    });
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchId, setSearchId] = useState<string>('');
    const [searchDescription, setSearchDescription] = useState<string>('');

    // Fetch CRS versions
    const { data: versionsData } = useQuery({
        queryKey: ['crs-versions'],
        queryFn: () => wafApi.getCrsVersions()
    });

    // Update filter with default version when versions are loaded
    React.useEffect(() => {
        if (versionsData?.versions && versionsData.versions.length > 0 && filters.crs_version === '4.14.0') {
            setFilters(prev => ({
                ...prev,
                crs_version: versionsData.versions[0].crs_version
            }));
        }
    }, [versionsData, filters.crs_version]);

    // Fetch CRS rules
    const { data: rulesData, isLoading } = useQuery({
        queryKey: ['crs-rules', filters],
        queryFn: () => wafApi.getCrsRules(filters)
    });

    // Filter rules by search criteria (client-side)
    const filteredRules = useMemo(() => {
        if (!rulesData?.rules) return [];

        return rulesData.rules.filter(rule => {
            // Filter by ID
            if (searchId) {
                const ruleId = String(rule.characteristics.id).toLowerCase();
                if (!ruleId.includes(searchId.toLowerCase())) {
                    return false;
                }
            }

            // Filter by description
            if (searchDescription) {
                const searchLower = searchDescription.toLowerCase();
                const titleMatch = rule.title?.toLowerCase().includes(searchLower);
                const shortDescMatch = rule.description?.short?.toLowerCase().includes(searchLower);
                const extendedDescMatch = rule.description?.extended?.toLowerCase().includes(searchLower);

                if (!titleMatch && !shortDescMatch && !extendedDescMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [rulesData, searchId, searchDescription]);

    // Group rules by file
    const rulesByFile = useMemo(() => {
        if (!filteredRules.length) return {};

        const grouped: Record<string, CrsRule[]> = {};
        filteredRules.forEach(rule => {
            const file = rule.characteristics.file;
            if (!grouped[file]) {
                grouped[file] = [];
            }
            grouped[file].push(rule);
        });

        return grouped;
    }, [filteredRules]);

    // Extract unique tags from all rules
    const availableTags = useMemo(() => {
        if (!rulesData?.rules) return [];

        const tagsSet = new Set<string>();
        rulesData.rules.forEach(rule => {
            rule.characteristics.tags.forEach(tag => {
                tagsSet.add(tag);
            });
        });

        return Array.from(tagsSet).sort().map(tag => ({
            label: tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            value: tag
        }));
    }, [rulesData]);

    // Extract unique phases from all rules
    const availablePhases = useMemo(() => {
        if (!rulesData?.rules) return [];

        const phasesSet = new Set<number>();
        rulesData.rules.forEach(rule => {
            if (rule.characteristics.phase !== undefined && rule.characteristics.phase !== null) {
                phasesSet.add(rule.characteristics.phase);
            }
        });

        return Array.from(phasesSet).sort().map(phase => ({
            label: `${phase} - ${PHASE_NAMES[phase] || 'Unknown'}`,
            value: phase
        }));
    }, [rulesData]);

    // Extract unique severities from all rules
    const availableSeverities = useMemo(() => {
        if (!rulesData?.rules) return [];

        const severitiesSet = new Set<string>();
        rulesData.rules.forEach(rule => {
            if (rule.characteristics.severity) {
                severitiesSet.add(rule.characteristics.severity);
            }
        });

        return Array.from(severitiesSet).sort().map(severity => ({
            label: severity.charAt(0) + severity.slice(1).toLowerCase(),
            value: severity
        }));
    }, [rulesData]);

    // Extract unique paranoia levels from all rules
    const availableParanoiaLevels = useMemo(() => {
        if (!rulesData?.rules) return [];

        const levelsSet = new Set<number>();
        rulesData.rules.forEach(rule => {
            if (rule.characteristics.paranoia_level !== undefined && rule.characteristics.paranoia_level !== null) {
                levelsSet.add(rule.characteristics.paranoia_level);
            }
        });

        return Array.from(levelsSet).sort().map(level => ({
            label: `Level ${level}`,
            value: level
        }));
    }, [rulesData]);

    const handleFilterChange = (key: keyof CrsFilter, value: any) => {
        setFilters({
            ...filters,
            [key]: value
        });
    };

    const handleTagsChange = (tags: string[]) => {
        setSelectedTags(tags);
        setFilters({
            ...filters,
            tags: tags.length > 0 ? tags.join(',') : undefined
        });
    };

    return (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
            marginBottom: 24
        }}>
            {/* Header */}
            <div style={{
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-default)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FilterOutlined style={{ fontSize: 18, color: 'var(--text-secondary)' }} />
                    <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>CRS Rule Browser</Text>
                    {rulesData && typeof rulesData.total === 'number' && (
                        <Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            ({filteredRules.length} {filteredRules.length !== rulesData.total && `of ${rulesData.total}`} rules)
                        </Text>
                    )}
                </div>
                {rulesData && Object.keys(rulesByFile).length > 0 && (
                    <Badge count={Object.keys(rulesByFile).length} style={{ backgroundColor: 'var(--color-success)' }} showZero />
                )}
            </div>
            {/* Body */}
            <div style={{ padding: '16px 20px' }}>
            {/* Filters */}
            <Collapse
                defaultActiveKey={['filters']}
                style={{ marginBottom: 16 }}
                items={[
                    {
                        key: 'filters',
                        label: 'Filters',
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col span={6}>
                                    <Text strong>CRS Version:</Text>
                                    <Select
                                        value={filters.crs_version}
                                        onChange={(value) => handleFilterChange('crs_version', value)}
                                        style={{ width: '100%', marginTop: 4 }}
                                        options={Array.isArray(versionsData?.versions)
                                            ? versionsData.versions.map(v => ({
                                                label: v.crs_version,
                                                value: v.crs_version
                                            }))
                                            : []
                                        }
                                    />
                                </Col>
                                <Col span={6}>
                                    <Text strong>Severity:</Text>
                                    <Select
                                        value={filters.severity}
                                        onChange={(value) => handleFilterChange('severity', value)}
                                        placeholder="All"
                                        allowClear
                                        style={{ width: '100%', marginTop: 4 }}
                                        options={availableSeverities}
                                        loading={isLoading}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Text strong>Phase:</Text>
                                    <Select
                                        value={filters.phase}
                                        onChange={(value) => handleFilterChange('phase', value)}
                                        placeholder="All"
                                        allowClear
                                        style={{ width: '100%', marginTop: 4 }}
                                        options={availablePhases}
                                        loading={isLoading}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Text strong>Paranoia Level:</Text>
                                    <Select
                                        value={filters.paranoia_level}
                                        onChange={(value) => handleFilterChange('paranoia_level', value)}
                                        placeholder="All"
                                        allowClear
                                        style={{ width: '100%', marginTop: 4 }}
                                        options={availableParanoiaLevels}
                                        loading={isLoading}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Text strong>Tags (multi-select):</Text>
                                    <Select
                                        mode="multiple"
                                        value={selectedTags}
                                        onChange={handleTagsChange}
                                        placeholder="Select tags"
                                        allowClear
                                        style={{ width: '100%', marginTop: 4 }}
                                        options={availableTags}
                                        loading={isLoading}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        maxTagCount="responsive"
                                    />
                                </Col>
                                <Col span={6}>
                                    <Text strong>Rule ID:</Text>
                                    <Input
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        placeholder="Search by ID (e.g., 920100)"
                                        prefix={<SearchOutlined />}
                                        allowClear
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Text strong>Description:</Text>
                                    <Input
                                        value={searchDescription}
                                        onChange={(e) => setSearchDescription(e.target.value)}
                                        placeholder="Search in descriptions..."
                                        prefix={<SearchOutlined />}
                                        allowClear
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                            </Row>
                        )
                    }
                ]}
            />

            {!selectedSetName && (
                <div style={{ marginBottom: 16, padding: 12, background: 'var(--color-warning-light)', borderRadius: 8, border: '1px solid var(--color-warning-border)' }}>
                    <Text type="warning">Please create at least one directive set below to add CRS rules</Text>
                </div>
            )}

            {/* File-based Collapse */}
            <Collapse
                accordion
                expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
                items={Object.entries(rulesByFile).sort(([a], [b]) => a.localeCompare(b)).map(([filename, rules]) => ({
                    key: filename,
                    label: (
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space>
                                <FileOutlined />
                                <Text strong>{filename}</Text>
                                <Badge count={rules.length} style={{ backgroundColor: 'var(--color-primary)' }} />
                            </Space>
                        </Space>
                    ),
                    extra: (
                        <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectFile(filename);
                            }}
                            disabled={!selectedSetName}
                            style={{
                                backgroundColor: selectedSetName ? 'var(--color-primary)' : undefined,
                                borderColor: selectedSetName ? 'var(--color-primary)' : undefined,
                                color: selectedSetName ? 'var(--text-on-primary)' : undefined,
                                borderRadius: 6
                            }}
                        >
                            Include File
                        </Button>
                    ),
                    children: (
                        <List
                            dataSource={rules}
                            loading={isLoading}
                            renderItem={(rule) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                <Text code>{rule.characteristics.id}</Text>
                                                <Text strong>{rule.title}</Text>
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                                <Text>{rule.description.short}</Text>
                                                <Space wrap size="small">
                                                    {rule.rule_type && (
                                                        <Tag color="blue" style={{ margin: 0 }}>
                                                            <span style={{ opacity: 0.8 }}>Type:</span> {rule.rule_type}
                                                        </Tag>
                                                    )}
                                                    {rule.characteristics.severity && (
                                                        <Tag color={SEVERITY_COLORS[rule.characteristics.severity]} style={{ margin: 0 }}>
                                                            <span style={{ opacity: 0.8 }}>Severity:</span> {rule.characteristics.severity}
                                                        </Tag>
                                                    )}
                                                    {rule.characteristics.phase && (
                                                        <Tooltip title={PHASE_NAMES[rule.characteristics.phase]}>
                                                            <Tag style={{ margin: 0 }}>
                                                                <span style={{ opacity: 0.7 }}>Phase:</span> {rule.characteristics.phase}
                                                            </Tag>
                                                        </Tooltip>
                                                    )}
                                                    {rule.characteristics.paranoia_level !== undefined && rule.characteristics.paranoia_level !== null && (
                                                        <Tag color="purple" style={{ margin: 0 }}>
                                                            <span style={{ opacity: 0.8 }}>Paranoia:</span> Level {rule.characteristics.paranoia_level}
                                                        </Tag>
                                                    )}
                                                </Space>
                                                <Collapse
                                                    ghost
                                                    items={[
                                                        {
                                                            key: 'details',
                                                            label: 'Show Details',
                                                            children: (
                                                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                                                    {rule.description.extended && (
                                                                        <div>
                                                                            <Text strong>Extended Description:</Text>
                                                                            <div><Text style={{ whiteSpace: 'pre-wrap' }}>{rule.description.extended}</Text></div>
                                                                        </div>
                                                                    )}
                                                                    {rule.description.rule_logic && (
                                                                        <div>
                                                                            <Text strong>Rule Logic:</Text>
                                                                            <div><Text style={{ whiteSpace: 'pre-wrap' }}>{rule.description.rule_logic}</Text></div>
                                                                        </div>
                                                                    )}
                                                                    {rule.description.rule && (
                                                                        <div>
                                                                            <Text strong>Rule:</Text>
                                                                            <div style={{
                                                                                background: 'var(--code-bg)',
                                                                                padding: '8px',
                                                                                borderRadius: 4,
                                                                                overflow: 'auto',
                                                                                fontFamily: 'monospace',
                                                                                fontSize: 12,
                                                                                color: 'var(--code-text)'
                                                                            }}>
                                                                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'inherit' }}>
                                                                                    {rule.description.rule
                                                                                        .replace(/\\n/g, '\n')
                                                                                        .replace(/\\t/g, '\t')
                                                                                        .replace(/\\"/g, '"')
                                                                                        .replace(/\u0026/g, '&')}
                                                                                </pre>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {rule.characteristics.transformations.length > 0 && (
                                                                        <div>
                                                                            <Text strong>Transformations:</Text>
                                                                            <div>
                                                                                <Space wrap>
                                                                                    {rule.characteristics.transformations.map((t, idx) => (
                                                                                        <Tag key={idx} color="cyan">{t}</Tag>
                                                                                    ))}
                                                                                </Space>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {rule.references && rule.references.length > 0 && (
                                                                        <div>
                                                                            <Text strong>References:</Text>
                                                                            <div style={{ marginTop: 4 }}>
                                                                                <Space direction="vertical" size="small">
                                                                                    {rule.references.map((ref, idx) => (
                                                                                        <a key={idx} href={ref} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13 }}>
                                                                                            {ref}
                                                                                        </a>
                                                                                    ))}
                                                                                </Space>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {rule.description.rulelink && (
                                                                        <div>
                                                                            <Text strong>Source: </Text>
                                                                            <a href={rule.description.rulelink} target="_blank" rel="noopener noreferrer">
                                                                                View on GitHub
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </Space>
                                                            )
                                                        }
                                                    ]}
                                                />
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )
                }))}
            />
            </div>
        </div>
    );
};

export default CrsRuleBrowser;
