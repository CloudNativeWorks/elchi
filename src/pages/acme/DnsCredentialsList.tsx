import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Typography, App as AntdApp } from 'antd';

const { Text } = Typography;
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { FaGoogle, FaAws, FaDigitalOcean, FaCloudflare } from 'react-icons/fa';
import { SiGodaddy } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useDnsCredentialMutations } from './hooks/useDnsCredentialMutations';
import type { DnsCredential } from './types';

const DnsCredentialsList: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useProjectVariable();
  const [searchTerm, setSearchTerm] = useState('');
  const { modal } = AntdApp.useApp();

  const { deleteMutation } = useDnsCredentialMutations();

  // Fetch DNS credentials
  const {
    data: credentials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['letsencrypt-dns-credentials', project],
    queryFn: () => letsencryptApi.getDnsCredentials(project),
    enabled: !!project,
  });

  // Filter credentials
  const filteredCredentials = React.useMemo(() => {
    if (!credentials) return [];
    return credentials.filter((cred) =>
      cred.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [credentials, searchTerm]);

  const handleDelete = (id: string, name: string) => {
    modal.confirm({
      title: 'Delete DNS Credential',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete DNS credential "${name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteMutation.mutate({ id, project }),
    });
  };

  const getProviderIcon = (provider: string) => {
    const iconStyle = { fontSize: 14 };
    switch (provider) {
      case 'google':
        return <FaGoogle style={iconStyle} />;
      case 'godaddy':
        return <SiGodaddy style={iconStyle} />;
      case 'cloudflare':
        return <FaCloudflare style={iconStyle} />;
      case 'digitalocean':
        return <FaDigitalOcean style={iconStyle} />;
      case 'route53':
      case 'lightsail':
        return <FaAws style={iconStyle} />;
      default:
        return <FaAws style={iconStyle} />;
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google Cloud DNS';
      case 'godaddy':
        return 'GoDaddy';
      case 'cloudflare':
        return 'Cloudflare';
      case 'digitalocean':
        return 'DigitalOcean';
      case 'route53':
        return 'AWS Route 53';
      case 'lightsail':
        return 'AWS Lightsail';
      default:
        return provider;
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      width: '20%',
      render: (provider: string) => (
        <Tag color="blue">
          <Space size={4}>
            {getProviderIcon(provider)}
            <span>{getProviderLabel(provider)}</span>
          </Space>
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '5%',
      render: (_: any, record: DnsCredential) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/acme/dns-credentials/${record._id}`)}
            style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
            title="View"
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id, record.name)}
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
        background: 'var(--card-bg)',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: 16
      }}
    >
      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>DNS Credentials</Text>
        <Space>
          <Input
            placeholder="Search credentials..."
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
            onClick={() => navigate('/acme/dns-credentials/create')}
          >
            Create DNS Credential
          </ElchiButton>
        </Space>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        <Table
          dataSource={filteredCredentials}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </div>
  );
};

export default DnsCredentialsList;
