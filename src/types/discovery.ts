export interface NodeInfo {
  name: string;
  status: string;
  version: string;
  addresses: Record<string, string>;
}

export interface ClusterDiscovery {
  id?: string;
  cluster_name: string;
  project: string;
  nodes: NodeInfo[];
  status: string;
  last_seen: string;
  created_at: string;
  updated_at: string;
  node_count: number;
  cluster_version: string;
  discovery_duration: string;
  last_request_time: string;
}

export interface DiscoveryResponse {
  clusters: ClusterDiscovery[];
  count: number;
  success: boolean;
}