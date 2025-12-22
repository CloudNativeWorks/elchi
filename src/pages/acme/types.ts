// CA Provider Types
export type CAProvider = 'letsencrypt' | 'google' | 'zerossl' | 'buypass';

export interface CAProviderInfo {
  provider: CAProvider;
  name: string;
  description: string;
  supported: boolean;
  requires_eab: boolean;
  eab_instructions_url?: string;
  environments: ('staging' | 'production')[];
}

export interface EABCredentials {
  key_id: string;
  hmac_key: string;
}

// ACME Account types
export interface AcmeAccount {
  _id: string;
  project: string;
  name: string;
  description?: string;
  email: string;
  ca_provider: CAProvider;
  environment: 'staging' | 'production';
  registration_url?: string;
  eab?: {
    key_id: string;
    hmac_key_encrypted: string;
  };
  status: 'registered' | 'active' | 'deactivated' | 'error';
  is_registered: boolean;
  certificate_count: number;
  certificates?: string[];
  last_used?: string;
  last_validated?: string;
  last_error?: {
    timestamp: string;
    message: string;
  };
  permissions: {
    users: string[];
    groups: string[];
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAcmeAccountRequest {
  name: string;
  description?: string;
  email: string;
  ca_provider: CAProvider;
  environment: 'staging' | 'production';
  eab?: EABCredentials;
  permissions?: {
    users: string[];
    groups: string[];
  };
}

// Certificate types
export interface Certificate {
  _id: string;
  project: string;
  secret_name: string;
  secret_versions: string[];
  domains: string[];
  primary_domain: string;
  status: CertificateStatus;
  acme: {
    account_id: string; // REQUIRED: Reference to ACME account
    cert_url?: string;
    environment: 'staging' | 'production';
    account_deleted?: boolean;
    account_deleted_at?: string;
  };
  dns_verification: {
    provider: 'manual' | 'google' | 'godaddy' | 'cloudflare';
    dns_credential_id?: string;
    dns_credential_name?: string;
    pending_challenges: DnsChallenge[];
  };
  issued_at?: string;
  expires_at?: string;
  renewal_starts_at?: string;
  auto_renew: boolean;
  renewal_attempts: number;
  last_renewed_at?: string;
  last_renewed_by?: string;
  last_job_id?: string; // NEW: Last async job ID for this certificate
  last_error?: {
    timestamp: string;
    message: string;
    details?: string;
  };
  permissions: {
    users: string[];
    groups: string[];
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DnsChallenge {
  domain: string;
  fqdn: string; // Fully qualified domain name for the TXT record (e.g., "_acme-challenge.example.com.")
  type: 'TXT';
  value: string;
  created_at: string;
  expires_at: string;
}

// DNS Provider Types
export type DnsProvider = 'google' | 'godaddy' | 'cloudflare' | 'digitalocean' | 'route53' | 'lightsail';

export interface DnsCredential {
  _id: string;
  project: string;
  name: string;
  description: string;
  provider: DnsProvider;
  status: 'active' | 'inactive';
  last_validated?: string;
  permissions: {
    users: string[];
    groups: string[];
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CertificateStatus =
  | 'pending_dns'        // Waiting for manual DNS verification (user must add TXT records)
  | 'pending_verification' // Waiting for automatic DNS verification (background job running)
  | 'verification_failed'  // Automatic DNS verification failed (timeout or error)
  | 'verifying'          // Currently verifying DNS challenges
  | 'active'             // Certificate issued and active
  | 'renewal_pending'    // Certificate renewal in progress
  | 'renewal_failed'     // Certificate renewal failed
  | 'expired';           // Certificate has expired

export interface CreateCertificateRequest {
  domains: string[];
  secret_name: string;
  acme_account_id: string; // NEW: Required ACME account ID
  versions: string[];
  environment?: 'staging' | 'production';
  dns_credential_id?: string;
}

export interface DuplicateCertificateRequest {
  version: string;
}

// DNS Credentials Types
export interface GoogleCredentials {
  project_id: string;
  service_account_json: string;
}

export interface GodaddyCredentials {
  api_key: string;
  api_secret: string;
}

export interface CloudflareCredentials {
  api_token: string;
}

export interface DigitalOceanCredentials {
  api_token: string;
}

export interface Route53Credentials {
  access_key_id: string;
  secret_access_key: string;
  hosted_zone_id?: string;
}

export interface LightsailCredentials {
  access_key_id: string;
  secret_access_key: string;
  dns_zone: string; // REQUIRED: The Lightsail DNS zone domain (e.g., "example.com")
  region?: string;
}

export type DnsCredentials =
  | GoogleCredentials
  | GodaddyCredentials
  | CloudflareCredentials
  | DigitalOceanCredentials
  | Route53Credentials
  | LightsailCredentials;

export interface CreateDnsCredentialRequest {
  name: string;
  description: string;
  provider: DnsProvider;
  credentials: DnsCredentials;
  permissions?: {
    users: string[];
    groups: string[];
  };
}

// Async Job Types (for automatic DNS verification)
export interface CertificateJobResponse {
  certificate_id: string;
  job_id: string;
  status: 'pending_verification';
}

export interface JobStatus {
  job_id: string;
  type: 'ACME_VERIFICATION';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress?: {
    total: number;
    completed: number;
    percentage: number;
  };
  metadata?: {
    acme?: {
      certificate_id: string;
      certificate_name: string;
      domains: string[];
      environment: string;
      dns_provider: string;
    };
  };
  execution_details?: {
    acme?: {
      certificate_id: string;
      secret_name: string;
      domains: string[];
      status: string;
      issued_at?: string;
      expires_at?: string;
      error_message?: string;
    };
  };
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error?: string;
}
