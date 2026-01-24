import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Space, Spin, Descriptions, Tag, Button, App as AntdApp } from 'antd';
import { SaveOutlined, DeleteOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { FaGoogle, FaAws, FaDigitalOcean, FaCloudflare, FaServer } from 'react-icons/fa';
import { SiGodaddy } from 'react-icons/si';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import DnsCredentialForm from './components/DnsCredentialForm';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useDnsCredentialMutations } from './hooks/useDnsCredentialMutations';
import { getDnsProviderLabel } from './constants/providers';
import type { CreateDnsCredentialRequest, GoogleCredentials, GodaddyCredentials, CloudflareCredentials, DigitalOceanCredentials, Route53Credentials, LightsailCredentials } from './types';

const DnsCredentialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project } = useProjectVariable();
  const { modal } = AntdApp.useApp();
  const isCreateMode = !id;
  const [form] = Form.useForm();

  const { createMutation, deleteMutation } = useDnsCredentialMutations();

  const getProviderIcon = (provider: string) => {
    const iconStyle = { fontSize: 16 };
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

  // Fetch credential details if viewing
  const { data: credential, isLoading } = useQuery({
    queryKey: ['letsencrypt-dns-credential', id, project],
    queryFn: () => letsencryptApi.getDnsCredential(id!, project),
    enabled: !!id && !!project,
  });

  const handleDelete = () => {
    if (!credential) return;

    modal.confirm({
      title: 'Delete DNS Credential',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete DNS credential "${credential.name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        deleteMutation.mutate({ id: credential._id, project }, {
          onSuccess: () => {
            navigate('/acme?tab=dns-credentials');
          },
        });
      },
    });
  };

  // Initialize form with default provider in create mode
  useEffect(() => {
    if (isCreateMode) {
      // Set default provider
      form.setFieldsValue({
        provider: 'google',
      });
    }
  }, [form, isCreateMode]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const credentials: GoogleCredentials | GodaddyCredentials | CloudflareCredentials | DigitalOceanCredentials | Route53Credentials | LightsailCredentials =
        values.provider === 'google'
          ? {
            project_id: values.project_id,
            service_account_json: values.service_account_json,
            ...(values.zone_id && { zone_id: values.zone_id }),
          }
          : values.provider === 'cloudflare' || values.provider === 'digitalocean'
          ? {
            api_token: values.api_token,
          }
          : values.provider === 'route53'
          ? {
            access_key_id: values.access_key_id,
            secret_access_key: values.secret_access_key,
            hosted_zone_id: values.hosted_zone_id,
          }
          : values.provider === 'lightsail'
          ? {
            access_key_id: values.access_key_id,
            secret_access_key: values.secret_access_key,
            dns_zone: values.dns_zone,
            region: values.region,
          }
          : {
            api_key: values.api_key,
            api_secret: values.api_secret,
          };

      const request: CreateDnsCredentialRequest = {
        name: values.name,
        description: values.description || '',
        provider: values.provider,
        credentials,
      };

      await createMutation.mutateAsync(request);
      // Navigation handled in mutation onSuccess
    } catch (error) {
      // Form validation failed
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space size="middle">
          {!isCreateMode && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/acme?tab=dns-credentials')}
              type="text"
            />
          )}
          <span style={{ fontSize: 24, color: '#056ccd' }}>
            {!isCreateMode && credential ? getProviderIcon(credential.provider) : <FaServer style={{ fontSize: 24 }} />}
          </span>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {isCreateMode ? 'Create DNS Credential' : credential?.name || 'DNS Credential Details'}
          </h2>
        </Space>

        {isCreateMode ? (
          <ElchiButton
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create DNS Credential'}
          </ElchiButton>
        ) : (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deleteMutation.isPending}
          >
            Delete
          </Button>
        )}
      </div>

      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: 12,
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
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
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {isCreateMode ? 'DNS Credential Configuration' : 'DNS Credential Information'}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px' }}>
          {isCreateMode ? (
            <Form form={form} layout="vertical">
              <DnsCredentialForm form={form} isCreateMode={isCreateMode} />
            </Form>
          ) : credential ? (
            <>
              <Form form={form} style={{ display: 'none' }} />
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Credential Name" span={2}>
                  <strong>{credential.name}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Description" span={2}>
                  {credential.description || '-'}
                </Descriptions.Item>

                <Descriptions.Item label="Provider">
                  <Tag color="blue">
                    <Space size={4} align="center">
                      {getProviderIcon(credential.provider)}
                      <span>{getDnsProviderLabel(credential.provider)}</span>
                    </Space>
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={credential.status === 'active' ? 'success' : 'default'}>
                    {credential.status === 'active' ? 'Active' : 'Inactive'}
                  </Tag>
                </Descriptions.Item>

                {credential.last_validated && (
                  <Descriptions.Item label="Last Validated" span={2}>
                    {new Date(credential.last_validated).toLocaleString()}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Created By" span={2}>
                  {credential.created_by}
                </Descriptions.Item>

                <Descriptions.Item label="Created At" span={2}>
                  {new Date(credential.created_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-surface)', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong>Security Note:</strong> Credentials are encrypted and cannot be viewed for security
                  reasons. To update credentials, please delete this credential and create a new one.
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DnsCredentialDetail;
