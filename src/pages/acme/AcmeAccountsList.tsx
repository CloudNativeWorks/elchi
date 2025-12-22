import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Typography, Select, App as AntdApp } from 'antd';

const { Text } = Typography;
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useAcmeAccountMutations } from './hooks/useAcmeAccountMutations';
import CAProviderBadge from './components/CAProviderBadge';
import type { AcmeAccount, CAProvider } from './types';

const AcmeAccountsList: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useProjectVariable();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCAProvider, setSelectedCAProvider] = useState<CAProvider | 'all'>('all');
  const { modal } = AntdApp.useApp();

  const { deleteMutation, validateMutation } = useAcmeAccountMutations();

  // Fetch CA providers
  const { data: caProviders } = useQuery({
    queryKey: ['ca-providers'],
    queryFn: () => letsencryptApi.getCAProviders(),
  });

  // Fetch ACME accounts
  const {
    data: acmeAccounts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['letsencrypt-acme-accounts', project],
    queryFn: () => letsencryptApi.getAcmeAccounts(project),
    enabled: !!project,
  });

  // Filter only supported CA providers
  const supportedProviders = caProviders?.filter((p) => p.supported) || [];

  // Filter accounts
  const filteredAccounts = React.useMemo(() => {
    if (!acmeAccounts) return [];
    return acmeAccounts.filter((acc) => {
      const matchesSearch =
        acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCA =
        selectedCAProvider === 'all' || acc.ca_provider === selectedCAProvider;
      return matchesSearch && matchesCA;
    });
  }, [acmeAccounts, searchTerm, selectedCAProvider]);

  const handleDelete = (id: string, name: string, certificateCount: number) => {
    if (certificateCount > 0) {
      modal.confirm({
        title: 'Delete ACME Account',
        icon: <ExclamationCircleOutlined />,
        content: `This account is used by ${certificateCount} certificate(s). Deleting it will prevent automatic renewal. Are you sure?`,
        okText: 'Force Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutate({ id, project, force: true }),
      });
    } else {
      modal.confirm({
        title: 'Delete ACME Account',
        icon: <ExclamationCircleOutlined />,
        content: `Are you sure you want to delete ACME account "${name}"?`,
        okText: 'Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => deleteMutation.mutate({ id, project, force: false }),
      });
    }
  };

  const handleValidate = (id: string) => {
    validateMutation.mutate({ id, project });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      render: (text: string) => <Text code style={{ fontFamily: 'monospace' }}>{text}</Text>,
    },
    {
      title: 'CA Provider',
      key: 'ca_provider',
      width: '15%',
      render: (_: any, record: AcmeAccount) => (
        <CAProviderBadge provider={record.ca_provider} showIcon={false} />
      ),
    },
    {
      title: 'Environment',
      dataIndex: 'environment',
      key: 'environment',
      width: '10%',
      render: (env: string) => (
        <Tag color={env === 'production' ? 'green' : 'blue'}>
          {env === 'production' ? 'Production' : 'Staging'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => {
        const colors = {
          registered: 'blue',
          active: 'green',
          deactivated: 'red',
          error: 'red',
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Certificates',
      dataIndex: 'certificate_count',
      key: 'certificate_count',
      width: '10%',
      render: (count: number) => <Tag>{count}</Tag>,
    },
    {
      title: 'Last Used',
      dataIndex: 'last_used',
      key: 'last_used',
      width: '15%',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_: any, record: AcmeAccount) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/acme/acme-accounts/${record._id}`)}
            style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
            title="View"
          />
          <Button
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleValidate(record._id)}
            loading={validateMutation.isPending}
            style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
            title="Validate"
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id, record.name, record.certificate_count)}
            loading={deleteMutation.isPending}
            style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: 16
      }}
    >
      {/* Header */}
      <div style={{
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong style={{ fontSize: 16, color: '#111827' }}>ACME Accounts</Text>
        <Space>
          <Select
            value={selectedCAProvider}
            onChange={setSelectedCAProvider}
            style={{ width: 200 }}
          >
            <Select.Option value="all">All Providers</Select.Option>
            {supportedProviders.map((provider) => (
              <Select.Option key={provider.provider} value={provider.provider}>
                {provider.name}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Search accounts..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
          <ElchiButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/acme/acme-accounts/create')}
          >
            Create ACME Account
          </ElchiButton>
        </Space>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        <Table
          dataSource={filteredAccounts}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </div>
  );
};

export default AcmeAccountsList;
