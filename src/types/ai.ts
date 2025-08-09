export interface AIUsageRecord {
  id?: string;
  project: string;
  user_id: string;
  request_type: 'analyze' | 'analyze-logs';
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  resource_name?: string;
  collection?: string;
  success: boolean;
  error_message?: string;
  duration_ms: number;
  timestamp: string;
  created_at: string;
}

export interface AIUsageStats {
  project: string;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  total_tokens_used: number;
  total_input_tokens: number;
  total_output_tokens: number;
  analyze_requests: number;
  log_analyze_requests: number;
  average_response_time_ms: number;
  last_used: string;
  first_used: string;
  tokens_today: number;
  tokens_this_week: number;
  tokens_this_month: number;
}

export interface AIUsageStatus {
  success: boolean;
  status: {
    token_configured: boolean;
    service_available: boolean;
    supported_features: string[];
    max_tokens_per_request: number;
    supported_models: string[];
  };
  usage_summary?: {
    total_requests: number;
    tokens_used_today: number;
    tokens_used_month: number;
    last_used: string;
    success_rate: number;
  };
}

export interface AIUsageStatsResponse {
  success: boolean;
  stats: AIUsageStats;
}

export interface AIRecentUsageResponse {
  success: boolean;
  usage: AIUsageRecord[];
  count: number;
}