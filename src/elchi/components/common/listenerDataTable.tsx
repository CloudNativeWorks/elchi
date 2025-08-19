import { SearchOutlined, ExclamationCircleFilled, InboxOutlined, DeploymentUnitOutlined, DeleteOutlined, AliyunOutlined, PlaySquareOutlined, CopyOutlined } from '@ant-design/icons';
import type { InputRef, MenuProps } from 'antd';
import { message, Button, Dropdown, Input, Space, Table, Typography, Modal, Tag, Pagination } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { useCustomGetQuery, useDeleteMutation } from "../../../common/api";
import { DateTimeTool } from "../../../utils/date-time-tool"
import { useNavigate } from "react-router-dom";
import { get } from "lodash-es";
import { ActionsSVG } from '@/assets/svg/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { dependenciesType } from './dataTable';
import { getFieldsByGType } from '@/common/statics/gtypes';
import { getGTypeFields } from '@/hooks/useGtypes';
import useDeleteResource from './DeleteResource';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import DependenciesModal from "@/elchi/components/common/dependency";
import { getLastDotPart } from '@/utils/tools';
import { getVersionAntdColor } from '@/utils/versionColors';


const { Text } = Typography;
type DataIndex = keyof DataType;
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

const FilterIconComponent: React.FC<{ filtered: boolean }> = ({ filtered }) => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
);

const renderFilterIcon = (filtered: boolean) => <FilterIconComponent filtered={filtered} />;

interface CustomListenerDataTableProps {
    path: string;
    searchText: string;
}

const CustomListenerDataTable: React.FC<CustomListenerDataTableProps> = ({ path, searchText }) => {
    const navigate = useNavigate();
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const deleteMutate = useDeleteMutation()
    const { project } = useProjectVariable();
    const [updateData, setUpdateData] = useState(1);
    const [queryKey, setQueryKey] = useState(`listResources-${path}`);
    const [isModalVisible, setIsModalVisible] = useState<dependenciesType>({ name: '', collection: '', gtype: '', version: '', visible: false });
    const deleteResource = useDeleteResource(messageApi, deleteMutate);
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; record: DataType | null }>({ visible: false, record: null });
    // Removed local version colors - using global system now
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `${queryKey}_${project}_${updateData}`,
        enabled: true,
        path: `${path}`,
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

    // Removed manual version color mapping - now using global system

    const handleSearch = (
        selectedKeys: string[], //eslint-disable-next-line no-unused-vars
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    const renderFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close, dataIndex }) => {
        return (
            <button
                onClick={() => confirm()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                }}
                style={{
                    overflow: 'hidden',
                    background: 'none',
                    border: 'none',
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)' }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Clear
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </button>
        )
    };

    const getColumnSearchProps = (dataIndex: any): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => renderFilterDropdown({ setSelectedKeys, selectedKeys, confirm, clearFilters, close, dataIndex }),
        filterIcon: renderFilterIcon,
        onFilter: (value, record) =>
            (get(record, dataIndex).toString().toLowerCase() ?? "")
                .includes((value as string).toLowerCase()),
        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

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
            ...getColumnSearchProps('name'),
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
            ...getColumnSearchProps('gtype'),
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
            ...getColumnSearchProps('version'),
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
            ...getColumnSearchProps('created_at'),
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
            ...getColumnSearchProps('updated_at'),
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

    const filteredData = useMemo(() => {
        if (!searchText) return dataResource;
        const lower = searchText.toLowerCase();
        return (Array.isArray(dataResource) ? dataResource : []).filter((item: DataType) =>
            item.name?.toLowerCase().includes(lower) ||
            item.version?.toLowerCase().includes(lower)
        );
    }, [searchText, dataResource]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData?.slice(start, start + pageSize);
    }, [filteredData, currentPage]);

    return <>{contextHolder}
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <Table
                loading={isLoadingResource}
                rowKey={(record) => record.name}
                size="small"
                columns={columns}
                dataSource={paginatedData as DataType[]}
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
                    Total: {filteredData?.length}
                </div>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData?.length}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
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
