/**
 * GSLB TypeScript Type Definitions
 * Based on GSLB_API_REFERENCE.md
 */

export interface GSLBConfig {
  enabled: boolean;
  zone: string;
  failover_zones?: string[]; // Array of failover zones (first one is default)
  dns_secret: string;
  default_ttl: number;
}

export interface GSLBStatusHistory {
  state: 'passing' | 'warning' | 'critical' | 'recovery';
  datetime: string;
  response_code?: number;
  response_time?: number;
  error_message?: string;
}

export interface GSLBIPAddress {
  id?: string; // MongoDB document ID for gslb_ip_health collection (used for clearing history)
  ip: string;
  client_id?: string;
  shard_id?: number;
  sub_shard_id?: number;
  health_state: 'passing' | 'warning' | 'critical' | 'recovery';
  backoff_until?: string | null;
  current_backoff?: number;
  last_check?: string;
  last_status_change?: string;
  status_history?: GSLBStatusHistory[];
  is_manual?: boolean; // true = manually added by admin (deletable), false = auto-generated from service (non-deletable)
}

export interface GSLBProbe {
  type: 'http' | 'https' | 'tcp';
  port?: number;
  path?: string;
  host_header?: string;
  interval: 10 | 20 | 30 | 60 | 90 | 120 | 180 | 300;
  timeout: number;
  enabled?: boolean; // Enable/disable probe execution (default: true, false = paused)
  warning_threshold: number;
  critical_threshold: number;
  passing_threshold?: number; // Consecutive successes before passing state (default: 1, max: 10). When > 1, enables anti-flapping via RECOVERY state
  expected_status_codes?: string[]; // HTTP/HTTPS only - e.g., ["200-299", "301", "302"]
  follow_redirects?: boolean; // HTTP/HTTPS only - Follow HTTP redirects (default: true)
  skip_ssl_verify?: boolean; // HTTPS only - Skip SSL certificate verification (default: false)
}

export interface GSLBRecord {
  id: string;
  fqdn: string;
  service_id: string; // empty string for manual records, ObjectID for auto-created
  project: string;
  version: string;
  zone: string;
  failover_zone?: string; // Per-record failover zone (overrides default)
  shard_id: number;
  enabled: boolean;
  ttl: number;
  ips?: GSLBIPAddress[]; // Optional - only available in detail view
  total_ips?: number; // IP statistics from list view
  healthy_ips?: number;
  unhealthy_ips?: number;
  probe?: GSLBProbe | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateGSLBRequest {
  fqdn: string;
  project: string;
  version: string;
  enabled: boolean;
  ttl: number;
  failover_zone?: string; // Optional per-record failover zone
  probe?: GSLBProbe | null;
  // Note: ips field removed - IPs must be added via POST /api/v3/gslb/:id/ips after record creation
}

export interface UpdateGSLBRequest {
  enabled: boolean;
  ttl: number;
  failover_zone?: string; // Optional per-record failover zone
  probe?: GSLBProbe | null;
  // Note: ips field removed - use dedicated IP management endpoints instead
  // POST /api/v3/gslb/:id/ips and DELETE /api/v3/gslb/:id/ips/:ip
}

export interface GSLBListResponse {
  records: GSLBRecord[];
  count: number; // Total number of records
  page: number;
  limit: number;
  total_pages: number;
}

export interface GSLBNode {
  id: string;
  node_ip: string;
  zone: string;
  first_seen: string;
  last_seen: string;
  request_count: number;
  last_version_hash: string;
}

export interface GSLBListFilter {
  project: string;
  page?: number;
  limit?: number;
  search?: string; // Search in FQDN (case-insensitive)
  status?: 'enabled' | 'disabled'; // Filter by status
  probe_type?: 'http' | 'https' | 'tcp'; // Filter by probe type
  probe_interval?: 10 | 20 | 30 | 60 | 90 | 120 | 180 | 300; // Filter by probe interval
  ttl?: number; // Filter by TTL value
}
