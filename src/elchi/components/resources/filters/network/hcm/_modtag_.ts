import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_http_connection_manager = [
    {
        alias: 'hcm',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpConnectionManager', 'HttpConnectionManager_SingleFields'],
    },
    {
        alias: 'sht',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['SchemeHeaderTransformation', 'SchemeHeaderTransformation_SingleFields'],
    },
    {
        alias: 'alo',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpConnectionManager_HcmAccessLogOptions', 'HttpConnectionManager_HcmAccessLogOptions_SingleFields'],
    },
    {
        alias: 'scccd',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpConnectionManager_SetCurrentClientCertDetails', 'HttpConnectionManager_SetCurrentClientCertDetails_SingleFields'],
    },
    {
        alias: 'psc',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpConnectionManager_ProxyStatusConfig', 'HttpConnectionManager_ProxyStatusConfig_SingleFields'],
    },
];

export const modtag_http_filter = [
    {
        alias: 'hf',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpFilter', 'HttpFilter_SingleFields'],
    },
];

export const modtag_upgrade_configs = [
    {
        alias: 'uc',
        relativePath: 'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager',
        names: ['HttpConnectionManager_UpgradeConfig', 'HttpConnectionManager_UpgradeConfig_SingleFields'],
    },
];

export const modtag_us_hcm: TagsType = {
    "HCM": [
        "route_specifier.scoped_routes",
        "tracing",
        "early_header_mutation_extensions",
        "internal_address_config",
        "request_id_extension",
        "local_reply_config",
        "path_normalization_options",
        "typed_header_validation_config",
        "access_log_flush_interval", //deprecated
        "flush_access_log_on_new_request", //deprecated
        "represent_ipv4_remote_address_as_ipv4_mapped_ipv6", //deprecated
    ]
}

export const modtag_r_hcm: TagsType = {
    "HttpConnectionManager": [
        "stat_prefix",
        'rds',
        'route_config',
    ]
}