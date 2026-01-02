export interface HttpFilterConfigDiscovery {
    name: string;
    config_discovery: {
        config_source: typeof ConfigSource,
        type_urls: string[];
    };
    is_optional: boolean;
    disabled: boolean;
}

export const ConfigSource = {
    ads: {},
    initial_fetch_timeout: "2s",
    resource_api_version: "V3"
}

export const DeltaConfigSource = {
    api_config_source: {
        api_type: "DELTA_GRPC",
        transport_api_version: "V3",
        grpc_services: [
            {
                timeout: "5s",
                envoy_grpc: {
                    cluster_name: "elchi-control-plane"
                },
                initial_metadata: [{
                    key: "nodeid",
                    value: "__NODEID__"
                }]
            }
        ]
    },
    initial_fetch_timeout: "2s",
    resource_api_version: "V3"
}

export const AdsConfigSource = {
    config_source: ConfigSource
}

export const DeltaGrpcConfigSource = {
    config_source: DeltaConfigSource
}

export const EdsConfigSource = {
    eds_config: AdsConfigSource.config_source,
    service_name: ""
}

export const RdsConfigSource = {
    config_source: AdsConfigSource.config_source,
    route_config_name: ""
}
