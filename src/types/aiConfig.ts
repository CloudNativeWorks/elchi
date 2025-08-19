// AI Configuration Types - Matches backend pkg/ai types

// AI Analysis Request Types
export interface ConfigAnalyzerRequest {
  resource_name: string;
  collection: string;
  project: string;
  version: string;
  question: string;
  include_dependencies?: boolean;
  depth?: number; // Dependency depth (default: 3)
}

// AI Analysis Response Types
export interface ConfigAnalysisResult {
  resource_config: DBResource;
  dependencies?: DependencyGraph;
  related_resources: Record<string, DBResource[]>;
  analysis: string;
  suggestions?: string[];
  warnings?: string[];
  processed_at: string;
  token_usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    cost_usd: number;
  };
}

export interface DBResource {
  _id: string;
  general: ResourceGeneral;
  resource: {
    version: string;
    resource: any; // Envoy config object
  };
}

export interface ResourceGeneral {
  name: string;
  version: string;
  type: string;
  gtype: string;
  project: string;
  collection: string;
  canonical_name: string;
  category: string;
  managed: boolean;
  metadata?: {
    ai_generated?: boolean;
    [key: string]: any;
  };
  permissions: {
    users: string[];
    groups: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  data: {
    label: string;
    category: string;
    gtype: string;
  };
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  data: {
    relationship: string;
  };
}

// AI Status and Features Types
export interface AIStatus {
  available: boolean;
  providers: {
    claude: boolean;
    openai: boolean;
  };
  default_model: string;
  supported_features: string[];
  status: string;
  message?: string;
}

export interface SupportedFeatures {
  total_supported: number;
  categories: Record<string, string[]>;
  supported_collections: string[];
  api_endpoints: Record<string, string>;
}

// Available resources for dropdown selection
export interface ResourceOption {
  name: string;
  project: string;
  version: string;
  gtype: string;
  created_at: string;
}

// Resource collection types
export interface ResourceCollection {
  name: string;
  displayName: string;
  endpoint: string;
  description: string;
}

// Available collections - different endpoint structures
export const RESOURCE_COLLECTIONS: ResourceCollection[] = [
  { name: 'listeners', displayName: 'Listeners', endpoint: 'xds/listeners', description: 'HTTP/TCP listeners' },
  { name: 'clusters', displayName: 'Clusters', endpoint: 'xds/clusters', description: 'Upstream clusters' },
  { name: 'routes', displayName: 'Routes', endpoint: 'xds/routes', description: 'Route configurations' },
  { name: 'endpoints', displayName: 'Endpoints', endpoint: 'xds/endpoints', description: 'Load balancing endpoints' },
  { name: 'virtual_hosts', displayName: 'Virtual Hosts', endpoint: 'xds/virtual_hosts', description: 'Virtual host configurations' },
  { name: 'secrets', displayName: 'Secrets', endpoint: 'xds/secrets', description: 'TLS certificates and secrets' },
  { name: 'tls', displayName: 'TLS Contexts', endpoint: 'xds/tls', description: 'TLS configurations' }
];

// Import GTypes from the existing static file
import { GTypes, getFieldsByGType } from '../common/statics/gtypes';

// Component types from backend GTypes - these will show individual components instead of collection groups
export interface ComponentType {
  gtype: string;
  displayName: string;
  collection: string;
  backendPath: string;
  category: string;
  description: string;
}

// Function to generate component types from gtypes
function generateComponentTypes(): ComponentType[] {
  const componentTypes: ComponentType[] = [];
  
  // Define which GTypes we want to show as individual components
  const filterAndExtensionGTypes = [
    // HTTP Filters
    GTypes.Router,
    GTypes.Cors,
    GTypes.BasicAuth,
    GTypes.HttpRBAC,
    GTypes.Compressor,
    GTypes.HttpLocalRatelimit,
    GTypes.Lua,
    GTypes.OAuth2,
    GTypes.Buffer,
    GTypes.AdaptiveConcurrency,
    GTypes.AdmissionControl,
    GTypes.StatefulSession,
    GTypes.CsrfPolicy,
    GTypes.BandwidthLimit,
    
    // Network Filters  
    GTypes.HTTPConnectionManager,
    GTypes.TcpProxy,
    GTypes.NetworkRBAC,
    GTypes.ConnectionLimit,
    GTypes.NetworkLocalRatelimit,
    
    // Listener Filters
    GTypes.ListenerHttpInspector,
    GTypes.ListenerTlsInspector,
    GTypes.ListenerOriginalDst,
    GTypes.ListenerLocalRateLimit,
    GTypes.ListenerProxyProtocol,
    
    // Extensions
    GTypes.FileAccessLog,
    GTypes.FluentdAccessLog,
    GTypes.GzipCompressor,
    GTypes.BrotliCompressor,
    GTypes.ZstdCompressor,
    GTypes.HttpProtocolOptions,
    GTypes.OpenTelemetry,
    GTypes.HCEFS,
    GTypes.UTM,
    GTypes.CookieBasedSessionState,
    GTypes.HeaderBasedSessionState
  ];
  
  filterAndExtensionGTypes.forEach(gtype => {
    try {
      const fields = getFieldsByGType(gtype);
      
      // Determine filter type from category or path
      let filterTypeDisplay = '';
      if (fields.category.includes('http')) {
        filterTypeDisplay = 'http filter';
      } else if (fields.category.includes('network')) {
        filterTypeDisplay = 'network filter';  
      } else if (fields.category.includes('listener')) {
        filterTypeDisplay = 'listener filter';
      } else if (fields.collection === 'extensions') {
        filterTypeDisplay = 'extension';
      }
      
      componentTypes.push({
        gtype: gtype as string,
        displayName: `${fields.prettyName} (${filterTypeDisplay})`,
        collection: fields.collection,
        backendPath: fields.backendPath,
        category: fields.category,
        description: fields.prettyName
      });
    } catch (error) {
      console.warn(`Failed to get fields for GType: ${gtype}`, error);
    }
  });
  
  return componentTypes;
}

export const COMPONENT_TYPES: ComponentType[] = generateComponentTypes();

// Log Analysis Types
export interface LogAnalyzerRequest {
  service_name: string;
  client_name: string;
  project: string;
  logs: ServiceLogItem[];
  question?: string;
  max_logs?: number;
}

export interface LogAnalysisResult {
  service_name: string;
  client_name: string;
  log_count: number;
  analysis: string;
  log_summary?: string;
  suggestions?: string[];
  issues_found?: string[];
  processed_at: string;
  token_usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    cost_usd: number;
  };
  // Additional dynamic fields from OpenRouter response
  [key: string]: any;
}

export interface ServiceLogItem {
  message: string;
  level: string;
  component?: string;
  timestamp: string;
  client_name?: string;
}