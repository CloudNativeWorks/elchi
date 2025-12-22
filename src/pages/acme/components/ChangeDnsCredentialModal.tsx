import React, { useState } from 'react';
import { Modal, Select, Alert, Space, Typography } from 'antd';
import { SwapOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type { Certificate } from '../types';

const { Text } = Typography;

interface ChangeDnsCredentialModalProps {
  visible: boolean;
  certificate: Certificate;
  onCancel: () => void;
  onConfirm: (dnsCredentialId: string) => void;
  loading?: boolean;
}

const ChangeDnsCredentialModal: React.FC<ChangeDnsCredentialModalProps> = ({
  visible,
  certificate,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const { project } = useProjectVariable();
  const [selectedCredentialId, setSelectedCredentialId] = useState<string | undefined>();

  // Fetch available DNS credentials
  const { data: dnsCredentials, isLoading: credentialsLoading } = useQuery({
    queryKey: ['letsencrypt-dns-credentials', project],
    queryFn: () => letsencryptApi.getDnsCredentials(project),
    enabled: visible && !!project,
  });

  // Filter out the current credential and only show active credentials
  const availableCredentials = (dnsCredentials || []).filter(
    (cred) =>
      cred.status === 'active' &&
      cred._id !== certificate.dns_verification.dns_credential_id
  );

  const handleOk = () => {
    if (selectedCredentialId) {
      onConfirm(selectedCredentialId);
      setSelectedCredentialId(undefined);
    }
  };

  const handleCancel = () => {
    setSelectedCredentialId(undefined);
    onCancel();
  };

  const selectedCredential = availableCredentials.find((c) => c._id === selectedCredentialId);

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          Change DNS Credential
        </Space>
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Change Credential"
      okButtonProps={{ disabled: !selectedCredentialId }}
      width={600}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Change DNS Credential for Renewals"
          description="This will change which DNS credential is used for future certificate renewals. The change takes effect on the next renewal (automatic or manual). Your current certificate remains active."
          type="info"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />

        <div>
          <Text strong>Current DNS Credential:</Text>
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <Text>
              {certificate.dns_verification.dns_credential_name || 'Unknown'}{' '}
              <Text type="secondary">({certificate.dns_verification.provider})</Text>
            </Text>
          </div>
        </div>

        <div>
          <Text strong>Select New DNS Credential:</Text>
          <Select
            placeholder="Select a DNS credential"
            style={{ width: '100%', marginTop: 8 }}
            value={selectedCredentialId}
            onChange={setSelectedCredentialId}
            loading={credentialsLoading}
            disabled={credentialsLoading || availableCredentials.length === 0}
            options={availableCredentials.map((cred) => ({
              value: cred._id,
              label: `${cred.name} (${cred.provider})`,
            }))}
          />
          {!credentialsLoading && availableCredentials.length === 0 && (
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              No other active DNS credentials available
            </Text>
          )}
        </div>

        {selectedCredential && (
          <Alert
            message="New Credential Selected"
            description={
              <div>
                <div>
                  <Text strong>Name:</Text> {selectedCredential.name}
                </div>
                <div>
                  <Text strong>Provider:</Text> {selectedCredential.provider}
                </div>
                {selectedCredential.description && (
                  <div>
                    <Text strong>Description:</Text> {selectedCredential.description}
                  </div>
                )}
              </div>
            }
            type="success"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default ChangeDnsCredentialModal;
