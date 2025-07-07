export const modelMap: { [relativePath: string]: () => Promise<{ [key: string]: any }> } = {
    'bazel/cc_proto_descriptor_library/testdata/test': () => import('./bazel/cc_proto_descriptor_library/testdata/test').then(module => ({
        'Foo': module.Foo
    })),
    'bazel/cc_proto_descriptor_library/testdata/test1': () => import('./bazel/cc_proto_descriptor_library/testdata/test1').then(module => ({
        'FooCopy': module.FooCopy
    })),
    'contrib/envoy/extensions/filters/http/squash/v3/squash': () => import('./contrib/envoy/extensions/filters/http/squash/v3/squash').then(module => ({
        'Squash': module.Squash
    })),
    'contrib/envoy/extensions/filters/network/client_ssl_auth/v3/client_ssl_auth': () => import('./contrib/envoy/extensions/filters/network/client_ssl_auth/v3/client_ssl_auth').then(module => ({
        'ClientSSLAuth': module.ClientSSLAuth
    })),
    'contrib/envoy/extensions/filters/network/kafka_broker/v3/kafka_broker': () => import('./contrib/envoy/extensions/filters/network/kafka_broker/v3/kafka_broker').then(module => ({
        'KafkaBroker': module.KafkaBroker,
        'IdBasedBrokerRewriteSpec': module.IdBasedBrokerRewriteSpec,
        'IdBasedBrokerRewriteRule': module.IdBasedBrokerRewriteRule
    })),
    'contrib/envoy/extensions/filters/network/mysql_proxy/v3/mysql_proxy': () => import('./contrib/envoy/extensions/filters/network/mysql_proxy/v3/mysql_proxy').then(module => ({
        'MySQLProxy': module.MySQLProxy
    })),
    'contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/rocketmq_proxy': () => import('./contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/rocketmq_proxy').then(module => ({
        'RocketmqProxy': module.RocketmqProxy
    })),
    'contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/route': () => import('./contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'RouteMatch': module.RouteMatch,
        'RouteAction': module.RouteAction,
        'Route': module.Route
    })),
    'envoy/admin/v3/certs': () => import('./envoy/admin/v3/certs').then(module => ({
        'Certificates': module.Certificates,
        'Certificate': module.Certificate,
        'CertificateDetails_OcspDetails': module.CertificateDetails_OcspDetails,
        'CertificateDetails': module.CertificateDetails,
        'SubjectAlternateName': module.SubjectAlternateName
    })),
    'envoy/admin/v3/clusters': () => import('./envoy/admin/v3/clusters').then(module => ({
        'Clusters': module.Clusters,
        'ClusterStatus': module.ClusterStatus,
        'HostHealthStatus': module.HostHealthStatus,
        'HostStatus': module.HostStatus
    })),
    'envoy/admin/v3/config_dump': () => import('./envoy/admin/v3/config_dump').then(module => ({
        'ConfigDump': module.ConfigDump,
        'BootstrapConfigDump': module.BootstrapConfigDump,
        'SecretsConfigDump': module.SecretsConfigDump,
        'SecretsConfigDump_DynamicSecret': module.SecretsConfigDump_DynamicSecret,
        'SecretsConfigDump_StaticSecret': module.SecretsConfigDump_StaticSecret
    })),
    'envoy/admin/v3/config_dump_shared': () => import('./envoy/admin/v3/config_dump_shared').then(module => ({
        'UpdateFailureState': module.UpdateFailureState,
        'ListenersConfigDump': module.ListenersConfigDump,
        'ListenersConfigDump_StaticListener': module.ListenersConfigDump_StaticListener,
        'ListenersConfigDump_DynamicListenerState': module.ListenersConfigDump_DynamicListenerState,
        'ListenersConfigDump_DynamicListener': module.ListenersConfigDump_DynamicListener,
        'ClustersConfigDump': module.ClustersConfigDump,
        'ClustersConfigDump_StaticCluster': module.ClustersConfigDump_StaticCluster,
        'ClustersConfigDump_DynamicCluster': module.ClustersConfigDump_DynamicCluster,
        'RoutesConfigDump': module.RoutesConfigDump,
        'RoutesConfigDump_StaticRouteConfig': module.RoutesConfigDump_StaticRouteConfig,
        'RoutesConfigDump_DynamicRouteConfig': module.RoutesConfigDump_DynamicRouteConfig,
        'ScopedRoutesConfigDump': module.ScopedRoutesConfigDump,
        'ScopedRoutesConfigDump_InlineScopedRouteConfigs': module.ScopedRoutesConfigDump_InlineScopedRouteConfigs,
        'ScopedRoutesConfigDump_DynamicScopedRouteConfigs': module.ScopedRoutesConfigDump_DynamicScopedRouteConfigs,
        'EndpointsConfigDump': module.EndpointsConfigDump,
        'EndpointsConfigDump_StaticEndpointConfig': module.EndpointsConfigDump_StaticEndpointConfig,
        'EndpointsConfigDump_DynamicEndpointConfig': module.EndpointsConfigDump_DynamicEndpointConfig,
        'EcdsConfigDump': module.EcdsConfigDump,
        'EcdsConfigDump_EcdsFilterConfig': module.EcdsConfigDump_EcdsFilterConfig
    })),
    'envoy/admin/v3/init_dump': () => import('./envoy/admin/v3/init_dump').then(module => ({
        'UnreadyTargetsDumps': module.UnreadyTargetsDumps,
        'UnreadyTargetsDumps_UnreadyTargetsDump': module.UnreadyTargetsDumps_UnreadyTargetsDump
    })),
    'envoy/admin/v3/listeners': () => import('./envoy/admin/v3/listeners').then(module => ({
        'Listeners': module.Listeners,
        'ListenerStatus': module.ListenerStatus
    })),
    'envoy/admin/v3/memory': () => import('./envoy/admin/v3/memory').then(module => ({
        'Memory': module.Memory
    })),
    'envoy/admin/v3/metrics': () => import('./envoy/admin/v3/metrics').then(module => ({
        'SimpleMetric': module.SimpleMetric
    })),
    'envoy/admin/v3/mutex_stats': () => import('./envoy/admin/v3/mutex_stats').then(module => ({
        'MutexStats': module.MutexStats
    })),
    'envoy/admin/v3/server_info': () => import('./envoy/admin/v3/server_info').then(module => ({
        'CommandLineOptions': module.CommandLineOptions,
        'ServerInfo': module.ServerInfo
    })),
    'envoy/admin/v3/tap': () => import('./envoy/admin/v3/tap').then(module => ({
        'TapRequest': module.TapRequest
    })),
    'envoy/annotations/resource': () => import('./envoy/annotations/resource').then(module => ({
        'ResourceAnnotation': module.ResourceAnnotation
    })),
    'envoy/config/accesslog/v3/accesslog': () => import('./envoy/config/accesslog/v3/accesslog').then(module => ({
        'AccessLogFilter': module.AccessLogFilter,
        'AccessLog': module.AccessLog,
        'ComparisonFilter': module.ComparisonFilter,
        'StatusCodeFilter': module.StatusCodeFilter,
        'DurationFilter': module.DurationFilter,
        'RuntimeFilter': module.RuntimeFilter,
        'AndFilter': module.AndFilter,
        'OrFilter': module.OrFilter,
        'HeaderFilter': module.HeaderFilter,
        'ResponseFlagFilter': module.ResponseFlagFilter,
        'GrpcStatusFilter': module.GrpcStatusFilter,
        'MetadataFilter': module.MetadataFilter,
        'LogTypeFilter': module.LogTypeFilter,
        'ExtensionFilter': module.ExtensionFilter
    })),
    'envoy/config/bootstrap/v3/bootstrap': () => import('./envoy/config/bootstrap/v3/bootstrap').then(module => ({
        'Bootstrap_StaticResources': module.Bootstrap_StaticResources,
        'Bootstrap_DynamicResources': module.Bootstrap_DynamicResources,
        'ClusterManager_OutlierDetection': module.ClusterManager_OutlierDetection,
        'ClusterManager': module.ClusterManager,
        'Bootstrap_DeferredStatOptions': module.Bootstrap_DeferredStatOptions,
        'Watchdog': module.Watchdog,
        'Watchdogs': module.Watchdogs,
        'LayeredRuntime': module.LayeredRuntime,
        'Admin': module.Admin,
        'Bootstrap_ApplicationLogConfig_LogFormat': module.Bootstrap_ApplicationLogConfig_LogFormat,
        'Bootstrap_ApplicationLogConfig': module.Bootstrap_ApplicationLogConfig,
        'Bootstrap_GrpcAsyncClientManagerConfig': module.Bootstrap_GrpcAsyncClientManagerConfig,
        'MemoryAllocatorManager': module.MemoryAllocatorManager,
        'Bootstrap': module.Bootstrap,
        'Bootstrap_CertificateProviderInstancesEntry': module.Bootstrap_CertificateProviderInstancesEntry,
        'Watchdog_WatchdogAction': module.Watchdog_WatchdogAction,
        'FatalAction': module.FatalAction,
        'Runtime': module.Runtime,
        'RuntimeLayer': module.RuntimeLayer,
        'RuntimeLayer_DiskLayer': module.RuntimeLayer_DiskLayer,
        'RuntimeLayer_RtdsLayer': module.RuntimeLayer_RtdsLayer,
        'CustomInlineHeader': module.CustomInlineHeader
    })),
    'envoy/config/cluster/redis/redis_cluster': () => import('./envoy/config/cluster/redis/redis_cluster').then(module => ({
        'RedisClusterConfig': module.RedisClusterConfig
    })),
    'envoy/config/cluster/v3/circuit_breaker': () => import('./envoy/config/cluster/v3/circuit_breaker').then(module => ({
        'CircuitBreakers': module.CircuitBreakers,
        'CircuitBreakers_Thresholds_RetryBudget': module.CircuitBreakers_Thresholds_RetryBudget,
        'CircuitBreakers_Thresholds': module.CircuitBreakers_Thresholds
    })),
    'envoy/config/cluster/v3/cluster': () => import('./envoy/config/cluster/v3/cluster').then(module => ({
        'ClusterCollection': module.ClusterCollection,
        'Cluster_EdsClusterConfig': module.Cluster_EdsClusterConfig,
        'Cluster_RefreshRate': module.Cluster_RefreshRate,
        'Cluster_LbSubsetConfig': module.Cluster_LbSubsetConfig,
        'Cluster_CommonLbConfig_ConsistentHashingLbConfig': module.Cluster_CommonLbConfig_ConsistentHashingLbConfig,
        'Cluster_CommonLbConfig': module.Cluster_CommonLbConfig,
        'UpstreamConnectionOptions_HappyEyeballsConfig': module.UpstreamConnectionOptions_HappyEyeballsConfig,
        'UpstreamConnectionOptions': module.UpstreamConnectionOptions,
        'LoadBalancingPolicy': module.LoadBalancingPolicy,
        'TrackClusterStats': module.TrackClusterStats,
        'Cluster_PreconnectPolicy': module.Cluster_PreconnectPolicy,
        'Cluster': module.Cluster,
        'Cluster_TransportSocketMatch': module.Cluster_TransportSocketMatch,
        'Cluster_CustomClusterType': module.Cluster_CustomClusterType,
        'Cluster_LbSubsetConfig_LbSubsetSelector': module.Cluster_LbSubsetConfig_LbSubsetSelector,
        'Cluster_SlowStartConfig': module.Cluster_SlowStartConfig,
        'Cluster_RoundRobinLbConfig': module.Cluster_RoundRobinLbConfig,
        'Cluster_LeastRequestLbConfig': module.Cluster_LeastRequestLbConfig,
        'Cluster_RingHashLbConfig': module.Cluster_RingHashLbConfig,
        'Cluster_MaglevLbConfig': module.Cluster_MaglevLbConfig,
        'Cluster_OriginalDstLbConfig': module.Cluster_OriginalDstLbConfig,
        'Cluster_CommonLbConfig_ZoneAwareLbConfig': module.Cluster_CommonLbConfig_ZoneAwareLbConfig,
        'Cluster_TypedExtensionProtocolOptionsEntry': module.Cluster_TypedExtensionProtocolOptionsEntry,
        'LoadBalancingPolicy_Policy': module.LoadBalancingPolicy_Policy
    })),
    'envoy/config/cluster/v3/filter': () => import('./envoy/config/cluster/v3/filter').then(module => ({
        'Filter': module.Filter
    })),
    'envoy/config/cluster/v3/outlier_detection': () => import('./envoy/config/cluster/v3/outlier_detection').then(module => ({
        'OutlierDetection': module.OutlierDetection
    })),
    'envoy/config/common/key_value/v3/config': () => import('./envoy/config/common/key_value/v3/config').then(module => ({
        'KeyValueStoreConfig': module.KeyValueStoreConfig
    })),
    'envoy/config/common/matcher/v3/matcher': () => import('./envoy/config/common/matcher/v3/matcher').then(module => ({
        'Matcher_OnMatch': module.Matcher_OnMatch,
        'Matcher': module.Matcher,
        'Matcher_MatcherList': module.Matcher_MatcherList,
        'Matcher_MatcherList_Predicate': module.Matcher_MatcherList_Predicate,
        'Matcher_MatcherList_Predicate_SinglePredicate': module.Matcher_MatcherList_Predicate_SinglePredicate,
        'Matcher_MatcherList_Predicate_PredicateList': module.Matcher_MatcherList_Predicate_PredicateList,
        'Matcher_MatcherList_FieldMatcher': module.Matcher_MatcherList_FieldMatcher,
        'Matcher_MatcherTree': module.Matcher_MatcherTree,
        'Matcher_MatcherTree_MatchMap': module.Matcher_MatcherTree_MatchMap,
        'Matcher_MatcherTree_MatchMap_MapEntry': module.Matcher_MatcherTree_MatchMap_MapEntry,
        'MatchPredicate': module.MatchPredicate,
        'MatchPredicate_MatchSet': module.MatchPredicate_MatchSet,
        'HttpHeadersMatch': module.HttpHeadersMatch,
        'HttpGenericBodyMatch': module.HttpGenericBodyMatch,
        'HttpGenericBodyMatch_GenericTextMatch': module.HttpGenericBodyMatch_GenericTextMatch
    })),
    'envoy/config/common/mutation_rules/v3/mutation_rules': () => import('./envoy/config/common/mutation_rules/v3/mutation_rules').then(module => ({
        'HeaderMutationRules': module.HeaderMutationRules,
        'HeaderMutation': module.HeaderMutation
    })),
    'envoy/config/core/v3/address': () => import('./envoy/config/core/v3/address').then(module => ({
        'Pipe': module.Pipe,
        'EnvoyInternalAddress': module.EnvoyInternalAddress,
        'SocketAddress': module.SocketAddress,
        'TcpKeepalive': module.TcpKeepalive,
        'ExtraSourceAddress': module.ExtraSourceAddress,
        'BindConfig': module.BindConfig,
        'Address': module.Address,
        'CidrRange': module.CidrRange
    })),
    'envoy/config/core/v3/backoff': () => import('./envoy/config/core/v3/backoff').then(module => ({
        'BackoffStrategy': module.BackoffStrategy
    })),
    'envoy/config/core/v3/base': () => import('./envoy/config/core/v3/base').then(module => ({
        'Locality': module.Locality,
        'BuildVersion': module.BuildVersion,
        'Extension': module.Extension,
        'Node': module.Node,
        'Node_DynamicParametersEntry': module.Node_DynamicParametersEntry,
        'Metadata': module.Metadata,
        'Metadata_FilterMetadataEntry': module.Metadata_FilterMetadataEntry,
        'Metadata_TypedFilterMetadataEntry': module.Metadata_TypedFilterMetadataEntry,
        'RuntimeUInt32': module.RuntimeUInt32,
        'RuntimePercent': module.RuntimePercent,
        'RuntimeDouble': module.RuntimeDouble,
        'RuntimeFeatureFlag': module.RuntimeFeatureFlag,
        'KeyValue': module.KeyValue,
        'KeyValuePair': module.KeyValuePair,
        'KeyValueAppend': module.KeyValueAppend,
        'KeyValueMutation': module.KeyValueMutation,
        'QueryParameter': module.QueryParameter,
        'HeaderValue': module.HeaderValue,
        'HeaderValueOption': module.HeaderValueOption,
        'HeaderMap': module.HeaderMap,
        'WatchedDirectory': module.WatchedDirectory,
        'DataSource': module.DataSource,
        'RetryPolicy_RetryPriority': module.RetryPolicy_RetryPriority,
        'RetryPolicy': module.RetryPolicy,
        'RetryPolicy_RetryHostPredicate': module.RetryPolicy_RetryHostPredicate,
        'RemoteDataSource': module.RemoteDataSource,
        'AsyncDataSource': module.AsyncDataSource,
        'TransportSocket': module.TransportSocket,
        'RuntimeFractionalPercent': module.RuntimeFractionalPercent,
        'ControlPlane': module.ControlPlane
    })),
    'envoy/config/core/v3/config_source': () => import('./envoy/config/core/v3/config_source').then(module => ({
        'RateLimitSettings': module.RateLimitSettings,
        'ApiConfigSource': module.ApiConfigSource,
        'SelfConfigSource': module.SelfConfigSource,
        'PathConfigSource': module.PathConfigSource,
        'ConfigSource': module.ConfigSource,
        'ExtensionConfigSource': module.ExtensionConfigSource
    })),
    'envoy/config/core/v3/event_service_config': () => import('./envoy/config/core/v3/event_service_config').then(module => ({
        'EventServiceConfig': module.EventServiceConfig
    })),
    'envoy/config/core/v3/extension': () => import('./envoy/config/core/v3/extension').then(module => ({
        'TypedExtensionConfig': module.TypedExtensionConfig
    })),
    'envoy/config/core/v3/grpc_method_list': () => import('./envoy/config/core/v3/grpc_method_list').then(module => ({
        'GrpcMethodList': module.GrpcMethodList,
        'GrpcMethodList_Service': module.GrpcMethodList_Service
    })),
    'envoy/config/core/v3/grpc_service': () => import('./envoy/config/core/v3/grpc_service').then(module => ({
        'GrpcService': module.GrpcService,
        'GrpcService_EnvoyGrpc': module.GrpcService_EnvoyGrpc,
        'GrpcService_GoogleGrpc_ChannelCredentials': module.GrpcService_GoogleGrpc_ChannelCredentials,
        'GrpcService_GoogleGrpc_ChannelArgs': module.GrpcService_GoogleGrpc_ChannelArgs,
        'GrpcService_GoogleGrpc': module.GrpcService_GoogleGrpc,
        'GrpcService_GoogleGrpc_SslCredentials': module.GrpcService_GoogleGrpc_SslCredentials,
        'GrpcService_GoogleGrpc_CallCredentials': module.GrpcService_GoogleGrpc_CallCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials': module.GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials': module.GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin': module.GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin,
        'GrpcService_GoogleGrpc_CallCredentials_StsService': module.GrpcService_GoogleGrpc_CallCredentials_StsService,
        'GrpcService_GoogleGrpc_ChannelArgs_Value': module.GrpcService_GoogleGrpc_ChannelArgs_Value,
        'GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry': module.GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry
    })),
    'envoy/config/core/v3/health_check': () => import('./envoy/config/core/v3/health_check').then(module => ({
        'HealthStatusSet': module.HealthStatusSet,
        'HealthCheck_TlsOptions': module.HealthCheck_TlsOptions,
        'HealthCheck': module.HealthCheck,
        'HealthCheck_Payload': module.HealthCheck_Payload,
        'HealthCheck_HttpHealthCheck': module.HealthCheck_HttpHealthCheck,
        'HealthCheck_TcpHealthCheck': module.HealthCheck_TcpHealthCheck,
        'HealthCheck_RedisHealthCheck': module.HealthCheck_RedisHealthCheck,
        'HealthCheck_GrpcHealthCheck': module.HealthCheck_GrpcHealthCheck,
        'HealthCheck_CustomHealthCheck': module.HealthCheck_CustomHealthCheck
    })),
    'envoy/config/core/v3/http_service': () => import('./envoy/config/core/v3/http_service').then(module => ({
        'HttpService': module.HttpService
    })),
    'envoy/config/core/v3/http_uri': () => import('./envoy/config/core/v3/http_uri').then(module => ({
        'HttpUri': module.HttpUri
    })),
    'envoy/config/core/v3/protocol': () => import('./envoy/config/core/v3/protocol').then(module => ({
        'QuicKeepAliveSettings': module.QuicKeepAliveSettings,
        'QuicProtocolOptions': module.QuicProtocolOptions,
        'UpstreamHttpProtocolOptions': module.UpstreamHttpProtocolOptions,
        'AlternateProtocolsCacheOptions': module.AlternateProtocolsCacheOptions,
        'AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry': module.AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry,
        'HttpProtocolOptions': module.HttpProtocolOptions,
        'Http1ProtocolOptions_HeaderKeyFormat': module.Http1ProtocolOptions_HeaderKeyFormat,
        'Http1ProtocolOptions': module.Http1ProtocolOptions,
        'KeepaliveSettings': module.KeepaliveSettings,
        'Http2ProtocolOptions': module.Http2ProtocolOptions,
        'Http2ProtocolOptions_SettingsParameter': module.Http2ProtocolOptions_SettingsParameter,
        'GrpcProtocolOptions': module.GrpcProtocolOptions,
        'Http3ProtocolOptions': module.Http3ProtocolOptions,
        'SchemeHeaderTransformation': module.SchemeHeaderTransformation
    })),
    'envoy/config/core/v3/proxy_protocol': () => import('./envoy/config/core/v3/proxy_protocol').then(module => ({
        'ProxyProtocolPassThroughTLVs': module.ProxyProtocolPassThroughTLVs,
        'ProxyProtocolConfig': module.ProxyProtocolConfig
    })),
    'envoy/config/core/v3/resolver': () => import('./envoy/config/core/v3/resolver').then(module => ({
        'DnsResolverOptions': module.DnsResolverOptions,
        'DnsResolutionConfig': module.DnsResolutionConfig
    })),
    'envoy/config/core/v3/socket_cmsg_headers': () => import('./envoy/config/core/v3/socket_cmsg_headers').then(module => ({
        'SocketCmsgHeaders': module.SocketCmsgHeaders
    })),
    'envoy/config/core/v3/socket_option': () => import('./envoy/config/core/v3/socket_option').then(module => ({
        'SocketOption_SocketType': module.SocketOption_SocketType,
        'SocketOption': module.SocketOption,
        'SocketOptionsOverride': module.SocketOptionsOverride
    })),
    'envoy/config/core/v3/substitution_format_string': () => import('./envoy/config/core/v3/substitution_format_string').then(module => ({
        'JsonFormatOptions': module.JsonFormatOptions,
        'SubstitutionFormatString': module.SubstitutionFormatString
    })),
    'envoy/config/core/v3/udp_socket_config': () => import('./envoy/config/core/v3/udp_socket_config').then(module => ({
        'UdpSocketConfig': module.UdpSocketConfig
    })),
    'envoy/config/endpoint/v3/endpoint': () => import('./envoy/config/endpoint/v3/endpoint').then(module => ({
        'ClusterLoadAssignment_Policy': module.ClusterLoadAssignment_Policy,
        'ClusterLoadAssignment': module.ClusterLoadAssignment,
        'ClusterLoadAssignment_Policy_DropOverload': module.ClusterLoadAssignment_Policy_DropOverload,
        'ClusterLoadAssignment_NamedEndpointsEntry': module.ClusterLoadAssignment_NamedEndpointsEntry
    })),
    'envoy/config/endpoint/v3/endpoint_components': () => import('./envoy/config/endpoint/v3/endpoint_components').then(module => ({
        'Endpoint_HealthCheckConfig': module.Endpoint_HealthCheckConfig,
        'Endpoint': module.Endpoint,
        'Endpoint_AdditionalAddress': module.Endpoint_AdditionalAddress,
        'LbEndpoint': module.LbEndpoint,
        'LedsClusterLocalityConfig': module.LedsClusterLocalityConfig,
        'LocalityLbEndpoints': module.LocalityLbEndpoints,
        'LocalityLbEndpoints_LbEndpointList': module.LocalityLbEndpoints_LbEndpointList
    })),
    'envoy/config/endpoint/v3/load_report': () => import('./envoy/config/endpoint/v3/load_report').then(module => ({
        'UnnamedEndpointLoadMetricStats': module.UnnamedEndpointLoadMetricStats,
        'UpstreamLocalityStats': module.UpstreamLocalityStats,
        'UpstreamEndpointStats': module.UpstreamEndpointStats,
        'EndpointLoadMetricStats': module.EndpointLoadMetricStats,
        'ClusterStats': module.ClusterStats,
        'ClusterStats_DroppedRequests': module.ClusterStats_DroppedRequests
    })),
    'envoy/config/filter/network/mysql_proxy/v1alpha1/mysql_proxy': () => import('./envoy/config/filter/network/mysql_proxy/v1alpha1/mysql_proxy').then(module => ({
        'MySQLProxy': module.MySQLProxy
    })),
    'envoy/config/filter/network/zookeeper_proxy/v1alpha1/zookeeper_proxy': () => import('./envoy/config/filter/network/zookeeper_proxy/v1alpha1/zookeeper_proxy').then(module => ({
        'ZooKeeperProxy': module.ZooKeeperProxy
    })),
    'envoy/config/grpc_credential/v3/aws_iam': () => import('./envoy/config/grpc_credential/v3/aws_iam').then(module => ({
        'AwsIamConfig': module.AwsIamConfig
    })),
    'envoy/config/grpc_credential/v3/file_based_metadata': () => import('./envoy/config/grpc_credential/v3/file_based_metadata').then(module => ({
        'FileBasedMetadataConfig': module.FileBasedMetadataConfig
    })),
    'envoy/config/listener/v3/api_listener': () => import('./envoy/config/listener/v3/api_listener').then(module => ({
        'ApiListener': module.ApiListener
    })),
    'envoy/config/listener/v3/listener': () => import('./envoy/config/listener/v3/listener').then(module => ({
        'AdditionalAddress': module.AdditionalAddress,
        'ListenerCollection': module.ListenerCollection,
        'Listener_DeprecatedV1': module.Listener_DeprecatedV1,
        'Listener_ConnectionBalanceConfig': module.Listener_ConnectionBalanceConfig,
        'Listener': module.Listener
    })),
    'envoy/config/listener/v3/listener_components': () => import('./envoy/config/listener/v3/listener_components').then(module => ({
        'Filter': module.Filter,
        'FilterChainMatch': module.FilterChainMatch,
        'FilterChain': module.FilterChain,
        'ListenerFilterChainMatchPredicate': module.ListenerFilterChainMatchPredicate,
        'ListenerFilterChainMatchPredicate_MatchSet': module.ListenerFilterChainMatchPredicate_MatchSet,
        'ListenerFilter': module.ListenerFilter
    })),
    'envoy/config/listener/v3/quic_config': () => import('./envoy/config/listener/v3/quic_config').then(module => ({
        'QuicProtocolOptions': module.QuicProtocolOptions
    })),
    'envoy/config/listener/v3/udp_listener_config': () => import('./envoy/config/listener/v3/udp_listener_config').then(module => ({
        'UdpListenerConfig': module.UdpListenerConfig
    })),
    'envoy/config/metrics/v3/metrics_service': () => import('./envoy/config/metrics/v3/metrics_service').then(module => ({
        'MetricsServiceConfig': module.MetricsServiceConfig
    })),
    'envoy/config/metrics/v3/stats': () => import('./envoy/config/metrics/v3/stats').then(module => ({
        'StatsSink': module.StatsSink,
        'StatsMatcher': module.StatsMatcher,
        'StatsConfig': module.StatsConfig,
        'TagSpecifier': module.TagSpecifier,
        'HistogramBucketSettings': module.HistogramBucketSettings,
        'StatsdSink': module.StatsdSink,
        'DogStatsdSink': module.DogStatsdSink,
        'HystrixSink': module.HystrixSink
    })),
    'envoy/config/overload/v3/overload': () => import('./envoy/config/overload/v3/overload').then(module => ({
        'ResourceMonitor': module.ResourceMonitor,
        'ThresholdTrigger': module.ThresholdTrigger,
        'ScaledTrigger': module.ScaledTrigger,
        'Trigger': module.Trigger,
        'ScaleTimersOverloadActionConfig': module.ScaleTimersOverloadActionConfig,
        'ScaleTimersOverloadActionConfig_ScaleTimer': module.ScaleTimersOverloadActionConfig_ScaleTimer,
        'OverloadAction': module.OverloadAction,
        'LoadShedPoint': module.LoadShedPoint,
        'BufferFactoryConfig': module.BufferFactoryConfig,
        'OverloadManager': module.OverloadManager
    })),
    'envoy/config/ratelimit/v3/rls': () => import('./envoy/config/ratelimit/v3/rls').then(module => ({
        'RateLimitServiceConfig': module.RateLimitServiceConfig
    })),
    'envoy/config/rbac/v3/rbac': () => import('./envoy/config/rbac/v3/rbac').then(module => ({
        'RBAC_AuditLoggingOptions': module.RBAC_AuditLoggingOptions,
        'RBAC': module.RBAC,
        'RBAC_AuditLoggingOptions_AuditLoggerConfig': module.RBAC_AuditLoggingOptions_AuditLoggerConfig,
        'Policy': module.Policy,
        'RBAC_PoliciesEntry': module.RBAC_PoliciesEntry,
        'SourcedMetadata': module.SourcedMetadata,
        'Permission': module.Permission,
        'Permission_Set': module.Permission_Set,
        'Principal': module.Principal,
        'Principal_Set': module.Principal_Set,
        'Principal_Authenticated': module.Principal_Authenticated,
        'Action': module.Action
    })),
    'envoy/config/retry/previous_priorities/previous_priorities_config': () => import('./envoy/config/retry/previous_priorities/previous_priorities_config').then(module => ({
        'PreviousPrioritiesConfig': module.PreviousPrioritiesConfig
    })),
    'envoy/config/route/v3/route': () => import('./envoy/config/route/v3/route').then(module => ({
        'Vhds': module.Vhds,
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_TypedPerFilterConfigEntry': module.RouteConfiguration_TypedPerFilterConfigEntry
    })),
    'envoy/config/route/v3/route_components': () => import('./envoy/config/route/v3/route_components').then(module => ({
        'CorsPolicy': module.CorsPolicy,
        'RetryPolicy_RetryPriority': module.RetryPolicy_RetryPriority,
        'RetryPolicy_RetryBackOff': module.RetryPolicy_RetryBackOff,
        'RetryPolicy_RateLimitedRetryBackOff': module.RetryPolicy_RateLimitedRetryBackOff,
        'RetryPolicy': module.RetryPolicy,
        'HedgePolicy': module.HedgePolicy,
        'VirtualHost': module.VirtualHost,
        'VirtualHost_TypedPerFilterConfigEntry': module.VirtualHost_TypedPerFilterConfigEntry,
        'FilterAction': module.FilterAction,
        'RouteList': module.RouteList,
        'RouteMatch_TlsContextMatchOptions': module.RouteMatch_TlsContextMatchOptions,
        'RouteMatch': module.RouteMatch,
        'Decorator': module.Decorator,
        'Tracing': module.Tracing,
        'Route': module.Route,
        'Route_TypedPerFilterConfigEntry': module.Route_TypedPerFilterConfigEntry,
        'WeightedCluster': module.WeightedCluster,
        'WeightedCluster_ClusterWeight': module.WeightedCluster_ClusterWeight,
        'WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry': module.WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry,
        'ClusterSpecifierPlugin': module.ClusterSpecifierPlugin,
        'InternalRedirectPolicy': module.InternalRedirectPolicy,
        'RouteAction_MaxStreamDuration': module.RouteAction_MaxStreamDuration,
        'RouteAction': module.RouteAction,
        'RouteAction_RequestMirrorPolicy': module.RouteAction_RequestMirrorPolicy,
        'RouteAction_HashPolicy': module.RouteAction_HashPolicy,
        'RouteAction_HashPolicy_Header': module.RouteAction_HashPolicy_Header,
        'RouteAction_HashPolicy_CookieAttribute': module.RouteAction_HashPolicy_CookieAttribute,
        'RouteAction_HashPolicy_Cookie': module.RouteAction_HashPolicy_Cookie,
        'RouteAction_HashPolicy_ConnectionProperties': module.RouteAction_HashPolicy_ConnectionProperties,
        'RouteAction_HashPolicy_QueryParameter': module.RouteAction_HashPolicy_QueryParameter,
        'RouteAction_HashPolicy_FilterState': module.RouteAction_HashPolicy_FilterState,
        'RouteAction_UpgradeConfig_ConnectConfig': module.RouteAction_UpgradeConfig_ConnectConfig,
        'RouteAction_UpgradeConfig': module.RouteAction_UpgradeConfig,
        'RetryPolicy_RetryHostPredicate': module.RetryPolicy_RetryHostPredicate,
        'RetryPolicy_ResetHeader': module.RetryPolicy_ResetHeader,
        'RedirectAction': module.RedirectAction,
        'DirectResponseAction': module.DirectResponseAction,
        'VirtualCluster': module.VirtualCluster,
        'RateLimit_Override': module.RateLimit_Override,
        'RateLimit_HitsAddend': module.RateLimit_HitsAddend,
        'RateLimit': module.RateLimit,
        'RateLimit_Action': module.RateLimit_Action,
        'RateLimit_Action_RequestHeaders': module.RateLimit_Action_RequestHeaders,
        'RateLimit_Action_QueryParameters': module.RateLimit_Action_QueryParameters,
        'RateLimit_Action_MaskedRemoteAddress': module.RateLimit_Action_MaskedRemoteAddress,
        'RateLimit_Action_GenericKey': module.RateLimit_Action_GenericKey,
        'RateLimit_Action_HeaderValueMatch': module.RateLimit_Action_HeaderValueMatch,
        'RateLimit_Action_DynamicMetaData': module.RateLimit_Action_DynamicMetaData,
        'RateLimit_Action_MetaData': module.RateLimit_Action_MetaData,
        'RateLimit_Action_QueryParameterValueMatch': module.RateLimit_Action_QueryParameterValueMatch,
        'RateLimit_Override_DynamicMetadata': module.RateLimit_Override_DynamicMetadata,
        'HeaderMatcher': module.HeaderMatcher,
        'QueryParameterMatcher': module.QueryParameterMatcher,
        'FilterConfig': module.FilterConfig
    })),
    'envoy/config/route/v3/scoped_route': () => import('./envoy/config/route/v3/scoped_route').then(module => ({
        'ScopedRouteConfiguration_Key': module.ScopedRouteConfiguration_Key,
        'ScopedRouteConfiguration': module.ScopedRouteConfiguration,
        'ScopedRouteConfiguration_Key_Fragment': module.ScopedRouteConfiguration_Key_Fragment
    })),
    'envoy/config/tap/v3/common': () => import('./envoy/config/tap/v3/common').then(module => ({
        'MatchPredicate': module.MatchPredicate,
        'OutputConfig': module.OutputConfig,
        'TapConfig': module.TapConfig,
        'MatchPredicate_MatchSet': module.MatchPredicate_MatchSet,
        'HttpHeadersMatch': module.HttpHeadersMatch,
        'HttpGenericBodyMatch': module.HttpGenericBodyMatch,
        'HttpGenericBodyMatch_GenericTextMatch': module.HttpGenericBodyMatch_GenericTextMatch,
        'OutputSink': module.OutputSink,
        'BufferedAdminSink': module.BufferedAdminSink,
        'FilePerTapSink': module.FilePerTapSink,
        'StreamingGrpcSink': module.StreamingGrpcSink
    })),
    'envoy/config/trace/v3/datadog': () => import('./envoy/config/trace/v3/datadog').then(module => ({
        'DatadogRemoteConfig': module.DatadogRemoteConfig,
        'DatadogConfig': module.DatadogConfig
    })),
    'envoy/config/trace/v3/dynamic_ot': () => import('./envoy/config/trace/v3/dynamic_ot').then(module => ({
        'DynamicOtConfig': module.DynamicOtConfig
    })),
    'envoy/config/trace/v3/http_tracer': () => import('./envoy/config/trace/v3/http_tracer').then(module => ({
        'Tracing_Http': module.Tracing_Http,
        'Tracing': module.Tracing
    })),
    'envoy/config/trace/v3/lightstep': () => import('./envoy/config/trace/v3/lightstep').then(module => ({
        'LightstepConfig': module.LightstepConfig
    })),
    'envoy/config/trace/v3/opentelemetry': () => import('./envoy/config/trace/v3/opentelemetry').then(module => ({
        'OpenTelemetryConfig': module.OpenTelemetryConfig
    })),
    'envoy/config/trace/v3/service': () => import('./envoy/config/trace/v3/service').then(module => ({
        'TraceServiceConfig': module.TraceServiceConfig
    })),
    'envoy/config/trace/v3/skywalking': () => import('./envoy/config/trace/v3/skywalking').then(module => ({
        'ClientConfig': module.ClientConfig,
        'SkyWalkingConfig': module.SkyWalkingConfig
    })),
    'envoy/config/trace/v3/xray': () => import('./envoy/config/trace/v3/xray').then(module => ({
        'XRayConfig_SegmentFields': module.XRayConfig_SegmentFields,
        'XRayConfig': module.XRayConfig
    })),
    'envoy/config/trace/v3/zipkin': () => import('./envoy/config/trace/v3/zipkin').then(module => ({
        'ZipkinConfig': module.ZipkinConfig
    })),
    'envoy/data/accesslog/v3/accesslog': () => import('./envoy/data/accesslog/v3/accesslog').then(module => ({
        'TLSProperties_CertificateProperties': module.TLSProperties_CertificateProperties,
        'TLSProperties': module.TLSProperties,
        'ResponseFlags_Unauthorized': module.ResponseFlags_Unauthorized,
        'ResponseFlags': module.ResponseFlags,
        'AccessLogCommon': module.AccessLogCommon,
        'ConnectionProperties': module.ConnectionProperties,
        'TCPAccessLogEntry': module.TCPAccessLogEntry,
        'HTTPRequestProperties': module.HTTPRequestProperties,
        'HTTPResponseProperties': module.HTTPResponseProperties,
        'HTTPAccessLogEntry': module.HTTPAccessLogEntry,
        'AccessLogCommon_FilterStateObjectsEntry': module.AccessLogCommon_FilterStateObjectsEntry,
        'AccessLogCommon_CustomTagsEntry': module.AccessLogCommon_CustomTagsEntry,
        'TLSProperties_CertificateProperties_SubjectAltName': module.TLSProperties_CertificateProperties_SubjectAltName,
        'HTTPRequestProperties_RequestHeadersEntry': module.HTTPRequestProperties_RequestHeadersEntry,
        'HTTPResponseProperties_ResponseHeadersEntry': module.HTTPResponseProperties_ResponseHeadersEntry,
        'HTTPResponseProperties_ResponseTrailersEntry': module.HTTPResponseProperties_ResponseTrailersEntry
    })),
    'envoy/data/cluster/v3/outlier_detection_event': () => import('./envoy/data/cluster/v3/outlier_detection_event').then(module => ({
        'OutlierDetectionEvent': module.OutlierDetectionEvent,
        'OutlierEjectSuccessRate': module.OutlierEjectSuccessRate,
        'OutlierEjectFailurePercentage': module.OutlierEjectFailurePercentage
    })),
    'envoy/data/core/v3/health_check_event': () => import('./envoy/data/core/v3/health_check_event').then(module => ({
        'HealthCheckEvent': module.HealthCheckEvent,
        'HealthCheckEjectUnhealthy': module.HealthCheckEjectUnhealthy,
        'HealthCheckAddHealthy': module.HealthCheckAddHealthy,
        'HealthCheckFailure': module.HealthCheckFailure
    })),
    'envoy/data/core/v3/tlv_metadata': () => import('./envoy/data/core/v3/tlv_metadata').then(module => ({
        'TlvsMetadata': module.TlvsMetadata,
        'TlvsMetadata_TypedMetadataEntry': module.TlvsMetadata_TypedMetadataEntry
    })),
    'envoy/data/dns/v3/dns_table': () => import('./envoy/data/dns/v3/dns_table').then(module => ({
        'DnsTable': module.DnsTable,
        'DnsTable_AddressList': module.DnsTable_AddressList,
        'DnsTable_DnsServiceProtocol': module.DnsTable_DnsServiceProtocol,
        'DnsTable_DnsServiceTarget': module.DnsTable_DnsServiceTarget,
        'DnsTable_DnsService': module.DnsTable_DnsService,
        'DnsTable_DnsServiceList': module.DnsTable_DnsServiceList,
        'DnsTable_DnsEndpoint': module.DnsTable_DnsEndpoint,
        'DnsTable_DnsVirtualDomain': module.DnsTable_DnsVirtualDomain
    })),
    'envoy/data/tap/v3/common': () => import('./envoy/data/tap/v3/common').then(module => ({
        'Body': module.Body,
        'Connection': module.Connection
    })),
    'envoy/data/tap/v3/http': () => import('./envoy/data/tap/v3/http').then(module => ({
        'HttpBufferedTrace_Message': module.HttpBufferedTrace_Message,
        'HttpBufferedTrace': module.HttpBufferedTrace,
        'HttpStreamedTraceSegment': module.HttpStreamedTraceSegment
    })),
    'envoy/data/tap/v3/transport': () => import('./envoy/data/tap/v3/transport').then(module => ({
        'SocketEvent': module.SocketEvent,
        'SocketEvent_Read': module.SocketEvent_Read,
        'SocketEvent_Write': module.SocketEvent_Write,
        'SocketBufferedTrace': module.SocketBufferedTrace,
        'SocketStreamedTraceSegment': module.SocketStreamedTraceSegment
    })),
    'envoy/data/tap/v3/wrapper': () => import('./envoy/data/tap/v3/wrapper').then(module => ({
        'TraceWrapper': module.TraceWrapper
    })),
    'envoy/extensions/access_loggers/file/v3/file': () => import('./envoy/extensions/access_loggers/file/v3/file').then(module => ({
        'FileAccessLog': module.FileAccessLog
    })),
    'envoy/extensions/access_loggers/filters/cel/v3/cel': () => import('./envoy/extensions/access_loggers/filters/cel/v3/cel').then(module => ({
        'ExpressionFilter': module.ExpressionFilter
    })),
    'envoy/extensions/access_loggers/fluentd/v3/fluentd': () => import('./envoy/extensions/access_loggers/fluentd/v3/fluentd').then(module => ({
        'FluentdAccessLogConfig_RetryOptions': module.FluentdAccessLogConfig_RetryOptions,
        'FluentdAccessLogConfig': module.FluentdAccessLogConfig
    })),
    'envoy/extensions/access_loggers/grpc/v3/als': () => import('./envoy/extensions/access_loggers/grpc/v3/als').then(module => ({
        'CommonGrpcAccessLogConfig': module.CommonGrpcAccessLogConfig,
        'HttpGrpcAccessLogConfig': module.HttpGrpcAccessLogConfig,
        'TcpGrpcAccessLogConfig': module.TcpGrpcAccessLogConfig
    })),
    'envoy/extensions/access_loggers/open_telemetry/v3/logs_service': () => import('./envoy/extensions/access_loggers/open_telemetry/v3/logs_service').then(module => ({
        'OpenTelemetryAccessLogConfig': module.OpenTelemetryAccessLogConfig
    })),
    'envoy/extensions/access_loggers/stream/v3/stream': () => import('./envoy/extensions/access_loggers/stream/v3/stream').then(module => ({
        'StdoutAccessLog': module.StdoutAccessLog,
        'StderrAccessLog': module.StderrAccessLog
    })),
    'envoy/extensions/access_loggers/wasm/v3/wasm': () => import('./envoy/extensions/access_loggers/wasm/v3/wasm').then(module => ({
        'WasmAccessLog': module.WasmAccessLog
    })),
    'envoy/extensions/bootstrap/internal_listener/v3/internal_listener': () => import('./envoy/extensions/bootstrap/internal_listener/v3/internal_listener').then(module => ({
        'InternalListener': module.InternalListener
    })),
    'envoy/extensions/clusters/aggregate/v3/cluster': () => import('./envoy/extensions/clusters/aggregate/v3/cluster').then(module => ({
        'ClusterConfig': module.ClusterConfig
    })),
    'envoy/extensions/clusters/dns/v3/dns_cluster': () => import('./envoy/extensions/clusters/dns/v3/dns_cluster').then(module => ({
        'DnsCluster_RefreshRate': module.DnsCluster_RefreshRate,
        'DnsCluster': module.DnsCluster
    })),
    'envoy/extensions/clusters/dynamic_forward_proxy/v3/cluster': () => import('./envoy/extensions/clusters/dynamic_forward_proxy/v3/cluster').then(module => ({
        'ClusterConfig': module.ClusterConfig,
        'SubClustersConfig': module.SubClustersConfig
    })),
    'envoy/extensions/clusters/redis/v3/redis_cluster': () => import('./envoy/extensions/clusters/redis/v3/redis_cluster').then(module => ({
        'RedisClusterConfig': module.RedisClusterConfig
    })),
    'envoy/extensions/common/async_files/v3/async_file_manager': () => import('./envoy/extensions/common/async_files/v3/async_file_manager').then(module => ({
        'AsyncFileManagerConfig': module.AsyncFileManagerConfig,
        'AsyncFileManagerConfig_ThreadPool': module.AsyncFileManagerConfig_ThreadPool
    })),
    'envoy/extensions/common/aws/v3/credential_provider': () => import('./envoy/extensions/common/aws/v3/credential_provider').then(module => ({
        'AssumeRoleWithWebIdentityCredentialProvider': module.AssumeRoleWithWebIdentityCredentialProvider,
        'InlineCredentialProvider': module.InlineCredentialProvider,
        'CredentialsFileCredentialProvider': module.CredentialsFileCredentialProvider,
        'AwsCredentialProvider': module.AwsCredentialProvider
    })),
    'envoy/extensions/common/dynamic_forward_proxy/v3/dns_cache': () => import('./envoy/extensions/common/dynamic_forward_proxy/v3/dns_cache').then(module => ({
        'DnsCacheCircuitBreakers': module.DnsCacheCircuitBreakers,
        'DnsCacheConfig': module.DnsCacheConfig
    })),
    'envoy/extensions/common/matching/v3/extension_matcher': () => import('./envoy/extensions/common/matching/v3/extension_matcher').then(module => ({
        'ExtensionWithMatcher': module.ExtensionWithMatcher,
        'ExtensionWithMatcherPerRoute': module.ExtensionWithMatcherPerRoute
    })),
    'envoy/extensions/common/ratelimit/v3/ratelimit': () => import('./envoy/extensions/common/ratelimit/v3/ratelimit').then(module => ({
        'RateLimitDescriptor_RateLimitOverride': module.RateLimitDescriptor_RateLimitOverride,
        'RateLimitDescriptor': module.RateLimitDescriptor,
        'RateLimitDescriptor_Entry': module.RateLimitDescriptor_Entry,
        'LocalRateLimitDescriptor': module.LocalRateLimitDescriptor
    })),
    'envoy/extensions/common/tap/v3/common': () => import('./envoy/extensions/common/tap/v3/common').then(module => ({
        'CommonExtensionConfig': module.CommonExtensionConfig,
        'AdminConfig': module.AdminConfig
    })),
    'envoy/extensions/compression/brotli/compressor/v3/brotli': () => import('./envoy/extensions/compression/brotli/compressor/v3/brotli').then(module => ({
        'Brotli': module.Brotli
    })),
    'envoy/extensions/compression/brotli/decompressor/v3/brotli': () => import('./envoy/extensions/compression/brotli/decompressor/v3/brotli').then(module => ({
        'Brotli': module.Brotli
    })),
    'envoy/extensions/compression/gzip/compressor/v3/gzip': () => import('./envoy/extensions/compression/gzip/compressor/v3/gzip').then(module => ({
        'Gzip': module.Gzip
    })),
    'envoy/extensions/compression/gzip/decompressor/v3/gzip': () => import('./envoy/extensions/compression/gzip/decompressor/v3/gzip').then(module => ({
        'Gzip': module.Gzip
    })),
    'envoy/extensions/compression/zstd/compressor/v3/zstd': () => import('./envoy/extensions/compression/zstd/compressor/v3/zstd').then(module => ({
        'Zstd': module.Zstd
    })),
    'envoy/extensions/compression/zstd/decompressor/v3/zstd': () => import('./envoy/extensions/compression/zstd/decompressor/v3/zstd').then(module => ({
        'Zstd': module.Zstd
    })),
    'envoy/extensions/config/validators/minimum_clusters/v3/minimum_clusters': () => import('./envoy/extensions/config/validators/minimum_clusters/v3/minimum_clusters').then(module => ({
        'MinimumClustersValidator': module.MinimumClustersValidator
    })),
    'envoy/extensions/dynamic_modules/v3/dynamic_modules': () => import('./envoy/extensions/dynamic_modules/v3/dynamic_modules').then(module => ({
        'DynamicModuleConfig': module.DynamicModuleConfig
    })),
    'envoy/extensions/filters/common/dependency/v3/dependency': () => import('./envoy/extensions/filters/common/dependency/v3/dependency').then(module => ({
        'Dependency': module.Dependency,
        'FilterDependencies': module.FilterDependencies,
        'MatchingRequirements_DataInputAllowList': module.MatchingRequirements_DataInputAllowList,
        'MatchingRequirements': module.MatchingRequirements
    })),
    'envoy/extensions/filters/common/fault/v3/fault': () => import('./envoy/extensions/filters/common/fault/v3/fault').then(module => ({
        'FaultDelay': module.FaultDelay,
        'FaultRateLimit': module.FaultRateLimit,
        'FaultRateLimit_FixedLimit': module.FaultRateLimit_FixedLimit
    })),
    'envoy/extensions/filters/common/set_filter_state/v3/value': () => import('./envoy/extensions/filters/common/set_filter_state/v3/value').then(module => ({
        'FilterStateValue': module.FilterStateValue
    })),
    'envoy/extensions/filters/http/adaptive_concurrency/v3/adaptive_concurrency': () => import('./envoy/extensions/filters/http/adaptive_concurrency/v3/adaptive_concurrency').then(module => ({
        'GradientControllerConfig_ConcurrencyLimitCalculationParams': module.GradientControllerConfig_ConcurrencyLimitCalculationParams,
        'GradientControllerConfig_MinimumRTTCalculationParams': module.GradientControllerConfig_MinimumRTTCalculationParams,
        'GradientControllerConfig': module.GradientControllerConfig,
        'AdaptiveConcurrency': module.AdaptiveConcurrency
    })),
    'envoy/extensions/filters/http/admission_control/v3/admission_control': () => import('./envoy/extensions/filters/http/admission_control/v3/admission_control').then(module => ({
        'AdmissionControl': module.AdmissionControl,
        'AdmissionControl_SuccessCriteria_HttpCriteria': module.AdmissionControl_SuccessCriteria_HttpCriteria,
        'AdmissionControl_SuccessCriteria_GrpcCriteria': module.AdmissionControl_SuccessCriteria_GrpcCriteria,
        'AdmissionControl_SuccessCriteria': module.AdmissionControl_SuccessCriteria
    })),
    'envoy/extensions/filters/http/alternate_protocols_cache/v3/alternate_protocols_cache': () => import('./envoy/extensions/filters/http/alternate_protocols_cache/v3/alternate_protocols_cache').then(module => ({
        'FilterConfig': module.FilterConfig
    })),
    'envoy/extensions/filters/http/api_key_auth/v3/api_key_auth': () => import('./envoy/extensions/filters/http/api_key_auth/v3/api_key_auth').then(module => ({
        'ApiKeyAuth': module.ApiKeyAuth,
        'ApiKeyAuthPerRoute': module.ApiKeyAuthPerRoute,
        'Credential': module.Credential,
        'KeySource': module.KeySource
    })),
    'envoy/extensions/filters/http/aws_lambda/v3/aws_lambda': () => import('./envoy/extensions/filters/http/aws_lambda/v3/aws_lambda').then(module => ({
        'Credentials': module.Credentials,
        'Config': module.Config,
        'PerRouteConfig': module.PerRouteConfig
    })),
    'envoy/extensions/filters/http/aws_request_signing/v3/aws_request_signing': () => import('./envoy/extensions/filters/http/aws_request_signing/v3/aws_request_signing').then(module => ({
        'AwsRequestSigning_QueryString': module.AwsRequestSigning_QueryString,
        'AwsRequestSigning': module.AwsRequestSigning,
        'AwsRequestSigningPerRoute': module.AwsRequestSigningPerRoute
    })),
    'envoy/extensions/filters/http/bandwidth_limit/v3/bandwidth_limit': () => import('./envoy/extensions/filters/http/bandwidth_limit/v3/bandwidth_limit').then(module => ({
        'BandwidthLimit': module.BandwidthLimit
    })),
    'envoy/extensions/filters/http/basic_auth/v3/basic_auth': () => import('./envoy/extensions/filters/http/basic_auth/v3/basic_auth').then(module => ({
        'BasicAuth': module.BasicAuth,
        'BasicAuthPerRoute': module.BasicAuthPerRoute
    })),
    'envoy/extensions/filters/http/buffer/v3/buffer': () => import('./envoy/extensions/filters/http/buffer/v3/buffer').then(module => ({
        'Buffer': module.Buffer,
        'BufferPerRoute': module.BufferPerRoute
    })),
    'envoy/extensions/filters/http/cache/v3/cache': () => import('./envoy/extensions/filters/http/cache/v3/cache').then(module => ({
        'CacheConfig_KeyCreatorParams': module.CacheConfig_KeyCreatorParams,
        'CacheConfig': module.CacheConfig
    })),
    'envoy/extensions/filters/http/cdn_loop/v3/cdn_loop': () => import('./envoy/extensions/filters/http/cdn_loop/v3/cdn_loop').then(module => ({
        'CdnLoopConfig': module.CdnLoopConfig
    })),
    'envoy/extensions/filters/http/composite/v3/composite': () => import('./envoy/extensions/filters/http/composite/v3/composite').then(module => ({
        'DynamicConfig': module.DynamicConfig,
        'ExecuteFilterAction': module.ExecuteFilterAction
    })),
    'envoy/extensions/filters/http/compressor/v3/compressor': () => import('./envoy/extensions/filters/http/compressor/v3/compressor').then(module => ({
        'Compressor_CommonDirectionConfig': module.Compressor_CommonDirectionConfig,
        'Compressor_RequestDirectionConfig': module.Compressor_RequestDirectionConfig,
        'Compressor_ResponseDirectionConfig': module.Compressor_ResponseDirectionConfig,
        'Compressor': module.Compressor,
        'ResponseDirectionOverrides': module.ResponseDirectionOverrides,
        'CompressorOverrides': module.CompressorOverrides,
        'CompressorPerRoute': module.CompressorPerRoute
    })),
    'envoy/extensions/filters/http/cors/v3/cors': () => import('./envoy/extensions/filters/http/cors/v3/cors').then(module => ({
        'CorsPolicy': module.CorsPolicy
    })),
    'envoy/extensions/filters/http/credential_injector/v3/credential_injector': () => import('./envoy/extensions/filters/http/credential_injector/v3/credential_injector').then(module => ({
        'CredentialInjector': module.CredentialInjector
    })),
    'envoy/extensions/filters/http/csrf/v3/csrf': () => import('./envoy/extensions/filters/http/csrf/v3/csrf').then(module => ({
        'CsrfPolicy': module.CsrfPolicy
    })),
    'envoy/extensions/filters/http/custom_response/v3/custom_response': () => import('./envoy/extensions/filters/http/custom_response/v3/custom_response').then(module => ({
        'CustomResponse': module.CustomResponse
    })),
    'envoy/extensions/filters/http/decompressor/v3/decompressor': () => import('./envoy/extensions/filters/http/decompressor/v3/decompressor').then(module => ({
        'Decompressor_CommonDirectionConfig': module.Decompressor_CommonDirectionConfig,
        'Decompressor_RequestDirectionConfig': module.Decompressor_RequestDirectionConfig,
        'Decompressor_ResponseDirectionConfig': module.Decompressor_ResponseDirectionConfig,
        'Decompressor': module.Decompressor
    })),
    'envoy/extensions/filters/http/dynamic_forward_proxy/v3/dynamic_forward_proxy': () => import('./envoy/extensions/filters/http/dynamic_forward_proxy/v3/dynamic_forward_proxy').then(module => ({
        'FilterConfig': module.FilterConfig,
        'PerRouteConfig': module.PerRouteConfig,
        'SubClusterConfig': module.SubClusterConfig
    })),
    'envoy/extensions/filters/http/dynamic_modules/v3/dynamic_modules': () => import('./envoy/extensions/filters/http/dynamic_modules/v3/dynamic_modules').then(module => ({
        'DynamicModuleFilter': module.DynamicModuleFilter
    })),
    'envoy/extensions/filters/http/ext_authz/v3/ext_authz': () => import('./envoy/extensions/filters/http/ext_authz/v3/ext_authz').then(module => ({
        'BufferSettings': module.BufferSettings,
        'ExtAuthz': module.ExtAuthz,
        'AuthorizationRequest': module.AuthorizationRequest,
        'AuthorizationResponse': module.AuthorizationResponse,
        'HttpService': module.HttpService,
        'ExtAuthzPerRoute': module.ExtAuthzPerRoute,
        'CheckSettings': module.CheckSettings,
        'CheckSettings_ContextExtensionsEntry': module.CheckSettings_ContextExtensionsEntry
    })),
    'envoy/extensions/filters/http/ext_proc/v3/ext_proc': () => import('./envoy/extensions/filters/http/ext_proc/v3/ext_proc').then(module => ({
        'ExtProcHttpService': module.ExtProcHttpService,
        'HeaderForwardingRules': module.HeaderForwardingRules,
        'MetadataOptions_MetadataNamespaces': module.MetadataOptions_MetadataNamespaces,
        'MetadataOptions': module.MetadataOptions,
        'ExternalProcessor': module.ExternalProcessor,
        'ExtProcPerRoute': module.ExtProcPerRoute,
        'ExtProcOverrides': module.ExtProcOverrides
    })),
    'envoy/extensions/filters/http/ext_proc/v3/processing_mode': () => import('./envoy/extensions/filters/http/ext_proc/v3/processing_mode').then(module => ({
        'ProcessingMode': module.ProcessingMode
    })),
    'envoy/extensions/filters/http/fault/v3/fault': () => import('./envoy/extensions/filters/http/fault/v3/fault').then(module => ({
        'FaultAbort': module.FaultAbort,
        'HTTPFault': module.HTTPFault
    })),
    'envoy/extensions/filters/http/file_system_buffer/v3/file_system_buffer': () => import('./envoy/extensions/filters/http/file_system_buffer/v3/file_system_buffer').then(module => ({
        'BufferBehavior': module.BufferBehavior,
        'StreamConfig': module.StreamConfig,
        'FileSystemBufferFilterConfig': module.FileSystemBufferFilterConfig
    })),
    'envoy/extensions/filters/http/gcp_authn/v3/gcp_authn': () => import('./envoy/extensions/filters/http/gcp_authn/v3/gcp_authn').then(module => ({
        'TokenCacheConfig': module.TokenCacheConfig,
        'TokenHeader': module.TokenHeader,
        'GcpAuthnFilterConfig': module.GcpAuthnFilterConfig,
        'Audience': module.Audience
    })),
    'envoy/extensions/filters/http/geoip/v3/geoip': () => import('./envoy/extensions/filters/http/geoip/v3/geoip').then(module => ({
        'Geoip_XffConfig': module.Geoip_XffConfig,
        'Geoip': module.Geoip
    })),
    'envoy/extensions/filters/http/grpc_field_extraction/v3/config': () => import('./envoy/extensions/filters/http/grpc_field_extraction/v3/config').then(module => ({
        'GrpcFieldExtractionConfig': module.GrpcFieldExtractionConfig,
        'FieldExtractions': module.FieldExtractions,
        'GrpcFieldExtractionConfig_ExtractionsByMethodEntry': module.GrpcFieldExtractionConfig_ExtractionsByMethodEntry,
        'RequestFieldValueDisposition': module.RequestFieldValueDisposition,
        'FieldExtractions_RequestFieldExtractionsEntry': module.FieldExtractions_RequestFieldExtractionsEntry
    })),
    'envoy/extensions/filters/http/grpc_http1_bridge/v3/config': () => import('./envoy/extensions/filters/http/grpc_http1_bridge/v3/config').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/http/grpc_http1_reverse_bridge/v3/config': () => import('./envoy/extensions/filters/http/grpc_http1_reverse_bridge/v3/config').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterConfigPerRoute': module.FilterConfigPerRoute
    })),
    'envoy/extensions/filters/http/grpc_json_reverse_transcoder/v3/transcoder': () => import('./envoy/extensions/filters/http/grpc_json_reverse_transcoder/v3/transcoder').then(module => ({
        'GrpcJsonReverseTranscoder': module.GrpcJsonReverseTranscoder
    })),
    'envoy/extensions/filters/http/grpc_json_transcoder/v3/transcoder': () => import('./envoy/extensions/filters/http/grpc_json_transcoder/v3/transcoder').then(module => ({
        'GrpcJsonTranscoder_PrintOptions': module.GrpcJsonTranscoder_PrintOptions,
        'GrpcJsonTranscoder_RequestValidationOptions': module.GrpcJsonTranscoder_RequestValidationOptions,
        'GrpcJsonTranscoder': module.GrpcJsonTranscoder,
        'UnknownQueryParams': module.UnknownQueryParams,
        'UnknownQueryParams_Values': module.UnknownQueryParams_Values,
        'UnknownQueryParams_KeyEntry': module.UnknownQueryParams_KeyEntry
    })),
    'envoy/extensions/filters/http/grpc_stats/v3/config': () => import('./envoy/extensions/filters/http/grpc_stats/v3/config').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterObject': module.FilterObject
    })),
    'envoy/extensions/filters/http/gzip/v3/gzip': () => import('./envoy/extensions/filters/http/gzip/v3/gzip').then(module => ({
        'Gzip': module.Gzip
    })),
    'envoy/extensions/filters/http/header_mutation/v3/header_mutation': () => import('./envoy/extensions/filters/http/header_mutation/v3/header_mutation').then(module => ({
        'Mutations': module.Mutations,
        'HeaderMutationPerRoute': module.HeaderMutationPerRoute,
        'HeaderMutation': module.HeaderMutation
    })),
    'envoy/extensions/filters/http/header_to_metadata/v3/header_to_metadata': () => import('./envoy/extensions/filters/http/header_to_metadata/v3/header_to_metadata').then(module => ({
        'Config': module.Config,
        'Config_KeyValuePair': module.Config_KeyValuePair,
        'Config_Rule': module.Config_Rule
    })),
    'envoy/extensions/filters/http/health_check/v3/health_check': () => import('./envoy/extensions/filters/http/health_check/v3/health_check').then(module => ({
        'HealthCheck': module.HealthCheck,
        'HealthCheck_ClusterMinHealthyPercentagesEntry': module.HealthCheck_ClusterMinHealthyPercentagesEntry
    })),
    'envoy/extensions/filters/http/ip_tagging/v3/ip_tagging': () => import('./envoy/extensions/filters/http/ip_tagging/v3/ip_tagging').then(module => ({
        'IPTagging_IpTagHeader': module.IPTagging_IpTagHeader,
        'IPTagging': module.IPTagging,
        'IPTagging_IPTag': module.IPTagging_IPTag
    })),
    'envoy/extensions/filters/http/json_to_metadata/v3/json_to_metadata': () => import('./envoy/extensions/filters/http/json_to_metadata/v3/json_to_metadata').then(module => ({
        'JsonToMetadata_MatchRules': module.JsonToMetadata_MatchRules,
        'JsonToMetadata': module.JsonToMetadata,
        'JsonToMetadata_KeyValuePair': module.JsonToMetadata_KeyValuePair,
        'JsonToMetadata_Selector': module.JsonToMetadata_Selector,
        'JsonToMetadata_Rule': module.JsonToMetadata_Rule
    })),
    'envoy/extensions/filters/http/jwt_authn/v3/config': () => import('./envoy/extensions/filters/http/jwt_authn/v3/config').then(module => ({
        'JwtProvider_NormalizePayload': module.JwtProvider_NormalizePayload,
        'JwtCacheConfig': module.JwtCacheConfig,
        'JwtProvider': module.JwtProvider,
        'JwksAsyncFetch': module.JwksAsyncFetch,
        'RemoteJwks': module.RemoteJwks,
        'JwtHeader': module.JwtHeader,
        'ProviderWithAudiences': module.ProviderWithAudiences,
        'JwtRequirement': module.JwtRequirement,
        'JwtRequirementOrList': module.JwtRequirementOrList,
        'JwtRequirementAndList': module.JwtRequirementAndList,
        'RequirementRule': module.RequirementRule,
        'FilterStateRule': module.FilterStateRule,
        'FilterStateRule_RequiresEntry': module.FilterStateRule_RequiresEntry,
        'JwtAuthentication': module.JwtAuthentication,
        'JwtAuthentication_ProvidersEntry': module.JwtAuthentication_ProvidersEntry,
        'JwtAuthentication_RequirementMapEntry': module.JwtAuthentication_RequirementMapEntry,
        'PerRouteConfig': module.PerRouteConfig,
        'JwtClaimToHeader': module.JwtClaimToHeader
    })),
    'envoy/extensions/filters/http/kill_request/v3/kill_request': () => import('./envoy/extensions/filters/http/kill_request/v3/kill_request').then(module => ({
        'KillRequest': module.KillRequest
    })),
    'envoy/extensions/filters/http/local_ratelimit/v3/local_rate_limit': () => import('./envoy/extensions/filters/http/local_ratelimit/v3/local_rate_limit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit
    })),
    'envoy/extensions/filters/http/lua/v3/lua': () => import('./envoy/extensions/filters/http/lua/v3/lua').then(module => ({
        'Lua': module.Lua,
        'Lua_SourceCodesEntry': module.Lua_SourceCodesEntry,
        'LuaPerRoute': module.LuaPerRoute
    })),
    'envoy/extensions/filters/http/oauth2/v3/oauth': () => import('./envoy/extensions/filters/http/oauth2/v3/oauth').then(module => ({
        'OAuth2Credentials_CookieNames': module.OAuth2Credentials_CookieNames,
        'OAuth2Credentials': module.OAuth2Credentials,
        'OAuth2Config': module.OAuth2Config,
        'OAuth2': module.OAuth2
    })),
    'envoy/extensions/filters/http/on_demand/v3/on_demand': () => import('./envoy/extensions/filters/http/on_demand/v3/on_demand').then(module => ({
        'OnDemandCds': module.OnDemandCds,
        'OnDemand': module.OnDemand,
        'PerRouteConfig': module.PerRouteConfig
    })),
    'envoy/extensions/filters/http/original_src/v3/original_src': () => import('./envoy/extensions/filters/http/original_src/v3/original_src').then(module => ({
        'OriginalSrc': module.OriginalSrc
    })),
    'envoy/extensions/filters/http/proto_message_extraction/v3/config': () => import('./envoy/extensions/filters/http/proto_message_extraction/v3/config').then(module => ({
        'ProtoMessageExtractionConfig': module.ProtoMessageExtractionConfig,
        'MethodExtraction': module.MethodExtraction,
        'ProtoMessageExtractionConfig_ExtractionByMethodEntry': module.ProtoMessageExtractionConfig_ExtractionByMethodEntry,
        'MethodExtraction_RequestExtractionByFieldEntry': module.MethodExtraction_RequestExtractionByFieldEntry,
        'MethodExtraction_ResponseExtractionByFieldEntry': module.MethodExtraction_ResponseExtractionByFieldEntry
    })),
    'envoy/extensions/filters/http/rate_limit_quota/v3/rate_limit_quota': () => import('./envoy/extensions/filters/http/rate_limit_quota/v3/rate_limit_quota').then(module => ({
        'RateLimitQuotaFilterConfig': module.RateLimitQuotaFilterConfig,
        'RateLimitQuotaOverride': module.RateLimitQuotaOverride,
        'RateLimitQuotaBucketSettings_BucketIdBuilder': module.RateLimitQuotaBucketSettings_BucketIdBuilder,
        'RateLimitQuotaBucketSettings_DenyResponseSettings': module.RateLimitQuotaBucketSettings_DenyResponseSettings,
        'RateLimitQuotaBucketSettings_NoAssignmentBehavior': module.RateLimitQuotaBucketSettings_NoAssignmentBehavior,
        'RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior': module.RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior,
        'RateLimitQuotaBucketSettings': module.RateLimitQuotaBucketSettings,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder': module.RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry': module.RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry
    })),
    'envoy/extensions/filters/http/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/http/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit,
        'RateLimitPerRoute': module.RateLimitPerRoute
    })),
    'envoy/extensions/filters/http/rbac/v3/rbac': () => import('./envoy/extensions/filters/http/rbac/v3/rbac').then(module => ({
        'RBAC': module.RBAC,
        'RBACPerRoute': module.RBACPerRoute
    })),
    'envoy/extensions/filters/http/router/v3/router': () => import('./envoy/extensions/filters/http/router/v3/router').then(module => ({
        'Router_UpstreamAccessLogOptions': module.Router_UpstreamAccessLogOptions,
        'Router': module.Router
    })),
    'envoy/extensions/filters/http/set_filter_state/v3/set_filter_state': () => import('./envoy/extensions/filters/http/set_filter_state/v3/set_filter_state').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/http/set_metadata/v3/set_metadata': () => import('./envoy/extensions/filters/http/set_metadata/v3/set_metadata').then(module => ({
        'Metadata': module.Metadata,
        'Config': module.Config
    })),
    'envoy/extensions/filters/http/stateful_session/v3/stateful_session': () => import('./envoy/extensions/filters/http/stateful_session/v3/stateful_session').then(module => ({
        'StatefulSession': module.StatefulSession,
        'StatefulSessionPerRoute': module.StatefulSessionPerRoute
    })),
    'envoy/extensions/filters/http/tap/v3/tap': () => import('./envoy/extensions/filters/http/tap/v3/tap').then(module => ({
        'Tap': module.Tap
    })),
    'envoy/extensions/filters/http/thrift_to_metadata/v3/thrift_to_metadata': () => import('./envoy/extensions/filters/http/thrift_to_metadata/v3/thrift_to_metadata').then(module => ({
        'KeyValuePair': module.KeyValuePair,
        'FieldSelector': module.FieldSelector,
        'Rule': module.Rule,
        'ThriftToMetadata': module.ThriftToMetadata,
        'ThriftToMetadataPerRoute': module.ThriftToMetadataPerRoute
    })),
    'envoy/extensions/filters/http/wasm/v3/wasm': () => import('./envoy/extensions/filters/http/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/filters/listener/local_ratelimit/v3/local_ratelimit': () => import('./envoy/extensions/filters/listener/local_ratelimit/v3/local_ratelimit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit
    })),
    'envoy/extensions/filters/listener/original_src/v3/original_src': () => import('./envoy/extensions/filters/listener/original_src/v3/original_src').then(module => ({
        'OriginalSrc': module.OriginalSrc
    })),
    'envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol': () => import('./envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol').then(module => ({
        'ProxyProtocol': module.ProxyProtocol,
        'ProxyProtocol_KeyValuePair': module.ProxyProtocol_KeyValuePair,
        'ProxyProtocol_Rule': module.ProxyProtocol_Rule
    })),
    'envoy/extensions/filters/listener/tls_inspector/v3/tls_inspector': () => import('./envoy/extensions/filters/listener/tls_inspector/v3/tls_inspector').then(module => ({
        'TlsInspector': module.TlsInspector
    })),
    'envoy/extensions/filters/network/connection_limit/v3/connection_limit': () => import('./envoy/extensions/filters/network/connection_limit/v3/connection_limit').then(module => ({
        'ConnectionLimit': module.ConnectionLimit
    })),
    'envoy/extensions/filters/network/direct_response/v3/config': () => import('./envoy/extensions/filters/network/direct_response/v3/config').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/network/dubbo_proxy/v3/dubbo_proxy': () => import('./envoy/extensions/filters/network/dubbo_proxy/v3/dubbo_proxy').then(module => ({
        'Drds': module.Drds,
        'DubboProxy': module.DubboProxy,
        'DubboFilter': module.DubboFilter
    })),
    'envoy/extensions/filters/network/dubbo_proxy/v3/route': () => import('./envoy/extensions/filters/network/dubbo_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'MethodMatch': module.MethodMatch,
        'RouteMatch': module.RouteMatch,
        'RouteAction': module.RouteAction,
        'Route': module.Route,
        'MethodMatch_ParameterMatchSpecifier': module.MethodMatch_ParameterMatchSpecifier,
        'MethodMatch_ParamsMatchEntry': module.MethodMatch_ParamsMatchEntry,
        'MultipleRouteConfiguration': module.MultipleRouteConfiguration
    })),
    'envoy/extensions/filters/network/ext_authz/v3/ext_authz': () => import('./envoy/extensions/filters/network/ext_authz/v3/ext_authz').then(module => ({
        'ExtAuthz': module.ExtAuthz
    })),
    'envoy/extensions/filters/network/generic_proxy/action/v3/action': () => import('./envoy/extensions/filters/network/generic_proxy/action/v3/action').then(module => ({
        'RouteAction': module.RouteAction,
        'RouteAction_PerFilterConfigEntry': module.RouteAction_PerFilterConfigEntry
    })),
    'envoy/extensions/filters/network/generic_proxy/codecs/http1/v3/http1': () => import('./envoy/extensions/filters/network/generic_proxy/codecs/http1/v3/http1').then(module => ({
        'Http1CodecConfig': module.Http1CodecConfig
    })),
    'envoy/extensions/filters/network/generic_proxy/matcher/v3/matcher': () => import('./envoy/extensions/filters/network/generic_proxy/matcher/v3/matcher').then(module => ({
        'PropertyMatchInput': module.PropertyMatchInput,
        'KeyValueMatchEntry': module.KeyValueMatchEntry,
        'RequestMatcher': module.RequestMatcher
    })),
    'envoy/extensions/filters/network/generic_proxy/router/v3/router': () => import('./envoy/extensions/filters/network/generic_proxy/router/v3/router').then(module => ({
        'Router': module.Router
    })),
    'envoy/extensions/filters/network/generic_proxy/v3/generic_proxy': () => import('./envoy/extensions/filters/network/generic_proxy/v3/generic_proxy').then(module => ({
        'GenericProxy': module.GenericProxy,
        'GenericRds': module.GenericRds
    })),
    'envoy/extensions/filters/network/generic_proxy/v3/route': () => import('./envoy/extensions/filters/network/generic_proxy/v3/route').then(module => ({
        'VirtualHost': module.VirtualHost,
        'RouteConfiguration': module.RouteConfiguration
    })),
    'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager': () => import('./envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager').then(module => ({
        'HttpConnectionManager_Tracing': module.HttpConnectionManager_Tracing,
        'HttpConnectionManager_HcmAccessLogOptions': module.HttpConnectionManager_HcmAccessLogOptions,
        'HttpConnectionManager_InternalAddressConfig': module.HttpConnectionManager_InternalAddressConfig,
        'HttpConnectionManager_SetCurrentClientCertDetails': module.HttpConnectionManager_SetCurrentClientCertDetails,
        'RequestIDExtension': module.RequestIDExtension,
        'LocalReplyConfig': module.LocalReplyConfig,
        'HttpConnectionManager_PathNormalizationOptions': module.HttpConnectionManager_PathNormalizationOptions,
        'HttpConnectionManager_ProxyStatusConfig': module.HttpConnectionManager_ProxyStatusConfig,
        'HttpConnectionManager': module.HttpConnectionManager,
        'HttpConnectionManager_UpgradeConfig': module.HttpConnectionManager_UpgradeConfig,
        'ResponseMapper': module.ResponseMapper,
        'Rds': module.Rds,
        'ScopedRouteConfigurationsList': module.ScopedRouteConfigurationsList,
        'ScopedRoutes_ScopeKeyBuilder': module.ScopedRoutes_ScopeKeyBuilder,
        'ScopedRoutes': module.ScopedRoutes,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement,
        'ScopedRds': module.ScopedRds,
        'HttpFilter': module.HttpFilter,
        'EnvoyMobileHttpConnectionManager': module.EnvoyMobileHttpConnectionManager
    })),
    'envoy/extensions/filters/network/local_ratelimit/v3/local_rate_limit': () => import('./envoy/extensions/filters/network/local_ratelimit/v3/local_rate_limit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit
    })),
    'envoy/extensions/filters/network/mongo_proxy/v3/mongo_proxy': () => import('./envoy/extensions/filters/network/mongo_proxy/v3/mongo_proxy').then(module => ({
        'MongoProxy': module.MongoProxy
    })),
    'envoy/extensions/filters/network/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/network/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit
    })),
    'envoy/extensions/filters/network/rbac/v3/rbac': () => import('./envoy/extensions/filters/network/rbac/v3/rbac').then(module => ({
        'RBAC': module.RBAC
    })),
    'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy': () => import('./envoy/extensions/filters/network/redis_proxy/v3/redis_proxy').then(module => ({
        'RedisProxy_ConnectionRateLimit': module.RedisProxy_ConnectionRateLimit,
        'RedisProxy_ConnPoolSettings': module.RedisProxy_ConnPoolSettings,
        'RedisProxy_PrefixRoutes_Route_ReadCommandPolicy': module.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy,
        'RedisProxy_PrefixRoutes_Route': module.RedisProxy_PrefixRoutes_Route,
        'RedisProxy_PrefixRoutes': module.RedisProxy_PrefixRoutes,
        'RedisExternalAuthProvider': module.RedisExternalAuthProvider,
        'RedisProxy': module.RedisProxy,
        'RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy': module.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy,
        'RedisProxy_RedisFault': module.RedisProxy_RedisFault,
        'RedisProtocolOptions': module.RedisProtocolOptions
    })),
    'envoy/extensions/filters/network/set_filter_state/v3/set_filter_state': () => import('./envoy/extensions/filters/network/set_filter_state/v3/set_filter_state').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/network/sni_dynamic_forward_proxy/v3/sni_dynamic_forward_proxy': () => import('./envoy/extensions/filters/network/sni_dynamic_forward_proxy/v3/sni_dynamic_forward_proxy').then(module => ({
        'FilterConfig': module.FilterConfig
    })),
    'envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy': () => import('./envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy').then(module => ({
        'TcpProxy_OnDemand': module.TcpProxy_OnDemand,
        'TcpProxy_TunnelingConfig': module.TcpProxy_TunnelingConfig,
        'TcpProxy_TcpAccessLogOptions': module.TcpProxy_TcpAccessLogOptions,
        'TcpProxy': module.TcpProxy,
        'TcpProxy_WeightedCluster': module.TcpProxy_WeightedCluster,
        'TcpProxy_WeightedCluster_ClusterWeight': module.TcpProxy_WeightedCluster_ClusterWeight
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/header_to_metadata/v3/header_to_metadata': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/header_to_metadata/v3/header_to_metadata').then(module => ({
        'HeaderToMetadata': module.HeaderToMetadata,
        'HeaderToMetadata_KeyValuePair': module.HeaderToMetadata_KeyValuePair,
        'HeaderToMetadata_Rule': module.HeaderToMetadata_Rule
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/payload_to_metadata/v3/payload_to_metadata': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/payload_to_metadata/v3/payload_to_metadata').then(module => ({
        'PayloadToMetadata': module.PayloadToMetadata,
        'PayloadToMetadata_KeyValuePair': module.PayloadToMetadata_KeyValuePair,
        'PayloadToMetadata_FieldSelector': module.PayloadToMetadata_FieldSelector,
        'PayloadToMetadata_Rule': module.PayloadToMetadata_Rule
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit
    })),
    'envoy/extensions/filters/network/thrift_proxy/router/v3/router': () => import('./envoy/extensions/filters/network/thrift_proxy/router/v3/router').then(module => ({
        'Router': module.Router
    })),
    'envoy/extensions/filters/network/thrift_proxy/v3/route': () => import('./envoy/extensions/filters/network/thrift_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'RouteMatch': module.RouteMatch,
        'RouteAction': module.RouteAction,
        'Route': module.Route,
        'RouteAction_RequestMirrorPolicy': module.RouteAction_RequestMirrorPolicy,
        'WeightedCluster': module.WeightedCluster,
        'WeightedCluster_ClusterWeight': module.WeightedCluster_ClusterWeight
    })),
    'envoy/extensions/filters/network/thrift_proxy/v3/thrift_proxy': () => import('./envoy/extensions/filters/network/thrift_proxy/v3/thrift_proxy').then(module => ({
        'Trds': module.Trds,
        'ThriftProxy': module.ThriftProxy,
        'ThriftFilter': module.ThriftFilter,
        'ThriftProtocolOptions': module.ThriftProtocolOptions
    })),
    'envoy/extensions/filters/network/wasm/v3/wasm': () => import('./envoy/extensions/filters/network/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/filters/network/zookeeper_proxy/v3/zookeeper_proxy': () => import('./envoy/extensions/filters/network/zookeeper_proxy/v3/zookeeper_proxy').then(module => ({
        'ZooKeeperProxy': module.ZooKeeperProxy,
        'LatencyThresholdOverride': module.LatencyThresholdOverride
    })),
    'envoy/extensions/filters/udp/dns_filter/v3/dns_filter': () => import('./envoy/extensions/filters/udp/dns_filter/v3/dns_filter').then(module => ({
        'DnsFilterConfig_ServerContextConfig': module.DnsFilterConfig_ServerContextConfig,
        'DnsFilterConfig_ClientContextConfig': module.DnsFilterConfig_ClientContextConfig,
        'DnsFilterConfig': module.DnsFilterConfig
    })),
    'envoy/extensions/filters/udp/udp_proxy/session/dynamic_forward_proxy/v3/dynamic_forward_proxy': () => import('./envoy/extensions/filters/udp/udp_proxy/session/dynamic_forward_proxy/v3/dynamic_forward_proxy').then(module => ({
        'FilterConfig_BufferOptions': module.FilterConfig_BufferOptions,
        'FilterConfig': module.FilterConfig
    })),
    'envoy/extensions/filters/udp/udp_proxy/v3/route': () => import('./envoy/extensions/filters/udp/udp_proxy/v3/route').then(module => ({
        'Route': module.Route
    })),
    'envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy': () => import('./envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy').then(module => ({
        'UdpProxyConfig_UdpTunnelingConfig_RetryOptions': module.UdpProxyConfig_UdpTunnelingConfig_RetryOptions,
        'UdpProxyConfig_UdpTunnelingConfig_BufferOptions': module.UdpProxyConfig_UdpTunnelingConfig_BufferOptions,
        'UdpProxyConfig_UdpTunnelingConfig': module.UdpProxyConfig_UdpTunnelingConfig,
        'UdpProxyConfig_UdpAccessLogOptions': module.UdpProxyConfig_UdpAccessLogOptions,
        'UdpProxyConfig': module.UdpProxyConfig,
        'UdpProxyConfig_HashPolicy': module.UdpProxyConfig_HashPolicy,
        'UdpProxyConfig_SessionFilter': module.UdpProxyConfig_SessionFilter
    })),
    'envoy/extensions/geoip_providers/common/v3/common': () => import('./envoy/extensions/geoip_providers/common/v3/common').then(module => ({
        'CommonGeoipProviderConfig_GeolocationHeadersToAdd': module.CommonGeoipProviderConfig_GeolocationHeadersToAdd,
        'CommonGeoipProviderConfig': module.CommonGeoipProviderConfig
    })),
    'envoy/extensions/geoip_providers/maxmind/v3/maxmind': () => import('./envoy/extensions/geoip_providers/maxmind/v3/maxmind').then(module => ({
        'MaxMindConfig': module.MaxMindConfig
    })),
    'envoy/extensions/health_check/event_sinks/file/v3/file': () => import('./envoy/extensions/health_check/event_sinks/file/v3/file').then(module => ({
        'HealthCheckEventFileSink': module.HealthCheckEventFileSink
    })),
    'envoy/extensions/health_checkers/redis/v3/redis': () => import('./envoy/extensions/health_checkers/redis/v3/redis').then(module => ({
        'Redis': module.Redis
    })),
    'envoy/extensions/health_checkers/thrift/v3/thrift': () => import('./envoy/extensions/health_checkers/thrift/v3/thrift').then(module => ({
        'Thrift': module.Thrift
    })),
    'envoy/extensions/http/cache/file_system_http_cache/v3/file_system_http_cache': () => import('./envoy/extensions/http/cache/file_system_http_cache/v3/file_system_http_cache').then(module => ({
        'FileSystemHttpCacheConfig': module.FileSystemHttpCacheConfig
    })),
    'envoy/extensions/http/custom_response/local_response_policy/v3/local_response_policy': () => import('./envoy/extensions/http/custom_response/local_response_policy/v3/local_response_policy').then(module => ({
        'LocalResponsePolicy': module.LocalResponsePolicy
    })),
    'envoy/extensions/http/custom_response/redirect_policy/v3/redirect_policy': () => import('./envoy/extensions/http/custom_response/redirect_policy/v3/redirect_policy').then(module => ({
        'RedirectPolicy': module.RedirectPolicy
    })),
    'envoy/extensions/http/early_header_mutation/header_mutation/v3/header_mutation': () => import('./envoy/extensions/http/early_header_mutation/header_mutation/v3/header_mutation').then(module => ({
        'HeaderMutation': module.HeaderMutation
    })),
    'envoy/extensions/http/header_formatters/preserve_case/v3/preserve_case': () => import('./envoy/extensions/http/header_formatters/preserve_case/v3/preserve_case').then(module => ({
        'PreserveCaseFormatterConfig': module.PreserveCaseFormatterConfig
    })),
    'envoy/extensions/http/header_validators/envoy_default/v3/header_validator': () => import('./envoy/extensions/http/header_validators/envoy_default/v3/header_validator').then(module => ({
        'HeaderValidatorConfig_Http1ProtocolOptions': module.HeaderValidatorConfig_Http1ProtocolOptions,
        'HeaderValidatorConfig_UriPathNormalizationOptions': module.HeaderValidatorConfig_UriPathNormalizationOptions,
        'HeaderValidatorConfig': module.HeaderValidatorConfig
    })),
    'envoy/extensions/http/injected_credentials/generic/v3/generic': () => import('./envoy/extensions/http/injected_credentials/generic/v3/generic').then(module => ({
        'Generic': module.Generic
    })),
    'envoy/extensions/http/injected_credentials/oauth2/v3/oauth2': () => import('./envoy/extensions/http/injected_credentials/oauth2/v3/oauth2').then(module => ({
        'OAuth2': module.OAuth2,
        'OAuth2_ClientCredentials': module.OAuth2_ClientCredentials
    })),
    'envoy/extensions/http/original_ip_detection/custom_header/v3/custom_header': () => import('./envoy/extensions/http/original_ip_detection/custom_header/v3/custom_header').then(module => ({
        'CustomHeaderConfig': module.CustomHeaderConfig
    })),
    'envoy/extensions/http/original_ip_detection/xff/v3/xff': () => import('./envoy/extensions/http/original_ip_detection/xff/v3/xff').then(module => ({
        'XffTrustedCidrs': module.XffTrustedCidrs,
        'XffConfig': module.XffConfig
    })),
    'envoy/extensions/http/stateful_session/cookie/v3/cookie': () => import('./envoy/extensions/http/stateful_session/cookie/v3/cookie').then(module => ({
        'CookieBasedSessionState': module.CookieBasedSessionState
    })),
    'envoy/extensions/http/stateful_session/header/v3/header': () => import('./envoy/extensions/http/stateful_session/header/v3/header').then(module => ({
        'HeaderBasedSessionState': module.HeaderBasedSessionState
    })),
    'envoy/extensions/internal_redirect/allow_listed_routes/v3/allow_listed_routes_config': () => import('./envoy/extensions/internal_redirect/allow_listed_routes/v3/allow_listed_routes_config').then(module => ({
        'AllowListedRoutesConfig': module.AllowListedRoutesConfig
    })),
    'envoy/extensions/key_value/file_based/v3/config': () => import('./envoy/extensions/key_value/file_based/v3/config').then(module => ({
        'FileBasedKeyValueStoreConfig': module.FileBasedKeyValueStoreConfig
    })),
    'envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/client_side_weighted_round_robin': () => import('./envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/client_side_weighted_round_robin').then(module => ({
        'ClientSideWeightedRoundRobin': module.ClientSideWeightedRoundRobin
    })),
    'envoy/extensions/load_balancing_policies/common/v3/common': () => import('./envoy/extensions/load_balancing_policies/common/v3/common').then(module => ({
        'LocalityLbConfig': module.LocalityLbConfig,
        'LocalityLbConfig_ZoneAwareLbConfig': module.LocalityLbConfig_ZoneAwareLbConfig,
        'SlowStartConfig': module.SlowStartConfig,
        'ConsistentHashingLbConfig': module.ConsistentHashingLbConfig
    })),
    'envoy/extensions/load_balancing_policies/least_request/v3/least_request': () => import('./envoy/extensions/load_balancing_policies/least_request/v3/least_request').then(module => ({
        'LeastRequest': module.LeastRequest
    })),
    'envoy/extensions/load_balancing_policies/maglev/v3/maglev': () => import('./envoy/extensions/load_balancing_policies/maglev/v3/maglev').then(module => ({
        'Maglev': module.Maglev
    })),
    'envoy/extensions/load_balancing_policies/pick_first/v3/pick_first': () => import('./envoy/extensions/load_balancing_policies/pick_first/v3/pick_first').then(module => ({
        'PickFirst': module.PickFirst
    })),
    'envoy/extensions/load_balancing_policies/random/v3/random': () => import('./envoy/extensions/load_balancing_policies/random/v3/random').then(module => ({
        'Random': module.Random
    })),
    'envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash': () => import('./envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash').then(module => ({
        'RingHash': module.RingHash
    })),
    'envoy/extensions/load_balancing_policies/round_robin/v3/round_robin': () => import('./envoy/extensions/load_balancing_policies/round_robin/v3/round_robin').then(module => ({
        'RoundRobin': module.RoundRobin
    })),
    'envoy/extensions/load_balancing_policies/subset/v3/subset': () => import('./envoy/extensions/load_balancing_policies/subset/v3/subset').then(module => ({
        'Subset': module.Subset,
        'Subset_LbSubsetSelector': module.Subset_LbSubsetSelector
    })),
    'envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality': () => import('./envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality').then(module => ({
        'WrrLocality': module.WrrLocality
    })),
    'envoy/extensions/matching/common_inputs/environment_variable/v3/input': () => import('./envoy/extensions/matching/common_inputs/environment_variable/v3/input').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/matching/common_inputs/network/v3/network_inputs': () => import('./envoy/extensions/matching/common_inputs/network/v3/network_inputs').then(module => ({
        'FilterStateInput': module.FilterStateInput,
        'DynamicMetadataInput': module.DynamicMetadataInput,
        'DynamicMetadataInput_PathSegment': module.DynamicMetadataInput_PathSegment
    })),
    'envoy/extensions/matching/input_matchers/consistent_hashing/v3/consistent_hashing': () => import('./envoy/extensions/matching/input_matchers/consistent_hashing/v3/consistent_hashing').then(module => ({
        'ConsistentHashing': module.ConsistentHashing
    })),
    'envoy/extensions/matching/input_matchers/ip/v3/ip': () => import('./envoy/extensions/matching/input_matchers/ip/v3/ip').then(module => ({
        'Ip': module.Ip
    })),
    'envoy/extensions/matching/input_matchers/metadata/v3/metadata': () => import('./envoy/extensions/matching/input_matchers/metadata/v3/metadata').then(module => ({
        'Metadata': module.Metadata
    })),
    'envoy/extensions/matching/input_matchers/runtime_fraction/v3/runtime_fraction': () => import('./envoy/extensions/matching/input_matchers/runtime_fraction/v3/runtime_fraction').then(module => ({
        'RuntimeFraction': module.RuntimeFraction
    })),
    'envoy/extensions/network/dns_resolver/apple/v3/apple_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/apple/v3/apple_dns_resolver').then(module => ({
        'AppleDnsResolverConfig': module.AppleDnsResolverConfig
    })),
    'envoy/extensions/network/dns_resolver/cares/v3/cares_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/cares/v3/cares_dns_resolver').then(module => ({
        'CaresDnsResolverConfig': module.CaresDnsResolverConfig
    })),
    'envoy/extensions/network/dns_resolver/getaddrinfo/v3/getaddrinfo_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/getaddrinfo/v3/getaddrinfo_dns_resolver').then(module => ({
        'GetAddrInfoDnsResolverConfig': module.GetAddrInfoDnsResolverConfig
    })),
    'envoy/extensions/outlier_detection_monitors/common/v3/error_types': () => import('./envoy/extensions/outlier_detection_monitors/common/v3/error_types').then(module => ({
        'HttpErrors': module.HttpErrors,
        'ErrorBuckets': module.ErrorBuckets
    })),
    'envoy/extensions/outlier_detection_monitors/consecutive_errors/v3/consecutive_errors': () => import('./envoy/extensions/outlier_detection_monitors/consecutive_errors/v3/consecutive_errors').then(module => ({
        'ConsecutiveErrors': module.ConsecutiveErrors
    })),
    'envoy/extensions/path/match/uri_template/v3/uri_template_match': () => import('./envoy/extensions/path/match/uri_template/v3/uri_template_match').then(module => ({
        'UriTemplateMatchConfig': module.UriTemplateMatchConfig
    })),
    'envoy/extensions/path/rewrite/uri_template/v3/uri_template_rewrite': () => import('./envoy/extensions/path/rewrite/uri_template/v3/uri_template_rewrite').then(module => ({
        'UriTemplateRewriteConfig': module.UriTemplateRewriteConfig
    })),
    'envoy/extensions/quic/connection_debug_visitor/quic_stats/v3/quic_stats': () => import('./envoy/extensions/quic/connection_debug_visitor/quic_stats/v3/quic_stats').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/quic/server_preferred_address/v3/datasource': () => import('./envoy/extensions/quic/server_preferred_address/v3/datasource').then(module => ({
        'DataSourceServerPreferredAddressConfig_AddressFamilyConfig': module.DataSourceServerPreferredAddressConfig_AddressFamilyConfig,
        'DataSourceServerPreferredAddressConfig': module.DataSourceServerPreferredAddressConfig
    })),
    'envoy/extensions/quic/server_preferred_address/v3/fixed_server_preferred_address_config': () => import('./envoy/extensions/quic/server_preferred_address/v3/fixed_server_preferred_address_config').then(module => ({
        'FixedServerPreferredAddressConfig_AddressFamilyConfig': module.FixedServerPreferredAddressConfig_AddressFamilyConfig,
        'FixedServerPreferredAddressConfig': module.FixedServerPreferredAddressConfig
    })),
    'envoy/extensions/rate_limit_descriptors/expr/v3/expr': () => import('./envoy/extensions/rate_limit_descriptors/expr/v3/expr').then(module => ({
        'Descriptor': module.Descriptor
    })),
    'envoy/extensions/rbac/matchers/upstream_ip_port/v3/upstream_ip_port_matcher': () => import('./envoy/extensions/rbac/matchers/upstream_ip_port/v3/upstream_ip_port_matcher').then(module => ({
        'UpstreamIpPortMatcher': module.UpstreamIpPortMatcher
    })),
    'envoy/extensions/request_id/uuid/v3/uuid': () => import('./envoy/extensions/request_id/uuid/v3/uuid').then(module => ({
        'UuidRequestIdConfig': module.UuidRequestIdConfig
    })),
    'envoy/extensions/resource_monitors/downstream_connections/v3/downstream_connections': () => import('./envoy/extensions/resource_monitors/downstream_connections/v3/downstream_connections').then(module => ({
        'DownstreamConnectionsConfig': module.DownstreamConnectionsConfig
    })),
    'envoy/extensions/resource_monitors/fixed_heap/v3/fixed_heap': () => import('./envoy/extensions/resource_monitors/fixed_heap/v3/fixed_heap').then(module => ({
        'FixedHeapConfig': module.FixedHeapConfig
    })),
    'envoy/extensions/resource_monitors/injected_resource/v3/injected_resource': () => import('./envoy/extensions/resource_monitors/injected_resource/v3/injected_resource').then(module => ({
        'InjectedResourceConfig': module.InjectedResourceConfig
    })),
    'envoy/extensions/retry/host/omit_host_metadata/v3/omit_host_metadata_config': () => import('./envoy/extensions/retry/host/omit_host_metadata/v3/omit_host_metadata_config').then(module => ({
        'OmitHostMetadataConfig': module.OmitHostMetadataConfig
    })),
    'envoy/extensions/retry/priority/previous_priorities/v3/previous_priorities_config': () => import('./envoy/extensions/retry/priority/previous_priorities/v3/previous_priorities_config').then(module => ({
        'PreviousPrioritiesConfig': module.PreviousPrioritiesConfig
    })),
    'envoy/extensions/router/cluster_specifiers/lua/v3/lua': () => import('./envoy/extensions/router/cluster_specifiers/lua/v3/lua').then(module => ({
        'LuaConfig': module.LuaConfig
    })),
    'envoy/extensions/stat_sinks/graphite_statsd/v3/graphite_statsd': () => import('./envoy/extensions/stat_sinks/graphite_statsd/v3/graphite_statsd').then(module => ({
        'GraphiteStatsdSink': module.GraphiteStatsdSink
    })),
    'envoy/extensions/stat_sinks/open_telemetry/v3/open_telemetry': () => import('./envoy/extensions/stat_sinks/open_telemetry/v3/open_telemetry').then(module => ({
        'SinkConfig': module.SinkConfig
    })),
    'envoy/extensions/stat_sinks/wasm/v3/wasm': () => import('./envoy/extensions/stat_sinks/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/string_matcher/lua/v3/lua': () => import('./envoy/extensions/string_matcher/lua/v3/lua').then(module => ({
        'Lua': module.Lua
    })),
    'envoy/extensions/tracers/opentelemetry/resource_detectors/v3/static_config_resource_detector': () => import('./envoy/extensions/tracers/opentelemetry/resource_detectors/v3/static_config_resource_detector').then(module => ({
        'StaticConfigResourceDetectorConfig': module.StaticConfigResourceDetectorConfig,
        'StaticConfigResourceDetectorConfig_AttributesEntry': module.StaticConfigResourceDetectorConfig_AttributesEntry
    })),
    'envoy/extensions/tracers/opentelemetry/samplers/v3/dynatrace_sampler': () => import('./envoy/extensions/tracers/opentelemetry/samplers/v3/dynatrace_sampler').then(module => ({
        'DynatraceSamplerConfig': module.DynatraceSamplerConfig
    })),
    'envoy/extensions/transport_sockets/alts/v3/alts': () => import('./envoy/extensions/transport_sockets/alts/v3/alts').then(module => ({
        'Alts': module.Alts
    })),
    'envoy/extensions/transport_sockets/http_11_proxy/v3/upstream_http_11_connect': () => import('./envoy/extensions/transport_sockets/http_11_proxy/v3/upstream_http_11_connect').then(module => ({
        'Http11ProxyUpstreamTransport': module.Http11ProxyUpstreamTransport
    })),
    'envoy/extensions/transport_sockets/internal_upstream/v3/internal_upstream': () => import('./envoy/extensions/transport_sockets/internal_upstream/v3/internal_upstream').then(module => ({
        'InternalUpstreamTransport': module.InternalUpstreamTransport,
        'InternalUpstreamTransport_MetadataValueSource': module.InternalUpstreamTransport_MetadataValueSource
    })),
    'envoy/extensions/transport_sockets/proxy_protocol/v3/upstream_proxy_protocol': () => import('./envoy/extensions/transport_sockets/proxy_protocol/v3/upstream_proxy_protocol').then(module => ({
        'ProxyProtocolUpstreamTransport': module.ProxyProtocolUpstreamTransport
    })),
    'envoy/extensions/transport_sockets/quic/v3/quic_transport': () => import('./envoy/extensions/transport_sockets/quic/v3/quic_transport').then(module => ({
        'QuicDownstreamTransport': module.QuicDownstreamTransport,
        'QuicUpstreamTransport': module.QuicUpstreamTransport
    })),
    'envoy/extensions/transport_sockets/s2a/v3/s2a': () => import('./envoy/extensions/transport_sockets/s2a/v3/s2a').then(module => ({
        'S2AConfiguration': module.S2AConfiguration
    })),
    'envoy/extensions/transport_sockets/starttls/v3/starttls': () => import('./envoy/extensions/transport_sockets/starttls/v3/starttls').then(module => ({
        'StartTlsConfig': module.StartTlsConfig,
        'UpstreamStartTlsConfig': module.UpstreamStartTlsConfig
    })),
    'envoy/extensions/transport_sockets/tap/v3/tap': () => import('./envoy/extensions/transport_sockets/tap/v3/tap').then(module => ({
        'Tap': module.Tap
    })),
    'envoy/extensions/transport_sockets/tcp_stats/v3/tcp_stats': () => import('./envoy/extensions/transport_sockets/tcp_stats/v3/tcp_stats').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/transport_sockets/tls/v3/common': () => import('./envoy/extensions/transport_sockets/tls/v3/common').then(module => ({
        'TlsParameters': module.TlsParameters,
        'PrivateKeyProvider': module.PrivateKeyProvider,
        'TlsCertificate': module.TlsCertificate,
        'TlsSessionTicketKeys': module.TlsSessionTicketKeys,
        'CertificateProviderPluginInstance': module.CertificateProviderPluginInstance,
        'SubjectAltNameMatcher': module.SubjectAltNameMatcher,
        'CertificateValidationContext': module.CertificateValidationContext
    })),
    'envoy/extensions/transport_sockets/tls/v3/secret': () => import('./envoy/extensions/transport_sockets/tls/v3/secret').then(module => ({
        'GenericSecret': module.GenericSecret,
        'SdsSecretConfig': module.SdsSecretConfig,
        'Secret': module.Secret
    })),
    'envoy/extensions/transport_sockets/tls/v3/tls': () => import('./envoy/extensions/transport_sockets/tls/v3/tls').then(module => ({
        'CommonTlsContext_CertificateProvider': module.CommonTlsContext_CertificateProvider,
        'CommonTlsContext_CertificateProviderInstance': module.CommonTlsContext_CertificateProviderInstance,
        'TlsKeyLog': module.TlsKeyLog,
        'CommonTlsContext': module.CommonTlsContext,
        'UpstreamTlsContext': module.UpstreamTlsContext,
        'DownstreamTlsContext': module.DownstreamTlsContext,
        'CommonTlsContext_CombinedCertificateValidationContext': module.CommonTlsContext_CombinedCertificateValidationContext
    })),
    'envoy/extensions/transport_sockets/tls/v3/tls_spiffe_validator_config': () => import('./envoy/extensions/transport_sockets/tls/v3/tls_spiffe_validator_config').then(module => ({
        'SPIFFECertValidatorConfig': module.SPIFFECertValidatorConfig,
        'SPIFFECertValidatorConfig_TrustDomain': module.SPIFFECertValidatorConfig_TrustDomain
    })),
    'envoy/extensions/upstreams/http/v3/http_protocol_options': () => import('./envoy/extensions/upstreams/http/v3/http_protocol_options').then(module => ({
        'HttpProtocolOptions': module.HttpProtocolOptions,
        'HttpProtocolOptions_ExplicitHttpConfig': module.HttpProtocolOptions_ExplicitHttpConfig,
        'HttpProtocolOptions_UseDownstreamHttpConfig': module.HttpProtocolOptions_UseDownstreamHttpConfig,
        'HttpProtocolOptions_AutoHttpConfig': module.HttpProtocolOptions_AutoHttpConfig
    })),
    'envoy/extensions/upstreams/tcp/v3/tcp_protocol_options': () => import('./envoy/extensions/upstreams/tcp/v3/tcp_protocol_options').then(module => ({
        'TcpProtocolOptions': module.TcpProtocolOptions
    })),
    'envoy/extensions/wasm/v3/wasm': () => import('./envoy/extensions/wasm/v3/wasm').then(module => ({
        'ReloadConfig': module.ReloadConfig,
        'CapabilityRestrictionConfig': module.CapabilityRestrictionConfig,
        'CapabilityRestrictionConfig_AllowedCapabilitiesEntry': module.CapabilityRestrictionConfig_AllowedCapabilitiesEntry,
        'EnvironmentVariables': module.EnvironmentVariables,
        'VmConfig': module.VmConfig,
        'EnvironmentVariables_KeyValuesEntry': module.EnvironmentVariables_KeyValuesEntry,
        'PluginConfig': module.PluginConfig,
        'WasmService': module.WasmService
    })),
    'envoy/extensions/watchdog/profile_action/v3/profile_action': () => import('./envoy/extensions/watchdog/profile_action/v3/profile_action').then(module => ({
        'ProfileActionConfig': module.ProfileActionConfig
    })),
    'envoy/service/accesslog/v3/als': () => import('./envoy/service/accesslog/v3/als').then(module => ({
        'StreamAccessLogsMessage_Identifier': module.StreamAccessLogsMessage_Identifier,
        'StreamAccessLogsMessage': module.StreamAccessLogsMessage,
        'StreamAccessLogsMessage_HTTPAccessLogEntries': module.StreamAccessLogsMessage_HTTPAccessLogEntries,
        'StreamAccessLogsMessage_TCPAccessLogEntries': module.StreamAccessLogsMessage_TCPAccessLogEntries
    })),
    'envoy/service/auth/v3/attribute_context': () => import('./envoy/service/auth/v3/attribute_context').then(module => ({
        'AttributeContext_Peer': module.AttributeContext_Peer,
        'AttributeContext_HttpRequest': module.AttributeContext_HttpRequest,
        'AttributeContext_Request': module.AttributeContext_Request,
        'AttributeContext_TLSSession': module.AttributeContext_TLSSession,
        'AttributeContext': module.AttributeContext,
        'AttributeContext_Peer_LabelsEntry': module.AttributeContext_Peer_LabelsEntry,
        'AttributeContext_HttpRequest_HeadersEntry': module.AttributeContext_HttpRequest_HeadersEntry,
        'AttributeContext_ContextExtensionsEntry': module.AttributeContext_ContextExtensionsEntry
    })),
    'envoy/service/auth/v3/external_auth': () => import('./envoy/service/auth/v3/external_auth').then(module => ({
        'CheckRequest': module.CheckRequest,
        'DeniedHttpResponse': module.DeniedHttpResponse,
        'OkHttpResponse': module.OkHttpResponse,
        'CheckResponse': module.CheckResponse
    })),
    'envoy/service/discovery/v3/discovery': () => import('./envoy/service/discovery/v3/discovery').then(module => ({
        'ResourceLocator': module.ResourceLocator,
        'ResourceLocator_DynamicParametersEntry': module.ResourceLocator_DynamicParametersEntry,
        'DynamicParameterConstraints': module.DynamicParameterConstraints,
        'ResourceName': module.ResourceName,
        'ResourceError': module.ResourceError,
        'DiscoveryRequest': module.DiscoveryRequest,
        'DiscoveryResponse': module.DiscoveryResponse,
        'DeltaDiscoveryRequest': module.DeltaDiscoveryRequest,
        'DeltaDiscoveryRequest_InitialResourceVersionsEntry': module.DeltaDiscoveryRequest_InitialResourceVersionsEntry,
        'DeltaDiscoveryResponse': module.DeltaDiscoveryResponse,
        'DynamicParameterConstraints_SingleConstraint': module.DynamicParameterConstraints_SingleConstraint,
        'DynamicParameterConstraints_ConstraintList': module.DynamicParameterConstraints_ConstraintList,
        'Resource_CacheControl': module.Resource_CacheControl,
        'Resource': module.Resource
    })),
    'envoy/service/event_reporting/v3/event_reporting_service': () => import('./envoy/service/event_reporting/v3/event_reporting_service').then(module => ({
        'StreamEventsRequest_Identifier': module.StreamEventsRequest_Identifier,
        'StreamEventsRequest': module.StreamEventsRequest
    })),
    'envoy/service/ext_proc/v3/external_processor': () => import('./envoy/service/ext_proc/v3/external_processor').then(module => ({
        'ProcessingRequest': module.ProcessingRequest,
        'ProcessingRequest_AttributesEntry': module.ProcessingRequest_AttributesEntry,
        'ProcessingResponse': module.ProcessingResponse,
        'HttpHeaders': module.HttpHeaders,
        'HttpHeaders_AttributesEntry': module.HttpHeaders_AttributesEntry,
        'HttpBody': module.HttpBody,
        'HttpTrailers': module.HttpTrailers,
        'HeaderMutation': module.HeaderMutation,
        'BodyMutation': module.BodyMutation,
        'CommonResponse': module.CommonResponse,
        'HeadersResponse': module.HeadersResponse,
        'BodyResponse': module.BodyResponse,
        'TrailersResponse': module.TrailersResponse,
        'GrpcStatus': module.GrpcStatus,
        'ImmediateResponse': module.ImmediateResponse,
        'StreamedBodyResponse': module.StreamedBodyResponse
    })),
    'envoy/service/health/v3/hds': () => import('./envoy/service/health/v3/hds').then(module => ({
        'Capability': module.Capability,
        'HealthCheckRequest': module.HealthCheckRequest,
        'EndpointHealth': module.EndpointHealth,
        'LocalityEndpointsHealth': module.LocalityEndpointsHealth,
        'ClusterEndpointsHealth': module.ClusterEndpointsHealth,
        'EndpointHealthResponse': module.EndpointHealthResponse,
        'HealthCheckRequestOrEndpointHealthResponse': module.HealthCheckRequestOrEndpointHealthResponse,
        'LocalityEndpoints': module.LocalityEndpoints,
        'ClusterHealthCheck': module.ClusterHealthCheck,
        'HealthCheckSpecifier': module.HealthCheckSpecifier
    })),
    'envoy/service/load_stats/v3/lrs': () => import('./envoy/service/load_stats/v3/lrs').then(module => ({
        'LoadStatsRequest': module.LoadStatsRequest,
        'LoadStatsResponse': module.LoadStatsResponse
    })),
    'envoy/service/metrics/v3/metrics_service': () => import('./envoy/service/metrics/v3/metrics_service').then(module => ({
        'StreamMetricsMessage_Identifier': module.StreamMetricsMessage_Identifier,
        'StreamMetricsMessage': module.StreamMetricsMessage
    })),
    'envoy/service/rate_limit_quota/v3/rlqs': () => import('./envoy/service/rate_limit_quota/v3/rlqs').then(module => ({
        'RateLimitQuotaUsageReports': module.RateLimitQuotaUsageReports,
        'BucketId': module.BucketId,
        'RateLimitQuotaUsageReports_BucketQuotaUsage': module.RateLimitQuotaUsageReports_BucketQuotaUsage,
        'RateLimitQuotaResponse': module.RateLimitQuotaResponse,
        'RateLimitQuotaResponse_BucketAction': module.RateLimitQuotaResponse_BucketAction,
        'RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction': module.RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction,
        'BucketId_BucketEntry': module.BucketId_BucketEntry
    })),
    'envoy/service/ratelimit/v3/rls': () => import('./envoy/service/ratelimit/v3/rls').then(module => ({
        'RateLimitRequest': module.RateLimitRequest,
        'RateLimitResponse_Quota': module.RateLimitResponse_Quota,
        'RateLimitResponse': module.RateLimitResponse,
        'RateLimitResponse_RateLimit': module.RateLimitResponse_RateLimit,
        'RateLimitResponse_DescriptorStatus': module.RateLimitResponse_DescriptorStatus
    })),
    'envoy/service/redis_auth/v3/redis_external_auth': () => import('./envoy/service/redis_auth/v3/redis_external_auth').then(module => ({
        'RedisProxyExternalAuthRequest': module.RedisProxyExternalAuthRequest,
        'RedisProxyExternalAuthResponse': module.RedisProxyExternalAuthResponse
    })),
    'envoy/service/runtime/v3/rtds': () => import('./envoy/service/runtime/v3/rtds').then(module => ({
        'Runtime': module.Runtime
    })),
    'envoy/service/status/v3/csds': () => import('./envoy/service/status/v3/csds').then(module => ({
        'ClientStatusRequest': module.ClientStatusRequest,
        'PerXdsConfig': module.PerXdsConfig,
        'ClientConfig': module.ClientConfig,
        'ClientConfig_GenericXdsConfig': module.ClientConfig_GenericXdsConfig,
        'ClientStatusResponse': module.ClientStatusResponse
    })),
    'envoy/service/tap/v3/tap': () => import('./envoy/service/tap/v3/tap').then(module => ({
        'StreamTapsRequest_Identifier': module.StreamTapsRequest_Identifier,
        'StreamTapsRequest': module.StreamTapsRequest
    })),
    'envoy/type/hash_policy': () => import('./envoy/type/hash_policy').then(module => ({
        'HashPolicy': module.HashPolicy
    })),
    'envoy/type/http/v3/cookie': () => import('./envoy/type/http/v3/cookie').then(module => ({
        'Cookie': module.Cookie
    })),
    'envoy/type/http/v3/path_transformation': () => import('./envoy/type/http/v3/path_transformation').then(module => ({
        'PathTransformation': module.PathTransformation,
        'PathTransformation_Operation': module.PathTransformation_Operation
    })),
    'envoy/type/http_status': () => import('./envoy/type/http_status').then(module => ({
        'HttpStatus': module.HttpStatus
    })),
    'envoy/type/matcher/metadata': () => import('./envoy/type/matcher/metadata').then(module => ({
        'MetadataMatcher': module.MetadataMatcher,
        'MetadataMatcher_PathSegment': module.MetadataMatcher_PathSegment
    })),
    'envoy/type/matcher/node': () => import('./envoy/type/matcher/node').then(module => ({
        'NodeMatcher': module.NodeMatcher
    })),
    'envoy/type/matcher/number': () => import('./envoy/type/matcher/number').then(module => ({
        'DoubleMatcher': module.DoubleMatcher
    })),
    'envoy/type/matcher/path': () => import('./envoy/type/matcher/path').then(module => ({
        'PathMatcher': module.PathMatcher
    })),
    'envoy/type/matcher/regex': () => import('./envoy/type/matcher/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher,
        'RegexMatcher_GoogleRE2': module.RegexMatcher_GoogleRE2,
        'RegexMatchAndSubstitute': module.RegexMatchAndSubstitute
    })),
    'envoy/type/matcher/string': () => import('./envoy/type/matcher/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'ListStringMatcher': module.ListStringMatcher
    })),
    'envoy/type/matcher/struct': () => import('./envoy/type/matcher/struct').then(module => ({
        'StructMatcher': module.StructMatcher,
        'StructMatcher_PathSegment': module.StructMatcher_PathSegment
    })),
    'envoy/type/matcher/v3/address': () => import('./envoy/type/matcher/v3/address').then(module => ({
        'AddressMatcher': module.AddressMatcher
    })),
    'envoy/type/matcher/v3/filter_state': () => import('./envoy/type/matcher/v3/filter_state').then(module => ({
        'FilterStateMatcher': module.FilterStateMatcher
    })),
    'envoy/type/matcher/v3/http_inputs': () => import('./envoy/type/matcher/v3/http_inputs').then(module => ({
        'HttpRequestHeaderMatchInput': module.HttpRequestHeaderMatchInput,
        'HttpRequestTrailerMatchInput': module.HttpRequestTrailerMatchInput,
        'HttpResponseHeaderMatchInput': module.HttpResponseHeaderMatchInput,
        'HttpResponseTrailerMatchInput': module.HttpResponseTrailerMatchInput,
        'HttpRequestQueryParamMatchInput': module.HttpRequestQueryParamMatchInput
    })),
    'envoy/type/matcher/v3/metadata': () => import('./envoy/type/matcher/v3/metadata').then(module => ({
        'MetadataMatcher': module.MetadataMatcher,
        'MetadataMatcher_PathSegment': module.MetadataMatcher_PathSegment
    })),
    'envoy/type/matcher/v3/node': () => import('./envoy/type/matcher/v3/node').then(module => ({
        'NodeMatcher': module.NodeMatcher
    })),
    'envoy/type/matcher/v3/number': () => import('./envoy/type/matcher/v3/number').then(module => ({
        'DoubleMatcher': module.DoubleMatcher
    })),
    'envoy/type/matcher/v3/path': () => import('./envoy/type/matcher/v3/path').then(module => ({
        'PathMatcher': module.PathMatcher
    })),
    'envoy/type/matcher/v3/regex': () => import('./envoy/type/matcher/v3/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher,
        'RegexMatcher_GoogleRE2': module.RegexMatcher_GoogleRE2,
        'RegexMatchAndSubstitute': module.RegexMatchAndSubstitute
    })),
    'envoy/type/matcher/v3/string': () => import('./envoy/type/matcher/v3/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'ListStringMatcher': module.ListStringMatcher
    })),
    'envoy/type/matcher/v3/struct': () => import('./envoy/type/matcher/v3/struct').then(module => ({
        'StructMatcher': module.StructMatcher,
        'StructMatcher_PathSegment': module.StructMatcher_PathSegment
    })),
    'envoy/type/matcher/v3/value': () => import('./envoy/type/matcher/v3/value').then(module => ({
        'ValueMatcher': module.ValueMatcher,
        'ListMatcher': module.ListMatcher,
        'OrMatcher': module.OrMatcher
    })),
    'envoy/type/matcher/value': () => import('./envoy/type/matcher/value').then(module => ({
        'ValueMatcher': module.ValueMatcher,
        'ListMatcher': module.ListMatcher
    })),
    'envoy/type/metadata/v3/metadata': () => import('./envoy/type/metadata/v3/metadata').then(module => ({
        'MetadataKey': module.MetadataKey,
        'MetadataKey_PathSegment': module.MetadataKey_PathSegment,
        'MetadataKind': module.MetadataKind
    })),
    'envoy/type/percent': () => import('./envoy/type/percent').then(module => ({
        'Percent': module.Percent,
        'FractionalPercent': module.FractionalPercent
    })),
    'envoy/type/range': () => import('./envoy/type/range').then(module => ({
        'Int64Range': module.Int64Range,
        'Int32Range': module.Int32Range,
        'DoubleRange': module.DoubleRange
    })),
    'envoy/type/semantic_version': () => import('./envoy/type/semantic_version').then(module => ({
        'SemanticVersion': module.SemanticVersion
    })),
    'envoy/type/token_bucket': () => import('./envoy/type/token_bucket').then(module => ({
        'TokenBucket': module.TokenBucket
    })),
    'envoy/type/tracing/v3/custom_tag': () => import('./envoy/type/tracing/v3/custom_tag').then(module => ({
        'CustomTag': module.CustomTag,
        'CustomTag_Literal': module.CustomTag_Literal,
        'CustomTag_Environment': module.CustomTag_Environment,
        'CustomTag_Header': module.CustomTag_Header,
        'CustomTag_Metadata': module.CustomTag_Metadata
    })),
    'envoy/type/v3/hash_policy': () => import('./envoy/type/v3/hash_policy').then(module => ({
        'HashPolicy': module.HashPolicy,
        'HashPolicy_FilterState': module.HashPolicy_FilterState
    })),
    'envoy/type/v3/http_status': () => import('./envoy/type/v3/http_status').then(module => ({
        'HttpStatus': module.HttpStatus
    })),
    'envoy/type/v3/percent': () => import('./envoy/type/v3/percent').then(module => ({
        'Percent': module.Percent,
        'FractionalPercent': module.FractionalPercent
    })),
    'envoy/type/v3/range': () => import('./envoy/type/v3/range').then(module => ({
        'Int64Range': module.Int64Range,
        'Int32Range': module.Int32Range,
        'DoubleRange': module.DoubleRange
    })),
    'envoy/type/v3/ratelimit_strategy': () => import('./envoy/type/v3/ratelimit_strategy').then(module => ({
        'RateLimitStrategy': module.RateLimitStrategy,
        'RateLimitStrategy_RequestsPerTimeUnit': module.RateLimitStrategy_RequestsPerTimeUnit
    })),
    'envoy/type/v3/semantic_version': () => import('./envoy/type/v3/semantic_version').then(module => ({
        'SemanticVersion': module.SemanticVersion
    })),
    'envoy/type/v3/token_bucket': () => import('./envoy/type/v3/token_bucket').then(module => ({
        'TokenBucket': module.TokenBucket
    })),
    'envoy/watchdog/v3/abort_action': () => import('./envoy/watchdog/v3/abort_action').then(module => ({
        'AbortActionConfig': module.AbortActionConfig
    })),
    'google/api/expr/v1alpha1/checked': () => import('./google/api/expr/v1alpha1/checked').then(module => ({
        'CheckedExpr': module.CheckedExpr,
        'Reference': module.Reference,
        'CheckedExpr_ReferenceMapEntry': module.CheckedExpr_ReferenceMapEntry,
        'Type': module.Type,
        'CheckedExpr_TypeMapEntry': module.CheckedExpr_TypeMapEntry,
        'Type_ListType': module.Type_ListType,
        'Type_MapType': module.Type_MapType,
        'Type_FunctionType': module.Type_FunctionType,
        'Type_AbstractType': module.Type_AbstractType,
        'Decl': module.Decl,
        'Decl_IdentDecl': module.Decl_IdentDecl,
        'Decl_FunctionDecl': module.Decl_FunctionDecl,
        'Decl_FunctionDecl_Overload': module.Decl_FunctionDecl_Overload
    })),
    'google/api/expr/v1alpha1/syntax': () => import('./google/api/expr/v1alpha1/syntax').then(module => ({
        'Expr': module.Expr,
        'SourceInfo': module.SourceInfo,
        'ParsedExpr': module.ParsedExpr,
        'Expr_Ident': module.Expr_Ident,
        'Expr_Select': module.Expr_Select,
        'Expr_Call': module.Expr_Call,
        'Expr_CreateList': module.Expr_CreateList,
        'Expr_CreateStruct': module.Expr_CreateStruct,
        'Expr_CreateStruct_Entry': module.Expr_CreateStruct_Entry,
        'Expr_Comprehension': module.Expr_Comprehension,
        'Constant': module.Constant,
        'SourceInfo_PositionsEntry': module.SourceInfo_PositionsEntry,
        'SourceInfo_MacroCallsEntry': module.SourceInfo_MacroCallsEntry,
        'SourcePosition': module.SourcePosition
    })),
    'google/api/http': () => import('./google/api/http').then(module => ({
        'Http': module.Http,
        'HttpRule': module.HttpRule,
        'CustomHttpPattern': module.CustomHttpPattern
    })),
    'google/protobuf/any': () => import('./google/protobuf/any').then(module => ({
        'Any': module.Any
    })),
    'google/protobuf/descriptor': () => import('./google/protobuf/descriptor').then(module => ({
        'FileDescriptorSet': module.FileDescriptorSet,
        'FileOptions': module.FileOptions,
        'SourceCodeInfo': module.SourceCodeInfo,
        'FileDescriptorProto': module.FileDescriptorProto,
        'MessageOptions': module.MessageOptions,
        'DescriptorProto': module.DescriptorProto,
        'ExtensionRangeOptions': module.ExtensionRangeOptions,
        'DescriptorProto_ExtensionRange': module.DescriptorProto_ExtensionRange,
        'DescriptorProto_ReservedRange': module.DescriptorProto_ReservedRange,
        'FieldOptions': module.FieldOptions,
        'FieldDescriptorProto': module.FieldDescriptorProto,
        'OneofOptions': module.OneofOptions,
        'OneofDescriptorProto': module.OneofDescriptorProto,
        'EnumOptions': module.EnumOptions,
        'EnumDescriptorProto': module.EnumDescriptorProto,
        'EnumDescriptorProto_EnumReservedRange': module.EnumDescriptorProto_EnumReservedRange,
        'EnumValueOptions': module.EnumValueOptions,
        'EnumValueDescriptorProto': module.EnumValueDescriptorProto,
        'ServiceOptions': module.ServiceOptions,
        'ServiceDescriptorProto': module.ServiceDescriptorProto,
        'MethodOptions': module.MethodOptions,
        'MethodDescriptorProto': module.MethodDescriptorProto,
        'UninterpretedOption': module.UninterpretedOption,
        'UninterpretedOption_NamePart': module.UninterpretedOption_NamePart,
        'SourceCodeInfo_Location': module.SourceCodeInfo_Location,
        'GeneratedCodeInfo': module.GeneratedCodeInfo,
        'GeneratedCodeInfo_Annotation': module.GeneratedCodeInfo_Annotation
    })),
    'google/protobuf/duration': () => import('./google/protobuf/duration').then(module => ({
        'Duration': module.Duration
    })),
    'google/protobuf/struct': () => import('./google/protobuf/struct').then(module => ({
        'Struct': module.Struct,
        'Struct_FieldsEntry': module.Struct_FieldsEntry,
        'Value': module.Value,
        'ListValue': module.ListValue
    })),
    'google/protobuf/timestamp': () => import('./google/protobuf/timestamp').then(module => ({
        'Timestamp': module.Timestamp
    })),
    'google/protobuf/wrappers': () => import('./google/protobuf/wrappers').then(module => ({
        'DoubleValue': module.DoubleValue,
        'FloatValue': module.FloatValue,
        'Int64Value': module.Int64Value,
        'UInt64Value': module.UInt64Value,
        'Int32Value': module.Int32Value,
        'UInt32Value': module.UInt32Value,
        'BoolValue': module.BoolValue,
        'StringValue': module.StringValue,
        'BytesValue': module.BytesValue
    })),
    'google/rpc/status': () => import('./google/rpc/status').then(module => ({
        'Status': module.Status
    })),
    'io/prometheus/client/metrics': () => import('./io/prometheus/client/metrics').then(module => ({
        'LabelPair': module.LabelPair,
        'Gauge': module.Gauge,
        'Exemplar': module.Exemplar,
        'Counter': module.Counter,
        'Quantile': module.Quantile,
        'Summary': module.Summary,
        'Untyped': module.Untyped,
        'Histogram': module.Histogram,
        'Bucket': module.Bucket,
        'Metric': module.Metric,
        'MetricFamily': module.MetricFamily
    })),
    'opentelemetry/proto/common/v1/common': () => import('./opentelemetry/proto/common/v1/common').then(module => ({
        'AnyValue': module.AnyValue,
        'ArrayValue': module.ArrayValue,
        'KeyValueList': module.KeyValueList,
        'KeyValue': module.KeyValue,
        'InstrumentationScope': module.InstrumentationScope
    })),
    'udpa/annotations/migrate': () => import('./udpa/annotations/migrate').then(module => ({
        'MigrateAnnotation': module.MigrateAnnotation,
        'FieldMigrateAnnotation': module.FieldMigrateAnnotation,
        'FileMigrateAnnotation': module.FileMigrateAnnotation
    })),
    'udpa/annotations/security': () => import('./udpa/annotations/security').then(module => ({
        'FieldSecurityAnnotation': module.FieldSecurityAnnotation
    })),
    'udpa/annotations/status': () => import('./udpa/annotations/status').then(module => ({
        'StatusAnnotation': module.StatusAnnotation
    })),
    'udpa/annotations/versioning': () => import('./udpa/annotations/versioning').then(module => ({
        'VersioningAnnotation': module.VersioningAnnotation
    })),
    'validate/validate': () => import('./validate/validate').then(module => ({
        'MessageRules': module.MessageRules,
        'FieldRules': module.FieldRules,
        'FloatRules': module.FloatRules,
        'DoubleRules': module.DoubleRules,
        'Int32Rules': module.Int32Rules,
        'Int64Rules': module.Int64Rules,
        'UInt32Rules': module.UInt32Rules,
        'UInt64Rules': module.UInt64Rules,
        'SInt32Rules': module.SInt32Rules,
        'SInt64Rules': module.SInt64Rules,
        'Fixed32Rules': module.Fixed32Rules,
        'Fixed64Rules': module.Fixed64Rules,
        'SFixed32Rules': module.SFixed32Rules,
        'SFixed64Rules': module.SFixed64Rules,
        'BoolRules': module.BoolRules,
        'StringRules': module.StringRules,
        'BytesRules': module.BytesRules,
        'EnumRules': module.EnumRules,
        'RepeatedRules': module.RepeatedRules,
        'MapRules': module.MapRules,
        'AnyRules': module.AnyRules,
        'DurationRules': module.DurationRules,
        'TimestampRules': module.TimestampRules
    })),
    'xds/annotations/v3/status': () => import('./xds/annotations/v3/status').then(module => ({
        'FileStatusAnnotation': module.FileStatusAnnotation,
        'MessageStatusAnnotation': module.MessageStatusAnnotation,
        'FieldStatusAnnotation': module.FieldStatusAnnotation,
        'StatusAnnotation': module.StatusAnnotation
    })),
    'xds/core/v3/authority': () => import('./xds/core/v3/authority').then(module => ({
        'Authority': module.Authority
    })),
    'xds/core/v3/cidr': () => import('./xds/core/v3/cidr').then(module => ({
        'CidrRange': module.CidrRange
    })),
    'xds/core/v3/collection_entry': () => import('./xds/core/v3/collection_entry').then(module => ({
        'CollectionEntry': module.CollectionEntry,
        'CollectionEntry_InlineEntry': module.CollectionEntry_InlineEntry
    })),
    'xds/core/v3/context_params': () => import('./xds/core/v3/context_params').then(module => ({
        'ContextParams': module.ContextParams,
        'ContextParams_ParamsEntry': module.ContextParams_ParamsEntry
    })),
    'xds/core/v3/extension': () => import('./xds/core/v3/extension').then(module => ({
        'TypedExtensionConfig': module.TypedExtensionConfig
    })),
    'xds/core/v3/resource_locator': () => import('./xds/core/v3/resource_locator').then(module => ({
        'ResourceLocator': module.ResourceLocator,
        'ResourceLocator_Directive': module.ResourceLocator_Directive
    })),
    'xds/type/matcher/v3/matcher': () => import('./xds/type/matcher/v3/matcher').then(module => ({
        'Matcher_OnMatch': module.Matcher_OnMatch,
        'Matcher': module.Matcher,
        'Matcher_MatcherList': module.Matcher_MatcherList,
        'Matcher_MatcherList_Predicate': module.Matcher_MatcherList_Predicate,
        'Matcher_MatcherList_Predicate_SinglePredicate': module.Matcher_MatcherList_Predicate_SinglePredicate,
        'Matcher_MatcherList_Predicate_PredicateList': module.Matcher_MatcherList_Predicate_PredicateList,
        'Matcher_MatcherList_FieldMatcher': module.Matcher_MatcherList_FieldMatcher,
        'Matcher_MatcherTree': module.Matcher_MatcherTree,
        'Matcher_MatcherTree_MatchMap': module.Matcher_MatcherTree_MatchMap,
        'Matcher_MatcherTree_MatchMap_MapEntry': module.Matcher_MatcherTree_MatchMap_MapEntry
    })),
    'xds/type/matcher/v3/regex': () => import('./xds/type/matcher/v3/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher
    })),
    'xds/type/matcher/v3/string': () => import('./xds/type/matcher/v3/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'ListStringMatcher': module.ListStringMatcher
    })),
};