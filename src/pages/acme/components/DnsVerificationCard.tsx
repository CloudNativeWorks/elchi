import React from 'react';
import { Alert, Button, Space, Typography, Tag, Divider } from 'antd';
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { showSuccessNotification } from '@/common/notificationHandler';
import type { DnsChallenge, CertificateStatus } from '../types';

const { Text, Paragraph } = Typography;

interface DnsVerificationCardProps {
  challenges: DnsChallenge[];
  onVerify: () => void;
  onRefresh?: () => void;
  verifying?: boolean;
  refreshing?: boolean;
  certificateStatus?: CertificateStatus;
}

const DnsVerificationCard: React.FC<DnsVerificationCardProps> = ({
  challenges,
  onVerify,
  onRefresh,
  verifying = false,
  refreshing = false,
  certificateStatus,
}) => {
  const isVerificationFailed = certificateStatus === 'verification_failed';
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessNotification(`${label} copied to clipboard!`);
    } catch {
      showSuccessNotification('Failed to copy. Please copy manually.');
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        marginBottom: 16
      }}
    >
      {/* Header */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-default)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Tag color="orange">Manual DNS Verification Required</Tag>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        {isVerificationFailed && (
          <Alert
            message="Verification Failed - Please Retry"
            description={
              <div>
                <p>The DNS verification failed. The challenge values below are still valid for 24 hours.</p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Next steps:</strong> Ensure the DNS TXT records are correctly added, wait for DNS propagation (5-10 minutes),
                  then click "Verify DNS and Issue Certificate" to retry. If you've hit rate limits or the challenges have expired,
                  click "Refresh Challenges" to get new values.
                </p>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Alert
        message="DNS TXT Records Required"
        description={
          <div>
            <p>
              Add the following TXT records to your DNS zone. DNS propagation can take up to 48
              hours, but usually completes within minutes.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Important:</strong> After adding the records, click "Verify DNS" below to
              complete certificate issuance.
            </p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {challenges.map((challenge, index) => (
        <div key={index}>
          {index > 0 && <Divider />}
          <div
            style={{
              padding: '16px',
              background: 'var(--bg-elevated)',
              borderRadius: 8,
              marginBottom: index < challenges.length - 1 ? 16 : 0,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Domain:</Text>
                <Tag
                  style={{ marginLeft: 8, fontFamily: 'monospace' }}
                  color="blue"
                >
                  {challenge.domain}
                </Tag>
              </div>

              <div>
                <Text strong>Record Type:</Text>
                <Tag style={{ marginLeft: 8 }} color="purple">
                  TXT
                </Tag>
              </div>

              <div>
                <Text strong>Record Name:</Text>
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text
                    code
                    copyable={{
                      text: '_acme-challenge',
                      onCopy: () => copyToClipboard('_acme-challenge', 'Record name'),
                    }}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 13,
                      background: 'var(--bg-surface)',
                      padding: '4px 8px',
                      borderRadius: 4,
                    }}
                  >
                    _acme-challenge
                  </Text>
                </div>
              </div>

              <div>
                <Text strong>Record Value:</Text>
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Text
                    code
                    copyable={{
                      text: challenge.value,
                      onCopy: () => copyToClipboard(challenge.value, 'Record value'),
                    }}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 13,
                      background: 'var(--bg-surface)',
                      padding: '4px 8px',
                      borderRadius: 4,
                      wordBreak: 'break-all',
                      maxWidth: '100%',
                    }}
                  >
                    {challenge.value}
                  </Text>
                </div>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                <Text type="secondary">
                  Expires: {new Date(challenge.expires_at).toLocaleString()}
                </Text>
              </div>
            </Space>
          </div>
        </div>
      ))}

      <Divider />

      <div style={{ marginTop: 16 }}>
        <Alert
          message="DNS Propagation Check"
          description={
            <div>
              <p>You can check if DNS records have propagated using these commands:</p>
              <Paragraph
                code
                copyable
                style={{
                  background: '#2d2d2d',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: 4,
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              >
                {`dig _acme-challenge.${challenges[0]?.domain} TXT\n# or\nnslookup -type=TXT _acme-challenge.${challenges[0]?.domain}`}
              </Paragraph>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onVerify}
            loading={verifying}
            size="large"
            style={{
              background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
              border: 'none',
              borderRadius: 8,
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(0,198,251,0.10)',
            }}
          >
            Verify DNS and Issue Certificate
          </Button>

          {onRefresh && (
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={refreshing}
              size="large"
              style={{
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Refresh Challenges
            </Button>
          )}
        </Space>
      </div>
      </div>
    </div>
  );
};

export default DnsVerificationCard;
