import { api } from '@/common/api';
import { handleApiResponse } from '@/common/notificationHandler';
import type {
  Certificate,
  DnsCredential,
  CreateCertificateRequest,
  CreateDnsCredentialRequest,
  DnsChallenge,
  AcmeAccount,
  CreateAcmeAccountRequest,
  CertificateJobResponse,
  JobStatus,
  CAProviderInfo,
  CAProvider,
  DnsProvider,
} from './types';

const ACME_BASE_PATH = '/api/v3/acme';

class LetsEncryptApiClient {
  // ========== CERTIFICATES ==========

  async getCertificates(project: string): Promise<Certificate[]> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates?${params.toString()}`;

    const response = await api.get<{ message: string; data: any[] }>(path);
    // Backend returns 'id' but we use '_id' in frontend
    const certificates = (response.data?.data || []).map((cert: any) => ({
      ...cert,
      _id: cert.id || cert._id,
    }));
    return certificates;
  }

  async getCertificate(id: string, project: string): Promise<Certificate> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${id}?${params.toString()}`;

    const response = await api.get<{ message: string; data: any }>(path);
    const cert = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cert,
      _id: cert.id || cert._id,
    };
  }

  async createCertificate(
    request: CreateCertificateRequest,
    project: string
  ): Promise<Certificate | CertificateJobResponse> {
    const params = new URLSearchParams({ project });

    const url = `${ACME_BASE_PATH}/certificates?${params.toString()}`;
    const response = await api.post<{
      message: string;
      certificate?: any;
      data?: CertificateJobResponse;
    }>(url, request);

    const isManual = !request.dns_credential_id;

    // Check if response contains async job (automatic DNS verification)
    if (response.data.data?.job_id) {
      handleApiResponse(response.data, undefined, undefined, {
        showAutoSuccess: true,
        customSuccessMessage: 'Certificate creation started. DNS verification running in background...',
        successTitle: 'Certificate Created',
      });

      return response.data.data;
    }

    // Manual DNS verification - returns certificate immediately
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Certificate created. Please add DNS TXT records and verify.',
      successTitle: 'Certificate Created',
    });

    const cert = response.data.certificate;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cert,
      _id: cert.id || cert._id,
    };
  }

  async duplicateCertificate(
    certId: string,
    version: string,
    project: string
  ): Promise<Certificate> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${certId}/duplicate?${params.toString()}`;

    const response = await api.post<{ message: string; certificate: any }>(path, {
      version,
    });

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `Certificate duplicated successfully to version ${version}`,
      successTitle: 'Version Added',
    });

    const cert = response.data.certificate;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cert,
      _id: cert.id || cert._id,
    };
  }

  async deleteCertificate(id: string, project: string): Promise<void> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${id}?${params.toString()}`;

    const response = await api.delete<{ message: string }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Certificate deleted successfully',
      successTitle: 'Certificate Deleted',
    });
  }

  async getDnsChallenges(certId: string, project: string, refresh?: boolean): Promise<DnsChallenge[]> {
    const params = new URLSearchParams({ project });
    if (refresh) {
      params.append('refresh', 'true');
    }
    const path = `${ACME_BASE_PATH}/certificates/${certId}/dns-challenges?${params.toString()}`;

    const response = await api.get<{
      message: string;
      data: {
        status?: string;
        provider?: string;
        pending_challenges: DnsChallenge[]
      };
    }>(path);

    // Backend returns actual TXT record values in this endpoint
    // Use refresh=true to force-fetch new challenges from Let's Encrypt when verification fails
    return response.data?.data?.pending_challenges || [];
  }

  async verifyDns(certId: string, project: string): Promise<Certificate> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${certId}/verify?${params.toString()}`;

    const response = await api.post<{ message: string; certificate: any }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Certificate verified and issued successfully!',
      successTitle: 'DNS Verified',
    });

    const cert = response.data.certificate;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cert,
      _id: cert.id || cert._id,
    };
  }

  async renewCertificate(certId: string, project: string): Promise<Certificate> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${certId}/renew?${params.toString()}`;

    const response = await api.post<{ message: string; certificate: any }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Certificate renewed successfully!',
      successTitle: 'Certificate Renewed',
    });

    const cert = response.data.certificate;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cert,
      _id: cert.id || cert._id,
    };
  }

  async retryVerification(certId: string, project: string): Promise<CertificateJobResponse> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${certId}/retry-verification?${params.toString()}`;

    const response = await api.post<{ message: string; data: CertificateJobResponse }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'Verification retry initiated. Monitoring progress...',
      successTitle: 'Retry Started',
    });

    return response.data.data;
  }

  async changeDnsCredential(
    certId: string,
    dnsCredentialId: string,
    project: string
  ): Promise<{ certificate_id: string; new_dns_credential: string; new_provider: string }> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/certificates/${certId}/dns-credential?${params.toString()}`;

    const response = await api.put<{
      message: string;
      data: { certificate_id: string; new_dns_credential: string; new_provider: string };
    }>(path, { dns_credential_id: dnsCredentialId });

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `DNS credential changed to "${response.data.data.new_dns_credential}". Change will take effect on next renewal.`,
      successTitle: 'DNS Credential Updated',
    });

    return response.data.data;
  }

  // ========== JOB MONITORING ==========

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const path = `/api/v3/jobs/${jobId}`;
    const response = await api.get<{ data: JobStatus }>(path);
    return response.data.data;
  }

  // ========== DNS CREDENTIALS ==========

  async getDnsCredentials(project: string): Promise<DnsCredential[]> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/dns-credentials?${params.toString()}`;

    const response = await api.get<{ message: string; data: any[] }>(path);
    // Backend returns 'id' but we use '_id' in frontend
    const credentials = (response.data?.data || []).map((cred: any) => ({
      ...cred,
      _id: cred.id || cred._id,
    }));
    return credentials;
  }

  async getDnsCredential(id: string, project: string): Promise<DnsCredential> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/dns-credentials/${id}?${params.toString()}`;

    const response = await api.get<{ message: string; data: any }>(path);
    const cred = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cred,
      _id: cred.id || cred._id,
    };
  }

  async createDnsCredential(
    request: CreateDnsCredentialRequest,
    project: string
  ): Promise<DnsCredential> {
    const params = new URLSearchParams({ project });
    const url = `${ACME_BASE_PATH}/dns-credentials?${params.toString()}`;

    const response = await api.post<{ message: string; data: any }>(url, request);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `DNS credential "${request.name}" created successfully`,
      successTitle: 'DNS Credential Created',
    });

    const cred = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cred,
      _id: cred.id || cred._id,
    };
  }

  async updateDnsCredential(
    id: string,
    request: Partial<CreateDnsCredentialRequest>,
    project: string
  ): Promise<DnsCredential> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/dns-credentials/${id}?${params.toString()}`;

    const response = await api.put<{ message: string; data: any }>(path, request);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'DNS credential updated successfully',
      successTitle: 'DNS Credential Updated',
    });

    const cred = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...cred,
      _id: cred.id || cred._id,
    };
  }

  async deleteDnsCredential(id: string, project: string, force: boolean = false): Promise<void> {
    const params = new URLSearchParams({ project });
    if (force) params.append('force', 'true');
    const path = `${ACME_BASE_PATH}/dns-credentials/${id}?${params.toString()}`;

    const response = await api.delete<{ message: string; warning?: string }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: response.data.warning
        ? `${response.data.message}. ${response.data.warning}`
        : response.data.message,
      successTitle: 'DNS Credential Deleted',
    });
  }

  async testDnsCredential(
    provider: DnsProvider,
    credentials: any,
    domain: string,
    project: string
  ): Promise<boolean> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/dns-credentials/test?${params.toString()}`;

    const response = await api.post<{ message: string }>(path, {
      provider,
      credentials,
      domain,
    });

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'DNS credential test successful!',
      successTitle: 'Test Passed',
    });

    return true;
  }

  // ========== ACME ACCOUNTS ==========

  async getAcmeAccounts(project: string): Promise<AcmeAccount[]> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/acme-accounts?${params.toString()}`;

    const response = await api.get<{ message: string; data: any[] }>(path);
    // Backend returns 'id' but we use '_id' in frontend
    const accounts = (response.data?.data || []).map((acc: any) => ({
      ...acc,
      _id: acc.id || acc._id,
    }));
    return accounts;
  }

  async getAcmeAccount(id: string, project: string): Promise<AcmeAccount> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/acme-accounts/${id}?${params.toString()}`;

    const response = await api.get<{ message: string; data: any }>(path);
    const acc = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...acc,
      _id: acc.id || acc._id,
    };
  }

  async createAcmeAccount(
    request: CreateAcmeAccountRequest,
    project: string
  ): Promise<AcmeAccount> {
    const params = new URLSearchParams({ project });
    const url = `${ACME_BASE_PATH}/acme-accounts?${params.toString()}`;

    const response = await api.post<{ message: string; data: any }>(url, request);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `ACME account "${request.name}" created and registered successfully`,
      successTitle: 'ACME Account Created',
    });

    const acc = response.data.data;
    // Backend returns 'id' but we use '_id' in frontend
    return {
      ...acc,
      _id: acc.id || acc._id,
    };
  }

  async deleteAcmeAccount(id: string, project: string, force: boolean = false): Promise<void> {
    const params = new URLSearchParams({ project });
    if (force) params.append('force', 'true');
    const path = `${ACME_BASE_PATH}/acme-accounts/${id}?${params.toString()}`;

    const response = await api.delete<{ message: string; warning?: string }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: response.data.warning
        ? `${response.data.message}. ${response.data.warning}`
        : response.data.message,
      successTitle: 'ACME Account Deleted',
    });
  }

  async validateAcmeAccount(id: string, project: string): Promise<AcmeAccount> {
    const params = new URLSearchParams({ project });
    const path = `${ACME_BASE_PATH}/acme-accounts/${id}/validate?${params.toString()}`;

    const response = await api.post<{ message: string; data: any }>(path);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'ACME account validated successfully',
      successTitle: 'Validation Successful',
    });

    return response.data.data;
  }

  // ========== CA PROVIDERS ==========

  async getCAProviders(): Promise<CAProviderInfo[]> {
    const path = `${ACME_BASE_PATH}/ca-providers`;

    const response = await api.get<{ message: string; data: CAProviderInfo[] }>(path);
    return response.data?.data || [];
  }

  async validateEAB(
    provider: CAProvider,
    email: string,
    environment: 'staging' | 'production',
    credentials: { key_id: string; hmac_key: string }
  ): Promise<{ provider: string; environment: string; validation_note: string }> {
    const path = `${ACME_BASE_PATH}/ca-providers/${provider}/validate-eab`;

    const requestBody = {
      email,
      environment,
      eab: credentials,
    };

    const response = await api.post<{
      message: string;
      data: { provider: string; environment: string; validation_note: string };
    }>(path, requestBody);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'EAB credentials format is valid',
      successTitle: 'Validation Successful',
    });

    return response.data.data;
  }
}

export const letsencryptApi = new LetsEncryptApiClient();
