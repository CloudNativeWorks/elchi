import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Descriptions, Tag, Spin, Input, Select, Button } from 'antd';
import { SafetyCertificateOutlined, SaveOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import ElchiButton from '@/elchi/components/common/ElchiButton';
import { useAcmeAccountMutations } from './hooks/useAcmeAccountMutations';
import { ACME_ENVIRONMENTS } from './constants/providers';
import CAProviderSelector from './components/CAProviderSelector';
import EABCredentialsForm from './components/EABCredentialsForm';
import CAProviderBadge from './components/CAProviderBadge';
import type { CreateAcmeAccountRequest, CAProvider, EABCredentials } from './types';

const AcmeAccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project } = useProjectVariable();
  const [form] = Form.useForm();
  const isCreateMode = !id;

  // State for CA provider and EAB
  const [caProvider, setCAProvider] = useState<CAProvider>('letsencrypt');
  const [eabCredentials, setEABCredentials] = useState<EABCredentials | undefined>();
  const [requiresEAB, setRequiresEAB] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  const { createMutation } = useAcmeAccountMutations();

  // Fetch CA providers to determine EAB requirement
  const { data: caProviders } = useQuery({
    queryKey: ['ca-providers'],
    queryFn: () => letsencryptApi.getCAProviders(),
  });

  useEffect(() => {
    if (caProviders && caProvider) {
      const provider = caProviders.find((p) => p.provider === caProvider);
      setRequiresEAB(provider?.requires_eab || false);
    }
  }, [caProvider, caProviders]);

  // Fetch ACME account details if viewing
  const {
    data: acmeAccount,
    isLoading,
  } = useQuery({
    queryKey: ['letsencrypt-acme-account', id, project],
    queryFn: () => letsencryptApi.getAcmeAccount(id!, project),
    enabled: !!id && !!project,
  });

  // Form initialization not needed in view mode
  // Form is only rendered in create mode

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const request: CreateAcmeAccountRequest = {
        name: values.name,
        description: values.description || '',
        email: values.email,
        ca_provider: caProvider,
        environment: values.environment,
        eab: requiresEAB ? eabCredentials : undefined,
      };

      await createMutation.mutateAsync({ request });
      // Navigation handled in mutation onSuccess
    } catch (error) {
      // Form validation failed
    }
  };

  // Check if form can be submitted
  const canSubmit = () => {
    if (!isCreateMode) return true; // Not relevant in view mode
    const basicFieldsValid =
      formValues.name &&
      formValues.email &&
      formValues.environment &&
      caProvider;
    const eabValid = !requiresEAB || (eabCredentials?.key_id && eabCredentials?.hmac_key);
    return basicFieldsValid && eabValid;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isCreateMode && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/acme?tab=acme-accounts')}
              type="text"
            />
          )}
          <SafetyCertificateOutlined style={{ fontSize: 24, color: 'var(--color-primary)' }} />
          <h2 style={{ margin: 0 }}>
            {isCreateMode ? 'Create ACME Account' : acmeAccount?.name || 'ACME Account Details'}
          </h2>
        </div>
        {isCreateMode && (
          <ElchiButton
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={createMutation.isPending}
            disabled={!canSubmit()}
          >
            {createMutation.isPending ? 'Creating...' : 'Create ACME Account'}
          </ElchiButton>
        )}
      </div>

      {isCreateMode ? (
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
              ACME Account Configuration
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px' }}>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={(_, allValues) => setFormValues(allValues)}
            >
              <Form.Item
                name="name"
                label="Account Name"
                rules={[{ required: true, message: 'Please enter account name' }]}
                tooltip="Display name for this ACME account"
              >
                <Input placeholder="Production Account" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                tooltip="Optional description of the account purpose"
              >
                <Input.TextArea
                  placeholder="Main production ACME account for SSL certificates"
                  rows={3}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
                tooltip="Email address for ACME account registration with the selected Certificate Authority. Must be unique per CA per environment per project."
              >
                <Input placeholder="ssl@company.com" />
              </Form.Item>

              <Form.Item
                label="Certificate Authority"
                required
                tooltip="Select the Certificate Authority to use for certificate issuance"
              >
                <CAProviderSelector value={caProvider} onChange={setCAProvider} />
              </Form.Item>

              {requiresEAB && (
                <Form.Item
                  label="EAB Credentials"
                  required
                  tooltip="External Account Binding credentials required for this CA"
                >
                  <EABCredentialsForm
                    caProvider={caProvider}
                    email={form.getFieldValue('email')}
                    environment={form.getFieldValue('environment')}
                    value={eabCredentials}
                    onChange={setEABCredentials}
                    helpUrl={caProviders?.find((p) => p.provider === caProvider)?.eab_instructions_url}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="environment"
                label="Environment"
                rules={[{ required: true, message: 'Please select environment' }]}
                tooltip="Staging: No rate limits (recommended for testing). Production: Subject to rate limits"
              >
                <Select
                  placeholder="Select environment"
                  optionLabelProp="label"
                >
                  {ACME_ENVIRONMENTS.map((env) => (
                    <Select.Option
                      key={env.value}
                      value={env.value}
                      label={env.value === 'production' ? 'Production' : 'Staging'}
                    >
                      <div>
                        <div>{env.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{env.description}</div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        acmeAccount && (
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
                ACME Account Information
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px' }}>
              <Form form={form} style={{ display: 'none' }} />
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Account Name" span={2}>
                  <strong>{acmeAccount.name}</strong>
                </Descriptions.Item>

                {acmeAccount.description && (
                  <Descriptions.Item label="Description" span={2}>
                    {acmeAccount.description}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Email">
                  {acmeAccount.email}
                </Descriptions.Item>

                <Descriptions.Item label="Certificate Authority">
                  <CAProviderBadge provider={acmeAccount.ca_provider} />
                </Descriptions.Item>

                {acmeAccount.eab && (
                  <Descriptions.Item label="EAB Configured">
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Yes
                    </Tag>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Environment">
                  <Tag color={acmeAccount.environment === 'production' ? 'green' : 'blue'}>
                    {acmeAccount.environment === 'production' ? 'Production' : 'Staging'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={
                    acmeAccount.status === 'registered' || acmeAccount.status === 'active'
                      ? 'green'
                      : 'red'
                  }>
                    {acmeAccount.status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Registered">
                  <Tag color={acmeAccount.is_registered ? 'success' : 'default'}>
                    {acmeAccount.is_registered ? 'Yes' : 'No'}
                  </Tag>
                </Descriptions.Item>

                {acmeAccount.registration_url && (
                  <Descriptions.Item label="Registration URL" span={2}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
                      {acmeAccount.registration_url}
                    </span>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Certificates Using This Account">
                  <Tag>{acmeAccount.certificate_count}</Tag>
                </Descriptions.Item>

                {acmeAccount.last_used && (
                  <Descriptions.Item label="Last Used">
                    {new Date(acmeAccount.last_used).toLocaleString()}
                  </Descriptions.Item>
                )}

                {acmeAccount.last_validated && (
                  <Descriptions.Item label="Last Validated" span={2}>
                    {new Date(acmeAccount.last_validated).toLocaleString()}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Created At">
                  {new Date(acmeAccount.created_at).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label="Updated At">
                  {new Date(acmeAccount.updated_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              {acmeAccount.last_error && (
                <div style={{ marginTop: 16, padding: 12, background: 'var(--color-danger-bg)', borderRadius: 8, border: '1px solid var(--color-danger-border)' }}>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-danger)' }}>
                    <strong>Last Error:</strong> {acmeAccount.last_error.message}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {new Date(acmeAccount.last_error.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AcmeAccountDetail;
