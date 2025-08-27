import { ExclamationCircleFilled, InboxOutlined, DeploymentUnitOutlined, DeleteOutlined, AliyunOutlined, PlaySquareOutlined, CopyOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { message, Dropdown, Table, Typography, Modal, Tag, Pagination } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCustomGetQuery, useDeleteMutation } from "../../../common/api";
import { DateTimeTool } from "../../../utils/date-time-tool"
import { useNavigate } from "react-router-dom";
import { ActionsSVG } from '@/assets/svg/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { dependenciesType } from './dataTable';
import { getFieldsByGType } from '@/common/statics/gtypes';
import { getGTypeFields } from '@/hooks/useGtypes';
import useDeleteResource from './DeleteResource';
import React, { useEffect, useState, useMemo } from 'react';
import DependenciesModal from "@/elchi/components/common/dependency";
import { getLastDotPart } from '@/utils/tools';
import { getVersionAntdColor } from '@/utils/versionColors';


const { Text } = Typography;

interface DataType {
    id: string;
    name: string;
    version: string;
    service: {
        enabled?: boolean;
        name?: string;
    }
    collection: string;
    type: string;
    gtype: string;
    canonical_name: string;
    created_at: string;
    updated_at: string;
}


interface CustomListenerDataTableProps {
    path: string;
    filters?: Record<string, any>;
}

const CustomListenerDataTable: React.FC<CustomListenerDataTableProps> = ({ path, filters = {} }) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const deleteMutate = useDeleteMutation()
    const { project } = useProjectVariable();
    const [updateData, setUpdateData] = useState(1);
    const [queryKey, setQueryKey] = useState(`listResources-${path}`);
    const [isModalVisible, setIsModalVisible] = useState<dependenciesType>({ name: '', collection: '', gtype: '', version: '', visible: false });
    const deleteResource = useDeleteResource(messageApi, deleteMutate);
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; record: DataType | null }>({ visible: false, record: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortBy, setSortBy] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

    const listenerActions: MenuProps['items'] = [
        { key: '1', label: 'Show Dependencies', icon: <DeploymentUnitOutlined /> },
        { key: '3', label: 'Bootstrap', icon: <PlaySquareOutlined /> },
        { key: '5', label: 'Snapshot Dump', icon: <AliyunOutlined /> },
        { key: '7', label: 'Duplicate', icon: <CopyOutlined /> },
        { type: 'divider' },
        { key: '6', label: 'Delete', danger: true, icon: <DeleteOutlined /> },
    ];

    const hideModal = () => {
        setIsModalVisible((prevState) => ({
            ...prevState,
            visible: false,
        }));
    };

    const hideDeleteModal = () => {
        setDeleteModal({ visible: false, record: null });
    };

    const confirmDelete = () => {
        if (deleteModal.record) {
            const record = deleteModal.record;
            const gtype = getGTypeFields(record.gtype);
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
        }
    };

    const onClick = (record: DataType, key: string) => {
        if (key === "1") {
            setIsModalVisible({
                name: record?.name,
                collection: record?.collection,
                gtype: record?.gtype,
                version: record?.version,
                visible: true,
            });
        }
        else if (key === "5") {
            navigate(`/snapshot_dump/${record.name}?version=${record.version}`);
        } else if (key === "6") {
            setDeleteModal({ visible: true, record });
        } else if (key === "7") {
            // Duplicate functionality - navigate to create page with resource data
            const gtype = getGTypeFields(record.gtype);
            const GType = getFieldsByGType(gtype);
            
            // Navigate to create page with duplicate data as query parameters
            navigate(`${GType.createPath}?duplicate=true&resource_id=${record.id}&resource_name=${encodeURIComponent(record.name)}&version=${record.version}`);
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
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1, height: 'auto' }} onClick={e => e.stopPropagation()}>
                    <Dropdown trigger={['click']} menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }}>
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
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Text strong>{record.name}</Text>
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Type',
            dataIndex: 'gtype',
            key: 'type',
            width: '10%',
            ellipsis: true,
            render: (_, record) => (
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
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
        {
            title: 'Managed',
            dataIndex: ['managed'],
            key: 'managed',
            width: '15%',
            render: (enabled: boolean) => (
                <Dropdown menu={{ items: listenerActions }} trigger={['contextMenu']}>
                    <div>
                        {enabled ? (
                            <span style={{
                                display: 'inline-block',
                                background: '#f6ffed',
                                color: '#52c41a',
                                borderRadius: 4,
                                border: '1px solid #52c41a',
                                padding: '2px 12px',
                                fontWeight: 'bold',
                                fontSize: 10,
                                boxShadow: '0 1px 4px rgba(82,196,26,0.08)'
                            }}>
                                Managed
                            </span>
                        ) : (
                            <span style={{
                                display: 'inline-block',
                                background: '#f5f5f5',
                                color: '#8c8c8c',
                                borderRadius: 4,
                                border: '1px solid #8c8c8c',
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
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: '10%',
            render: (_, record) => (
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Tag className='auto-width-tag' color={getVersionAntdColor(record.version)}>{record.version}</Tag>
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Created AT',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '15%',
            sorter: (a, b) => a.created_at.length - b.created_at.length,
            sortDirections: ['descend', 'ascend'],
            render: (record) => (
                <Dropdown menu={{ items: listenerActions }} trigger={['contextMenu']}>
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
                <Dropdown menu={{ items: listenerActions }} trigger={['contextMenu']}>
                    <div>
                        {DateTimeTool(record)}
                    </div>
                </Dropdown>
            )
        },
    ];

    // Handle both paginated and non-paginated responses
    const { tableData, totalCount, totalPages, hasNext, hasPrev } = useMemo(() => {
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

    return <>{contextHolder}
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
                loading={isLoadingResource}
                rowKey={(record) => record.name}
                size="small"
                columns={columns}
                dataSource={tableData as DataType[]}
                pagination={false}
                locale={{
                    emptyText: (
                        <div>
                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                            <div>No Listeners</div>
                        </div>
                    )
                }}
                onRow={(record) => ({
                    onClick: () => navigate(`${record.name}?resource_id=${record.id}&version=${record.version}`),
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
                    color: '#8c8c8c',
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
        <DependenciesModal
            visible={isModalVisible.visible}
            onClose={hideModal}
            name={isModalVisible.name}
            collection={isModalVisible.collection}
            gtype={isModalVisible.gtype}
            version={isModalVisible.version}
        />
        <Modal
            title={
                <span>
                    <ExclamationCircleFilled style={{ color: '#faad14', marginRight: '8px' }} />
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
    </>
};

export default CustomListenerDataTable;
