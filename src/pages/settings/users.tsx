import React, { useEffect, useState } from 'react';
import { Dropdown, Table, Typography, Modal, message, Tag, Pagination, Input, Card, Space, Divider, Switch, Alert, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Link, NavLink } from 'react-router-dom';
import { ActionsSVG } from '@/assets/svg/icons';
import { DateTimeTool } from '@/utils/date-time-tool';
import { useCustomGetQuery, useDeleteMutation } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { DeleteOutlined, ExclamationCircleFilled, InboxOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useOTPConfig, useOTPAdmin } from '@/hooks/useOTPAdmin';
import useAuth from '@/hooks/useUserDetails';

const { Text } = Typography;
interface DataType {
    username: string;
    email: string;
    groups: string[];
    user_id: string;
    role: string;
    auth_type: string;
    created_at: string;
    updated_at: string;
}

const listenerActions = [
    { key: '1', label: 'Delete', danger: true, icon: <DeleteOutlined /> },
];

const Users: React.FC = () => {
    const [tableData, setTableData] = useState([]);
    const { project } = useProjectVariable();
    const [messageApi, contextHolder] = message.useMessage();
    const deleteMutate = useDeleteMutation();
    const [deleteModal, setDeleteModal] = useState<{ visible: boolean; record: DataType | null }>({ visible: false, record: null });
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    // OTP Configuration
    const userDetail = useAuth();
    const isAdminOrOwner = ['owner', 'admin'].includes(userDetail?.role?.toLowerCase() || '');
    const { config: otpConfig, isLoading: otpConfigLoading, refetch: refetchOTPConfig } = useOTPConfig(project || '', isAdminOrOwner);
    const { updateOTPConfig, isLoading: otpUpdateLoading } = useOTPAdmin(project || '');
    const [otpEnforced, setOtpEnforced] = useState(false);

    React.useEffect(() => {
        if (otpConfig) {
            setOtpEnforced(otpConfig.otp_enforced);
        }
    }, [otpConfig]);

    const handleOTPEnforcementChange = async (checked: boolean) => {
        try {
            await updateOTPConfig(checked);
            setOtpEnforced(checked);
            refetchOTPConfig();
        } catch (error) {
            console.error('Failed to update OTP enforcement:', error);
        }
    };

    const hideDeleteModal = () => {
        setDeleteModal({ visible: false, record: null });
    };

    const confirmDelete = () => {
        if (deleteModal.record) {
            const record = deleteModal.record;
            deleteMutate.mutate({
                path: `setting/user/${record.user_id}?project=${project}`,
            }, {
                onSuccess: () => {
                    messageApi.success(`User ${record.username} has been deleted successfully.`);
                    const updatedData = tableData.filter(item => item.user_id !== record.user_id);
                    setTableData(updatedData);
                },
                onError: (error: AxiosError) => {
                    if (error.response?.data?.["message"]) {
                        messageApi.error(`Failed to delete user: ${error.response?.data?.["message"]}`);
                    } else {
                        messageApi.error(`Failed to delete user: ${error.message}`);
                    }
                }
            });
            hideDeleteModal();
        }
    };

    const onClick = (record: DataType, key: string) => {
        if (key === "1") {
            // Delete action
            setDeleteModal({ visible: true, record });
        }
    };

    const { isLoading: isLoadingResource, data: dataResource } = useCustomGetQuery({
        queryKey: `user_list${project}`,
        enabled: true,
        path: `api/v3/setting/user_list?project=${project}`,
        directApi: true
    });

    useEffect(() => {
        setTableData(dataResource || []);
    }, [dataResource]);

    const filteredTableData = React.useMemo(() => {
        if (!searchText) return tableData;
        const lower = searchText.toLowerCase();
        return tableData.filter((item: DataType) =>
            item.username?.toLowerCase().includes(lower) ||
            item.email?.toLowerCase().includes(lower) ||
            item.role?.toLowerCase().includes(lower) ||
            item.auth_type?.toLowerCase().includes(lower) ||
            (item.groups && item.groups.join(',').toLowerCase().includes(lower))
        );
    }, [searchText, tableData]);

    const paginatedData = React.useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTableData.slice(start, start + pageSize);
    }, [filteredTableData, currentPage]);

    const columns: ColumnsType<DataType> = [
        {
            key: 'operation',
            fixed: 'left',
            width: '3%',
            render: (record) => (
                <div style={{ display: 'flex', justifyContent: 'center', minWidth: 1, height: 'auto' }}>
                    <Dropdown trigger={['click']} menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }}>
                        <div
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textDecoration: 'underline',
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
            width: '30%',
            fixed: 'left',
            render: (_, record) => (
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Link to={`users/${record.username}?user_id=${record.user_id}`}>
                            <Text strong>{`${record.username}`}</Text>
                        </Link>
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: '15%',
            fixed: 'left',
            render: (_, record) => (
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Tag className='auto-width-tag' color={
                            record.role === 'owner' ? 'red' :
                                record.role === 'admin' ? 'purple' :
                                    record.role === 'editor' ? 'green' :
                                        record.role === 'viewer' ? 'blue' : 'default'
                        }>{record.role}</Tag>
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Auth Type',
            dataIndex: 'auth_type',
            key: 'auth_type',
            width: '15%',
            fixed: 'left',
            render: (_, record) => (
                <Dropdown menu={{ items: listenerActions, onClick: (e) => onClick(record, e.key) }} trigger={['contextMenu']}>
                    <div>
                        <Tag className='auto-width-tag' color={
                            record.auth_type === 'ldap' ? 'cyan' : 'geekblue'
                        }>{record.auth_type || 'local'}</Tag>
                    </div>
                </Dropdown>
            )
        },
        {
            title: 'Created AT',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '25%',
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
            width: '25%',
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

    return (
        <>
            {contextHolder}

            {/* OTP/2FA Security Configuration Card - Admin/Owner Only */}
            {isAdminOrOwner && (
                <Card
                    style={{
                        borderRadius: '12px',
                        border: '1px solid #e1e5e9',
                        marginBottom: 16,
                        margin: '4px 0 16px 0'
                    }}
                    styles={{ body: { padding: '20px' } }}
                >
                    <Spin spinning={otpConfigLoading}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Space>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #722ed1 0%, #1890ff 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <SafetyOutlined style={{ color: 'white', fontSize: '18px' }} />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1f2937' }}>
                                        Two-Factor Authentication (2FA)
                                    </Text>
                                    <br />
                                    <Text type="secondary" style={{ fontSize: '13px' }}>
                                        Project-wide security configuration
                                    </Text>
                                </div>
                            </Space>

                            <Divider style={{ margin: '8px 0' }} />

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 14px',
                                background: otpEnforced ? '#f6ffed' : '#fafafa',
                                borderRadius: '8px',
                                border: `1px solid ${otpEnforced ? '#b7eb8f' : '#d9d9d9'}`
                            }}>
                                <Space direction="vertical" size={2}>
                                    <Space size={6}>
                                        <LockOutlined style={{ color: otpEnforced ? '#52c41a' : '#8c8c8c', fontSize: 14 }} />
                                        <Text strong style={{ fontSize: '13px' }}>
                                            Enforce 2FA for all users
                                        </Text>
                                    </Space>
                                    <Text type="secondary" style={{ fontSize: '12px', marginLeft: 20 }}>
                                        {otpEnforced
                                            ? 'All users must setup 2FA before login'
                                            : '2FA is optional for users'}
                                    </Text>
                                </Space>
                                <Switch
                                    checked={otpEnforced}
                                    onChange={handleOTPEnforcementChange}
                                    loading={otpUpdateLoading}
                                    checkedChildren="Enforced"
                                    unCheckedChildren="Optional"
                                />
                            </div>

                            {otpEnforced && (
                                <Alert
                                    message="2FA Enforcement Active"
                                    description={
                                        <div style={{ fontSize: '12px' }}>
                                            <ul style={{ margin: '6px 0', paddingLeft: '18px' }}>
                                                <li>All users will be required to setup 2FA before they can login</li>
                                                <li>Users without 2FA will be prompted to configure it on their next login</li>
                                                <li>Both local and LDAP users can use 2FA for enhanced security</li>
                                                <li>Admins can reset a user's 2FA from user details if needed</li>
                                            </ul>
                                        </div>
                                    }
                                    type="info"
                                    showIcon
                                    style={{ marginTop: 2 }}
                                />
                            )}

                            {!otpEnforced && (
                                <Alert
                                    message="2FA is Optional"
                                    description="Users can choose to enable 2FA for their accounts from their profile page. Consider enforcing 2FA for enhanced security."
                                    type="warning"
                                    showIcon
                                    style={{ marginTop: 2, fontSize: '12px' }}
                                />
                            )}
                        </Space>
                    </Spin>
                </Card>
            )}

            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
                    <NavLink style={{ display: 'inline-block' }} to={"/settings/create/user"}>
                        <ElchiButton>Add New</ElchiButton>
                    </NavLink>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Input.Search
                            placeholder="Search Users..."
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 220 }}
                        />
                    </span>
                </div>
                <Table
                    loading={isLoadingResource}
                    rowKey={(record) => record?.username}
                    size='small'
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ y: 500 }}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Users</div>
                            </div>
                        )
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
                        Total: {filteredTableData?.length}
                    </div>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredTableData.length}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                    />
                </div>
                <Modal
                    title={
                        <span>
                            <ExclamationCircleFilled style={{ color: '#faad14', marginRight: '8px' }} />
                            Are you sure you want to delete this user?
                        </span>
                    }
                    open={deleteModal.visible}
                    onOk={confirmDelete}
                    onCancel={hideDeleteModal}
                    okText="Yes"
                    cancelText="Cancel"
                >
                    <p><b>{deleteModal.record?.username}</b> user will be deleted.</p>
                </Modal>
            </div>
        </>
    );
};

export default Users;
