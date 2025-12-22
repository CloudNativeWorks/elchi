import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Descriptions, Tag, Space, Modal, Spin, Alert, Button, Select, Progress, App as AntdApp } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, PlusOutlined, SafetyCertificateOutlined, WarningOutlined, SyncOutlined, SwapOutlined } from '@ant-design/icons';
import { FaGoogle, FaAws, FaDigitalOcean, FaCloudflare } from 'react-icons/fa';
import { SiGodaddy } from 'react-icons/si';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { letsencryptApi } from './letsencryptApi';
import CertificateHeader from './components/CertificateHeader';
import CertificateForm from './components/CertificateForm';
import CertificateStatusBadge from './components/CertificateStatusBadge';
import DnsVerificationCard from './components/DnsVerificationCard';
import ChangeDnsCredentialModal from './components/ChangeDnsCredentialModal';
import { useCertificateMutations } from './hooks/useCertificateMutations';
import { useCertificateActions } from './hooks/useCertificateActions';
import { useJobPolling } from './hooks/useJobPolling';
import { showSuccessNotification, showErrorNotification } from '@/common/notificationHandler';
import { getDnsProviderLabel } from './constants/providers';
import type { CreateCertificateRequest } from './types';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useProjectVariable();
  const [form] = Form.useForm();
  const { modal } = AntdApp.useApp();
  const isCreateMode = !id;
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [changeDnsCredentialModalVisible, setChangeDnsCredentialModalVisible] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const processedJobsRef = useRef<Set<string>>(new Set()); // Track processed jobs to prevent re-polling

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
        return null;
    }
  };

  // Read job_id from URL query parameter (for page refresh or navigation from create)
  useEffect(() => {
    const jobIdFromUrl = searchParams.get('job_id');
    if (jobIdFromUrl && !activeJobId) {
      setActiveJobId(jobIdFromUrl);
      // Clean URL after reading
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('job_id');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, activeJobId, setSearchParams]);

  const { createMutation, deleteMutation, duplicateMutation } = useCertificateMutations();
  const { verifyMutation, retryVerificationMutation, changeDnsCredentialMutation } = useCertificateActions();

  // Job polling for automatic DNS verification
  const { jobStatus, isPolling, progress, isCompleted, isFailed } = useJobPolling({
    jobId: activeJobId,
    enabled: !!activeJobId,
    onComplete: (job) => {
      showSuccessNotification('Certificate verified and issued successfully!', 'Verification Complete');

      // Mark this job as processed so we don't poll it again
      if (job.job_id) {
        processedJobsRef.current.add(job.job_id);
      }

      setActiveJobId(null);
      // Manually refetch certificate to show updated status
      refetch();
    },
    onFailed: (job) => {
      const errorMsg = job.execution_details?.acme?.error_message || job.error || 'Unknown error';
      showErrorNotification(errorMsg, 'Verification Failed');

      // Mark this job as processed so we don't poll it again
      if (job.job_id) {
        processedJobsRef.current.add(job.job_id);
      }

      setActiveJobId(null);
      // Manually refetch certificate to show updated status
      refetch();
    },
  });

  // Fetch certificate details if viewing
  const {
    data: certificate,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['letsencrypt-certificate', id, project],
    queryFn: () => {
      return letsencryptApi.getCertificate(id!, project);
    },
    enabled: !!id && !!project,
    refetchInterval: false, // Prevent automatic refetching
    refetchOnWindowFocus: false, // Prevent refetch on window focus
  });

  // Check if certificate has last_job_id and start polling if needed
  // IMPORTANT: Only resume polling if activeJobId is NOT already set
  // This prevents re-polling after navigation when processedJobsRef is lost
  useEffect(() => {
    // Don't resume polling if we already have an activeJobId (from URL or state)
    if (activeJobId) {
      return;
    }

    if (!certificate?.last_job_id) return;

    // Don't poll jobs that we've already processed (completed/failed)
    if (processedJobsRef.current.has(certificate.last_job_id)) {
      return;
    }

    // Only start polling if certificate status is pending_verification or renewal_pending (actively running)
    // Do NOT poll for verification_failed (already failed, no point in polling)
    if (certificate.status === 'pending_verification' || certificate.status === 'renewal_pending') {
      setActiveJobId(certificate.last_job_id);
    }
  }, [certificate?.last_job_id, activeJobId]); // Depend on activeJobId to prevent conflicts

  // Fetch DNS challenges if pending or verification failed
  const { data: dnsChallenges, isLoading: challengesLoading, error: challengesError, refetch: refetchChallenges } = useQuery({
    queryKey: ['letsencrypt-dns-challenges', id, project],
    queryFn: () => letsencryptApi.getDnsChallenges(id!, project, false),
    enabled: !!id && !!project && (certificate?.status === 'pending_dns' || certificate?.status === 'verification_failed'),
    refetchInterval: false, // Don't auto-poll - user can manually refresh
  });

  // Debug: Log DNS challenges when they change
  useEffect(() => {
    if (dnsChallenges) {
      // Check if we got placeholder values
      const hasPlaceholder = dnsChallenges.some(ch =>
        ch.value.includes('Call GET') || ch.value.includes('to see the actual')
      );
      if (hasPlaceholder) {
        console.warn('⚠️ Backend returned placeholder values instead of actual TXT records!');
        console.warn('This might be a backend bug. The challenges should contain actual ACME tokens.');
      }
    }
    if (challengesError) {
      console.error('DNS Challenges error:', challengesError);
    }
  }, [dnsChallenges, challengesError, id, project]);

  // Fetch ACME account details if viewing certificate
  const { data: acmeAccount } = useQuery({
    queryKey: ['letsencrypt-acme-account', certificate?.acme.account_id, project],
    queryFn: () => letsencryptApi.getAcmeAccount(certificate!.acme.account_id!, project),
    enabled: !!certificate?.acme.account_id && !!project && !isCreateMode,
  });

  // Initialize form with certificate data (only in create mode)
  useEffect(() => {
    if (isCreateMode) {
      // Form initialization for create mode if needed
    }
  }, [isCreateMode]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const request: CreateCertificateRequest = {
        domains: values.domains,
        secret_name: values.secret_name,
        acme_account_id: values.acme_account_id,
        versions: values.versions,
        environment: values.environment,
        dns_credential_id: values.dns_credential_id,
      };

      await createMutation.mutateAsync({
        request,
      });

      // Navigation handled in mutation onSuccess
      // URL parameter job_id will be picked up by useEffect on new page
    } catch (error) {
      // Form validation failed
    }
  };

  const handleDelete = () => {
    if (!certificate) return;

    modal.confirm({
      title: 'Delete Certificate',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete certificate "${certificate.secret_name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => deleteMutation.mutate({ id: certificate._id, project }),
    });
  };

  const handleVerifyDns = async () => {
    if (!id) return;
    await verifyMutation.mutateAsync(id);
    refetch();
  };

  const handleRefreshChallenges = async () => {
    if (!id) return;
    try {
      await letsencryptApi.getDnsChallenges(id, project, true);
      await refetchChallenges();
      await refetch();
    } catch (error) {
      console.error('Failed to refresh challenges:', error);
    }
  };

  const handleRetryVerification = async () => {
    if (!id) return;
    try {
      const jobResponse = await retryVerificationMutation.mutateAsync(id);
      setActiveJobId(jobResponse.job_id);
      refetch(); // Refresh certificate to show pending_verification status
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDuplicate = async () => {
    if (!id || !newVersion.trim()) return;

    try {
      await duplicateMutation.mutateAsync({ certId: id, version: newVersion.trim() });
      setDuplicateModalVisible(false);
      setNewVersion('');
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleChangeDnsCredential = async (dnsCredentialId: string) => {
    if (!id) return;

    try {
      await changeDnsCredentialMutation.mutateAsync({ certId: id, dnsCredentialId });
      setChangeDnsCredentialModalVisible(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const shouldShowDnsVerification =
    !isCreateMode &&
    (certificate?.status === 'pending_dns' || certificate?.status === 'verification_failed');

  const showDnsVerification = shouldShowDnsVerification && dnsChallenges && dnsChallenges.length > 0;

  // Show Change DNS Credential button only for certificates with automatic DNS (not manual)
  // Backend handles Admin/Owner role check
  const showChangeDnsCredential =
    !isCreateMode &&
    certificate?.dns_verification.provider !== 'manual' &&
    !!certificate?.dns_verification.dns_credential_id;

  return (
    <div>
      <CertificateHeader
        title={isCreateMode ? 'Create Certificate' : certificate?.secret_name || 'Certificate Details'}
        onSave={isCreateMode ? handleSave : undefined}
        onDelete={!isCreateMode ? handleDelete : undefined}
        onBack={() => navigate('/acme')}
        saveLoading={createMutation.isPending}
        deleteLoading={deleteMutation.isPending}
        showSave={isCreateMode}
        showDelete={!isCreateMode}
        showBack={!isCreateMode}
      />

      {!isCreateMode && certificate?.last_error && certificate.status !== 'active' && !isCompleted && (
        <Alert
          message={
            certificate.status === 'verification_failed'
              ? 'Verification Failed'
              : certificate.status === 'renewal_failed'
                ? 'Renewal Failed'
                : 'Certificate Error'
          }
          description={
            <div>
              <div>{certificate.last_error.message}</div>
              {certificate.status === 'verification_failed' && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  Click "Retry Verification" below to try again.
                </div>
              )}
              {certificate.status === 'renewal_failed' && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  Certificate renewal failed. The certificate is still active but will expire soon.
                </div>
              )}
            </div>
          }
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Async job progress indicator */}
      {!isCreateMode && isPolling && (
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: 16,
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SyncOutlined spin style={{ fontSize: 20, color: '#1890ff' }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                  {certificate?.status === 'renewal_pending' ? 'Certificate Renewal in Progress' : 'DNS Verification in Progress'}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {certificate?.status === 'renewal_pending'
                    ? (jobStatus?.metadata?.acme?.dns_provider
                      ? `Renewing with ${jobStatus.metadata.acme.dns_provider} DNS provider...`
                      : 'Automatic renewal running...')
                    : (jobStatus?.metadata?.acme?.dns_provider
                      ? `Verifying with ${jobStatus.metadata.acme.dns_provider} DNS provider...`
                      : 'Automatic DNS verification running...')}
                </div>
              </div>
            </div>

            <Progress
              percent={Math.round(progress)}
              status="active"
              strokeColor={{
                '0%': '#056ccd',
                '100%': '#00c6fb',
              }}
            />

            <div style={{ fontSize: 12, color: '#666' }}>
              Job ID: <code>{activeJobId}</code>
            </div>
          </Space>
        </div>
      )}

      {/* Retry verification button for failed automatic verification */}
      {!isCreateMode && certificate?.status === 'verification_failed' && certificate?.dns_verification.provider !== 'manual' && (
        <Alert
          message="Automatic Verification Failed"
          description={
            <div>
              <p>The automatic DNS verification failed. This could be due to:</p>
              <ul style={{ marginBottom: 0 }}>
                <li>DNS propagation taking longer than 5 minutes</li>
                <li>Temporary DNS provider issues</li>
              </ul>
            </div>
          }
          type="warning"
          showIcon
          action={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRetryVerification}
              loading={retryVerificationMutation.isPending}
            >
              Retry Verification
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {shouldShowDnsVerification && challengesLoading && (
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <Spin size="large">
            <div style={{ padding: '50px' }} />
          </Spin>
          <div style={{ marginTop: 16, color: '#666' }}>Loading DNS challenges...</div>
        </div>
      )}

      {showDnsVerification && (
        <DnsVerificationCard
          challenges={dnsChallenges}
          onVerify={handleVerifyDns}
          onRefresh={handleRefreshChallenges}
          verifying={verifyMutation.isPending}
          refreshing={challengesLoading}
          certificateStatus={certificate?.status}
        />
      )}

      {isCreateMode ? (
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginBottom: 16
          }}
        >
          {/* Header */}
          <div style={{
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Certificate Configuration</span>
          </div>

          {/* Body */}
          <div style={{ padding: '16px 20px' }}>
            <Form form={form} layout="vertical">
              <CertificateForm form={form} isCreateMode={isCreateMode} />
            </Form>
          </div>
        </div>
      ) : (
        certificate && (
          <div
            style={{
              background: 'white',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              marginBottom: 16
            }}
          >
            {/* Header */}
            <div style={{
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>Certificate Information</span>
              <Space>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setDuplicateModalVisible(true)}
                  size="small"
                  disabled={certificate?.status !== 'active'}
                >
                  Add Version
                </Button>
                {showChangeDnsCredential && (
                  <Button
                    icon={<SwapOutlined />}
                    onClick={() => setChangeDnsCredentialModalVisible(true)}
                    size="small"
                    disabled={certificate?.status !== 'active'}
                  >
                    Change DNS Credential
                  </Button>
                )}
                <Button icon={<ReloadOutlined />} onClick={() => refetch()} size="small">
                  Refresh
                </Button>
              </Space>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 20px' }}>
              <Descriptions bordered column={2} size="middle">
                <Descriptions.Item label="Certificate Name" span={2}>
                  <strong>{certificate.secret_name}</strong>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <CertificateStatusBadge status={certificate.status} />
                </Descriptions.Item>

                <Descriptions.Item label="Environment">
                  <Tag color={certificate.acme.environment === 'production' ? 'green' : 'blue'}>
                    {certificate.acme.environment === 'production' ? 'Production' : 'Staging'}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Envoy Versions" span={2}>
                  <Space size={[0, 8]} wrap>
                    {certificate.secret_versions.map((version) => (
                      <Tag key={version} color="blue" style={{ fontFamily: 'monospace' }}>
                        {version}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label="Domains" span={2}>
                  <Space size={[0, 8]} wrap>
                    {certificate.domains.map((domain) => (
                      <Tag key={domain} style={{ fontFamily: 'monospace' }}>
                        {domain}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>

                {/* ACME Account Information */}
                {certificate.acme.account_deleted ? (
                  <Descriptions.Item label="ACME Account" span={2}>
                    <Space>
                      <Tag icon={<WarningOutlined />} color="warning">
                        Account Deleted
                      </Tag>
                      <span style={{ color: '#999', fontSize: 12 }}>
                        (Deleted on {new Date(certificate.acme.account_deleted_at!).toLocaleDateString()})
                      </span>
                    </Space>
                  </Descriptions.Item>
                ) : acmeAccount ? (
                  <>
                    <Descriptions.Item label="ACME Account" span={2}>
                      <Space>
                        <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                        <strong>{acmeAccount.name}</strong>
                        <Tag color={acmeAccount.status === 'active' || acmeAccount.status === 'registered' ? 'green' : 'red'}>
                          {acmeAccount.status}
                        </Tag>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => navigate(`/acme/acme-accounts/${acmeAccount._id}`)}
                        >
                          View Details
                        </Button>
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Email" span={2}>
                      {acmeAccount.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Environment" span={2}>
                      <Tag color={acmeAccount.environment === 'production' ? 'green' : 'blue'}>
                        {acmeAccount.environment === 'production' ? 'Production' : 'Staging'}
                      </Tag>
                    </Descriptions.Item>
                  </>
                ) : null}

                <Descriptions.Item label="DNS Provider">
                  <Tag color={certificate.dns_verification.provider === 'manual' ? 'orange' : 'green'}>
                    <Space size={4} align="center">
                      {certificate.dns_verification.provider !== 'manual' && getProviderIcon(certificate.dns_verification.provider)}
                      <span>
                        {certificate.dns_verification.provider === 'manual'
                          ? 'Manual'
                          : certificate.dns_verification.dns_credential_name || getDnsProviderLabel(certificate.dns_verification.provider as any)}
                      </span>
                    </Space>
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Auto Renew">
                  <Tag color={certificate.auto_renew ? 'success' : 'default'}>
                    {certificate.auto_renew ? 'Enabled' : 'Disabled'}
                  </Tag>
                </Descriptions.Item>

                {certificate.issued_at && (
                  <Descriptions.Item label="Issued At">
                    {new Date(certificate.issued_at).toLocaleString()}
                  </Descriptions.Item>
                )}

                {certificate.expires_at && (
                  <Descriptions.Item label="Expires At">
                    {new Date(certificate.expires_at).toLocaleString()}
                  </Descriptions.Item>
                )}

                {certificate.last_renewed_at && (
                  <Descriptions.Item label="Last Renewed" span={2}>
                    {new Date(certificate.last_renewed_at).toLocaleString()}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label="Created At" span={2}>
                  {new Date(certificate.created_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        )
      )}

      {/* Add Version Modal */}
      <Modal
        title="Add Envoy Version"
        open={duplicateModalVisible}
        onOk={handleDuplicate}
        onCancel={() => {
          setDuplicateModalVisible(false);
          setNewVersion('');
        }}
        okText="Add Version"
        confirmLoading={duplicateMutation.isPending}
        okButtonProps={{ disabled: !newVersion.trim() }}
      >
        <p>Add a new Envoy version to this certificate. The same certificate will be available for the new version.</p>
        <Select
          placeholder="Select Envoy version"
          value={newVersion || undefined}
          onChange={(value) => setNewVersion(value)}
          style={{ width: '100%', fontFamily: 'monospace' }}
          options={((window as any).APP_CONFIG?.AVAILABLE_VERSIONS || [])
            .filter((v: string) => !certificate?.secret_versions.includes(v))
            .map((version: string) => ({
              label: version,
              value: version,
            }))}
        />
        {certificate && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
            <strong>Current versions:</strong> {certificate.secret_versions.join(', ')}
          </div>
        )}
      </Modal>

      {/* Change DNS Credential Modal */}
      {certificate && (
        <ChangeDnsCredentialModal
          visible={changeDnsCredentialModalVisible}
          certificate={certificate}
          onCancel={() => setChangeDnsCredentialModalVisible(false)}
          onConfirm={handleChangeDnsCredential}
          loading={changeDnsCredentialMutation.isPending}
        />
      )}
    </div>
  );
};

export default CertificateDetail;
