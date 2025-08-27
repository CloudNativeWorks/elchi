// Job System Types based on async job system documentation

export type JobStatus = 
  | 'PENDING' 
  | 'CLAIMED' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'NO_WORK_NEEDED';

export type JobType = 'SNAPSHOT_UPDATE' | 'DISCOVERY_UPDATE';

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

export interface JobMetadata {
  source_resource: SourceResource;
  trigger_user: TriggerUser;
  affected_listeners: string[];
  total_affected: number;
  analysis_duration_ms: number;
}

export interface SnapshotExecution {
  node_id: string;
  listener_name: string;
  poke_status: PokeStatus;
  poke_sent_at: string;
  error?: string;
}

export interface ExecutionDetails {
  processed_snapshots: SnapshotExecution[];
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
  total_jobs: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  no_work_needed: number;
  average_duration_seconds: number;
  last_24h_jobs: number;
}

// WebSocket message types for real-time updates
export interface JobUpdateMessage {
  type: 'JOB_PROGRESS' | 'JOB_STATUS' | 'JOB_COMPLETED' | 'JOB_FAILED';
  job_id: string;
  data: Partial<BackgroundJob>;
  timestamp: string;
}

// Filter and sorting options
export interface JobFilters {
  status?: JobStatus[];
  type?: JobType[];
  project?: string;
  created_by?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

export interface JobSortOption {
  field: keyof BackgroundJob;
  direction: 'asc' | 'desc';
  label: string;
}

// UI-specific types
export interface JobTableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: string;
  sorter?: boolean;
  render?: (record: BackgroundJob) => React.ReactNode;
}

export interface JobActionOption {
  key: string;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}