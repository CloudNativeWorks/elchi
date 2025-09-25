/**
 * Resource Snippet System - Type Definitions
 */

export interface ResourceSnippet {
  // Identification
  id: string;
  name: string;
  
  // Auto-discovered metadata
  component_type: string;  // "health_check", "outlier_detection", etc.
  gtype: string;          // Full GType enum value: "envoy.config.cluster.v3.Cluster"
  field_path: string;     // "health_checks", "outlier_detection"
  is_array: boolean;
  
  // Version & Project
  version: string;        // "v1.34.2"
  project: string;
  
  // Snippet data
  snippet_data: Record<string, any>;
  data_hash?: string;     // Optional - only in responses
  
  // Timestamps
  created_at?: Date;      // Optional - only in responses
  updated_at?: Date;      // Optional - only in responses
  created_by?: string;    // Optional - only in responses
}

export interface SnippetMetadata {
  field_path: string;
  is_array: boolean;
  gtype: string;
}

export interface PathContext {
  componentType: string;    // CCard'dan gelen ctype
  keyPrefix?: string;        // Component'ten gelen keyPrefix
  gtype?: string;           // URL'den veya context'ten (GTypes enum value)
  parentPath?: string;       // Parent component path
  currentResource?: string; // Current resource type from URL
}

export interface SnippetFilter {
  project?: string;
  version?: string;
  component_type?: string;
  gtype?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface SnippetApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ApplySnippetOptions {
  targetIndex?: number;  // Array için hangi index'e uygulanacak
  appendToArray?: boolean; // Array'e yeni item olarak eklenecek mi
}

export interface SaveSnippetOptions {
  name: string;
  component_type: string;
  gtype: string;
  field_path: string;
  is_array: boolean;
  snippet_data: Record<string, any>;
}