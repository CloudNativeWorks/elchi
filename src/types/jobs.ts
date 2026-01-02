// Job System Types based on async job system documentation

export type JobStatus =
  | 'PENDING'
  | 'CLAIMED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'NO_WORK_NEEDED';

export type JobType = 'SNAPSHOT_UPDATE' | 'DISCOVERY_UPDATE' | 'WAF_PROPAGATION' | 'RESOURCE_UPGRADE' | 'RESOURCE_UPGRADE(DRY)' | 'ACME_VERIFICATION';

export type PokeStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export type RetryReason = 'manual' | 'pod_failure' | 'timeout' | 'manual_failed_only' | 'manual_pending_only';

export type RetryType = 'full' | 'failed_only' | 'pending_only';

export interface JobProgress {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
}

export interface TriggerUser {
  id: string;
  username: string;
  display_name: string;
  role: string;
}

export interface SourceResource {
  type: string;
  name: string;
  collection: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'DISCOVERY_UPDATE';
  project_id?: string;
  version?: string;
}

export interface MissingResource {
  gtype: string;
  name: string;
  collection: string;
  depends_on: string[];
}

export interface ExistingResource {
  gtype: string;
  name: string;
  collection: string;
}

export interface ListenerDetail {
  listener_name: string;
  exists_in_target: boolean;
  upstream_dependencies: number;
  missing_resources: MissingResource[];
  existing_resources: ExistingResource[];
  bootstrap_required: boolean;
  bootstrap_names?: string[];
  requires_client_upgrade?: boolean;
  connected_clients?: number;
  total_clients?: number;
}

export interface SkippedResource {
  gtype: string;
  name: string;
  collection: string;
}

export interface CreatedResource {
  gtype: string;
  name: string;
  collection: string;
  id: string;
  skipped: boolean;
}

export interface UpgradeAnalysis {
  listeners_to_upgrade: string[];
  listener_details: ListenerDetail[];
  upstream_dependencies: number;
  missing_in_target: number;
  existing_in_target: number;
  missing_resources: MissingResource[];
  skipped_resources: SkippedResource[];
  bootstrap_required: boolean;
  bootstrap_names?: string[];
  clients_validated: number;
  incompatible_clients?: string[];
  summary: string;
}

export interface ClientIdentity {
  clientid: string;
  clientname: string;
  sessiontoken: string;
}

export interface UpgradeListenerResult {
  name: string;
  port: number;
  fromversion: string;
  toversion: string;
  graceful: boolean;
  envoyrestarted: string;
  systemdserviceupdated?: string;
}

export interface ClientResponse {
  commandid: string;
  success: boolean;
  error: string;
  identity: ClientIdentity;
  result?: {
    upgradelistener?: UpgradeListenerResult;
  };
}

export interface UpgradeConfig {
  target_version: string;
  auto_create_missing: boolean;
  validate_clients: boolean;
  update_bootstrap: boolean;
  dry_run: boolean;
  analysis: UpgradeAnalysis;
  created_resources?: CreatedResource[];
  client_responses?: ClientResponse[][];
}

export interface AcmeMetadata {
  certificate_id: string;
  certificate_name: string;
  domains: string[];
  environment: 'staging' | 'production';
  dns_provider: string;
  acme_account_id: string;
  dns_credential_id?: string;
  project: string;
  versions: string[];
  is_renewal?: boolean;
}

export interface JobMetadata {
  source_resource?: SourceResource;
  trigger_user: TriggerUser;
  affected_listeners: string[] | null;
  total_affected: number;
  analysis_duration_ms: number;
  // WAF_PROPAGATION specific fields
  waf_config?: {
    name: string;
    project: string;
  };
  affected_wasm?: string[];
  // RESOURCE_UPGRADE specific fields
  upgrade_config?: UpgradeConfig;
  // ACME_VERIFICATION specific fields
  acme?: AcmeMetadata;
}

export interface SnapshotExecution {
  node_id: string;
  listener_name: string;
  poke_status: PokeStatus;
  poke_sent_at: string;
  error?: string;
}

export interface AcmeExecutionDetails {
  certificate_id: string;
  secret_name: string;
  domains: string[];
  status: string;
  issued_at?: string;
  expires_at?: string;
  error_message?: string;
}

export interface ExecutionDetails {
  processed_snapshots?: SnapshotExecution[];
  acme?: AcmeExecutionDetails;
}

export interface WorkerInfo {
  worker_id: string;
  claimed_at: string;
  heartbeat: string;
  ttl: string;
}

export interface RetryInfo {
  original_job_id: string;
  retry_count: number;
  retry_reason: RetryReason;
  retry_type: RetryType;
}

export interface BackgroundJob {
  _id: string;
  job_id: string; // Human-friendly ID like EC-1, EC-2
  type: JobType;
  status: JobStatus;
  progress: JobProgress;
  metadata: JobMetadata;
  execution_details?: ExecutionDetails;
  worker_info?: WorkerInfo;
  retry_info?: RetryInfo;
  created_by: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error?: string;
  project: string;
  version: string;
}

// API Request/Response Types
export interface JobListRequest {
  page?: number;
  limit?: number;
  status?: JobStatus;
  project?: string;
  created_by?: string;
  sort_by?: 'created_at' | 'started_at' | 'completed_at';
  sort_order?: 'asc' | 'desc';
  resource_name?: string;
  affected_listener?: string;
  username?: string;
  start_date?: string;
  end_date?: string;
}

export interface JobListResponse {
  jobs: BackgroundJob[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface RetryJobRequest {
  reason?: string;
  retry_type?: 'full' | 'failed_only';
}

export interface RetryJobResponse {
  message: string;
  job_id: string;
  retry_count: number;
}

export interface StuckJobsResponse {
  stuck_jobs: BackgroundJob[];
  count: number;
}

export interface JobStatsResponse {
  data: {
    total_jobs: number;
    jobs_by_status: Record<string, number>;
    jobs_by_resource: Record<string, number>;
    jobs_by_user: Record<string, number>;
    recent_jobs: any;
    queue_size: number;
    active_workers: number;
    processing_jobs: number;
    last_updated: string;
  };
  filters: {
    end_date: string;
    project: string;
    start_date: string;
  };
  message: string;
}
