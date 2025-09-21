// Resource Template System Types

export interface ResourceTemplate {
  gtype: string;
  version: string;
  project: string;
  general: {
    config_discovery: any[];
    typed_config: any[];
    elchi_discovery: any[];
  };
  resource: any;
}

export interface TemplateCheckResponse {
  exists: boolean;
}

export interface CreateTemplateRequest {
  general: {
    config_discovery: any[];
    typed_config: any[];
    elchi_discovery: any[];
  };
  resource: any;
}

export interface TemplateListResponse {
  data: ResourceTemplate[];
  total: number;
  message: string;
}