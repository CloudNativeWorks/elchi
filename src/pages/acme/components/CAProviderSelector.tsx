import React from 'react';
import { Select, Alert, Space, Typography, Card, Row, Col, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  GoogleOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import type { CAProvider } from '../types';

const { Text, Link } = Typography;

interface CAProviderSelectorProps {
  value?: CAProvider;
  onChange?: (provider: CAProvider) => void;
  disabled?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  GoogleOutlined: <GoogleOutlined />,
  LockOutlined: <LockOutlined />,
};

const CAProviderSelector: React.FC<CAProviderSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Fetch CA providers from backend
  const { data: caProviders, isLoading } = useQuery({
    queryKey: ['ca-providers'],
    queryFn: () => letsencryptApi.getCAProviders(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter only supported CA providers
  const supportedProviders = caProviders?.filter((p) => p.supported) || [];

  const selectedProvider = supportedProviders.find((p) => p.provider === value);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Select
        value={value}
        onChange={onChange}
        placeholder="Select Certificate Authority"
        loading={isLoading}
        disabled={disabled}
        style={{ width: '100%' }}
        size="large"
      >
        {supportedProviders.map((provider) => {
          const Icon =
            provider.provider === 'google'
              ? iconMap['GoogleOutlined']
              : iconMap['SafetyCertificateOutlined'];

          return (
            <Select.Option key={provider.provider} value={provider.provider}>
              <Space>
                {Icon}
                <span>{provider.name}</span>
                {provider.requires_eab && (
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    Requires EAB
                  </Tag>
                )}
              </Space>
            </Select.Option>
          );
        })}
      </Select>

      {selectedProvider && (
        <Card size="small" style={{ backgroundColor: '#f6f8fa' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">{selectedProvider.description}</Text>

            {selectedProvider.requires_eab && (
              <Alert
                message="External Account Binding Required"
                description={
                  <Space direction="vertical" size="small">
                    <Text>
                      This CA requires EAB credentials. You'll need to obtain these from{' '}
                      {selectedProvider.eab_instructions_url ? (
                        <Link href={selectedProvider.eab_instructions_url} target="_blank">
                          {selectedProvider.name} documentation
                        </Link>
                      ) : (
                        `${selectedProvider.name}`
                      )}
                      .
                    </Text>
                  </Space>
                }
                type="info"
                icon={<InfoCircleOutlined />}
                showIcon
              />
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Text type="secondary">Supported Environments:</Text>
                <div>
                  <Space size="small">
                    {selectedProvider.environments.map((env) => (
                      <Tag key={env} color={env === 'production' ? 'green' : 'blue'}>
                        {env}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Col>
            </Row>
          </Space>
        </Card>
      )}
    </Space>
  );
};

export default CAProviderSelector;
