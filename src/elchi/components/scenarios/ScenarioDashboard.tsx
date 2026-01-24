import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Input,
    Typography,
    Row,
    Col,
    Tag,
    Dropdown,
    Modal,
    Space,
    Spin,
    Empty,
    Upload,
    Select,
    Divider
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    MoreOutlined,
    PlayCircleOutlined,
    EditOutlined,
    CopyOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    ExportOutlined,
    ImportOutlined,
    FileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useScenarioAPI, Scenario } from './hooks/useScenarioAPI';
import { api } from '@/common/api';
import { useEnhancedErrorHandling } from './hooks/useEnhancedErrorHandling';
import { showErrorNotification, showSuccessNotification, showWarningNotification } from '@/common/notificationHandler';
import type { MenuProps } from 'antd';
import ElchiButton from '@/elchi/components/common/ElchiButton';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { confirm } = Modal;

const ScenarioDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'default' | 'custom'>('all');
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [loadingUsernames, setLoadingUsernames] = useState<Set<string>>(new Set());
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [conflictAction, setConflictAction] = useState<'skip' | 'overwrite' | 'rename'>('skip');

    const {
        useGetScenarios,
        useDeleteScenario,
        useCreateScenario,
        useExportScenarios,
        useImportScenarios
    } = useScenarioAPI();
    const { showScenarioError } = useEnhancedErrorHandling();
    const { data: scenariosData, isLoading, error } = useGetScenarios(false);
    const deleteScenarioMutation = useDeleteScenario();
    const createScenarioMutation = useCreateScenario();
    const exportScenariosMutation = useExportScenarios();
    const importScenariosMutation = useImportScenarios();

    // Filter scenarios based on search and type
    const filteredScenarios = React.useMemo(() => {
        if (!scenariosData?.scenarios) return [];

        return scenariosData.scenarios.filter(scenario => {
            const matchesSearch = searchText === '' ||
                scenario.name.toLowerCase().includes(searchText.toLowerCase()) ||
                scenario.description.toLowerCase().includes(searchText.toLowerCase()) ||
                scenario.scenario_id.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = filterType === 'all' ||
                (filterType === 'default' && scenario.is_default) ||
                (filterType === 'custom' && !scenario.is_default);

            return matchesSearch && matchesType;
        });
    }, [scenariosData?.scenarios, searchText, filterType]);

    // Fetch usernames for custom scenarios
    useEffect(() => {
        if (!scenariosData?.scenarios) return;

        const fetchUsernames = async () => {
            const customScenarios = scenariosData.scenarios.filter(s => !s.is_default);
            const uniqueUserIds = [...new Set(customScenarios.map(s => s.created_by))];

            for (const userId of uniqueUserIds) {
                // Skip if already fetched or currently fetching
                if (usernames[userId] || loadingUsernames.has(userId)) continue;

                setLoadingUsernames(prev => new Set([...prev, userId]));

                try {
                    const response = await api.get(`/api/v3/setting/users/${userId}`);
                    if (response.data?.data?.username) {
                        setUsernames(prev => ({
                            ...prev,
                            [userId]: response.data.data.username
                        }));
                    }
                } catch (error) {
                    console.error(`Failed to fetch username for ${userId}:`, error);
                    // Fallback to showing user ID if fetch fails
                    setUsernames(prev => ({
                        ...prev,
                        [userId]: userId
                    }));
                } finally {
                    setLoadingUsernames(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(userId);
                        return newSet;
                    });
                }
            }
        };

        fetchUsernames();
    }, [scenariosData?.scenarios, usernames, loadingUsernames]);

    const handleExecuteScenario = (scenario: Scenario) => {
        navigate(`/scenarios/${scenario.scenario_id}/execute`);
    };

    const handleEditScenario = (scenario: Scenario) => {
        if (scenario.is_default) {
            showWarningNotification('Default scenarios cannot be edited. You can duplicate them instead.');
            return;
        }
        navigate(`/scenarios/${scenario.scenario_id}/edit`);
    };

    const handleDuplicateScenario = async (scenario: Scenario) => {
        try {
            const newScenario = {
                name: `${scenario.name} (Copy)`,
                description: scenario.description,
                scenario_id: `${scenario.scenario_id}_copy_${Date.now()}`,
                components: scenario.components,
                project: project // Use current project for copy
            };

            await createScenarioMutation.mutateAsync(newScenario);
            showSuccessNotification('Scenario duplicated successfully');
        } catch (error: any) {
            showScenarioError(error, 'Failed to duplicate scenario');
        }
    };

    const handleDeleteScenario = (scenario: Scenario) => {
        if (scenario.is_default) {
            showErrorNotification('Default scenarios cannot be deleted');
            return;
        }

        confirm({
            title: 'Delete Scenario',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${scenario.name}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteScenarioMutation.mutateAsync(scenario.scenario_id);
                    showSuccessNotification('Scenario deleted successfully');
                } catch (error: any) {
                    showScenarioError(error, 'Failed to delete scenario');
                }
            },
        });
    };

    const handleExportScenario = async (scenario: Scenario) => {
        try {
            const result = await exportScenariosMutation.mutateAsync({
                scenario_ids: [scenario.id]
            });

            // Create and download JSON file
            const dataStr = JSON.stringify(result, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

            const exportFileDefaultName = `scenario-${scenario.name}-${new Date().toISOString().split('T')[0]}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();

            showSuccessNotification(`Scenario "${scenario.name}" exported successfully`);
        } catch (error: any) {
            showScenarioError(error, 'Failed to export scenario');
        }
    };

    const handleImportScenarios = async () => {
        if (!importFile || !project) {
            showErrorNotification('Please select a file and ensure project is selected');
            return;
        }

        try {
            const fileContent = await importFile.text();
            const importData = JSON.parse(fileContent);

            // Export format: { data: { scenarios: [...], exported_by, exported_at, version, count }, message }
            let scenarios;
            let version;

            if (importData.data && importData.data.scenarios && Array.isArray(importData.data.scenarios)) {
                scenarios = importData.data.scenarios;
                version = importData.data.version;
            } else if (importData.scenarios && Array.isArray(importData.scenarios)) {
                scenarios = importData.scenarios;
                version = importData.version;
            } else if (Array.isArray(importData)) {
                scenarios = importData;
                version = undefined;
            } else {
                showErrorNotification('Invalid import file format. Expected export data with scenarios.');
                return;
            }

            const result = await importScenariosMutation.mutateAsync({
                scenarios: scenarios,
                project: project, // Use current project  
                conflict_action: conflictAction,
                version: version // Use version from export data
            });

            if (result.success) {
                // Show detailed import results modal
                Modal.success({
                    title: '✅ Import Completed Successfully',
                    content: (
                        <div>
                            <div style={{
                                marginBottom: 20,
                                padding: '12px 16px',
                                background: 'var(--color-success-light)',
                                border: '1px solid var(--color-success-border)',
                                borderRadius: '6px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span><strong>📥 Imported:</strong></span>
                                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{result.imported}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span><strong>⏭️ Skipped:</strong></span>
                                    <span style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>{result.skipped}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span><strong>👤 Imported by:</strong></span>
                                    <span>{result.imported_by}</span>
                                </div>
                            </div>

                            {result.conflicts && result.conflicts.length > 0 && (
                                <div>
                                    <h4 style={{ marginBottom: 12, color: 'var(--color-primary)' }}>
                                        🔄 Conflict Resolutions ({result.conflicts.length})
                                    </h4>
                                    <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                        {result.conflicts.map((conflict, index) => (
                                            <div key={index} style={{
                                                marginBottom: 12,
                                                padding: '8px 12px',
                                                background: 'var(--bg-body)',
                                                border: '1px solid var(--border-default)',
                                                borderRadius: '4px',
                                                borderLeft: `4px solid ${conflict.action === 'skipped' ? 'var(--color-warning)' :
                                                        conflict.action === 'overwritten' ? 'var(--color-danger)' :
                                                            'var(--color-success)'
                                                    }`
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                                                    📄 {conflict.import_name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                    Scenario ID: {conflict.scenario_id}
                                                </div>
                                                <div style={{
                                                    marginTop: 4,
                                                    fontSize: '13px',
                                                    color: conflict.action === 'skipped' ? 'var(--color-warning)' :
                                                        conflict.action === 'overwritten' ? 'var(--color-danger)' :
                                                            'var(--color-success)',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {conflict.action === 'skipped' && '⏭️ SKIPPED - Existing scenario preserved'}
                                                    {conflict.action === 'overwritten' && '🔄 OVERWRITTEN - Replaced existing scenario'}
                                                    {conflict.action === 'renamed' && `✨ RENAMED - ${conflict.new_name}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ),
                    width: 650,
                    okText: 'Close'
                });

                // Also show brief success message
                showSuccessNotification(`Import completed: ${result.imported} imported, ${result.skipped} skipped`);
            } else {
                showErrorNotification(result.message || 'Import failed');
            }

            // Reset modal state
            setShowImportModal(false);
            setImportFile(null);
            setConflictAction('skip');
        } catch (error: any) {
            if (error.message?.includes('JSON')) {
                showErrorNotification('Invalid JSON file format');
            } else {
                showScenarioError(error, 'Failed to import scenarios');
            }
        }
    };

    const handleFileUpload = (file: File) => {
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            showErrorNotification('Please upload a JSON file');
            return false;
        }
        setImportFile(file);
        return false; // Prevent default upload
    };

    const getScenarioActions = (scenario: Scenario): MenuProps['items'] => [
        {
            key: 'execute',
            icon: <PlayCircleOutlined />,
            label: 'Execute',
            onClick: () => handleExecuteScenario(scenario)
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit',
            disabled: scenario.is_default,
            onClick: () => handleEditScenario(scenario)
        },
        {
            key: 'duplicate',
            icon: <CopyOutlined />,
            label: 'Duplicate',
            onClick: () => handleDuplicateScenario(scenario)
        },
        {
            type: 'divider'
        },
        {
            key: 'export',
            icon: <ExportOutlined />,
            label: 'Export',
            onClick: () => handleExportScenario(scenario)
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            danger: true,
            disabled: scenario.is_default,
            onClick: () => handleDeleteScenario(scenario)
        }
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading scenarios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="danger">Failed to load scenarios. Please try again.</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Scenarios
                    </Title>
                    <Space>
                        <ElchiButton
                            icon={<ImportOutlined />}
                            onClick={() => setShowImportModal(true)}
                        >
                            Import Scenarios
                        </ElchiButton>
                        <ElchiButton
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/scenarios/create')}
                        >
                            Create Scenario
                        </ElchiButton>
                    </Space>
                </div>

                <Text type="secondary">
                    Manage and execute proxy configuration scenarios. Create custom scenarios or use built-in templates.
                </Text>
            </div>

            {/* Filters and Search */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={8}>
                    <Search
                        placeholder="Search scenarios..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
                <Col xs={24} sm={12} md={16}>
                    <Space wrap>
                        <Button
                            type={filterType === 'all' ? 'primary' : 'default'}
                            onClick={() => setFilterType('all')}
                        >
                            All ({scenariosData?.scenarios?.length || 0})
                        </Button>
                        <Button
                            type={filterType === 'default' ? 'primary' : 'default'}
                            onClick={() => setFilterType('default')}
                        >
                            Default ({scenariosData?.scenarios?.filter(s => s.is_default)?.length || 0})
                        </Button>
                        <Button
                            type={filterType === 'custom' ? 'primary' : 'default'}
                            onClick={() => setFilterType('custom')}
                        >
                            Custom ({scenariosData?.scenarios?.filter(s => !s.is_default)?.length || 0})
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Scenarios Grid */}
            {filteredScenarios.length === 0 ? (
                <Empty
                    description="No scenarios found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    {filterType === 'custom' && (
                        <Button type="primary" onClick={() => navigate('/scenarios/create')}>
                            Create Your First Custom Scenario
                        </Button>
                    )}
                </Empty>
            ) : (
                <Row gutter={[24, 24]}>
                    {filteredScenarios.map((scenario) => (
                        <Col xs={24} sm={12} lg={8} key={scenario.id}>
                            <Card
                                hoverable
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                                styles={{
                                    body: {
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '16px',
                                        paddingBottom: '0'
                                    },
                                    actions: {
                                        padding: 0,
                                        background: 'transparent',
                                        borderTop: 'none'
                                    }
                                }}
                            >
                                <div style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    {/* Top Content - grows to fill space */}
                                    <div style={{ flex: 1 }}>
                                        {/* Header */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                <Title level={4} style={{ margin: 0, fontSize: '16px', lineHeight: '1.4', flex: 1 }}>
                                                    {scenario.name}
                                                </Title>
                                                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                    <Tag color={scenario.is_default ? 'blue' : 'green'} className="auto-width-tag">
                                                        {scenario.is_default ? 'Default' : 'Custom'}
                                                    </Tag>
                                                    {!scenario.project && (
                                                        <Tag color="gold" className="auto-width-tag">
                                                            Global
                                                        </Tag>
                                                    )}
                                                </div>
                                            </div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                                ID: {scenario.scenario_id}
                                            </Text>
                                        </div>

                                        {/* Description */}
                                        <Paragraph
                                            ellipsis={{ rows: 3, tooltip: scenario.description }}
                                            style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}
                                        >
                                            {scenario.description}
                                        </Paragraph>

                                        {/* Components */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <Text strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                                                Components ({scenario.components.length}):
                                            </Text>
                                            <div style={{ marginTop: '8px' }}>
                                                {scenario.components.slice(0, 4).map((component) => (
                                                    <Tag key={component.name} style={{ marginBottom: '4px' }} className="auto-width-tag">
                                                        {component.type}: {component.name}
                                                    </Tag>
                                                ))}
                                                {scenario.components.length > 4 && (
                                                    <Tag color="default" className="auto-width-tag">+{scenario.components.length - 4} more</Tag>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer - always at bottom */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderTop: '1px solid var(--border-light)',
                                        paddingTop: '12px',
                                        marginTop: '12px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <UserOutlined style={{ fontSize: '12px', color: 'var(--text-tertiary)' }} />
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {scenario.is_default ? 'System' : (usernames[scenario.created_by] || scenario.created_by)}
                                            </Text>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CalendarOutlined style={{ fontSize: '12px', color: 'var(--text-tertiary)' }} />
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {formatDate(scenario.created_at)}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        marginTop: '16px',
                                        padding: '12px 0',
                                        borderTop: '1px solid var(--border-light)'
                                    }}>
                                        <ElchiButton
                                            icon={<PlayCircleOutlined />}
                                            onClick={() => handleExecuteScenario(scenario)}
                                            style={{
                                                flex: 1,
                                                height: '36px'
                                            }}
                                        >
                                            Execute
                                        </ElchiButton>
                                        <Dropdown
                                            menu={{ items: getScenarioActions(scenario) }}
                                            trigger={['click']}
                                            placement="bottomRight"
                                        >
                                            <Button
                                                icon={<MoreOutlined />}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    padding: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        </Dropdown>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Import Modal */}
            <Modal
                title="Import Scenarios"
                open={showImportModal}
                onCancel={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                    setConflictAction('skip');
                }}
                onOk={handleImportScenarios}
                confirmLoading={importScenariosMutation.isPending}
                width={600}
                okText="Import Scenarios"
                cancelText="Cancel"
                okButtonProps={{ disabled: !importFile }}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text>
                        Import scenarios from a JSON export file. Scenarios will be imported to the current project: <strong>{project}</strong>
                    </Text>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                    <Text strong>1. Select Export File</Text>
                    <Upload.Dragger
                        accept=".json"
                        beforeUpload={handleFileUpload}
                        maxCount={1}
                        onRemove={() => setImportFile(null)}
                        style={{ marginTop: 8 }}
                    >
                        <p className="ant-upload-drag-icon">
                            <FileOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag JSON file here to upload
                        </p>
                        <p className="ant-upload-hint">
                            Select a scenario export file (.json)
                        </p>
                    </Upload.Dragger>
                    {importFile && (
                        <Text style={{ color: 'var(--color-success)', marginTop: 8, display: 'block' }}>
                            ✓ Selected: {importFile.name}
                        </Text>
                    )}
                </div>

                <div style={{ marginBottom: 16 }}>
                    <Text strong>2. Conflict Resolution</Text>
                    <div style={{ marginTop: 8 }}>
                        <Text type="secondary">What should happen if a scenario already exists?</Text>
                        <Select
                            value={conflictAction}
                            onChange={setConflictAction}
                            style={{ width: '100%', marginTop: 8 }}
                            options={[
                                {
                                    value: 'skip',
                                    label: 'Skip - Keep existing scenario, skip imported one'
                                },
                                {
                                    value: 'overwrite',
                                    label: 'Overwrite - Replace existing with imported scenario'
                                },
                                {
                                    value: 'rename',
                                    label: 'Rename - Import with new name (adds "(Imported)" suffix)'
                                }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ScenarioDashboard;