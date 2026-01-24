import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Tag, Space, Tabs, Typography, App as AntdApp } from 'antd';

const { Text } = Typography;
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import CertificateStatusBadge from './components/CertificateStatusBadge';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import DnsCredentialsList from './DnsCredentialsList';
import AcmeAccountsList from './AcmeAccountsList';
import { useCertificateMutations } from './hooks/useCertificateMutations';
import type { Certificate } from './types';

const { Title } = Typography;

const CertificateList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useProjectVariable();
  const [searchTerm, setSearchTerm] = useState('');
  const activeTab = searchParams.get('tab') || 'certificates';
  const { modal } = AntdApp.useApp();

  const { renewMutation } = useCertificateMutations();

  // Fetch certificates
  const {
    data: certificates,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['letsencrypt-certificates', project],
    queryFn: () => letsencryptApi.getCertificates(project),
    enabled: !!project && activeTab === 'certificates',
  });

  // Filter certificates
  const filteredCertificates = useMemo(() => {
    if (!certificates) return [];
    return certificates.filter(
      (cert) =>
        cert.secret_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.domains.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [certificates, searchTerm]);


  const handleRenew = (id: string, certificateName: string) => {
    modal.confirm({
      title: 'Renew Certificate',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to renew the certificate "${certificateName}"? This will initiate a new ACME verification job.`,
      okText: 'Renew',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk: () => renewMutation.mutate({ id, project }),
    });
  };

  const handleTabChange = (key: string) => {
    setSearchParams({ tab: key });
  };

  const columns = [
    {
      title: 'Certificate Name',
      dataIndex: 'secret_name',
      key: 'secret_name',
      width: '20%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Domains',
      key: 'domains',
      width: '25%',
      render: (_: any, record: Certificate) => (
        <Space size={[0, 4]} wrap>
          {record.domains.slice(0, 3).map((domain: string) => (
            <Tag key={domain}>{domain}</Tag>
          ))}
          {record.domains.length > 3 && <Tag>+{record.domains.length - 3} more</Tag>}
        </Space>
      ),
    },
    {
      title: 'Versions',
      key: 'versions',
      width: '20%',
      render: (_: any, record: Certificate) => (
        <Space size={[0, 4]} wrap>
          {record.secret_versions.map((version: string) => (
            <Tag key={version} color="blue" style={{ fontFamily: 'monospace' }}>
              {version}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: '15%',
      render: (_: any, record: Certificate) => <CertificateStatusBadge status={record.status} />,
    },
    {
      title: 'Expires',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: '15%',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '8%',
      render: (_: any, record: Certificate) => (
        <Space size={4}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/acme/${record._id}`)}
            style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
            title="View"
          />
          {record.status === 'active' && (
            <Button
              size="small"
              icon={<SyncOutlined />}
              onClick={() => handleRenew(record._id, record.secret_name)}
              loading={renewMutation.isPending}
              style={{ fontSize: 14, padding: '4px 8px', height: 28 }}
              title="Renew"
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{}}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <SafetyCertificateOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
            <Title level={4} style={{ margin: 0 }}>Certificates</Title>
          </Space>
        </div>

        <Text type="secondary">
          Manage ACME certificates
        </Text>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: 'certificates',
            label: 'Certificates',
            children: (
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
                  <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>SSL/TLS Certificates</Text>
                  <Space>
                    <Input
                      placeholder="Search certificates..."
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
                      onClick={() => navigate('/acme/create')}
                    >
                      Create Certificate
                    </ElchiButton>
                  </Space>
                </div>

                {/* Body */}
                <div style={{ padding: '16px 20px' }}>
                  <Table
                    dataSource={filteredCertificates}
                    columns={columns}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                  />
                </div>
              </div>
            ),
          },
          {
            key: 'acme-accounts',
            label: 'ACME Accounts',
            children: <AcmeAccountsList />,
          },
          {
            key: 'dns-credentials',
            label: 'DNS Credentials',
            children: <DnsCredentialsList />,
          },
        ]}
      />
    </div>
  );
};

export default CertificateList;
