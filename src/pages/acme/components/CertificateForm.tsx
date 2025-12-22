import React, { useEffect } from 'react';
import { Form, Input, Select, Radio, Space, Tag } from 'antd';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import { ACME_ENVIRONMENTS } from '../constants/providers';
import type { FormInstance } from 'antd';

interface CertificateFormProps {
  form: FormInstance;
  isCreateMode: boolean;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ form, isCreateMode }) => {
  const { project } = useProjectVariable();
  const [verificationMethod, setVerificationMethod] = React.useState<'manual' | 'automatic'>(
    'automatic'
  );
  const [domainInput, setDomainInput] = React.useState('');
  const [domains, setDomains] = React.useState<string[]>([]);

  // Get available Envoy versions from APP_CONFIG
  const availableVersions = (window as any).APP_CONFIG?.AVAILABLE_VERSIONS || [];

  // Sync form domains with local state
  React.useEffect(() => {
    const formDomains = form.getFieldValue('domains');
    if (formDomains && Array.isArray(formDomains)) {
      setDomains(formDomains);
    }
  }, [form]);

  const handleDomainInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && domainInput.trim()) {
      e.preventDefault();
      const newDomain = domainInput.trim();
      if (!domains.includes(newDomain)) {
        const newDomains = [...domains, newDomain];
        setDomains(newDomains);
        form.setFieldsValue({ domains: newDomains });
      }
      setDomainInput('');
    }
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    const newDomains = domains.filter((d) => d !== domainToRemove);
    setDomains(newDomains);
    form.setFieldsValue({ domains: newDomains });
  };

  // Fetch DNS credentials for automatic verification
  const { data: dnsCredentials } = useQuery({
    queryKey: ['letsencrypt-dns-credentials', project],
    queryFn: () => letsencryptApi.getDnsCredentials(project),
    enabled: !!project && verificationMethod === 'automatic',
  });

  // Fetch ACME accounts
  const { data: acmeAccounts } = useQuery({
    queryKey: ['letsencrypt-acme-accounts', project],
    queryFn: () => letsencryptApi.getAcmeAccounts(project),
    enabled: !!project && isCreateMode,
  });

  useEffect(() => {
    // Set default environment to staging
    if (isCreateMode && !form.getFieldValue('environment')) {
      form.setFieldsValue({ environment: 'staging' });
    }
  }, [form, isCreateMode]);

  return (
    <>
      <Form.Item
        name="secret_name"
        label="Certificate Name"
        rules={[
          { required: true, message: 'Please enter certificate name' },
          {
            pattern: /^[a-z0-9-]+$/,
            message: 'Only lowercase letters, numbers and hyphens allowed',
          },
        ]}
        tooltip="This will be used as the secret name in Envoy configuration"
      >
        <Input
          placeholder="my-wildcard-cert"
          disabled={!isCreateMode}
          style={{ fontFamily: 'monospace' }}
        />
      </Form.Item>

      <Form.Item
        name="domains"
        label="Domains"
        rules={[{ required: true, message: 'Please add at least one domain' }]}
        tooltip="Enter domain and press Enter. Supports wildcards (e.g., *.example.com)"
      >
        <div>
          <Input
            placeholder="example.com or *.example.com (press Enter to add)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={handleDomainInputKeyDown}
            disabled={!isCreateMode}
            style={{ fontFamily: 'monospace', marginBottom: domains.length > 0 ? 8 : 0 }}
          />
          {domains.length > 0 && (
            <Space size={[0, 8]} wrap style={{ marginTop: 8 }}>
              {domains.map((domain) => (
                <Tag
                  key={domain}
                  closable={isCreateMode}
                  onClose={() => handleRemoveDomain(domain)}
                  style={{ fontFamily: 'monospace' }}
                >
                  {domain}
                </Tag>
              ))}
            </Space>
          )}
        </div>
      </Form.Item>

      <Form.Item
        name="acme_account_id"
        label="ACME Account"
        rules={[{ required: true, message: 'Please select an ACME account' }]}
        tooltip="ACME account for certificate issuance. Must match the selected environment."
      >
        <Select
          placeholder="Select ACME account"
          disabled={!isCreateMode}
          options={acmeAccounts?.map((acc) => ({
            label: `${acc.name} (${acc.email} - ${acc.environment})`,
            value: acc._id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="environment"
        label="Environment"
        rules={[{ required: true, message: 'Please select environment' }]}
        tooltip="Staging: For testing (no rate limits). Production: For real certificates"
      >
        <Radio.Group disabled={!isCreateMode}>
          <Space direction="vertical">
            {ACME_ENVIRONMENTS.map((env) => (
              <Radio key={env.value} value={env.value}>
                <Tag color={env.color}>{env.label}</Tag>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="versions"
        label="Envoy Versions"
        rules={[{ required: true, message: 'Please select at least one Envoy version' }]}
        tooltip="Select Envoy XDS API versions. Multiple versions can be added for the same certificate."
      >
        <Select
          mode="multiple"
          placeholder="Select Envoy versions"
          disabled={!isCreateMode}
          style={{ fontFamily: 'monospace' }}
          options={availableVersions.map((version: string) => ({
            label: version,
            value: version,
          }))}
        />
      </Form.Item>

      {isCreateMode && (
        <>
          <Form.Item label="DNS Verification Method">
            <Radio.Group
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
            >
              <Space direction="vertical">
                <Radio value="automatic">
                  <strong>Automatic</strong> - Use DNS credentials for automatic verification
                </Radio>
                <Radio value="manual">
                  <strong>Manual</strong> - Add DNS TXT records manually
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {verificationMethod === 'automatic' && (
            <Form.Item
              name="dns_credential_id"
              label="DNS Credential"
              rules={[{ required: true, message: 'Please select a DNS credential' }]}
              tooltip="DNS credential will be used to automatically add TXT records"
            >
              <Select
                placeholder="Select DNS credential"
                options={dnsCredentials?.map((cred) => ({
                  label: `${cred.name} (${cred.provider})`,
                  value: cred._id,
                }))}
              />
            </Form.Item>
          )}
        </>
      )}
    </>
  );
};

export default CertificateForm;
