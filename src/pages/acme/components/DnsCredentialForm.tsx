import React, { useState } from 'react';
import { Form, Input, Select, Button, Space, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { FaGoogle, FaAws, FaDigitalOcean, FaCloudflare } from 'react-icons/fa';
import { SiGodaddy } from 'react-icons/si';
import { DNS_PROVIDERS } from '../constants/providers';
import { useDnsCredentialMutations } from '../hooks/useDnsCredentialMutations';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type { FormInstance } from 'antd';
import type { DnsProvider } from '../types';

const { TextArea } = Input;

const getIcon = (iconName: string) => {
  const iconStyle = { fontSize: 16 };
  switch (iconName) {
    case 'Google':
      return <FaGoogle style={iconStyle} />;
    case 'GoDaddy':
      return <SiGodaddy style={iconStyle} />;
    case 'Cloudflare':
      return <FaCloudflare style={iconStyle} />;
    case 'DigitalOcean':
      return <FaDigitalOcean style={iconStyle} />;
    case 'AWS':
      return <FaAws style={iconStyle} />;
    default:
      return <FaAws style={iconStyle} />;
  }
};

interface DnsCredentialFormProps {
  form: FormInstance;
  isCreateMode: boolean;
}

const DnsCredentialForm: React.FC<DnsCredentialFormProps> = ({ form, isCreateMode }) => {
  const { project } = useProjectVariable();
  const [provider, setProvider] = useState<DnsProvider>('google');
  const { testMutation } = useDnsCredentialMutations();

  const handleProviderChange = (value: DnsProvider) => {
    setProvider(value);
    // Clear all credential fields when provider changes
    form.setFieldsValue({
      project_id: undefined,
      service_account_json: undefined,
      zone_id: undefined,
      api_key: undefined,
      api_secret: undefined,
      api_token: undefined,
      access_key_id: undefined,
      secret_access_key: undefined,
      hosted_zone_id: undefined,
      dns_zone: undefined,
      region: undefined,
    });
  };

  const getCredentialFields = (): string[] => {
    switch (provider) {
      case 'google':
        return ['project_id', 'service_account_json'];
      case 'godaddy':
        return ['api_key', 'api_secret'];
      case 'cloudflare':
      case 'digitalocean':
        return ['api_token'];
      case 'route53':
        return ['access_key_id', 'secret_access_key'];
      case 'lightsail':
        return ['access_key_id', 'secret_access_key', 'dns_zone'];
      default:
        return [];
    }
  };

  const getCredentialsObject = (values: any) => {
    switch (provider) {
      case 'google':
        return {
          project_id: values.project_id,
          service_account_json: values.service_account_json,
          ...(values.zone_id && { zone_id: values.zone_id }),
        };
      case 'godaddy':
        return {
          api_key: values.api_key,
          api_secret: values.api_secret,
        };
      case 'cloudflare':
      case 'digitalocean':
        return {
          api_token: values.api_token,
        };
      case 'route53':
        return {
          access_key_id: values.access_key_id,
          secret_access_key: values.secret_access_key,
          hosted_zone_id: values.hosted_zone_id,
        };
      case 'lightsail':
        return {
          access_key_id: values.access_key_id,
          secret_access_key: values.secret_access_key,
          dns_zone: values.dns_zone,
          region: values.region,
        };
      default:
        return {};
    }
  };

  const handleTestCredential = async () => {
    try {
      const values = await form.validateFields([
        'provider',
        'test_domain',
        ...getCredentialFields(),
      ]);

      const credentials = getCredentialsObject(values);

      // Test with user-provided domain
      await testMutation.mutateAsync({
        provider,
        credentials,
        domain: values.test_domain,
        project,
      });
    } catch (error) {
      // Validation error or test failed - errors are shown automatically
    }
  };

  return (
    <>
      <Form.Item
        name="name"
        label="Credential Name"
        rules={[{ required: true, message: 'Please enter credential name' }]}
      >
        <Input placeholder="Production GCP DNS" disabled={!isCreateMode} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea
          placeholder="Main production Google Cloud DNS account"
          rows={2}
          disabled={!isCreateMode}
        />
      </Form.Item>

      <Form.Item
        name="provider"
        label="DNS Provider"
        rules={[{ required: true, message: 'Please select a provider' }]}
      >
        <Select
          placeholder="Select DNS provider"
          disabled={!isCreateMode}
          onChange={handleProviderChange}
          optionLabelProp="label"
        >
          {DNS_PROVIDERS.map((p) => (
            <Select.Option key={p.value} value={p.value} label={p.label}>
              <Space direction="vertical" size={0}>
                <Space align="center">
                  {getIcon(p.icon)}
                  <span>{p.label}</span>
                </Space>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', paddingLeft: 24 }}>
                  {p.description}
                </div>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {provider === 'google' && (
        <>
          <Alert
            message="Google Cloud DNS Requirements"
            description="You need a service account with 'DNS Administrator' role. Download the JSON key file from Google Cloud Console."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="project_id"
            label="GCP Project ID"
            rules={[{ required: true, message: 'Please enter GCP project ID' }]}
          >
            <Input placeholder="my-gcp-project" disabled={!isCreateMode} />
          </Form.Item>

          <Form.Item
            name="service_account_json"
            label="Service Account JSON"
            rules={[
              { required: true, message: 'Please enter service account JSON' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    JSON.parse(value);
                    return Promise.resolve();
                  } catch {
                    return Promise.reject(new Error('Invalid JSON format'));
                  }
                },
              },
            ]}
          >
            <TextArea
              placeholder={'{\n  "type": "service_account",\n  "project_id": "...",\n  ...\n}'}
              rows={8}
              disabled={!isCreateMode}
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Form.Item>

          <Form.Item
            name="zone_id"
            label="Managed Zone ID (Optional)"
            tooltip="Optional: Specify a specific Cloud DNS managed zone ID. If not provided, the zone will be auto-detected."
          >
            <Input placeholder="my-dns-zone" disabled={!isCreateMode} />
          </Form.Item>
        </>
      )}

      {provider === 'godaddy' && (
        <>
          <Alert
            message="GoDaddy API Requirements"
            description="You need GoDaddy API credentials. Get them from your GoDaddy Developer Portal."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="api_key"
            label="API Key"
            rules={[{ required: true, message: 'Please enter API key' }]}
          >
            <Input.Password placeholder="your-api-key" disabled={!isCreateMode} />
          </Form.Item>

          <Form.Item
            name="api_secret"
            label="API Secret"
            rules={[{ required: true, message: 'Please enter API secret' }]}
          >
            <Input.Password placeholder="your-api-secret" disabled={!isCreateMode} />
          </Form.Item>
        </>
      )}

      {provider === 'cloudflare' && (
        <>
          <Alert
            message="Cloudflare API Requirements"
            description={
              <>
                You need a Cloudflare API Token with DNS Edit permissions.
                <br />
                Create one at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
                <br />
                Required permissions: <strong>Zone:DNS:Edit</strong>
              </>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="api_token"
            label="API Token"
            rules={[{ required: true, message: 'Please enter Cloudflare API token' }]}
            tooltip="Modern token-based authentication (more secure than API key)."
          >
            <Input.Password
              placeholder="Your Cloudflare API Token"
              disabled={!isCreateMode}
            />
          </Form.Item>
        </>
      )}

      {provider === 'digitalocean' && (
        <>
          <Alert
            message="DigitalOcean API Requirements"
            description={
              <>
                You need a DigitalOcean Personal Access Token with Read and Write permissions.
                <br />
                Create one at: DigitalOcean Dashboard → API → Tokens → Generate New Token
                <br />
                Token format: <strong>dop_v1_...</strong>
              </>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="api_token"
            label="API Token"
            rules={[{ required: true, message: 'Please enter DigitalOcean API token' }]}
            tooltip="Personal Access Token with Read and Write permissions."
          >
            <Input.Password
              placeholder="dop_v1_..."
              disabled={!isCreateMode}
            />
          </Form.Item>
        </>
      )}

      {provider === 'route53' && (
        <>
          <Alert
            message="AWS Route 53 Requirements"
            description={
              <>
                You need AWS IAM credentials with Route 53 permissions.
                <br />
                Required IAM permissions: <strong>route53:ChangeResourceRecordSets</strong>, <strong>route53:GetChange</strong>, <strong>route53:ListHostedZonesByName</strong>
                <br />
                Minimum TTL: 60 seconds
              </>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="access_key_id"
            label="Access Key ID"
            rules={[{ required: true, message: 'Please enter AWS Access Key ID' }]}
          >
            <Input placeholder="AKIAIOSFODNN7EXAMPLE" disabled={!isCreateMode} />
          </Form.Item>

          <Form.Item
            name="secret_access_key"
            label="Secret Access Key"
            rules={[{ required: true, message: 'Please enter AWS Secret Access Key' }]}
          >
            <Input.Password
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              disabled={!isCreateMode}
            />
          </Form.Item>

          <Form.Item
            name="hosted_zone_id"
            label="Hosted Zone ID (Optional)"
            tooltip="If provided, will use this specific hosted zone. Otherwise, will automatically find the hosted zone."
          >
            <Input placeholder="Z1234567890ABC" disabled={!isCreateMode} />
          </Form.Item>
        </>
      )}

      {provider === 'lightsail' && (
        <>
          <Alert
            message="AWS Lightsail Requirements"
            description={
              <>
                You need AWS IAM credentials with Lightsail DNS permissions and the DNS zone domain.
                <br />
                Required IAM permissions: <strong>lightsail:CreateDomainEntry</strong>, <strong>lightsail:DeleteDomainEntry</strong>, <strong>lightsail:GetDomains</strong>
                <br />
                Default region: us-east-1
              </>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="access_key_id"
            label="Access Key ID"
            rules={[{ required: true, message: 'Please enter AWS Access Key ID' }]}
          >
            <Input placeholder="AKIAIOSFODNN7EXAMPLE" disabled={!isCreateMode} />
          </Form.Item>

          <Form.Item
            name="secret_access_key"
            label="Secret Access Key"
            rules={[{ required: true, message: 'Please enter AWS Secret Access Key' }]}
          >
            <Input.Password
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              disabled={!isCreateMode}
            />
          </Form.Item>

          <Form.Item
            name="dns_zone"
            label="DNS Zone"
            rules={[{ required: true, message: 'Please enter the Lightsail DNS zone domain' }]}
            tooltip="The Lightsail DNS zone domain (e.g., example.com)"
          >
            <Input placeholder="example.com" disabled={!isCreateMode} />
          </Form.Item>

          <Form.Item
            name="region"
            label="Region (Optional)"
            tooltip="AWS region for Lightsail. Defaults to us-east-1."
          >
            <Input placeholder="us-east-1" disabled={!isCreateMode} />
          </Form.Item>
        </>
      )}

      {isCreateMode && (
        <>
          <Alert
            message="Test Your Credentials"
            description="Before saving, test your DNS credentials by providing a domain name that you manage with this DNS provider."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            name="test_domain"
            label="Test Domain"
            rules={[
              { required: true, message: 'Please enter a domain to test' },
              {
                pattern: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
                message: 'Please enter a valid domain (e.g., example.com)',
              },
            ]}
            tooltip="Enter a domain you own that is managed by this DNS provider. We'll verify we can create DNS records for it."
          >
            <Input placeholder="example.com" />
          </Form.Item>

          <Form.Item>
            <Button
              icon={testMutation.isSuccess ? <CheckCircleOutlined /> : undefined}
              onClick={handleTestCredential}
              loading={testMutation.isPending}
              type={testMutation.isSuccess ? 'default' : 'dashed'}
            >
              {testMutation.isSuccess ? 'Test Passed ✓' : 'Test Credential'}
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );
};

export default DnsCredentialForm;
