export interface NodeInfo {
  name: string;
  status: string;
  version: string;
  addresses: Record<string, string>;
  roles?: string[];
}

export interface ClusterDiscovery {
  id?: string;
  cluster_name: string;
  cluster_version: string;
  last_seen: string;
  nodes: NodeInfo[];
  project: string;
  // Optional fields that may not be in API response
  status?: string;
  created_at?: string;
  updated_at?: string;
  node_count?: number;
  discovery_duration?: string;
  last_request_time?: string;
}

export interface DiscoveryResponse {
  clusters: ClusterDiscovery[];
  count: number;
  success: boolean;
}