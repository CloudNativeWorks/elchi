import { DeleteOutlined, DeploymentUnitOutlined, ExclamationCircleFilled, InboxOutlined, CopyOutlined, ShareAltOutlined, ArrowUpOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { message, Dropdown, Table, Typography, Modal, Tag, Pagination, Select, Tooltip, App as AntdApp } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useCustomGetQuery, useDeleteMutation } from "../../../common/api";
import { DateTimeTool } from "../../../utils/date-time-tool";
import { useNavigate } from "react-router-dom";
import { ActionsSVG } from '@/assets/svg/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
// Dependency graph and route map are now separate pages, not modals
import VersionSelectionModal from "@/elchi/components/common/VersionSelectionModal";
import useDeleteResource from './DeleteResource';
import { getGTypeFields } from '@/hooks/useGtypes';
import { getFieldsByGType, GTypes } from '@/common/statics/gtypes';
import { getLastDotPart } from '@/utils/tools';
import { getVersionAntdColor } from '@/utils/versionColors';
import { useRouteMapOperations } from '@/hooks/useRouteMapOperations';


const { Text } = Typography;

interface DataType {
    id: string;
    name: string;
    version: string;
    gtype: string;
    category?: string;
    collection: string;
    type?: string;
    managed?: boolean;
    service?: {
        enabled?: boolean;
        name?: string;
    };
    metadata?: {
        acme_enabled?: boolean;
        acme_cert_id?: string;
    };
    created_at: string;
    updated_at: string;
    canonical_name: string;
}

interface CustomDataTableProps {
    path: string;
    filters?: Record<string, any>;
    isListener?: boolean;
    consolidateVersions?: boolean;
    selectedListeners?: string[];
    onSelectionChange?: (selectedNames: string[], version?: string) => void;
}

interface ConsolidatedDataType extends DataType {
    versions?: DataType[]; // Array of all versions for this resource name
    isConsolidated?: boolean;
}

const CustomDataTable: React.FC<CustomDataTableProps> = ({
    path,
    filters = {},
    isListener = false,
    consolidateVersions = false,
    selectedListeners = [],
    onSelectionChange
}) => {
    const deleteMutate = useDeleteMutation()
    const { modal } = AntdApp.useApp();
    const [messageApi, contextHolder] = message.useMessage();
    const { project } = useProjectVariable();
    const [updateData, setUpdateData] = useState(1);
    const [queryKey, setQueryKey] = useState(`listResources-${path}`);
    // Removed dependency and routemap modal states - now use navigation
    const deleteResource = useDeleteResource(deleteMutate);
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; record: DataType | null }>({ visible: false, record: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const navigate = useNavigate();
    const { isRouteMapSupported } = useRouteMapOperations();

    // Version selection modal state
    const [versionModal, setVersionModal] = useState<{
        visible: boolean;
        resourceName: string;
        versions: DataType[];
        action: 'open' | 'delete' | 'dependency' | 'routemap' | 'duplicate' | 'upgrade';
    }>({
        visible: false,
        resourceName: '',
        versions: [],
        action: 'open'
    });


    // Build query parameters for backend pagination
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.append('limit', pageSize.toString());
        params.append('offset', ((currentPage - 1) * pageSize).toString());

        // Add filters from parent component
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        if (sortBy) {
            params.append('sort_by', sortBy);
            params.append('sort_order', sortOrder);
        }

        return params.toString();
    };

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `${queryKey}_${project}_${currentPage}_${pageSize}_${sortBy}_${sortOrder}_${JSON.stringify(filters)}_${updateData}`,
        enabled: true,
        path: `${path}${path.includes('?') ? '&' : '?'}${buildQueryParams()}`,
    });

    const isBootstrapPath = path.startsWith('xds/bootstrap');

    // Compare semantic versions (e.g., "1.36.2" > "1.35.3")
    const compareVersions = (v1: string, v2: string): number => {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }

        return 0;
    };

    const getResourceActions = (record: DataType): MenuProps['items'] => {
        // Disable Upgrade and Duplicate if acme_enabled
        const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
        const isAcmeEnabled = record.metadata?.acme_enabled === true;
        const showUpgrade = !isListener && availableVersions.length > 1;

        return [
            { key: '1', label: 'Show Dependencies', icon: <DeploymentUnitOutlined /> },
            ...(isRouteMapSupported(record.gtype) ? [
                { key: '4', label: 'Show Route Map', icon: <ShareAltOutlined /> },
            ] : []),
            ...(isBootstrapPath ? [] : [
                { type: 'divider' as const },
                {
                    key: isListener ? '7' : '3',
                    label: 'Duplicate',
                    icon: <CopyOutlined />,
                    disabled: isAcmeEnabled
                },
                // Show Upgrade if AVAILABLE_VERSIONS > 1 and not listener
                ...(showUpgrade ? [
                    {
                        key: '5',
                        label: 'Upgrade',
                        icon: <ArrowUpOutlined />,
                        disabled: isAcmeEnabled
                    },
                ] : []),
                { type: 'divider' as const },
                { key: isListener ? '6' : '2', label: 'Delete', danger: true, icon: <DeleteOutlined /> },
            ]),
        ];
    };

    // hideModal functions removed - dependency and routemap now use navigation instead of modal

    const hideDeleteModal = () => {
        setDeleteModal({ visible: false, record: null });
    };

    const confirmDelete = () => {
        if (deleteModal.record) {
            const record = deleteModal.record;
            const gtype = getGTypeFields(record.gtype);
            if (GTypes.BootStrap !== gtype) {
                const GType = getFieldsByGType(gtype);
                deleteResource({
                    version: record.version,
                    path: GType.backendPath,
                    name: record.name,
                    project: project,
                    resource_id: record.id,
                    gtype: record.gtype,
                    redirectUri: GType.listPage,
                    updateData: updateData,
                    setUpdateData: setUpdateData,
                });
                hideDeleteModal();
            } else {
                messageApi.error("Bootstrap resources cannot be deleted!");
                hideDeleteModal();
            }
        }
    };

    // Handle version selection modal actions
    const handleVersionSelection = (version: string, resourceId: string) => {
        const consolidatedRecord = versionModal.versions.find(v => v.id === resourceId);
        if (!consolidatedRecord) return;

        setVersionModal({ visible: false, resourceName: '', versions: [], action: 'open' });

        switch (versionModal.action) {
            case 'open':
                navigate(`${consolidatedRecord.name}?resource_id=${resourceId}&version=${version}`);
                break;
            case 'delete':
                setDeleteModal({ visible: true, record: consolidatedRecord });
                break;
            case 'dependency':
                navigate(`/dependency/${encodeURIComponent(consolidatedRecord.name)}?collection=${consolidatedRecord.collection}&gtype=${consolidatedRecord.gtype}&version=${version}`);
                break;
            case 'routemap':
                navigate(`/routemap/${encodeURIComponent(consolidatedRecord.name)}?collection=${consolidatedRecord.collection}&gtype=${consolidatedRecord.gtype}&version=${version}`);
                break;
            case 'duplicate':
                const gtype = getGTypeFields(consolidatedRecord.gtype);
                const GType = getFieldsByGType(gtype);
                navigate(`${GType.createPath}?duplicate=true&resource_id=${resourceId}&resource_name=${encodeURIComponent(consolidatedRecord.name)}&version=${version}`);
                break;
        }
    };

    const onClick = (record: DataType, key: string) => {
        const consolidatedRecord = record as ConsolidatedDataType;
        const hasMultipleVersions = consolidatedRecord.isConsolidated && consolidatedRecord.versions && consolidatedRecord.versions.length > 1;

        if (key === "1") {
            if (hasMultipleVersions && consolidatedRecord.versions) {
                setVersionModal({
                    visible: true,
                    resourceName: record.name,
                    versions: consolidatedRecord.versions,
                    action: 'dependency'
                });
            } else {
                navigate(`/dependency/${encodeURIComponent(record?.name)}?collection=${record?.collection}&gtype=${record?.gtype}&version=${record?.version}`);
            }
        } else if (key === "4" && isRouteMapSupported(record.gtype)) {
            if (hasMultipleVersions && consolidatedRecord.versions) {
                setVersionModal({
                    visible: true,
                    resourceName: record.name,
                    versions: consolidatedRecord.versions,
                    action: 'routemap'
                });
            } else {
                navigate(`/routemap/${encodeURIComponent(record?.name)}?collection=${record?.collection}&gtype=${record?.gtype}&version=${record?.version}`);
            }
        } else if ((key === "2" || key === "6") && !isBootstrapPath) {
            if (hasMultipleVersions && consolidatedRecord.versions) {
                setVersionModal({
                    visible: true,
                    resourceName: record.name,
                    versions: consolidatedRecord.versions,
                    action: 'delete'
                });
            } else {
                setDeleteModal({ visible: true, record });
            }
        } else if ((key === "3" || key === "7") && !isBootstrapPath) {
            if (hasMultipleVersions && consolidatedRecord.versions) {
                setVersionModal({
                    visible: true,
                    resourceName: record.name,
                    versions: consolidatedRecord.versions,
                    action: 'duplicate'
                });
            } else {
                // Duplicate functionality - navigate to create page with resource data
                const gtype = getGTypeFields(record.gtype);
                const GType = getFieldsByGType(gtype);

                // Navigate to create page with duplicate data as query parameters
                navigate(`${GType.createPath}?duplicate=true&resource_id=${record.id}&resource_name=${encodeURIComponent(record.name)}&version=${record.version}`);
            }
        } else if (key === "5" && !isBootstrapPath) {
            // Upgrade: Show version selection modal and navigate directly
            const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
            const higherVersions = availableVersions.filter(v => compareVersions(v, record.version) > 0);

            if (higherVersions.length > 0) {
                let selectedVersion: string | undefined;

                modal.confirm({
                    title: `Upgrade ${getLastDotPart(record.gtype)}`,
                    icon: <ExclamationCircleFilled />,
                    width: 480,
                    content: (
                        <div>
                            <p style={{ marginBottom: 8, fontSize: 13 }}>
                                <strong>Resource:</strong> <Tag className='auto-width-tag' color="cyan" style={{ margin: '0 4px' }}>{record.name}</Tag>
                            </p>
                            <p style={{ marginBottom: 12, fontSize: 13 }}>
                                <strong>Current Version:</strong> <Tag className='auto-width-tag' color="blue" style={{ margin: '0 4px' }}>{record.version}</Tag>
                            </p>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 500 }}>Select Target Version:</div>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Select target version"
                                    onChange={(value) => { selectedVersion = value; }}
                                    options={higherVersions.map(v => ({
                                        value: v,
                                        label: `${v} ${v === higherVersions[higherVersions.length - 1] ? '(Latest)' : ''}`
                                    }))}
                                />
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>
                                This will duplicate the resource to the selected version. You can review and modify before creating.
                            </div>
                        </div>
                    ),
                    okText: 'Upgrade',
                    cancelText: 'Cancel',
                    onOk() {
                        if (!selectedVersion) {
                            messageApi.warning('Please select a target version');
                            return Promise.reject();
                        }

                        try {
                            const gtype = getGTypeFields(record.gtype);
                            if (!gtype) {
                                messageApi.error(`Invalid resource type: ${record.gtype}`);
                                return Promise.reject();
                            }

                            const GType = getFieldsByGType(gtype);
                            if (!GType) {
                                messageApi.error(`Resource configuration not found for: ${gtype}`);
                                return Promise.reject();
                            }

                            // Navigate to create page with upgrade params, source version, and target version
                            navigate(`${GType.createPath}?duplicate=true&upgrade=true&resource_id=${record.id}&resource_name=${encodeURIComponent(record.name)}&source_version=${record.version}&version=${selectedVersion}`);

                            return Promise.resolve();
                        } catch (error) {
                            console.error('Upgrade navigation error:', error);
                            messageApi.error('Failed to navigate to upgrade page');
                            return Promise.reject();
                        }
                    }
                });
            } else {
                messageApi.info('Current version is already the latest available version.');
            }
        }
    };

    useEffect(() => {
        setQueryKey(`listResources-${path}`);
    }, [path])

    const columns: ColumnsType<DataType> = [
        {
            key: 'operation',
            fixed: 'left',
            width: '3%',
            render: (record) => (
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1 }} onClick={e => e.stopPropagation()}>
                    <Dropdown trigger={['click']} menu={{ items: getResourceActions(record), onClick: (e) => onClick(record, e.key) }}>
                        <div
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                color: 'blue',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            aria-label="Actions"
                        >
                            <ActionsSVG />
                        </div>
                    </Dropdown>
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '37%',
            fixed: 'left',
            render: (_, record) => (
                <Dropdown menu={{ items: getResourceActions(record), onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{`${record.name}`}</Text>
                        {record.metadata?.acme_enabled && (
                            <Tooltip title="Managed by Acme">
                                <Tag
                                    icon={<SafetyCertificateOutlined />}
                                    color="cyan"
                                    style={{ margin: 0, fontSize: 11 }}
                                >
                                    Acme
                                </Tag>
                            </Tooltip>
                        )}
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Type',
            dataIndex: 'gtype',
            key: 'type',
            width: isListener ? '10%' : '15%',
            ellipsis: true,
            render: (_, record) => (
                <Dropdown menu={{ items: getResourceActions(record), onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Text>
                            <div
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={record.gtype.replace('envoy.', '')}
                            >
                                {getLastDotPart(record.gtype)}
                            </div>
                        </Text>
                    </div>
                </Dropdown>
            )
        },
        ...(isListener ? [{
            title: 'Managed',
            dataIndex: ['managed'],
            key: 'managed',
            width: '15%',
            render: (enabled: boolean, record: DataType) => (
                <Dropdown menu={{ items: getResourceActions(record) }} trigger={['contextMenu']}>
                    <div>
                        {enabled ? (
                            <span style={{
                                display: 'inline-block',
                                background: 'var(--color-success-light)',
                                color: 'var(--color-success)',
                                borderRadius: 4,
                                border: '1px solid var(--color-success)',
                                padding: '2px 12px',
                                fontWeight: 'bold',
                                fontSize: 10,
                                boxShadow: 'var(--color-success-shadow)'
                            }}>
                                Managed
                            </span>
                        ) : (
                            <span style={{
                                display: 'inline-block',
                                background: 'var(--bg-disabled)',
                                color: 'var(--text-tertiary)',
                                borderRadius: 4,
                                border: '1px solid var(--text-tertiary)',
                                padding: '2px 12px',
                                fontWeight: 'bold',
                                fontSize: 10,
                                boxShadow: '0 1px 4px rgba(140,140,140,0.08)'
                            }}>
                                Unmanaged
                            </span>
                        )}
                    </div>
                </Dropdown>
            )
        }] : []),
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: isListener ? '10%' : '15%',
            render: (_, record: ConsolidatedDataType) => {
                const consolidatedRecord = record as ConsolidatedDataType;

                if (consolidatedRecord.isConsolidated && consolidatedRecord.versions && consolidatedRecord.versions.length > 1) {
                    // Show all versions for consolidated resources
                    return (
                        <Dropdown menu={{ items: getResourceActions(record), onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {consolidatedRecord.versions.map((v, idx) => (
                                    <Tag
                                        key={`${v.version}-${idx}`}
                                        className='auto-width-tag'
                                        color={getVersionAntdColor(v.version)}
                                        style={{ fontSize: 11, marginBottom: 2 }}
                                    >
                                        {v.version}
                                    </Tag>
                                ))}
                            </div>
                        </Dropdown>
                    );
                }

                // Single version
                return (
                    <Dropdown menu={{ items: getResourceActions(record), onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                        <div>
                            <Tag className='auto-width-tag' color={getVersionAntdColor(record.version)}>{record.version}</Tag>
                        </div>
                    </Dropdown>
                );
            }
        },
        {
            title: 'Created AT',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '15%',
            sorter: (a, b) => a.created_at.length - b.created_at.length,
            sortDirections: ['descend', 'ascend'],
            render: (record) => (
                <Dropdown menu={{ items: getResourceActions(record) }} trigger={['contextMenu']}>
                    <div>
                        {DateTimeTool(record)}
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Updated AT',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: '15%',
            sorter: (a, b) => a.updated_at.length - b.updated_at.length,
            sortDirections: ['descend', 'ascend'],
            render: (record) => (
                <Dropdown menu={{ items: getResourceActions(record) }} trigger={['contextMenu']}>
                    <div>
                        {DateTimeTool(record)}
                    </div>
                </Dropdown>
            )
        },
    ];

    // Handle both paginated and non-paginated responses
    const { tableData: rawTableData, totalCount, totalPages, hasNext, hasPrev } = React.useMemo(() => {
        // Check if response has nested pagination metadata (data.data structure)
        if (dataResource && typeof dataResource === 'object' && 'data' in dataResource && typeof dataResource.data === 'object' && 'data' in dataResource.data) {
            // New nested paginated response format: response.data.data
            const paginationData = dataResource.data;
            return {
                tableData: Array.isArray(paginationData.data) ? paginationData.data : [],
                totalCount: paginationData.total_count || 0,
                totalPages: paginationData.total_pages || 0,
                hasNext: paginationData.has_next || false,
                hasPrev: paginationData.has_prev || false
            };
        } else if (dataResource && typeof dataResource === 'object' && 'data' in dataResource) {
            // Simple paginated response format: response.data
            return {
                tableData: Array.isArray(dataResource.data) ? dataResource.data : [],
                totalCount: dataResource.total_count || 0,
                totalPages: dataResource.total_pages || 0,
                hasNext: dataResource.has_next || false,
                hasPrev: dataResource.has_prev || false
            };
        } else {
            // Legacy direct array response (no pagination)
            const legacyData = Array.isArray(dataResource) ? dataResource : [];
            return {
                tableData: legacyData,
                totalCount: legacyData.length,
                totalPages: Math.ceil(legacyData.length / pageSize),
                hasNext: false,
                hasPrev: false
            };
        }
    }, [dataResource, pageSize]);

    // Consolidate resources by name if enabled
    const tableData = React.useMemo(() => {
        if (!consolidateVersions || !rawTableData || rawTableData.length === 0) {
            return rawTableData;
        }

        // Group resources by name
        const groupedByName = rawTableData.reduce((acc: Record<string, DataType[]>, resource: DataType) => {
            if (!acc[resource.name]) {
                acc[resource.name] = [];
            }
            acc[resource.name].push(resource);
            return acc;
        }, {});

        // Create consolidated entries
        const consolidated: ConsolidatedDataType[] = [];
        Object.entries(groupedByName).forEach(([_, versions]) => {
            const versionArray = versions as DataType[];
            if (versionArray.length === 1) {
                // Single version - keep as is
                consolidated.push(versionArray[0]);
            } else {
                // Multiple versions - create consolidated entry
                // Use the most recently updated as the main record
                const sortedVersions = [...versionArray].sort((a, b) =>
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                );
                const mainRecord = sortedVersions[0];

                consolidated.push({
                    ...mainRecord,
                    versions: sortedVersions,
                    isConsolidated: true
                });
            }
        });

        return consolidated;
    }, [rawTableData, consolidateVersions]);

    // Get latest version to disable from selection
    const latestVersion = React.useMemo(() => {
        const availableVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
        if (availableVersions.length === 0) return null;

        // Sort versions and get the highest
        const sorted = [...availableVersions].sort((a, b) => compareVersions(b, a));
        return sorted[0];
    }, []);

    return <>{contextHolder}
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
                loading={isLoadingResource}
                rowKey={(record) => record.name}
                size="small"
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowSelection={isListener && onSelectionChange ? {
                    selectedRowKeys: selectedListeners,
                    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
                        // Validate: all selected must have same version and not be latest
                        if (selectedRows.length === 0) {
                            onSelectionChange([], undefined);
                            return;
                        }

                        const firstVersion = selectedRows[0].version;
                        const allSameVersion = selectedRows.every(row => row.version === firstVersion);

                        if (!allSameVersion) {
                            messageApi.warning('You can only select listeners with the same version');
                            return;
                        }

                        onSelectionChange(selectedRowKeys as string[], firstVersion);
                    },
                    getCheckboxProps: (record: DataType) => ({
                        disabled: record.version === latestVersion || (
                            selectedListeners.length > 0 &&
                            tableData &&
                            tableData.length > 0 &&
                            tableData.find((r: DataType) => selectedListeners.includes(r.name))?.version !== record.version
                        ),
                    }),
                } : undefined}
                locale={{
                    emptyText: (
                        <div>
                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                            <div>{isListener ? 'No Listeners' : 'No Resources'}</div>
                        </div>
                    )
                }}
                onRow={(record: ConsolidatedDataType) => ({
                    onClick: (event) => {
                        // Don't navigate if clicking on checkbox
                        const target = event.target as HTMLElement;
                        if (target.closest('.ant-checkbox-wrapper') || target.closest('.ant-checkbox')) {
                            return;
                        }

                        const consolidatedRecord = record as ConsolidatedDataType;
                        const hasMultipleVersions = consolidatedRecord.isConsolidated && consolidatedRecord.versions && consolidatedRecord.versions.length > 1;

                        if (hasMultipleVersions && consolidatedRecord.versions) {
                            // Show version selection modal
                            setVersionModal({
                                visible: true,
                                resourceName: record.name,
                                versions: consolidatedRecord.versions,
                                action: 'open'
                            });
                        } else {
                            // Single version - navigate directly
                            navigate(`${record.name}?resource_id=${record.id}&version=${record.version}`);
                        }
                    },
                    style: { cursor: 'pointer' }
                })}
                onChange={(pagination, filters, sorter: any) => {
                    // Handle table sorting
                    if (sorter.field && sorter.order) {
                        setSortBy(sorter.field);
                        setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
                        setCurrentPage(1); // Reset to first page when sorting
                    } else if (!sorter.order) {
                        setSortBy('');
                        setSortOrder('asc');
                    }
                }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 12,
                    padding: '4px 0',
                    gap: 6
                }}>
                    Total: {totalCount} {totalCount !== tableData.length && `(Showing ${tableData.length})`}
                </div>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        if (size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    }}
                    showSizeChanger={true}
                    showQuickJumper={true}
                    pageSizeOptions={['20', '50', '100', '200']}
                    showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`
                    }
                />
            </div>
        </div>
        <VersionSelectionModal
            visible={versionModal.visible}
            onClose={() => setVersionModal({ visible: false, resourceName: '', versions: [], action: 'open' })}
            onSelect={handleVersionSelection}
            resourceName={versionModal.resourceName}
            versions={versionModal.versions.map(v => ({
                version: v.version,
                id: v.id,
                created_at: v.created_at,
                updated_at: v.updated_at
            }))}
            title={
                versionModal.action === 'delete' ? 'Select Version to Delete' :
                    versionModal.action === 'dependency' ? 'Select Version for Dependencies' :
                        versionModal.action === 'routemap' ? 'Select Version for Route Map' :
                            versionModal.action === 'duplicate' ? 'Select Version to Duplicate' :
                                versionModal.action === 'upgrade' ? 'Select Version to Upgrade' :
                                    'Select Version'
            }
            action={versionModal.action}
        />
        {/* DependenciesModal and RouteMapModal removed - now use separate pages via navigation */}
        <Modal
            title={
                <span>
                    <ExclamationCircleFilled style={{ color: 'var(--color-warning)', marginRight: '8px' }} />
                    Are you sure you want to delete this resource?
                </span>
            }
            open={deleteModal.visible}
            onOk={confirmDelete}
            onCancel={hideDeleteModal}
            okText="Yes"
            cancelText="Cancel"
        >
            <p><b>{deleteModal.record?.name}</b> resource will be deleted.</p>
        </Modal>
    </>;
};

export default CustomDataTable;

