import {OutType} from '@elchi/tags/tagsType';


export const Vhds: OutType = { "Vhds": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for VHDS.",
    "notImp": false
  }
] };

export const RouteConfiguration: OutType = { "RouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. For example, it might match `route_config_name` in `envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.Rds`.",
    "notImp": false
  },
  {
    "name": "virtual_hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "VirtualHost[]",
    "enums": null,
    "comment": "An array of virtual hosts that make up the route table.",
    "notImp": false
  },
  {
    "name": "vhds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Vhds",
    "enums": null,
    "comment": "An array of virtual hosts will be dynamically loaded via the VHDS API. Both ``virtual_hosts`` and ``vhds`` fields will be used when present. ``virtual_hosts`` can be used for a base routing table or for infrequently changing virtual hosts. ``vhds`` is used for on-demand discovery of virtual hosts. The contents of these two fields will be merged to generate a routing table for a given RouteConfiguration, with ``vhds`` derived configuration taking precedence.",
    "notImp": false
  },
  {
    "name": "internal_only_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optionally specifies a list of HTTP headers that the connection manager will consider to be internal only. If they are found on external requests they will be cleaned prior to filter invocation. See `config_http_conn_man_headers_x-envoy-internal` for more information.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each response that the connection manager encodes. Headers specified at this level are applied after headers from any enclosed `envoy_v3_api_msg_config.route.v3.VirtualHost` or `envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each response that the connection manager encodes.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each request routed by the HTTP connection manager. Headers specified at this level are applied after headers from any enclosed `envoy_v3_api_msg_config.route.v3.VirtualHost` or `envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "request_headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be removed from each request routed by the HTTP connection manager.",
    "notImp": false
  },
  {
    "name": "most_specific_header_mutations_wins",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Headers mutations at all levels are evaluated, if specified. By default, the order is from most specific (i.e. route entry level) to least specific (i.e. route configuration level). Later header mutations may override earlier mutations. This order can be reversed by setting this field to true. In other words, most specific level mutation is evaluated last.",
    "notImp": false
  },
  {
    "name": "validate_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "An optional boolean that specifies whether the clusters that the route table refers to will be validated by the cluster manager. If set to true and a route refers to a non-existent cluster, the route table will not load. If set to false and a route refers to a non-existent cluster, the route table will load and the router filter will return a 404 if the route is selected at runtime. This setting defaults to true if the route table is statically defined via the `route_config` option. This setting default to false if the route table is loaded dynamically via the `rds` option. Users may wish to override the default behavior in certain cases (for example when using CDS with a static route table).",
    "notImp": false
  },
  {
    "name": "max_direct_response_body_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum bytes of the response `direct response body` size. If not specified the default is 4096.\n\n:::warning\n\nEnvoy currently holds the content of `direct response body` in memory. Be careful setting this to be larger than the default 4KB, since the allocated memory for direct response body is not subject to data plane buffering controls.",
    "notImp": false
  },
  {
    "name": "cluster_specifier_plugins",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterSpecifierPlugin[]",
    "enums": null,
    "comment": "A list of plugins and their configurations which may be used by a `cluster specifier plugin name` within the route. All ``extension.name`` fields in this list must be unique.",
    "notImp": false
  },
  {
    "name": "request_mirror_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Specify a set of default request mirroring policies which apply to all routes under its virtual hosts. Note that policies are not merged, the most specific non-empty one becomes the mirror policies.",
    "notImp": false
  },
  {
    "name": "ignore_port_in_host_matching",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, port in `:authority` header (if any) is used in host matching. With this option enabled, Envoy will ignore the port number in the `:authority` header (if any) when picking VirtualHost. NOTE: this option will not strip the port number (if any) contained in route config `envoy_v3_api_msg_config.route.v3.VirtualHost`.domains field.",
    "notImp": false
  },
  {
    "name": "ignore_path_parameters_in_path_matching",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Ignore path-parameters in path-matching. Before RFC3986, URI were like(RFC1808): <scheme>://<net_loc>/<path>;<params>?<query>#<fragment> Envoy by default takes \":path\" as \"<path>;<params>\". For users who want to only match path on the \"<path>\" portion, this option should be true.",
    "notImp": false
  },
  {
    "name": "typed_per_filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "This field can be used to provide RouteConfiguration level per filter config. The key should match the `filter config name`. See `Http filter route specific config` for details.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "The metadata field can be used to provide additional information about the route configuration. It can be used for configuration, stats, and logging. The metadata should go under the filter namespace that will need it. For instance, if the metadata is intended for the Router filter, the filter name should be specified as ``envoy.filters.http.router``.",
    "notImp": false
  }
] };

export const RouteConfiguration_SingleFields = [
  "name",
  "internal_only_headers",
  "response_headers_to_remove",
  "request_headers_to_remove",
  "most_specific_header_mutations_wins",
  "validate_clusters",
  "max_direct_response_body_size_bytes",
  "ignore_port_in_host_matching",
  "ignore_path_parameters_in_path_matching"
];

export const RouteConfiguration_TypedPerFilterConfigEntry: OutType = { "RouteConfiguration_TypedPerFilterConfigEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RouteConfiguration_TypedPerFilterConfigEntry_SingleFields = [
  "key"
];