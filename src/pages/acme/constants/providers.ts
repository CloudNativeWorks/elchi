import type { CAProvider } from '../types';

import type { DnsProvider } from '../types';

export interface DnsProviderConfig {
  value: DnsProvider;
  label: string;
  icon: string;
  description: string;
  authMethod: string;
  tokenFormat?: string;
}

export const DNS_PROVIDERS: DnsProviderConfig[] = [
  {
    value: 'google',
    label: 'Google Cloud DNS',
    icon: 'Google',
    description: 'Google Cloud Platform DNS service',
    authMethod: 'Service Account JSON',
    tokenFormat: 'Service account credentials file'
  },
  {
    value: 'godaddy',
    label: 'GoDaddy',
    icon: 'GoDaddy',
    description: 'GoDaddy DNS management',
    authMethod: 'API Key + Secret',
    tokenFormat: 'Key: string, Secret: string'
  },
  {
    value: 'cloudflare',
    label: 'Cloudflare',
    icon: 'Cloudflare',
    description: 'Cloudflare DNS management',
    authMethod: 'API Token',
    tokenFormat: 'Token with Zone:DNS:Edit permission'
  },
  {
    value: 'digitalocean',
    label: 'DigitalOcean',
    icon: 'DigitalOcean',
    description: 'DigitalOcean DNS management',
    authMethod: 'API Token',
    tokenFormat: 'Personal Access Token (dop_v1_...)'
  },
  {
    value: 'route53',
    label: 'AWS Route 53',
    icon: 'AWS',
    description: 'Amazon Route 53 DNS service',
    authMethod: 'Access Key + Secret',
    tokenFormat: 'IAM credentials with route53 permissions'
  },
  {
    value: 'lightsail',
    label: 'AWS Lightsail',
    icon: 'AWS',
    description: 'Amazon Lightsail DNS management',
    authMethod: 'Access Key + Secret',
    tokenFormat: 'IAM credentials with lightsail permissions'
  }
];

export const ACME_ENVIRONMENTS = [
  {
    value: 'staging',
    label: 'Staging (Testing)',
    color: 'blue',
    description: 'No rate limits - recommended for testing'
  },
  {
    value: 'production',
    label: 'Production',
    color: 'green',
    description: 'Subject to Let\'s Encrypt rate limits (50 certs/domain/week)'
  },
] as const;

export const getDnsProviderConfig = (provider: DnsProvider): DnsProviderConfig | undefined => {
  return DNS_PROVIDERS.find((p) => p.value === provider);
};

export const getDnsProviderLabel = (provider: DnsProvider): string => {
  return getDnsProviderConfig(provider)?.label || provider;
};
