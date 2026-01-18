import React from 'react';
import { Form, Input, Alert, Space, Typography, Button, message } from 'antd';
import { KeyOutlined, CheckCircleOutlined, LinkOutlined, CodeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import type { CAProvider, EABCredentials } from '../types';

const { Text, Link, Paragraph } = Typography;
const { TextArea } = Input;

interface EABCredentialsFormProps {
  caProvider: CAProvider;
  email?: string;
  environment?: 'staging' | 'production';
  value?: EABCredentials;
  onChange?: (value: EABCredentials) => void;
  helpUrl?: string;
}

const EABCredentialsForm: React.FC<EABCredentialsFormProps> = ({
  caProvider,
  email,
  environment,
  value,
  onChange,
  helpUrl,
}) => {
  const [keyId, setKeyId] = React.useState(value?.key_id || '');
  const [hmacKey, setHmacKey] = React.useState(value?.hmac_key || '');

  const validateMutation = useMutation({
    mutationFn: () => {
      if (!email || !environment) {
        throw new Error('Email and environment are required for EAB validation');
      }
      return letsencryptApi.validateEAB(caProvider, email, environment, {
        key_id: keyId,
        hmac_key: hmacKey,
      });
    },
    onSuccess: () => {
      message.success('EAB credentials format is valid');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.error || 'Invalid EAB credentials format');
    },
  });

  const handleChange = () => {
    if (keyId && hmacKey && onChange) {
      onChange({ key_id: keyId, hmac_key: hmacKey });
    }
  };

  React.useEffect(() => {
    handleChange();
  }, [keyId, hmacKey]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Alert
        message="External Account Binding (EAB) Credentials Required"
        description={
          <Space direction="vertical" size="small">
            <Text>
              {caProvider === 'google' && (
                <>
                  For Google Trust Services, obtain EAB credentials from Google Cloud Console.
                  {helpUrl && (
                    <>
                      {' '}
                      <Link href={helpUrl} target="_blank">
                        <LinkOutlined /> View Instructions
                      </Link>
                    </>
                  )}
                </>
              )}
              {caProvider === 'zerossl' &&
                'For ZeroSSL, obtain EAB credentials from your ZeroSSL account dashboard.'}
            </Text>
            {caProvider === 'google' && (
              <>
                <Paragraph
                  copyable
                  code
                  style={{
                    marginBottom: 8,
                    backgroundColor: 'var(--code-bg)',
                    color: 'var(--code-text)',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13
                  }}
                >
                  <CodeOutlined style={{ marginRight: 6 }} />
                  gcloud publicca external-account-keys create
                </Paragraph>
                <Text type="warning">
                  ⚠️ Google EAB credentials expire 7 days after creation if not used.
                </Text>
              </>
            )}
          </Space>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form.Item
        label="EAB Key ID"
        required
        tooltip="External Account Binding Key ID (base64 encoded string)"
      >
        <Input
          prefix={<KeyOutlined />}
          placeholder="Example: QO...Ag"
          value={keyId}
          onChange={(e) => setKeyId(e.target.value.trim())}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="EAB HMAC Key"
        required
        tooltip="External Account Binding HMAC Key (base64 encoded string)"
      >
        <TextArea
          placeholder="Example: bG9yZW0gaX...Vzd"
          value={hmacKey}
          onChange={(e) => setHmacKey(e.target.value.trim())}
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Form.Item>

      <Button
        icon={<CheckCircleOutlined />}
        onClick={() => validateMutation.mutate()}
        loading={validateMutation.isPending}
        disabled={!keyId || !hmacKey || !email || !environment}
      >
        Validate EAB Format
      </Button>
    </Space>
  );
};

export default EABCredentialsForm;
