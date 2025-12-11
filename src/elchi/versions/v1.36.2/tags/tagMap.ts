export const tagMap: { [relativePath: string]: () => Promise<any> } = {
    'bazel/cc_proto_descriptor_library/testdata/test': () => import('./bazel/cc_proto_descriptor_library/testdata/test').then(module => ({
        'Foo': module.Foo,
        'Foo_SingleFields': module.Foo_SingleFields
    })),
    'bazel/cc_proto_descriptor_library/testdata/test1': () => import('./bazel/cc_proto_descriptor_library/testdata/test1').then(module => ({
        'FooCopy': module.FooCopy,
        'FooCopy_SingleFields': module.FooCopy_SingleFields
    })),
    'contrib/envoy/extensions/filters/network/client_ssl_auth/v3/client_ssl_auth': () => import('./contrib/envoy/extensions/filters/network/client_ssl_auth/v3/client_ssl_auth').then(module => ({
        'ClientSSLAuth': module.ClientSSLAuth,
        'ClientSSLAuth_SingleFields': module.ClientSSLAuth_SingleFields
    })),
    'contrib/envoy/extensions/filters/network/kafka_broker/v3/kafka_broker': () => import('./contrib/envoy/extensions/filters/network/kafka_broker/v3/kafka_broker').then(module => ({
        'KafkaBroker': module.KafkaBroker,
        'KafkaBroker_SingleFields': module.KafkaBroker_SingleFields,
        'IdBasedBrokerRewriteSpec': module.IdBasedBrokerRewriteSpec,
        'IdBasedBrokerRewriteRule': module.IdBasedBrokerRewriteRule,
        'IdBasedBrokerRewriteRule_SingleFields': module.IdBasedBrokerRewriteRule_SingleFields
    })),
    'contrib/envoy/extensions/filters/network/mysql_proxy/v3/mysql_proxy': () => import('./contrib/envoy/extensions/filters/network/mysql_proxy/v3/mysql_proxy').then(module => ({
        'MySQLProxy': module.MySQLProxy,
        'MySQLProxy_SingleFields': module.MySQLProxy_SingleFields
    })),
    'contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/rocketmq_proxy': () => import('./contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/rocketmq_proxy').then(module => ({
        'RocketmqProxy': module.RocketmqProxy,
        'RocketmqProxy_SingleFields': module.RocketmqProxy_SingleFields
    })),
    'contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/route': () => import('./contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_SingleFields': module.RouteConfiguration_SingleFields,
        'RouteMatch': module.RouteMatch,
        'RouteAction': module.RouteAction,
        'RouteAction_SingleFields': module.RouteAction_SingleFields,
        'Route': module.Route
    })),
    'envoy/admin/v3/certs': () => import('./envoy/admin/v3/certs').then(module => ({
        'Certificates': module.Certificates,
        'Certificate': module.Certificate,
        'CertificateDetails_OcspDetails': module.CertificateDetails_OcspDetails,
        'CertificateDetails': module.CertificateDetails,
        'CertificateDetails_SingleFields': module.CertificateDetails_SingleFields,
        'SubjectAlternateName': module.SubjectAlternateName,
        'SubjectAlternateName_SingleFields': module.SubjectAlternateName_SingleFields
    })),
    'envoy/admin/v3/clusters': () => import('./envoy/admin/v3/clusters').then(module => ({
        'Clusters': module.Clusters,
        'ClusterStatus': module.ClusterStatus,
        'ClusterStatus_SingleFields': module.ClusterStatus_SingleFields,
        'HostHealthStatus': module.HostHealthStatus,
        'HostHealthStatus_SingleFields': module.HostHealthStatus_SingleFields,
        'HostStatus': module.HostStatus,
        'HostStatus_SingleFields': module.HostStatus_SingleFields
    })),
    'envoy/admin/v3/config_dump': () => import('./envoy/admin/v3/config_dump').then(module => ({
        'ConfigDump': module.ConfigDump,
        'BootstrapConfigDump': module.BootstrapConfigDump,
        'SecretsConfigDump': module.SecretsConfigDump,
        'SecretsConfigDump_DynamicSecret': module.SecretsConfigDump_DynamicSecret,
        'SecretsConfigDump_DynamicSecret_SingleFields': module.SecretsConfigDump_DynamicSecret_SingleFields,
        'SecretsConfigDump_StaticSecret': module.SecretsConfigDump_StaticSecret,
        'SecretsConfigDump_StaticSecret_SingleFields': module.SecretsConfigDump_StaticSecret_SingleFields
    })),
    'envoy/admin/v3/config_dump_shared': () => import('./envoy/admin/v3/config_dump_shared').then(module => ({
        'UpdateFailureState': module.UpdateFailureState,
        'UpdateFailureState_SingleFields': module.UpdateFailureState_SingleFields,
        'ListenersConfigDump': module.ListenersConfigDump,
        'ListenersConfigDump_SingleFields': module.ListenersConfigDump_SingleFields,
        'ListenersConfigDump_StaticListener': module.ListenersConfigDump_StaticListener,
        'ListenersConfigDump_DynamicListenerState': module.ListenersConfigDump_DynamicListenerState,
        'ListenersConfigDump_DynamicListenerState_SingleFields': module.ListenersConfigDump_DynamicListenerState_SingleFields,
        'ListenersConfigDump_DynamicListener': module.ListenersConfigDump_DynamicListener,
        'ListenersConfigDump_DynamicListener_SingleFields': module.ListenersConfigDump_DynamicListener_SingleFields,
        'ClustersConfigDump': module.ClustersConfigDump,
        'ClustersConfigDump_SingleFields': module.ClustersConfigDump_SingleFields,
        'ClustersConfigDump_StaticCluster': module.ClustersConfigDump_StaticCluster,
        'ClustersConfigDump_DynamicCluster': module.ClustersConfigDump_DynamicCluster,
        'ClustersConfigDump_DynamicCluster_SingleFields': module.ClustersConfigDump_DynamicCluster_SingleFields,
        'RoutesConfigDump': module.RoutesConfigDump,
        'RoutesConfigDump_StaticRouteConfig': module.RoutesConfigDump_StaticRouteConfig,
        'RoutesConfigDump_DynamicRouteConfig': module.RoutesConfigDump_DynamicRouteConfig,
        'RoutesConfigDump_DynamicRouteConfig_SingleFields': module.RoutesConfigDump_DynamicRouteConfig_SingleFields,
        'ScopedRoutesConfigDump': module.ScopedRoutesConfigDump,
        'ScopedRoutesConfigDump_InlineScopedRouteConfigs': module.ScopedRoutesConfigDump_InlineScopedRouteConfigs,
        'ScopedRoutesConfigDump_InlineScopedRouteConfigs_SingleFields': module.ScopedRoutesConfigDump_InlineScopedRouteConfigs_SingleFields,
        'ScopedRoutesConfigDump_DynamicScopedRouteConfigs': module.ScopedRoutesConfigDump_DynamicScopedRouteConfigs,
        'ScopedRoutesConfigDump_DynamicScopedRouteConfigs_SingleFields': module.ScopedRoutesConfigDump_DynamicScopedRouteConfigs_SingleFields,
        'EndpointsConfigDump': module.EndpointsConfigDump,
        'EndpointsConfigDump_StaticEndpointConfig': module.EndpointsConfigDump_StaticEndpointConfig,
        'EndpointsConfigDump_DynamicEndpointConfig': module.EndpointsConfigDump_DynamicEndpointConfig,
        'EndpointsConfigDump_DynamicEndpointConfig_SingleFields': module.EndpointsConfigDump_DynamicEndpointConfig_SingleFields,
        'EcdsConfigDump': module.EcdsConfigDump,
        'EcdsConfigDump_EcdsFilterConfig': module.EcdsConfigDump_EcdsFilterConfig,
        'EcdsConfigDump_EcdsFilterConfig_SingleFields': module.EcdsConfigDump_EcdsFilterConfig_SingleFields
    })),
    'envoy/admin/v3/init_dump': () => import('./envoy/admin/v3/init_dump').then(module => ({
        'UnreadyTargetsDumps': module.UnreadyTargetsDumps,
        'UnreadyTargetsDumps_UnreadyTargetsDump': module.UnreadyTargetsDumps_UnreadyTargetsDump,
        'UnreadyTargetsDumps_UnreadyTargetsDump_SingleFields': module.UnreadyTargetsDumps_UnreadyTargetsDump_SingleFields
    })),
    'envoy/admin/v3/listeners': () => import('./envoy/admin/v3/listeners').then(module => ({
        'Listeners': module.Listeners,
        'ListenerStatus': module.ListenerStatus,
        'ListenerStatus_SingleFields': module.ListenerStatus_SingleFields
    })),
    'envoy/admin/v3/memory': () => import('./envoy/admin/v3/memory').then(module => ({
        'Memory': module.Memory,
        'Memory_SingleFields': module.Memory_SingleFields
    })),
    'envoy/admin/v3/metrics': () => import('./envoy/admin/v3/metrics').then(module => ({
        'SimpleMetric': module.SimpleMetric,
        'SimpleMetric_SingleFields': module.SimpleMetric_SingleFields
    })),
    'envoy/admin/v3/mutex_stats': () => import('./envoy/admin/v3/mutex_stats').then(module => ({
        'MutexStats': module.MutexStats,
        'MutexStats_SingleFields': module.MutexStats_SingleFields
    })),
    'envoy/admin/v3/server_info': () => import('./envoy/admin/v3/server_info').then(module => ({
        'CommandLineOptions': module.CommandLineOptions,
        'CommandLineOptions_SingleFields': module.CommandLineOptions_SingleFields,
        'ServerInfo': module.ServerInfo,
        'ServerInfo_SingleFields': module.ServerInfo_SingleFields
    })),
    'envoy/admin/v3/tap': () => import('./envoy/admin/v3/tap').then(module => ({
        'TapRequest': module.TapRequest,
        'TapRequest_SingleFields': module.TapRequest_SingleFields
    })),
    'envoy/annotations/resource': () => import('./envoy/annotations/resource').then(module => ({
        'ResourceAnnotation': module.ResourceAnnotation,
        'ResourceAnnotation_SingleFields': module.ResourceAnnotation_SingleFields
    })),
    'envoy/config/accesslog/v3/accesslog': () => import('./envoy/config/accesslog/v3/accesslog').then(module => ({
        'AccessLogFilter': module.AccessLogFilter,
        'AccessLog': module.AccessLog,
        'AccessLog_SingleFields': module.AccessLog_SingleFields,
        'ComparisonFilter': module.ComparisonFilter,
        'ComparisonFilter_SingleFields': module.ComparisonFilter_SingleFields,
        'StatusCodeFilter': module.StatusCodeFilter,
        'DurationFilter': module.DurationFilter,
        'RuntimeFilter': module.RuntimeFilter,
        'RuntimeFilter_SingleFields': module.RuntimeFilter_SingleFields,
        'AndFilter': module.AndFilter,
        'OrFilter': module.OrFilter,
        'HeaderFilter': module.HeaderFilter,
        'ResponseFlagFilter': module.ResponseFlagFilter,
        'ResponseFlagFilter_SingleFields': module.ResponseFlagFilter_SingleFields,
        'GrpcStatusFilter': module.GrpcStatusFilter,
        'GrpcStatusFilter_SingleFields': module.GrpcStatusFilter_SingleFields,
        'MetadataFilter': module.MetadataFilter,
        'MetadataFilter_SingleFields': module.MetadataFilter_SingleFields,
        'LogTypeFilter': module.LogTypeFilter,
        'LogTypeFilter_SingleFields': module.LogTypeFilter_SingleFields,
        'ExtensionFilter': module.ExtensionFilter,
        'ExtensionFilter_SingleFields': module.ExtensionFilter_SingleFields
    })),
    'envoy/config/bootstrap/v3/bootstrap': () => import('./envoy/config/bootstrap/v3/bootstrap').then(module => ({
        'Bootstrap_StaticResources': module.Bootstrap_StaticResources,
        'Bootstrap_DynamicResources': module.Bootstrap_DynamicResources,
        'Bootstrap_DynamicResources_SingleFields': module.Bootstrap_DynamicResources_SingleFields,
        'ClusterManager_OutlierDetection': module.ClusterManager_OutlierDetection,
        'ClusterManager_OutlierDetection_SingleFields': module.ClusterManager_OutlierDetection_SingleFields,
        'ClusterManager': module.ClusterManager,
        'ClusterManager_SingleFields': module.ClusterManager_SingleFields,
        'Bootstrap_DeferredStatOptions': module.Bootstrap_DeferredStatOptions,
        'Bootstrap_DeferredStatOptions_SingleFields': module.Bootstrap_DeferredStatOptions_SingleFields,
        'Watchdog': module.Watchdog,
        'Watchdog_SingleFields': module.Watchdog_SingleFields,
        'Watchdogs': module.Watchdogs,
        'LayeredRuntime': module.LayeredRuntime,
        'Admin': module.Admin,
        'Admin_SingleFields': module.Admin_SingleFields,
        'Bootstrap_ApplicationLogConfig_LogFormat': module.Bootstrap_ApplicationLogConfig_LogFormat,
        'Bootstrap_ApplicationLogConfig_LogFormat_SingleFields': module.Bootstrap_ApplicationLogConfig_LogFormat_SingleFields,
        'Bootstrap_ApplicationLogConfig': module.Bootstrap_ApplicationLogConfig,
        'Bootstrap_GrpcAsyncClientManagerConfig': module.Bootstrap_GrpcAsyncClientManagerConfig,
        'Bootstrap_GrpcAsyncClientManagerConfig_SingleFields': module.Bootstrap_GrpcAsyncClientManagerConfig_SingleFields,
        'MemoryAllocatorManager': module.MemoryAllocatorManager,
        'MemoryAllocatorManager_SingleFields': module.MemoryAllocatorManager_SingleFields,
        'Bootstrap': module.Bootstrap,
        'Bootstrap_SingleFields': module.Bootstrap_SingleFields,
        'Bootstrap_CertificateProviderInstancesEntry': module.Bootstrap_CertificateProviderInstancesEntry,
        'Bootstrap_CertificateProviderInstancesEntry_SingleFields': module.Bootstrap_CertificateProviderInstancesEntry_SingleFields,
        'Watchdog_WatchdogAction': module.Watchdog_WatchdogAction,
        'Watchdog_WatchdogAction_SingleFields': module.Watchdog_WatchdogAction_SingleFields,
        'FatalAction': module.FatalAction,
        'Runtime': module.Runtime,
        'Runtime_SingleFields': module.Runtime_SingleFields,
        'RuntimeLayer': module.RuntimeLayer,
        'RuntimeLayer_SingleFields': module.RuntimeLayer_SingleFields,
        'RuntimeLayer_DiskLayer': module.RuntimeLayer_DiskLayer,
        'RuntimeLayer_DiskLayer_SingleFields': module.RuntimeLayer_DiskLayer_SingleFields,
        'RuntimeLayer_RtdsLayer': module.RuntimeLayer_RtdsLayer,
        'RuntimeLayer_RtdsLayer_SingleFields': module.RuntimeLayer_RtdsLayer_SingleFields,
        'CustomInlineHeader': module.CustomInlineHeader,
        'CustomInlineHeader_SingleFields': module.CustomInlineHeader_SingleFields
    })),
    'envoy/config/cluster/redis/redis_cluster': () => import('./envoy/config/cluster/redis/redis_cluster').then(module => ({
        'RedisClusterConfig': module.RedisClusterConfig,
        'RedisClusterConfig_SingleFields': module.RedisClusterConfig_SingleFields
    })),
    'envoy/config/cluster/v3/circuit_breaker': () => import('./envoy/config/cluster/v3/circuit_breaker').then(module => ({
        'CircuitBreakers': module.CircuitBreakers,
        'CircuitBreakers_Thresholds_RetryBudget': module.CircuitBreakers_Thresholds_RetryBudget,
        'CircuitBreakers_Thresholds_RetryBudget_SingleFields': module.CircuitBreakers_Thresholds_RetryBudget_SingleFields,
        'CircuitBreakers_Thresholds': module.CircuitBreakers_Thresholds,
        'CircuitBreakers_Thresholds_SingleFields': module.CircuitBreakers_Thresholds_SingleFields
    })),
    'envoy/config/cluster/v3/cluster': () => import('./envoy/config/cluster/v3/cluster').then(module => ({
        'ClusterCollection': module.ClusterCollection,
        'Cluster_EdsClusterConfig': module.Cluster_EdsClusterConfig,
        'Cluster_EdsClusterConfig_SingleFields': module.Cluster_EdsClusterConfig_SingleFields,
        'Cluster_RefreshRate': module.Cluster_RefreshRate,
        'Cluster_RefreshRate_SingleFields': module.Cluster_RefreshRate_SingleFields,
        'Cluster_LbSubsetConfig': module.Cluster_LbSubsetConfig,
        'Cluster_LbSubsetConfig_SingleFields': module.Cluster_LbSubsetConfig_SingleFields,
        'Cluster_CommonLbConfig_ConsistentHashingLbConfig': module.Cluster_CommonLbConfig_ConsistentHashingLbConfig,
        'Cluster_CommonLbConfig_ConsistentHashingLbConfig_SingleFields': module.Cluster_CommonLbConfig_ConsistentHashingLbConfig_SingleFields,
        'Cluster_CommonLbConfig': module.Cluster_CommonLbConfig,
        'Cluster_CommonLbConfig_SingleFields': module.Cluster_CommonLbConfig_SingleFields,
        'UpstreamConnectionOptions_HappyEyeballsConfig': module.UpstreamConnectionOptions_HappyEyeballsConfig,
        'UpstreamConnectionOptions_HappyEyeballsConfig_SingleFields': module.UpstreamConnectionOptions_HappyEyeballsConfig_SingleFields,
        'UpstreamConnectionOptions': module.UpstreamConnectionOptions,
        'UpstreamConnectionOptions_SingleFields': module.UpstreamConnectionOptions_SingleFields,
        'LoadBalancingPolicy': module.LoadBalancingPolicy,
        'TrackClusterStats': module.TrackClusterStats,
        'TrackClusterStats_SingleFields': module.TrackClusterStats_SingleFields,
        'Cluster_PreconnectPolicy': module.Cluster_PreconnectPolicy,
        'Cluster_PreconnectPolicy_SingleFields': module.Cluster_PreconnectPolicy_SingleFields,
        'Cluster': module.Cluster,
        'Cluster_SingleFields': module.Cluster_SingleFields,
        'Cluster_TransportSocketMatch': module.Cluster_TransportSocketMatch,
        'Cluster_TransportSocketMatch_SingleFields': module.Cluster_TransportSocketMatch_SingleFields,
        'Cluster_CustomClusterType': module.Cluster_CustomClusterType,
        'Cluster_CustomClusterType_SingleFields': module.Cluster_CustomClusterType_SingleFields,
        'Cluster_LbSubsetConfig_LbSubsetSelector': module.Cluster_LbSubsetConfig_LbSubsetSelector,
        'Cluster_LbSubsetConfig_LbSubsetSelector_SingleFields': module.Cluster_LbSubsetConfig_LbSubsetSelector_SingleFields,
        'Cluster_SlowStartConfig': module.Cluster_SlowStartConfig,
        'Cluster_SlowStartConfig_SingleFields': module.Cluster_SlowStartConfig_SingleFields,
        'Cluster_RoundRobinLbConfig': module.Cluster_RoundRobinLbConfig,
        'Cluster_LeastRequestLbConfig': module.Cluster_LeastRequestLbConfig,
        'Cluster_LeastRequestLbConfig_SingleFields': module.Cluster_LeastRequestLbConfig_SingleFields,
        'Cluster_RingHashLbConfig': module.Cluster_RingHashLbConfig,
        'Cluster_RingHashLbConfig_SingleFields': module.Cluster_RingHashLbConfig_SingleFields,
        'Cluster_MaglevLbConfig': module.Cluster_MaglevLbConfig,
        'Cluster_MaglevLbConfig_SingleFields': module.Cluster_MaglevLbConfig_SingleFields,
        'Cluster_OriginalDstLbConfig': module.Cluster_OriginalDstLbConfig,
        'Cluster_OriginalDstLbConfig_SingleFields': module.Cluster_OriginalDstLbConfig_SingleFields,
        'Cluster_CommonLbConfig_ZoneAwareLbConfig': module.Cluster_CommonLbConfig_ZoneAwareLbConfig,
        'Cluster_CommonLbConfig_ZoneAwareLbConfig_SingleFields': module.Cluster_CommonLbConfig_ZoneAwareLbConfig_SingleFields,
        'Cluster_TypedExtensionProtocolOptionsEntry': module.Cluster_TypedExtensionProtocolOptionsEntry,
        'Cluster_TypedExtensionProtocolOptionsEntry_SingleFields': module.Cluster_TypedExtensionProtocolOptionsEntry_SingleFields,
        'LoadBalancingPolicy_Policy': module.LoadBalancingPolicy_Policy
    })),
    'envoy/config/cluster/v3/filter': () => import('./envoy/config/cluster/v3/filter').then(module => ({
        'Filter': module.Filter,
        'Filter_SingleFields': module.Filter_SingleFields
    })),
    'envoy/config/cluster/v3/outlier_detection': () => import('./envoy/config/cluster/v3/outlier_detection').then(module => ({
        'OutlierDetection': module.OutlierDetection,
        'OutlierDetection_SingleFields': module.OutlierDetection_SingleFields
    })),
    'envoy/config/common/key_value/v3/config': () => import('./envoy/config/common/key_value/v3/config').then(module => ({
        'KeyValueStoreConfig': module.KeyValueStoreConfig
    })),
    'envoy/config/common/matcher/v3/matcher': () => import('./envoy/config/common/matcher/v3/matcher').then(module => ({
        'Matcher_OnMatch': module.Matcher_OnMatch,
        'Matcher_OnMatch_SingleFields': module.Matcher_OnMatch_SingleFields,
        'Matcher': module.Matcher,
        'Matcher_MatcherList': module.Matcher_MatcherList,
        'Matcher_MatcherList_Predicate': module.Matcher_MatcherList_Predicate,
        'Matcher_MatcherList_Predicate_SinglePredicate': module.Matcher_MatcherList_Predicate_SinglePredicate,
        'Matcher_MatcherList_Predicate_PredicateList': module.Matcher_MatcherList_Predicate_PredicateList,
        'Matcher_MatcherList_FieldMatcher': module.Matcher_MatcherList_FieldMatcher,
        'Matcher_MatcherTree': module.Matcher_MatcherTree,
        'Matcher_MatcherTree_MatchMap': module.Matcher_MatcherTree_MatchMap,
        'Matcher_MatcherTree_MatchMap_MapEntry': module.Matcher_MatcherTree_MatchMap_MapEntry,
        'Matcher_MatcherTree_MatchMap_MapEntry_SingleFields': module.Matcher_MatcherTree_MatchMap_MapEntry_SingleFields,
        'MatchPredicate': module.MatchPredicate,
        'MatchPredicate_SingleFields': module.MatchPredicate_SingleFields,
        'MatchPredicate_MatchSet': module.MatchPredicate_MatchSet,
        'HttpHeadersMatch': module.HttpHeadersMatch,
        'HttpGenericBodyMatch': module.HttpGenericBodyMatch,
        'HttpGenericBodyMatch_SingleFields': module.HttpGenericBodyMatch_SingleFields,
        'HttpGenericBodyMatch_GenericTextMatch': module.HttpGenericBodyMatch_GenericTextMatch,
        'HttpGenericBodyMatch_GenericTextMatch_SingleFields': module.HttpGenericBodyMatch_GenericTextMatch_SingleFields
    })),
    'envoy/config/common/mutation_rules/v3/mutation_rules': () => import('./envoy/config/common/mutation_rules/v3/mutation_rules').then(module => ({
        'HeaderMutationRules': module.HeaderMutationRules,
        'HeaderMutationRules_SingleFields': module.HeaderMutationRules_SingleFields,
        'HeaderMutation': module.HeaderMutation,
        'HeaderMutation_SingleFields': module.HeaderMutation_SingleFields,
        'HeaderMutation_RemoveOnMatch': module.HeaderMutation_RemoveOnMatch
    })),
    'envoy/config/core/v3/address': () => import('./envoy/config/core/v3/address').then(module => ({
        'Pipe': module.Pipe,
        'Pipe_SingleFields': module.Pipe_SingleFields,
        'EnvoyInternalAddress': module.EnvoyInternalAddress,
        'EnvoyInternalAddress_SingleFields': module.EnvoyInternalAddress_SingleFields,
        'SocketAddress': module.SocketAddress,
        'SocketAddress_SingleFields': module.SocketAddress_SingleFields,
        'TcpKeepalive': module.TcpKeepalive,
        'TcpKeepalive_SingleFields': module.TcpKeepalive_SingleFields,
        'ExtraSourceAddress': module.ExtraSourceAddress,
        'BindConfig': module.BindConfig,
        'BindConfig_SingleFields': module.BindConfig_SingleFields,
        'Address': module.Address,
        'CidrRange': module.CidrRange,
        'CidrRange_SingleFields': module.CidrRange_SingleFields
    })),
    'envoy/config/core/v3/backoff': () => import('./envoy/config/core/v3/backoff').then(module => ({
        'BackoffStrategy': module.BackoffStrategy,
        'BackoffStrategy_SingleFields': module.BackoffStrategy_SingleFields
    })),
    'envoy/config/core/v3/base': () => import('./envoy/config/core/v3/base').then(module => ({
        'Locality': module.Locality,
        'Locality_SingleFields': module.Locality_SingleFields,
        'BuildVersion': module.BuildVersion,
        'Extension': module.Extension,
        'Extension_SingleFields': module.Extension_SingleFields,
        'Node': module.Node,
        'Node_SingleFields': module.Node_SingleFields,
        'Node_DynamicParametersEntry': module.Node_DynamicParametersEntry,
        'Node_DynamicParametersEntry_SingleFields': module.Node_DynamicParametersEntry_SingleFields,
        'Metadata': module.Metadata,
        'Metadata_FilterMetadataEntry': module.Metadata_FilterMetadataEntry,
        'Metadata_FilterMetadataEntry_SingleFields': module.Metadata_FilterMetadataEntry_SingleFields,
        'Metadata_TypedFilterMetadataEntry': module.Metadata_TypedFilterMetadataEntry,
        'Metadata_TypedFilterMetadataEntry_SingleFields': module.Metadata_TypedFilterMetadataEntry_SingleFields,
        'RuntimeUInt32': module.RuntimeUInt32,
        'RuntimeUInt32_SingleFields': module.RuntimeUInt32_SingleFields,
        'RuntimePercent': module.RuntimePercent,
        'RuntimePercent_SingleFields': module.RuntimePercent_SingleFields,
        'RuntimeDouble': module.RuntimeDouble,
        'RuntimeDouble_SingleFields': module.RuntimeDouble_SingleFields,
        'RuntimeFeatureFlag': module.RuntimeFeatureFlag,
        'RuntimeFeatureFlag_SingleFields': module.RuntimeFeatureFlag_SingleFields,
        'KeyValue': module.KeyValue,
        'KeyValuePair': module.KeyValuePair,
        'KeyValuePair_SingleFields': module.KeyValuePair_SingleFields,
        'KeyValueAppend': module.KeyValueAppend,
        'KeyValueAppend_SingleFields': module.KeyValueAppend_SingleFields,
        'KeyValueMutation': module.KeyValueMutation,
        'KeyValueMutation_SingleFields': module.KeyValueMutation_SingleFields,
        'QueryParameter': module.QueryParameter,
        'QueryParameter_SingleFields': module.QueryParameter_SingleFields,
        'HeaderValue': module.HeaderValue,
        'HeaderValue_SingleFields': module.HeaderValue_SingleFields,
        'HeaderValueOption': module.HeaderValueOption,
        'HeaderValueOption_SingleFields': module.HeaderValueOption_SingleFields,
        'HeaderMap': module.HeaderMap,
        'WatchedDirectory': module.WatchedDirectory,
        'WatchedDirectory_SingleFields': module.WatchedDirectory_SingleFields,
        'DataSource': module.DataSource,
        'DataSource_SingleFields': module.DataSource_SingleFields,
        'RetryPolicy_RetryPriority': module.RetryPolicy_RetryPriority,
        'RetryPolicy_RetryPriority_SingleFields': module.RetryPolicy_RetryPriority_SingleFields,
        'RetryPolicy': module.RetryPolicy,
        'RetryPolicy_SingleFields': module.RetryPolicy_SingleFields,
        'RetryPolicy_RetryHostPredicate': module.RetryPolicy_RetryHostPredicate,
        'RetryPolicy_RetryHostPredicate_SingleFields': module.RetryPolicy_RetryHostPredicate_SingleFields,
        'RemoteDataSource': module.RemoteDataSource,
        'RemoteDataSource_SingleFields': module.RemoteDataSource_SingleFields,
        'AsyncDataSource': module.AsyncDataSource,
        'TransportSocket': module.TransportSocket,
        'TransportSocket_SingleFields': module.TransportSocket_SingleFields,
        'RuntimeFractionalPercent': module.RuntimeFractionalPercent,
        'RuntimeFractionalPercent_SingleFields': module.RuntimeFractionalPercent_SingleFields,
        'ControlPlane': module.ControlPlane,
        'ControlPlane_SingleFields': module.ControlPlane_SingleFields
    })),
    'envoy/config/core/v3/config_source': () => import('./envoy/config/core/v3/config_source').then(module => ({
        'RateLimitSettings': module.RateLimitSettings,
        'RateLimitSettings_SingleFields': module.RateLimitSettings_SingleFields,
        'ApiConfigSource': module.ApiConfigSource,
        'ApiConfigSource_SingleFields': module.ApiConfigSource_SingleFields,
        'SelfConfigSource': module.SelfConfigSource,
        'SelfConfigSource_SingleFields': module.SelfConfigSource_SingleFields,
        'PathConfigSource': module.PathConfigSource,
        'PathConfigSource_SingleFields': module.PathConfigSource_SingleFields,
        'ConfigSource': module.ConfigSource,
        'ConfigSource_SingleFields': module.ConfigSource_SingleFields,
        'ExtensionConfigSource': module.ExtensionConfigSource,
        'ExtensionConfigSource_SingleFields': module.ExtensionConfigSource_SingleFields
    })),
    'envoy/config/core/v3/event_service_config': () => import('./envoy/config/core/v3/event_service_config').then(module => ({
        'EventServiceConfig': module.EventServiceConfig
    })),
    'envoy/config/core/v3/extension': () => import('./envoy/config/core/v3/extension').then(module => ({
        'TypedExtensionConfig': module.TypedExtensionConfig,
        'TypedExtensionConfig_SingleFields': module.TypedExtensionConfig_SingleFields
    })),
    'envoy/config/core/v3/grpc_method_list': () => import('./envoy/config/core/v3/grpc_method_list').then(module => ({
        'GrpcMethodList': module.GrpcMethodList,
        'GrpcMethodList_Service': module.GrpcMethodList_Service,
        'GrpcMethodList_Service_SingleFields': module.GrpcMethodList_Service_SingleFields
    })),
    'envoy/config/core/v3/grpc_service': () => import('./envoy/config/core/v3/grpc_service').then(module => ({
        'GrpcService': module.GrpcService,
        'GrpcService_SingleFields': module.GrpcService_SingleFields,
        'GrpcService_EnvoyGrpc': module.GrpcService_EnvoyGrpc,
        'GrpcService_EnvoyGrpc_SingleFields': module.GrpcService_EnvoyGrpc_SingleFields,
        'GrpcService_GoogleGrpc_ChannelCredentials': module.GrpcService_GoogleGrpc_ChannelCredentials,
        'GrpcService_GoogleGrpc_ChannelArgs': module.GrpcService_GoogleGrpc_ChannelArgs,
        'GrpcService_GoogleGrpc': module.GrpcService_GoogleGrpc,
        'GrpcService_GoogleGrpc_SingleFields': module.GrpcService_GoogleGrpc_SingleFields,
        'GrpcService_GoogleGrpc_SslCredentials': module.GrpcService_GoogleGrpc_SslCredentials,
        'GrpcService_GoogleGrpc_CallCredentials': module.GrpcService_GoogleGrpc_CallCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_SingleFields': module.GrpcService_GoogleGrpc_CallCredentials_SingleFields,
        'GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials': module.GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials_SingleFields': module.GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials_SingleFields,
        'GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials': module.GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials,
        'GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials_SingleFields': module.GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials_SingleFields,
        'GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin': module.GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin,
        'GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin_SingleFields': module.GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin_SingleFields,
        'GrpcService_GoogleGrpc_CallCredentials_StsService': module.GrpcService_GoogleGrpc_CallCredentials_StsService,
        'GrpcService_GoogleGrpc_CallCredentials_StsService_SingleFields': module.GrpcService_GoogleGrpc_CallCredentials_StsService_SingleFields,
        'GrpcService_GoogleGrpc_ChannelArgs_Value': module.GrpcService_GoogleGrpc_ChannelArgs_Value,
        'GrpcService_GoogleGrpc_ChannelArgs_Value_SingleFields': module.GrpcService_GoogleGrpc_ChannelArgs_Value_SingleFields,
        'GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry': module.GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry,
        'GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry_SingleFields': module.GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry_SingleFields
    })),
    'envoy/config/core/v3/health_check': () => import('./envoy/config/core/v3/health_check').then(module => ({
        'HealthStatusSet': module.HealthStatusSet,
        'HealthCheck_TlsOptions': module.HealthCheck_TlsOptions,
        'HealthCheck_TlsOptions_SingleFields': module.HealthCheck_TlsOptions_SingleFields,
        'HealthCheck': module.HealthCheck,
        'HealthCheck_SingleFields': module.HealthCheck_SingleFields,
        'HealthCheck_Payload': module.HealthCheck_Payload,
        'HealthCheck_Payload_SingleFields': module.HealthCheck_Payload_SingleFields,
        'HealthCheck_HttpHealthCheck': module.HealthCheck_HttpHealthCheck,
        'HealthCheck_HttpHealthCheck_SingleFields': module.HealthCheck_HttpHealthCheck_SingleFields,
        'HealthCheck_TcpHealthCheck': module.HealthCheck_TcpHealthCheck,
        'HealthCheck_RedisHealthCheck': module.HealthCheck_RedisHealthCheck,
        'HealthCheck_RedisHealthCheck_SingleFields': module.HealthCheck_RedisHealthCheck_SingleFields,
        'HealthCheck_GrpcHealthCheck': module.HealthCheck_GrpcHealthCheck,
        'HealthCheck_GrpcHealthCheck_SingleFields': module.HealthCheck_GrpcHealthCheck_SingleFields,
        'HealthCheck_CustomHealthCheck': module.HealthCheck_CustomHealthCheck,
        'HealthCheck_CustomHealthCheck_SingleFields': module.HealthCheck_CustomHealthCheck_SingleFields
    })),
    'envoy/config/core/v3/http_service': () => import('./envoy/config/core/v3/http_service').then(module => ({
        'HttpService': module.HttpService
    })),
    'envoy/config/core/v3/http_uri': () => import('./envoy/config/core/v3/http_uri').then(module => ({
        'HttpUri': module.HttpUri,
        'HttpUri_SingleFields': module.HttpUri_SingleFields
    })),
    'envoy/config/core/v3/protocol': () => import('./envoy/config/core/v3/protocol').then(module => ({
        'QuicKeepAliveSettings': module.QuicKeepAliveSettings,
        'QuicKeepAliveSettings_SingleFields': module.QuicKeepAliveSettings_SingleFields,
        'QuicProtocolOptions': module.QuicProtocolOptions,
        'QuicProtocolOptions_SingleFields': module.QuicProtocolOptions_SingleFields,
        'UpstreamHttpProtocolOptions': module.UpstreamHttpProtocolOptions,
        'UpstreamHttpProtocolOptions_SingleFields': module.UpstreamHttpProtocolOptions_SingleFields,
        'AlternateProtocolsCacheOptions': module.AlternateProtocolsCacheOptions,
        'AlternateProtocolsCacheOptions_SingleFields': module.AlternateProtocolsCacheOptions_SingleFields,
        'AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry': module.AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry,
        'AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry_SingleFields': module.AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry_SingleFields,
        'HttpProtocolOptions': module.HttpProtocolOptions,
        'HttpProtocolOptions_SingleFields': module.HttpProtocolOptions_SingleFields,
        'Http1ProtocolOptions_HeaderKeyFormat': module.Http1ProtocolOptions_HeaderKeyFormat,
        'Http1ProtocolOptions': module.Http1ProtocolOptions,
        'Http1ProtocolOptions_SingleFields': module.Http1ProtocolOptions_SingleFields,
        'KeepaliveSettings': module.KeepaliveSettings,
        'KeepaliveSettings_SingleFields': module.KeepaliveSettings_SingleFields,
        'Http2ProtocolOptions': module.Http2ProtocolOptions,
        'Http2ProtocolOptions_SingleFields': module.Http2ProtocolOptions_SingleFields,
        'Http2ProtocolOptions_SettingsParameter': module.Http2ProtocolOptions_SettingsParameter,
        'Http2ProtocolOptions_SettingsParameter_SingleFields': module.Http2ProtocolOptions_SettingsParameter_SingleFields,
        'GrpcProtocolOptions': module.GrpcProtocolOptions,
        'Http3ProtocolOptions': module.Http3ProtocolOptions,
        'Http3ProtocolOptions_SingleFields': module.Http3ProtocolOptions_SingleFields,
        'SchemeHeaderTransformation': module.SchemeHeaderTransformation,
        'SchemeHeaderTransformation_SingleFields': module.SchemeHeaderTransformation_SingleFields
    })),
    'envoy/config/core/v3/proxy_protocol': () => import('./envoy/config/core/v3/proxy_protocol').then(module => ({
        'ProxyProtocolPassThroughTLVs': module.ProxyProtocolPassThroughTLVs,
        'ProxyProtocolPassThroughTLVs_SingleFields': module.ProxyProtocolPassThroughTLVs_SingleFields,
        'TlvEntry': module.TlvEntry,
        'TlvEntry_SingleFields': module.TlvEntry_SingleFields,
        'ProxyProtocolConfig': module.ProxyProtocolConfig,
        'ProxyProtocolConfig_SingleFields': module.ProxyProtocolConfig_SingleFields,
        'PerHostConfig': module.PerHostConfig
    })),
    'envoy/config/core/v3/resolver': () => import('./envoy/config/core/v3/resolver').then(module => ({
        'DnsResolverOptions': module.DnsResolverOptions,
        'DnsResolverOptions_SingleFields': module.DnsResolverOptions_SingleFields,
        'DnsResolutionConfig': module.DnsResolutionConfig
    })),
    'envoy/config/core/v3/socket_cmsg_headers': () => import('./envoy/config/core/v3/socket_cmsg_headers').then(module => ({
        'SocketCmsgHeaders': module.SocketCmsgHeaders,
        'SocketCmsgHeaders_SingleFields': module.SocketCmsgHeaders_SingleFields
    })),
    'envoy/config/core/v3/socket_option': () => import('./envoy/config/core/v3/socket_option').then(module => ({
        'SocketOption_SocketType': module.SocketOption_SocketType,
        'SocketOption': module.SocketOption,
        'SocketOption_SingleFields': module.SocketOption_SingleFields,
        'SocketOptionsOverride': module.SocketOptionsOverride
    })),
    'envoy/config/core/v3/substitution_format_string': () => import('./envoy/config/core/v3/substitution_format_string').then(module => ({
        'JsonFormatOptions': module.JsonFormatOptions,
        'SubstitutionFormatString': module.SubstitutionFormatString,
        'SubstitutionFormatString_SingleFields': module.SubstitutionFormatString_SingleFields
    })),
    'envoy/config/core/v3/udp_socket_config': () => import('./envoy/config/core/v3/udp_socket_config').then(module => ({
        'UdpSocketConfig': module.UdpSocketConfig,
        'UdpSocketConfig_SingleFields': module.UdpSocketConfig_SingleFields
    })),
    'envoy/config/endpoint/v3/endpoint': () => import('./envoy/config/endpoint/v3/endpoint').then(module => ({
        'ClusterLoadAssignment_Policy': module.ClusterLoadAssignment_Policy,
        'ClusterLoadAssignment_Policy_SingleFields': module.ClusterLoadAssignment_Policy_SingleFields,
        'ClusterLoadAssignment': module.ClusterLoadAssignment,
        'ClusterLoadAssignment_SingleFields': module.ClusterLoadAssignment_SingleFields,
        'ClusterLoadAssignment_Policy_DropOverload': module.ClusterLoadAssignment_Policy_DropOverload,
        'ClusterLoadAssignment_Policy_DropOverload_SingleFields': module.ClusterLoadAssignment_Policy_DropOverload_SingleFields,
        'ClusterLoadAssignment_NamedEndpointsEntry': module.ClusterLoadAssignment_NamedEndpointsEntry,
        'ClusterLoadAssignment_NamedEndpointsEntry_SingleFields': module.ClusterLoadAssignment_NamedEndpointsEntry_SingleFields
    })),
    'envoy/config/endpoint/v3/endpoint_components': () => import('./envoy/config/endpoint/v3/endpoint_components').then(module => ({
        'Endpoint_HealthCheckConfig': module.Endpoint_HealthCheckConfig,
        'Endpoint_HealthCheckConfig_SingleFields': module.Endpoint_HealthCheckConfig_SingleFields,
        'Endpoint': module.Endpoint,
        'Endpoint_SingleFields': module.Endpoint_SingleFields,
        'Endpoint_AdditionalAddress': module.Endpoint_AdditionalAddress,
        'LbEndpoint': module.LbEndpoint,
        'LbEndpoint_SingleFields': module.LbEndpoint_SingleFields,
        'LbEndpointCollection': module.LbEndpointCollection,
        'LedsClusterLocalityConfig': module.LedsClusterLocalityConfig,
        'LedsClusterLocalityConfig_SingleFields': module.LedsClusterLocalityConfig_SingleFields,
        'LocalityLbEndpoints': module.LocalityLbEndpoints,
        'LocalityLbEndpoints_SingleFields': module.LocalityLbEndpoints_SingleFields,
        'LocalityLbEndpoints_LbEndpointList': module.LocalityLbEndpoints_LbEndpointList
    })),
    'envoy/config/endpoint/v3/load_report': () => import('./envoy/config/endpoint/v3/load_report').then(module => ({
        'UnnamedEndpointLoadMetricStats': module.UnnamedEndpointLoadMetricStats,
        'UnnamedEndpointLoadMetricStats_SingleFields': module.UnnamedEndpointLoadMetricStats_SingleFields,
        'UpstreamLocalityStats': module.UpstreamLocalityStats,
        'UpstreamLocalityStats_SingleFields': module.UpstreamLocalityStats_SingleFields,
        'UpstreamEndpointStats': module.UpstreamEndpointStats,
        'UpstreamEndpointStats_SingleFields': module.UpstreamEndpointStats_SingleFields,
        'EndpointLoadMetricStats': module.EndpointLoadMetricStats,
        'EndpointLoadMetricStats_SingleFields': module.EndpointLoadMetricStats_SingleFields,
        'ClusterStats': module.ClusterStats,
        'ClusterStats_SingleFields': module.ClusterStats_SingleFields,
        'ClusterStats_DroppedRequests': module.ClusterStats_DroppedRequests,
        'ClusterStats_DroppedRequests_SingleFields': module.ClusterStats_DroppedRequests_SingleFields
    })),
    'envoy/config/filter/network/mysql_proxy/v1alpha1/mysql_proxy': () => import('./envoy/config/filter/network/mysql_proxy/v1alpha1/mysql_proxy').then(module => ({
        'MySQLProxy': module.MySQLProxy,
        'MySQLProxy_SingleFields': module.MySQLProxy_SingleFields
    })),
    'envoy/config/filter/network/zookeeper_proxy/v1alpha1/zookeeper_proxy': () => import('./envoy/config/filter/network/zookeeper_proxy/v1alpha1/zookeeper_proxy').then(module => ({
        'ZooKeeperProxy': module.ZooKeeperProxy,
        'ZooKeeperProxy_SingleFields': module.ZooKeeperProxy_SingleFields
    })),
    'envoy/config/grpc_credential/v3/file_based_metadata': () => import('./envoy/config/grpc_credential/v3/file_based_metadata').then(module => ({
        'FileBasedMetadataConfig': module.FileBasedMetadataConfig,
        'FileBasedMetadataConfig_SingleFields': module.FileBasedMetadataConfig_SingleFields
    })),
    'envoy/config/listener/v3/api_listener': () => import('./envoy/config/listener/v3/api_listener').then(module => ({
        'ApiListener': module.ApiListener
    })),
    'envoy/config/listener/v3/listener': () => import('./envoy/config/listener/v3/listener').then(module => ({
        'AdditionalAddress': module.AdditionalAddress,
        'ListenerCollection': module.ListenerCollection,
        'Listener_FcdsConfig': module.Listener_FcdsConfig,
        'Listener_FcdsConfig_SingleFields': module.Listener_FcdsConfig_SingleFields,
        'Listener_DeprecatedV1': module.Listener_DeprecatedV1,
        'Listener_DeprecatedV1_SingleFields': module.Listener_DeprecatedV1_SingleFields,
        'Listener_ConnectionBalanceConfig': module.Listener_ConnectionBalanceConfig,
        'Listener': module.Listener,
        'Listener_SingleFields': module.Listener_SingleFields
    })),
    'envoy/config/listener/v3/listener_components': () => import('./envoy/config/listener/v3/listener_components').then(module => ({
        'Filter': module.Filter,
        'Filter_SingleFields': module.Filter_SingleFields,
        'FilterChainMatch': module.FilterChainMatch,
        'FilterChainMatch_SingleFields': module.FilterChainMatch_SingleFields,
        'FilterChain': module.FilterChain,
        'FilterChain_SingleFields': module.FilterChain_SingleFields,
        'ListenerFilterChainMatchPredicate': module.ListenerFilterChainMatchPredicate,
        'ListenerFilterChainMatchPredicate_SingleFields': module.ListenerFilterChainMatchPredicate_SingleFields,
        'ListenerFilterChainMatchPredicate_MatchSet': module.ListenerFilterChainMatchPredicate_MatchSet,
        'ListenerFilter': module.ListenerFilter,
        'ListenerFilter_SingleFields': module.ListenerFilter_SingleFields
    })),
    'envoy/config/listener/v3/quic_config': () => import('./envoy/config/listener/v3/quic_config').then(module => ({
        'QuicProtocolOptions': module.QuicProtocolOptions,
        'QuicProtocolOptions_SingleFields': module.QuicProtocolOptions_SingleFields
    })),
    'envoy/config/listener/v3/udp_listener_config': () => import('./envoy/config/listener/v3/udp_listener_config').then(module => ({
        'UdpListenerConfig': module.UdpListenerConfig
    })),
    'envoy/config/metrics/v3/metrics_service': () => import('./envoy/config/metrics/v3/metrics_service').then(module => ({
        'MetricsServiceConfig': module.MetricsServiceConfig,
        'MetricsServiceConfig_SingleFields': module.MetricsServiceConfig_SingleFields
    })),
    'envoy/config/metrics/v3/stats': () => import('./envoy/config/metrics/v3/stats').then(module => ({
        'StatsSink': module.StatsSink,
        'StatsSink_SingleFields': module.StatsSink_SingleFields,
        'StatsMatcher': module.StatsMatcher,
        'StatsMatcher_SingleFields': module.StatsMatcher_SingleFields,
        'StatsConfig': module.StatsConfig,
        'StatsConfig_SingleFields': module.StatsConfig_SingleFields,
        'TagSpecifier': module.TagSpecifier,
        'TagSpecifier_SingleFields': module.TagSpecifier_SingleFields,
        'HistogramBucketSettings': module.HistogramBucketSettings,
        'HistogramBucketSettings_SingleFields': module.HistogramBucketSettings_SingleFields,
        'StatsdSink': module.StatsdSink,
        'StatsdSink_SingleFields': module.StatsdSink_SingleFields,
        'DogStatsdSink': module.DogStatsdSink,
        'DogStatsdSink_SingleFields': module.DogStatsdSink_SingleFields,
        'HystrixSink': module.HystrixSink,
        'HystrixSink_SingleFields': module.HystrixSink_SingleFields
    })),
    'envoy/config/overload/v3/overload': () => import('./envoy/config/overload/v3/overload').then(module => ({
        'ResourceMonitor': module.ResourceMonitor,
        'ResourceMonitor_SingleFields': module.ResourceMonitor_SingleFields,
        'ThresholdTrigger': module.ThresholdTrigger,
        'ThresholdTrigger_SingleFields': module.ThresholdTrigger_SingleFields,
        'ScaledTrigger': module.ScaledTrigger,
        'ScaledTrigger_SingleFields': module.ScaledTrigger_SingleFields,
        'Trigger': module.Trigger,
        'Trigger_SingleFields': module.Trigger_SingleFields,
        'ScaleTimersOverloadActionConfig': module.ScaleTimersOverloadActionConfig,
        'ScaleTimersOverloadActionConfig_ScaleTimer': module.ScaleTimersOverloadActionConfig_ScaleTimer,
        'ScaleTimersOverloadActionConfig_ScaleTimer_SingleFields': module.ScaleTimersOverloadActionConfig_ScaleTimer_SingleFields,
        'OverloadAction': module.OverloadAction,
        'OverloadAction_SingleFields': module.OverloadAction_SingleFields,
        'LoadShedPoint': module.LoadShedPoint,
        'LoadShedPoint_SingleFields': module.LoadShedPoint_SingleFields,
        'BufferFactoryConfig': module.BufferFactoryConfig,
        'BufferFactoryConfig_SingleFields': module.BufferFactoryConfig_SingleFields,
        'OverloadManager': module.OverloadManager,
        'OverloadManager_SingleFields': module.OverloadManager_SingleFields
    })),
    'envoy/config/ratelimit/v3/rls': () => import('./envoy/config/ratelimit/v3/rls').then(module => ({
        'RateLimitServiceConfig': module.RateLimitServiceConfig,
        'RateLimitServiceConfig_SingleFields': module.RateLimitServiceConfig_SingleFields
    })),
    'envoy/config/rbac/v3/rbac': () => import('./envoy/config/rbac/v3/rbac').then(module => ({
        'RBAC_AuditLoggingOptions': module.RBAC_AuditLoggingOptions,
        'RBAC_AuditLoggingOptions_SingleFields': module.RBAC_AuditLoggingOptions_SingleFields,
        'RBAC': module.RBAC,
        'RBAC_SingleFields': module.RBAC_SingleFields,
        'RBAC_AuditLoggingOptions_AuditLoggerConfig': module.RBAC_AuditLoggingOptions_AuditLoggerConfig,
        'RBAC_AuditLoggingOptions_AuditLoggerConfig_SingleFields': module.RBAC_AuditLoggingOptions_AuditLoggerConfig_SingleFields,
        'Policy': module.Policy,
        'RBAC_PoliciesEntry': module.RBAC_PoliciesEntry,
        'RBAC_PoliciesEntry_SingleFields': module.RBAC_PoliciesEntry_SingleFields,
        'SourcedMetadata': module.SourcedMetadata,
        'SourcedMetadata_SingleFields': module.SourcedMetadata_SingleFields,
        'Permission': module.Permission,
        'Permission_SingleFields': module.Permission_SingleFields,
        'Permission_Set': module.Permission_Set,
        'Principal': module.Principal,
        'Principal_SingleFields': module.Principal_SingleFields,
        'Principal_Set': module.Principal_Set,
        'Principal_Authenticated': module.Principal_Authenticated,
        'Action': module.Action,
        'Action_SingleFields': module.Action_SingleFields
    })),
    'envoy/config/retry/previous_priorities/previous_priorities_config': () => import('./envoy/config/retry/previous_priorities/previous_priorities_config').then(module => ({
        'PreviousPrioritiesConfig': module.PreviousPrioritiesConfig,
        'PreviousPrioritiesConfig_SingleFields': module.PreviousPrioritiesConfig_SingleFields
    })),
    'envoy/config/route/v3/route': () => import('./envoy/config/route/v3/route').then(module => ({
        'Vhds': module.Vhds,
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_SingleFields': module.RouteConfiguration_SingleFields,
        'RouteConfiguration_TypedPerFilterConfigEntry': module.RouteConfiguration_TypedPerFilterConfigEntry,
        'RouteConfiguration_TypedPerFilterConfigEntry_SingleFields': module.RouteConfiguration_TypedPerFilterConfigEntry_SingleFields
    })),
    'envoy/config/route/v3/route_components': () => import('./envoy/config/route/v3/route_components').then(module => ({
        'CorsPolicy': module.CorsPolicy,
        'CorsPolicy_SingleFields': module.CorsPolicy_SingleFields,
        'RetryPolicy_RetryPriority': module.RetryPolicy_RetryPriority,
        'RetryPolicy_RetryPriority_SingleFields': module.RetryPolicy_RetryPriority_SingleFields,
        'RetryPolicy_RetryBackOff': module.RetryPolicy_RetryBackOff,
        'RetryPolicy_RetryBackOff_SingleFields': module.RetryPolicy_RetryBackOff_SingleFields,
        'RetryPolicy_RateLimitedRetryBackOff': module.RetryPolicy_RateLimitedRetryBackOff,
        'RetryPolicy_RateLimitedRetryBackOff_SingleFields': module.RetryPolicy_RateLimitedRetryBackOff_SingleFields,
        'RetryPolicy': module.RetryPolicy,
        'RetryPolicy_SingleFields': module.RetryPolicy_SingleFields,
        'HedgePolicy': module.HedgePolicy,
        'HedgePolicy_SingleFields': module.HedgePolicy_SingleFields,
        'VirtualHost': module.VirtualHost,
        'VirtualHost_SingleFields': module.VirtualHost_SingleFields,
        'VirtualHost_TypedPerFilterConfigEntry': module.VirtualHost_TypedPerFilterConfigEntry,
        'VirtualHost_TypedPerFilterConfigEntry_SingleFields': module.VirtualHost_TypedPerFilterConfigEntry_SingleFields,
        'FilterAction': module.FilterAction,
        'RouteList': module.RouteList,
        'RouteMatch_TlsContextMatchOptions': module.RouteMatch_TlsContextMatchOptions,
        'RouteMatch_TlsContextMatchOptions_SingleFields': module.RouteMatch_TlsContextMatchOptions_SingleFields,
        'RouteMatch': module.RouteMatch,
        'RouteMatch_SingleFields': module.RouteMatch_SingleFields,
        'Decorator': module.Decorator,
        'Decorator_SingleFields': module.Decorator_SingleFields,
        'Tracing': module.Tracing,
        'Route': module.Route,
        'Route_SingleFields': module.Route_SingleFields,
        'Route_TypedPerFilterConfigEntry': module.Route_TypedPerFilterConfigEntry,
        'Route_TypedPerFilterConfigEntry_SingleFields': module.Route_TypedPerFilterConfigEntry_SingleFields,
        'WeightedCluster': module.WeightedCluster,
        'WeightedCluster_SingleFields': module.WeightedCluster_SingleFields,
        'WeightedCluster_ClusterWeight': module.WeightedCluster_ClusterWeight,
        'WeightedCluster_ClusterWeight_SingleFields': module.WeightedCluster_ClusterWeight_SingleFields,
        'WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry': module.WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry,
        'WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry_SingleFields': module.WeightedCluster_ClusterWeight_TypedPerFilterConfigEntry_SingleFields,
        'ClusterSpecifierPlugin': module.ClusterSpecifierPlugin,
        'ClusterSpecifierPlugin_SingleFields': module.ClusterSpecifierPlugin_SingleFields,
        'InternalRedirectPolicy': module.InternalRedirectPolicy,
        'InternalRedirectPolicy_SingleFields': module.InternalRedirectPolicy_SingleFields,
        'RouteAction_MaxStreamDuration': module.RouteAction_MaxStreamDuration,
        'RouteAction_MaxStreamDuration_SingleFields': module.RouteAction_MaxStreamDuration_SingleFields,
        'RouteAction': module.RouteAction,
        'RouteAction_SingleFields': module.RouteAction_SingleFields,
        'RouteAction_RequestMirrorPolicy': module.RouteAction_RequestMirrorPolicy,
        'RouteAction_RequestMirrorPolicy_SingleFields': module.RouteAction_RequestMirrorPolicy_SingleFields,
        'RouteAction_HashPolicy': module.RouteAction_HashPolicy,
        'RouteAction_HashPolicy_SingleFields': module.RouteAction_HashPolicy_SingleFields,
        'RouteAction_HashPolicy_Header': module.RouteAction_HashPolicy_Header,
        'RouteAction_HashPolicy_Header_SingleFields': module.RouteAction_HashPolicy_Header_SingleFields,
        'RouteAction_HashPolicy_CookieAttribute': module.RouteAction_HashPolicy_CookieAttribute,
        'RouteAction_HashPolicy_CookieAttribute_SingleFields': module.RouteAction_HashPolicy_CookieAttribute_SingleFields,
        'RouteAction_HashPolicy_Cookie': module.RouteAction_HashPolicy_Cookie,
        'RouteAction_HashPolicy_Cookie_SingleFields': module.RouteAction_HashPolicy_Cookie_SingleFields,
        'RouteAction_HashPolicy_ConnectionProperties': module.RouteAction_HashPolicy_ConnectionProperties,
        'RouteAction_HashPolicy_ConnectionProperties_SingleFields': module.RouteAction_HashPolicy_ConnectionProperties_SingleFields,
        'RouteAction_HashPolicy_QueryParameter': module.RouteAction_HashPolicy_QueryParameter,
        'RouteAction_HashPolicy_QueryParameter_SingleFields': module.RouteAction_HashPolicy_QueryParameter_SingleFields,
        'RouteAction_HashPolicy_FilterState': module.RouteAction_HashPolicy_FilterState,
        'RouteAction_HashPolicy_FilterState_SingleFields': module.RouteAction_HashPolicy_FilterState_SingleFields,
        'RouteAction_UpgradeConfig_ConnectConfig': module.RouteAction_UpgradeConfig_ConnectConfig,
        'RouteAction_UpgradeConfig_ConnectConfig_SingleFields': module.RouteAction_UpgradeConfig_ConnectConfig_SingleFields,
        'RouteAction_UpgradeConfig': module.RouteAction_UpgradeConfig,
        'RouteAction_UpgradeConfig_SingleFields': module.RouteAction_UpgradeConfig_SingleFields,
        'RetryPolicy_RetryHostPredicate': module.RetryPolicy_RetryHostPredicate,
        'RetryPolicy_RetryHostPredicate_SingleFields': module.RetryPolicy_RetryHostPredicate_SingleFields,
        'RetryPolicy_ResetHeader': module.RetryPolicy_ResetHeader,
        'RetryPolicy_ResetHeader_SingleFields': module.RetryPolicy_ResetHeader_SingleFields,
        'RedirectAction': module.RedirectAction,
        'RedirectAction_SingleFields': module.RedirectAction_SingleFields,
        'DirectResponseAction': module.DirectResponseAction,
        'DirectResponseAction_SingleFields': module.DirectResponseAction_SingleFields,
        'VirtualCluster': module.VirtualCluster,
        'VirtualCluster_SingleFields': module.VirtualCluster_SingleFields,
        'RateLimit_Override': module.RateLimit_Override,
        'RateLimit_HitsAddend': module.RateLimit_HitsAddend,
        'RateLimit_HitsAddend_SingleFields': module.RateLimit_HitsAddend_SingleFields,
        'RateLimit': module.RateLimit,
        'RateLimit_SingleFields': module.RateLimit_SingleFields,
        'RateLimit_Action': module.RateLimit_Action,
        'RateLimit_Action_RequestHeaders': module.RateLimit_Action_RequestHeaders,
        'RateLimit_Action_RequestHeaders_SingleFields': module.RateLimit_Action_RequestHeaders_SingleFields,
        'RateLimit_Action_QueryParameters': module.RateLimit_Action_QueryParameters,
        'RateLimit_Action_QueryParameters_SingleFields': module.RateLimit_Action_QueryParameters_SingleFields,
        'RateLimit_Action_MaskedRemoteAddress': module.RateLimit_Action_MaskedRemoteAddress,
        'RateLimit_Action_MaskedRemoteAddress_SingleFields': module.RateLimit_Action_MaskedRemoteAddress_SingleFields,
        'RateLimit_Action_GenericKey': module.RateLimit_Action_GenericKey,
        'RateLimit_Action_GenericKey_SingleFields': module.RateLimit_Action_GenericKey_SingleFields,
        'RateLimit_Action_HeaderValueMatch': module.RateLimit_Action_HeaderValueMatch,
        'RateLimit_Action_HeaderValueMatch_SingleFields': module.RateLimit_Action_HeaderValueMatch_SingleFields,
        'RateLimit_Action_DynamicMetaData': module.RateLimit_Action_DynamicMetaData,
        'RateLimit_Action_DynamicMetaData_SingleFields': module.RateLimit_Action_DynamicMetaData_SingleFields,
        'RateLimit_Action_MetaData': module.RateLimit_Action_MetaData,
        'RateLimit_Action_MetaData_SingleFields': module.RateLimit_Action_MetaData_SingleFields,
        'RateLimit_Action_QueryParameterValueMatch': module.RateLimit_Action_QueryParameterValueMatch,
        'RateLimit_Action_QueryParameterValueMatch_SingleFields': module.RateLimit_Action_QueryParameterValueMatch_SingleFields,
        'RateLimit_Override_DynamicMetadata': module.RateLimit_Override_DynamicMetadata,
        'HeaderMatcher': module.HeaderMatcher,
        'HeaderMatcher_SingleFields': module.HeaderMatcher_SingleFields,
        'QueryParameterMatcher': module.QueryParameterMatcher,
        'QueryParameterMatcher_SingleFields': module.QueryParameterMatcher_SingleFields,
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields
    })),
    'envoy/config/route/v3/scoped_route': () => import('./envoy/config/route/v3/scoped_route').then(module => ({
        'ScopedRouteConfiguration_Key': module.ScopedRouteConfiguration_Key,
        'ScopedRouteConfiguration': module.ScopedRouteConfiguration,
        'ScopedRouteConfiguration_SingleFields': module.ScopedRouteConfiguration_SingleFields,
        'ScopedRouteConfiguration_Key_Fragment': module.ScopedRouteConfiguration_Key_Fragment,
        'ScopedRouteConfiguration_Key_Fragment_SingleFields': module.ScopedRouteConfiguration_Key_Fragment_SingleFields
    })),
    'envoy/config/tap/v3/common': () => import('./envoy/config/tap/v3/common').then(module => ({
        'MatchPredicate': module.MatchPredicate,
        'MatchPredicate_SingleFields': module.MatchPredicate_SingleFields,
        'OutputConfig': module.OutputConfig,
        'OutputConfig_SingleFields': module.OutputConfig_SingleFields,
        'TapConfig': module.TapConfig,
        'MatchPredicate_MatchSet': module.MatchPredicate_MatchSet,
        'HttpHeadersMatch': module.HttpHeadersMatch,
        'HttpGenericBodyMatch': module.HttpGenericBodyMatch,
        'HttpGenericBodyMatch_SingleFields': module.HttpGenericBodyMatch_SingleFields,
        'HttpGenericBodyMatch_GenericTextMatch': module.HttpGenericBodyMatch_GenericTextMatch,
        'HttpGenericBodyMatch_GenericTextMatch_SingleFields': module.HttpGenericBodyMatch_GenericTextMatch_SingleFields,
        'OutputSink': module.OutputSink,
        'OutputSink_SingleFields': module.OutputSink_SingleFields,
        'BufferedAdminSink': module.BufferedAdminSink,
        'BufferedAdminSink_SingleFields': module.BufferedAdminSink_SingleFields,
        'FilePerTapSink': module.FilePerTapSink,
        'FilePerTapSink_SingleFields': module.FilePerTapSink_SingleFields,
        'StreamingGrpcSink': module.StreamingGrpcSink,
        'StreamingGrpcSink_SingleFields': module.StreamingGrpcSink_SingleFields
    })),
    'envoy/config/trace/v3/datadog': () => import('./envoy/config/trace/v3/datadog').then(module => ({
        'DatadogRemoteConfig': module.DatadogRemoteConfig,
        'DatadogRemoteConfig_SingleFields': module.DatadogRemoteConfig_SingleFields,
        'DatadogConfig': module.DatadogConfig,
        'DatadogConfig_SingleFields': module.DatadogConfig_SingleFields
    })),
    'envoy/config/trace/v3/dynamic_ot': () => import('./envoy/config/trace/v3/dynamic_ot').then(module => ({
        'DynamicOtConfig': module.DynamicOtConfig
    })),
    'envoy/config/trace/v3/http_tracer': () => import('./envoy/config/trace/v3/http_tracer').then(module => ({
        'Tracing_Http': module.Tracing_Http,
        'Tracing_Http_SingleFields': module.Tracing_Http_SingleFields,
        'Tracing': module.Tracing
    })),
    'envoy/config/trace/v3/lightstep': () => import('./envoy/config/trace/v3/lightstep').then(module => ({
        'LightstepConfig': module.LightstepConfig,
        'LightstepConfig_SingleFields': module.LightstepConfig_SingleFields
    })),
    'envoy/config/trace/v3/opentelemetry': () => import('./envoy/config/trace/v3/opentelemetry').then(module => ({
        'OpenTelemetryConfig': module.OpenTelemetryConfig,
        'OpenTelemetryConfig_SingleFields': module.OpenTelemetryConfig_SingleFields
    })),
    'envoy/config/trace/v3/service': () => import('./envoy/config/trace/v3/service').then(module => ({
        'TraceServiceConfig': module.TraceServiceConfig
    })),
    'envoy/config/trace/v3/skywalking': () => import('./envoy/config/trace/v3/skywalking').then(module => ({
        'ClientConfig': module.ClientConfig,
        'ClientConfig_SingleFields': module.ClientConfig_SingleFields,
        'SkyWalkingConfig': module.SkyWalkingConfig
    })),
    'envoy/config/trace/v3/xray': () => import('./envoy/config/trace/v3/xray').then(module => ({
        'XRayConfig_SegmentFields': module.XRayConfig_SegmentFields,
        'XRayConfig_SegmentFields_SingleFields': module.XRayConfig_SegmentFields_SingleFields,
        'XRayConfig': module.XRayConfig,
        'XRayConfig_SingleFields': module.XRayConfig_SingleFields
    })),
    'envoy/config/trace/v3/zipkin': () => import('./envoy/config/trace/v3/zipkin').then(module => ({
        'ZipkinConfig': module.ZipkinConfig,
        'ZipkinConfig_SingleFields': module.ZipkinConfig_SingleFields
    })),
    'envoy/data/accesslog/v3/accesslog': () => import('./envoy/data/accesslog/v3/accesslog').then(module => ({
        'TLSProperties_CertificateProperties': module.TLSProperties_CertificateProperties,
        'TLSProperties_CertificateProperties_SingleFields': module.TLSProperties_CertificateProperties_SingleFields,
        'TLSProperties': module.TLSProperties,
        'TLSProperties_SingleFields': module.TLSProperties_SingleFields,
        'ResponseFlags_Unauthorized': module.ResponseFlags_Unauthorized,
        'ResponseFlags_Unauthorized_SingleFields': module.ResponseFlags_Unauthorized_SingleFields,
        'ResponseFlags': module.ResponseFlags,
        'ResponseFlags_SingleFields': module.ResponseFlags_SingleFields,
        'AccessLogCommon': module.AccessLogCommon,
        'AccessLogCommon_SingleFields': module.AccessLogCommon_SingleFields,
        'ConnectionProperties': module.ConnectionProperties,
        'ConnectionProperties_SingleFields': module.ConnectionProperties_SingleFields,
        'TCPAccessLogEntry': module.TCPAccessLogEntry,
        'HTTPRequestProperties': module.HTTPRequestProperties,
        'HTTPRequestProperties_SingleFields': module.HTTPRequestProperties_SingleFields,
        'HTTPResponseProperties': module.HTTPResponseProperties,
        'HTTPResponseProperties_SingleFields': module.HTTPResponseProperties_SingleFields,
        'HTTPAccessLogEntry': module.HTTPAccessLogEntry,
        'HTTPAccessLogEntry_SingleFields': module.HTTPAccessLogEntry_SingleFields,
        'AccessLogCommon_FilterStateObjectsEntry': module.AccessLogCommon_FilterStateObjectsEntry,
        'AccessLogCommon_FilterStateObjectsEntry_SingleFields': module.AccessLogCommon_FilterStateObjectsEntry_SingleFields,
        'AccessLogCommon_CustomTagsEntry': module.AccessLogCommon_CustomTagsEntry,
        'AccessLogCommon_CustomTagsEntry_SingleFields': module.AccessLogCommon_CustomTagsEntry_SingleFields,
        'TLSProperties_CertificateProperties_SubjectAltName': module.TLSProperties_CertificateProperties_SubjectAltName,
        'TLSProperties_CertificateProperties_SubjectAltName_SingleFields': module.TLSProperties_CertificateProperties_SubjectAltName_SingleFields,
        'HTTPRequestProperties_RequestHeadersEntry': module.HTTPRequestProperties_RequestHeadersEntry,
        'HTTPRequestProperties_RequestHeadersEntry_SingleFields': module.HTTPRequestProperties_RequestHeadersEntry_SingleFields,
        'HTTPResponseProperties_ResponseHeadersEntry': module.HTTPResponseProperties_ResponseHeadersEntry,
        'HTTPResponseProperties_ResponseHeadersEntry_SingleFields': module.HTTPResponseProperties_ResponseHeadersEntry_SingleFields,
        'HTTPResponseProperties_ResponseTrailersEntry': module.HTTPResponseProperties_ResponseTrailersEntry,
        'HTTPResponseProperties_ResponseTrailersEntry_SingleFields': module.HTTPResponseProperties_ResponseTrailersEntry_SingleFields
    })),
    'envoy/data/cluster/v3/outlier_detection_event': () => import('./envoy/data/cluster/v3/outlier_detection_event').then(module => ({
        'OutlierDetectionEvent': module.OutlierDetectionEvent,
        'OutlierDetectionEvent_SingleFields': module.OutlierDetectionEvent_SingleFields,
        'OutlierEjectSuccessRate': module.OutlierEjectSuccessRate,
        'OutlierEjectSuccessRate_SingleFields': module.OutlierEjectSuccessRate_SingleFields,
        'OutlierEjectFailurePercentage': module.OutlierEjectFailurePercentage,
        'OutlierEjectFailurePercentage_SingleFields': module.OutlierEjectFailurePercentage_SingleFields
    })),
    'envoy/data/core/v3/health_check_event': () => import('./envoy/data/core/v3/health_check_event').then(module => ({
        'HealthCheckEvent': module.HealthCheckEvent,
        'HealthCheckEvent_SingleFields': module.HealthCheckEvent_SingleFields,
        'HealthCheckEjectUnhealthy': module.HealthCheckEjectUnhealthy,
        'HealthCheckEjectUnhealthy_SingleFields': module.HealthCheckEjectUnhealthy_SingleFields,
        'HealthCheckAddHealthy': module.HealthCheckAddHealthy,
        'HealthCheckAddHealthy_SingleFields': module.HealthCheckAddHealthy_SingleFields,
        'HealthCheckFailure': module.HealthCheckFailure,
        'HealthCheckFailure_SingleFields': module.HealthCheckFailure_SingleFields
    })),
    'envoy/data/core/v3/tlv_metadata': () => import('./envoy/data/core/v3/tlv_metadata').then(module => ({
        'TlvsMetadata': module.TlvsMetadata,
        'TlvsMetadata_TypedMetadataEntry': module.TlvsMetadata_TypedMetadataEntry,
        'TlvsMetadata_TypedMetadataEntry_SingleFields': module.TlvsMetadata_TypedMetadataEntry_SingleFields
    })),
    'envoy/data/dns/v3/dns_table': () => import('./envoy/data/dns/v3/dns_table').then(module => ({
        'DnsTable': module.DnsTable,
        'DnsTable_SingleFields': module.DnsTable_SingleFields,
        'DnsTable_AddressList': module.DnsTable_AddressList,
        'DnsTable_AddressList_SingleFields': module.DnsTable_AddressList_SingleFields,
        'DnsTable_DnsServiceProtocol': module.DnsTable_DnsServiceProtocol,
        'DnsTable_DnsServiceProtocol_SingleFields': module.DnsTable_DnsServiceProtocol_SingleFields,
        'DnsTable_DnsServiceTarget': module.DnsTable_DnsServiceTarget,
        'DnsTable_DnsServiceTarget_SingleFields': module.DnsTable_DnsServiceTarget_SingleFields,
        'DnsTable_DnsService': module.DnsTable_DnsService,
        'DnsTable_DnsService_SingleFields': module.DnsTable_DnsService_SingleFields,
        'DnsTable_DnsServiceList': module.DnsTable_DnsServiceList,
        'DnsTable_DnsEndpoint': module.DnsTable_DnsEndpoint,
        'DnsTable_DnsEndpoint_SingleFields': module.DnsTable_DnsEndpoint_SingleFields,
        'DnsTable_DnsVirtualDomain': module.DnsTable_DnsVirtualDomain,
        'DnsTable_DnsVirtualDomain_SingleFields': module.DnsTable_DnsVirtualDomain_SingleFields
    })),
    'envoy/data/tap/v3/common': () => import('./envoy/data/tap/v3/common').then(module => ({
        'Body': module.Body,
        'Body_SingleFields': module.Body_SingleFields,
        'Connection': module.Connection
    })),
    'envoy/data/tap/v3/http': () => import('./envoy/data/tap/v3/http').then(module => ({
        'HttpBufferedTrace_Message': module.HttpBufferedTrace_Message,
        'HttpBufferedTrace': module.HttpBufferedTrace,
        'HttpStreamedTraceSegment': module.HttpStreamedTraceSegment,
        'HttpStreamedTraceSegment_SingleFields': module.HttpStreamedTraceSegment_SingleFields
    })),
    'envoy/data/tap/v3/transport': () => import('./envoy/data/tap/v3/transport').then(module => ({
        'SocketEvent': module.SocketEvent,
        'SocketEvent_Read': module.SocketEvent_Read,
        'SocketEvent_Write': module.SocketEvent_Write,
        'SocketEvent_Write_SingleFields': module.SocketEvent_Write_SingleFields,
        'SocketBufferedTrace': module.SocketBufferedTrace,
        'SocketBufferedTrace_SingleFields': module.SocketBufferedTrace_SingleFields,
        'SocketEvents': module.SocketEvents,
        'SocketStreamedTraceSegment': module.SocketStreamedTraceSegment,
        'SocketStreamedTraceSegment_SingleFields': module.SocketStreamedTraceSegment_SingleFields
    })),
    'envoy/data/tap/v3/wrapper': () => import('./envoy/data/tap/v3/wrapper').then(module => ({
        'TraceWrapper': module.TraceWrapper
    })),
    'envoy/extensions/access_loggers/file/v3/file': () => import('./envoy/extensions/access_loggers/file/v3/file').then(module => ({
        'FileAccessLog': module.FileAccessLog,
        'FileAccessLog_SingleFields': module.FileAccessLog_SingleFields
    })),
    'envoy/extensions/access_loggers/filters/cel/v3/cel': () => import('./envoy/extensions/access_loggers/filters/cel/v3/cel').then(module => ({
        'ExpressionFilter': module.ExpressionFilter,
        'ExpressionFilter_SingleFields': module.ExpressionFilter_SingleFields
    })),
    'envoy/extensions/access_loggers/fluentd/v3/fluentd': () => import('./envoy/extensions/access_loggers/fluentd/v3/fluentd').then(module => ({
        'FluentdAccessLogConfig_RetryOptions': module.FluentdAccessLogConfig_RetryOptions,
        'FluentdAccessLogConfig_RetryOptions_SingleFields': module.FluentdAccessLogConfig_RetryOptions_SingleFields,
        'FluentdAccessLogConfig': module.FluentdAccessLogConfig,
        'FluentdAccessLogConfig_SingleFields': module.FluentdAccessLogConfig_SingleFields
    })),
    'envoy/extensions/access_loggers/grpc/v3/als': () => import('./envoy/extensions/access_loggers/grpc/v3/als').then(module => ({
        'CommonGrpcAccessLogConfig': module.CommonGrpcAccessLogConfig,
        'CommonGrpcAccessLogConfig_SingleFields': module.CommonGrpcAccessLogConfig_SingleFields,
        'HttpGrpcAccessLogConfig': module.HttpGrpcAccessLogConfig,
        'HttpGrpcAccessLogConfig_SingleFields': module.HttpGrpcAccessLogConfig_SingleFields,
        'TcpGrpcAccessLogConfig': module.TcpGrpcAccessLogConfig
    })),
    'envoy/extensions/access_loggers/open_telemetry/v3/logs_service': () => import('./envoy/extensions/access_loggers/open_telemetry/v3/logs_service').then(module => ({
        'OpenTelemetryAccessLogConfig': module.OpenTelemetryAccessLogConfig,
        'OpenTelemetryAccessLogConfig_SingleFields': module.OpenTelemetryAccessLogConfig_SingleFields
    })),
    'envoy/extensions/access_loggers/stream/v3/stream': () => import('./envoy/extensions/access_loggers/stream/v3/stream').then(module => ({
        'StdoutAccessLog': module.StdoutAccessLog,
        'StderrAccessLog': module.StderrAccessLog
    })),
    'envoy/extensions/access_loggers/wasm/v3/wasm': () => import('./envoy/extensions/access_loggers/wasm/v3/wasm').then(module => ({
        'WasmAccessLog': module.WasmAccessLog
    })),
    'envoy/extensions/bootstrap/internal_listener/v3/internal_listener': () => import('./envoy/extensions/bootstrap/internal_listener/v3/internal_listener').then(module => ({
        'InternalListener': module.InternalListener,
        'InternalListener_SingleFields': module.InternalListener_SingleFields
    })),
    'envoy/extensions/bootstrap/reverse_tunnel/downstream_socket_interface/v3/downstream_reverse_connection_socket_interface': () => import('./envoy/extensions/bootstrap/reverse_tunnel/downstream_socket_interface/v3/downstream_reverse_connection_socket_interface').then(module => ({
        'DownstreamReverseConnectionSocketInterface': module.DownstreamReverseConnectionSocketInterface,
        'DownstreamReverseConnectionSocketInterface_SingleFields': module.DownstreamReverseConnectionSocketInterface_SingleFields
    })),
    'envoy/extensions/bootstrap/reverse_tunnel/upstream_socket_interface/v3/upstream_reverse_connection_socket_interface': () => import('./envoy/extensions/bootstrap/reverse_tunnel/upstream_socket_interface/v3/upstream_reverse_connection_socket_interface').then(module => ({
        'UpstreamReverseConnectionSocketInterface': module.UpstreamReverseConnectionSocketInterface,
        'UpstreamReverseConnectionSocketInterface_SingleFields': module.UpstreamReverseConnectionSocketInterface_SingleFields
    })),
    'envoy/extensions/clusters/aggregate/v3/cluster': () => import('./envoy/extensions/clusters/aggregate/v3/cluster').then(module => ({
        'ClusterConfig': module.ClusterConfig,
        'ClusterConfig_SingleFields': module.ClusterConfig_SingleFields,
        'AggregateClusterResource': module.AggregateClusterResource,
        'AggregateClusterResource_SingleFields': module.AggregateClusterResource_SingleFields
    })),
    'envoy/extensions/clusters/dns/v3/dns_cluster': () => import('./envoy/extensions/clusters/dns/v3/dns_cluster').then(module => ({
        'DnsCluster_RefreshRate': module.DnsCluster_RefreshRate,
        'DnsCluster_RefreshRate_SingleFields': module.DnsCluster_RefreshRate_SingleFields,
        'DnsCluster': module.DnsCluster,
        'DnsCluster_SingleFields': module.DnsCluster_SingleFields
    })),
    'envoy/extensions/clusters/dynamic_forward_proxy/v3/cluster': () => import('./envoy/extensions/clusters/dynamic_forward_proxy/v3/cluster').then(module => ({
        'ClusterConfig': module.ClusterConfig,
        'ClusterConfig_SingleFields': module.ClusterConfig_SingleFields,
        'SubClustersConfig': module.SubClustersConfig,
        'SubClustersConfig_SingleFields': module.SubClustersConfig_SingleFields
    })),
    'envoy/extensions/clusters/redis/v3/redis_cluster': () => import('./envoy/extensions/clusters/redis/v3/redis_cluster').then(module => ({
        'RedisClusterConfig': module.RedisClusterConfig,
        'RedisClusterConfig_SingleFields': module.RedisClusterConfig_SingleFields
    })),
    'envoy/extensions/clusters/reverse_connection/v3/reverse_connection': () => import('./envoy/extensions/clusters/reverse_connection/v3/reverse_connection').then(module => ({
        'ReverseConnectionClusterConfig': module.ReverseConnectionClusterConfig,
        'ReverseConnectionClusterConfig_SingleFields': module.ReverseConnectionClusterConfig_SingleFields
    })),
    'envoy/extensions/common/async_files/v3/async_file_manager': () => import('./envoy/extensions/common/async_files/v3/async_file_manager').then(module => ({
        'AsyncFileManagerConfig': module.AsyncFileManagerConfig,
        'AsyncFileManagerConfig_SingleFields': module.AsyncFileManagerConfig_SingleFields,
        'AsyncFileManagerConfig_ThreadPool': module.AsyncFileManagerConfig_ThreadPool,
        'AsyncFileManagerConfig_ThreadPool_SingleFields': module.AsyncFileManagerConfig_ThreadPool_SingleFields
    })),
    'envoy/extensions/common/aws/v3/credential_provider': () => import('./envoy/extensions/common/aws/v3/credential_provider').then(module => ({
        'AssumeRoleWithWebIdentityCredentialProvider': module.AssumeRoleWithWebIdentityCredentialProvider,
        'AssumeRoleWithWebIdentityCredentialProvider_SingleFields': module.AssumeRoleWithWebIdentityCredentialProvider_SingleFields,
        'InlineCredentialProvider': module.InlineCredentialProvider,
        'InlineCredentialProvider_SingleFields': module.InlineCredentialProvider_SingleFields,
        'CredentialsFileCredentialProvider': module.CredentialsFileCredentialProvider,
        'CredentialsFileCredentialProvider_SingleFields': module.CredentialsFileCredentialProvider_SingleFields,
        'IAMRolesAnywhereCredentialProvider': module.IAMRolesAnywhereCredentialProvider,
        'IAMRolesAnywhereCredentialProvider_SingleFields': module.IAMRolesAnywhereCredentialProvider_SingleFields,
        'AwsCredentialProvider': module.AwsCredentialProvider,
        'AwsCredentialProvider_SingleFields': module.AwsCredentialProvider_SingleFields,
        'AssumeRoleCredentialProvider': module.AssumeRoleCredentialProvider,
        'AssumeRoleCredentialProvider_SingleFields': module.AssumeRoleCredentialProvider_SingleFields
    })),
    'envoy/extensions/common/dynamic_forward_proxy/v3/dns_cache': () => import('./envoy/extensions/common/dynamic_forward_proxy/v3/dns_cache').then(module => ({
        'DnsCacheCircuitBreakers': module.DnsCacheCircuitBreakers,
        'DnsCacheCircuitBreakers_SingleFields': module.DnsCacheCircuitBreakers_SingleFields,
        'DnsCacheConfig': module.DnsCacheConfig,
        'DnsCacheConfig_SingleFields': module.DnsCacheConfig_SingleFields
    })),
    'envoy/extensions/common/matching/v3/extension_matcher': () => import('./envoy/extensions/common/matching/v3/extension_matcher').then(module => ({
        'ExtensionWithMatcher': module.ExtensionWithMatcher,
        'ExtensionWithMatcherPerRoute': module.ExtensionWithMatcherPerRoute
    })),
    'envoy/extensions/common/ratelimit/v3/ratelimit': () => import('./envoy/extensions/common/ratelimit/v3/ratelimit').then(module => ({
        'RateLimitDescriptor_RateLimitOverride': module.RateLimitDescriptor_RateLimitOverride,
        'RateLimitDescriptor_RateLimitOverride_SingleFields': module.RateLimitDescriptor_RateLimitOverride_SingleFields,
        'RateLimitDescriptor': module.RateLimitDescriptor,
        'RateLimitDescriptor_SingleFields': module.RateLimitDescriptor_SingleFields,
        'RateLimitDescriptor_Entry': module.RateLimitDescriptor_Entry,
        'RateLimitDescriptor_Entry_SingleFields': module.RateLimitDescriptor_Entry_SingleFields,
        'LocalRateLimitDescriptor': module.LocalRateLimitDescriptor
    })),
    'envoy/extensions/common/tap/v3/common': () => import('./envoy/extensions/common/tap/v3/common').then(module => ({
        'CommonExtensionConfig': module.CommonExtensionConfig,
        'AdminConfig': module.AdminConfig,
        'AdminConfig_SingleFields': module.AdminConfig_SingleFields
    })),
    'envoy/extensions/compression/brotli/compressor/v3/brotli': () => import('./envoy/extensions/compression/brotli/compressor/v3/brotli').then(module => ({
        'Brotli': module.Brotli,
        'Brotli_SingleFields': module.Brotli_SingleFields
    })),
    'envoy/extensions/compression/brotli/decompressor/v3/brotli': () => import('./envoy/extensions/compression/brotli/decompressor/v3/brotli').then(module => ({
        'Brotli': module.Brotli,
        'Brotli_SingleFields': module.Brotli_SingleFields
    })),
    'envoy/extensions/compression/gzip/compressor/v3/gzip': () => import('./envoy/extensions/compression/gzip/compressor/v3/gzip').then(module => ({
        'Gzip': module.Gzip,
        'Gzip_SingleFields': module.Gzip_SingleFields
    })),
    'envoy/extensions/compression/gzip/decompressor/v3/gzip': () => import('./envoy/extensions/compression/gzip/decompressor/v3/gzip').then(module => ({
        'Gzip': module.Gzip,
        'Gzip_SingleFields': module.Gzip_SingleFields
    })),
    'envoy/extensions/compression/zstd/compressor/v3/zstd': () => import('./envoy/extensions/compression/zstd/compressor/v3/zstd').then(module => ({
        'Zstd': module.Zstd,
        'Zstd_SingleFields': module.Zstd_SingleFields
    })),
    'envoy/extensions/compression/zstd/decompressor/v3/zstd': () => import('./envoy/extensions/compression/zstd/decompressor/v3/zstd').then(module => ({
        'Zstd': module.Zstd,
        'Zstd_SingleFields': module.Zstd_SingleFields
    })),
    'envoy/extensions/config/validators/minimum_clusters/v3/minimum_clusters': () => import('./envoy/extensions/config/validators/minimum_clusters/v3/minimum_clusters').then(module => ({
        'MinimumClustersValidator': module.MinimumClustersValidator,
        'MinimumClustersValidator_SingleFields': module.MinimumClustersValidator_SingleFields
    })),
    'envoy/extensions/dynamic_modules/v3/dynamic_modules': () => import('./envoy/extensions/dynamic_modules/v3/dynamic_modules').then(module => ({
        'DynamicModuleConfig': module.DynamicModuleConfig,
        'DynamicModuleConfig_SingleFields': module.DynamicModuleConfig_SingleFields
    })),
    'envoy/extensions/filters/common/dependency/v3/dependency': () => import('./envoy/extensions/filters/common/dependency/v3/dependency').then(module => ({
        'Dependency': module.Dependency,
        'Dependency_SingleFields': module.Dependency_SingleFields,
        'FilterDependencies': module.FilterDependencies,
        'MatchingRequirements_DataInputAllowList': module.MatchingRequirements_DataInputAllowList,
        'MatchingRequirements_DataInputAllowList_SingleFields': module.MatchingRequirements_DataInputAllowList_SingleFields,
        'MatchingRequirements': module.MatchingRequirements
    })),
    'envoy/extensions/filters/common/fault/v3/fault': () => import('./envoy/extensions/filters/common/fault/v3/fault').then(module => ({
        'FaultDelay': module.FaultDelay,
        'FaultDelay_SingleFields': module.FaultDelay_SingleFields,
        'FaultRateLimit': module.FaultRateLimit,
        'FaultRateLimit_FixedLimit': module.FaultRateLimit_FixedLimit,
        'FaultRateLimit_FixedLimit_SingleFields': module.FaultRateLimit_FixedLimit_SingleFields
    })),
    'envoy/extensions/filters/common/set_filter_state/v3/value': () => import('./envoy/extensions/filters/common/set_filter_state/v3/value').then(module => ({
        'FilterStateValue': module.FilterStateValue,
        'FilterStateValue_SingleFields': module.FilterStateValue_SingleFields
    })),
    'envoy/extensions/filters/http/adaptive_concurrency/v3/adaptive_concurrency': () => import('./envoy/extensions/filters/http/adaptive_concurrency/v3/adaptive_concurrency').then(module => ({
        'GradientControllerConfig_ConcurrencyLimitCalculationParams': module.GradientControllerConfig_ConcurrencyLimitCalculationParams,
        'GradientControllerConfig_ConcurrencyLimitCalculationParams_SingleFields': module.GradientControllerConfig_ConcurrencyLimitCalculationParams_SingleFields,
        'GradientControllerConfig_MinimumRTTCalculationParams': module.GradientControllerConfig_MinimumRTTCalculationParams,
        'GradientControllerConfig_MinimumRTTCalculationParams_SingleFields': module.GradientControllerConfig_MinimumRTTCalculationParams_SingleFields,
        'GradientControllerConfig': module.GradientControllerConfig,
        'AdaptiveConcurrency': module.AdaptiveConcurrency
    })),
    'envoy/extensions/filters/http/admission_control/v3/admission_control': () => import('./envoy/extensions/filters/http/admission_control/v3/admission_control').then(module => ({
        'AdmissionControl': module.AdmissionControl,
        'AdmissionControl_SingleFields': module.AdmissionControl_SingleFields,
        'AdmissionControl_SuccessCriteria_HttpCriteria': module.AdmissionControl_SuccessCriteria_HttpCriteria,
        'AdmissionControl_SuccessCriteria_GrpcCriteria': module.AdmissionControl_SuccessCriteria_GrpcCriteria,
        'AdmissionControl_SuccessCriteria_GrpcCriteria_SingleFields': module.AdmissionControl_SuccessCriteria_GrpcCriteria_SingleFields,
        'AdmissionControl_SuccessCriteria': module.AdmissionControl_SuccessCriteria
    })),
    'envoy/extensions/filters/http/alternate_protocols_cache/v3/alternate_protocols_cache': () => import('./envoy/extensions/filters/http/alternate_protocols_cache/v3/alternate_protocols_cache').then(module => ({
        'FilterConfig': module.FilterConfig
    })),
    'envoy/extensions/filters/http/api_key_auth/v3/api_key_auth': () => import('./envoy/extensions/filters/http/api_key_auth/v3/api_key_auth').then(module => ({
        'Forwarding': module.Forwarding,
        'Forwarding_SingleFields': module.Forwarding_SingleFields,
        'ApiKeyAuth': module.ApiKeyAuth,
        'ApiKeyAuthPerRoute': module.ApiKeyAuthPerRoute,
        'ApiKeyAuthPerRoute_SingleFields': module.ApiKeyAuthPerRoute_SingleFields,
        'Credential': module.Credential,
        'Credential_SingleFields': module.Credential_SingleFields,
        'KeySource': module.KeySource,
        'KeySource_SingleFields': module.KeySource_SingleFields
    })),
    'envoy/extensions/filters/http/aws_lambda/v3/aws_lambda': () => import('./envoy/extensions/filters/http/aws_lambda/v3/aws_lambda').then(module => ({
        'Credentials': module.Credentials,
        'Credentials_SingleFields': module.Credentials_SingleFields,
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields,
        'PerRouteConfig': module.PerRouteConfig
    })),
    'envoy/extensions/filters/http/aws_request_signing/v3/aws_request_signing': () => import('./envoy/extensions/filters/http/aws_request_signing/v3/aws_request_signing').then(module => ({
        'AwsRequestSigning_QueryString': module.AwsRequestSigning_QueryString,
        'AwsRequestSigning_QueryString_SingleFields': module.AwsRequestSigning_QueryString_SingleFields,
        'AwsRequestSigning': module.AwsRequestSigning,
        'AwsRequestSigning_SingleFields': module.AwsRequestSigning_SingleFields,
        'AwsRequestSigningPerRoute': module.AwsRequestSigningPerRoute,
        'AwsRequestSigningPerRoute_SingleFields': module.AwsRequestSigningPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/bandwidth_limit/v3/bandwidth_limit': () => import('./envoy/extensions/filters/http/bandwidth_limit/v3/bandwidth_limit').then(module => ({
        'BandwidthLimit': module.BandwidthLimit,
        'BandwidthLimit_SingleFields': module.BandwidthLimit_SingleFields
    })),
    'envoy/extensions/filters/http/basic_auth/v3/basic_auth': () => import('./envoy/extensions/filters/http/basic_auth/v3/basic_auth').then(module => ({
        'BasicAuth': module.BasicAuth,
        'BasicAuth_SingleFields': module.BasicAuth_SingleFields,
        'BasicAuthPerRoute': module.BasicAuthPerRoute
    })),
    'envoy/extensions/filters/http/buffer/v3/buffer': () => import('./envoy/extensions/filters/http/buffer/v3/buffer').then(module => ({
        'Buffer': module.Buffer,
        'Buffer_SingleFields': module.Buffer_SingleFields,
        'BufferPerRoute': module.BufferPerRoute,
        'BufferPerRoute_SingleFields': module.BufferPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/cache/v3/cache': () => import('./envoy/extensions/filters/http/cache/v3/cache').then(module => ({
        'CacheConfig_KeyCreatorParams': module.CacheConfig_KeyCreatorParams,
        'CacheConfig_KeyCreatorParams_SingleFields': module.CacheConfig_KeyCreatorParams_SingleFields,
        'CacheConfig': module.CacheConfig,
        'CacheConfig_SingleFields': module.CacheConfig_SingleFields
    })),
    'envoy/extensions/filters/http/cache_v2/v3/cache': () => import('./envoy/extensions/filters/http/cache_v2/v3/cache').then(module => ({
        'CacheV2Config_KeyCreatorParams': module.CacheV2Config_KeyCreatorParams,
        'CacheV2Config_KeyCreatorParams_SingleFields': module.CacheV2Config_KeyCreatorParams_SingleFields,
        'CacheV2Config': module.CacheV2Config,
        'CacheV2Config_SingleFields': module.CacheV2Config_SingleFields
    })),
    'envoy/extensions/filters/http/cdn_loop/v3/cdn_loop': () => import('./envoy/extensions/filters/http/cdn_loop/v3/cdn_loop').then(module => ({
        'CdnLoopConfig': module.CdnLoopConfig,
        'CdnLoopConfig_SingleFields': module.CdnLoopConfig_SingleFields
    })),
    'envoy/extensions/filters/http/composite/v3/composite': () => import('./envoy/extensions/filters/http/composite/v3/composite').then(module => ({
        'FilterChainConfiguration': module.FilterChainConfiguration,
        'DynamicConfig': module.DynamicConfig,
        'DynamicConfig_SingleFields': module.DynamicConfig_SingleFields,
        'ExecuteFilterAction': module.ExecuteFilterAction
    })),
    'envoy/extensions/filters/http/compressor/v3/compressor': () => import('./envoy/extensions/filters/http/compressor/v3/compressor').then(module => ({
        'Compressor_CommonDirectionConfig': module.Compressor_CommonDirectionConfig,
        'Compressor_CommonDirectionConfig_SingleFields': module.Compressor_CommonDirectionConfig_SingleFields,
        'Compressor_RequestDirectionConfig': module.Compressor_RequestDirectionConfig,
        'Compressor_ResponseDirectionConfig': module.Compressor_ResponseDirectionConfig,
        'Compressor_ResponseDirectionConfig_SingleFields': module.Compressor_ResponseDirectionConfig_SingleFields,
        'Compressor': module.Compressor,
        'Compressor_SingleFields': module.Compressor_SingleFields,
        'ResponseDirectionOverrides': module.ResponseDirectionOverrides,
        'ResponseDirectionOverrides_SingleFields': module.ResponseDirectionOverrides_SingleFields,
        'CompressorOverrides': module.CompressorOverrides,
        'CompressorPerRoute': module.CompressorPerRoute,
        'CompressorPerRoute_SingleFields': module.CompressorPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/cors/v3/cors': () => import('./envoy/extensions/filters/http/cors/v3/cors').then(module => ({
        'CorsPolicy': module.CorsPolicy,
        'CorsPolicy_SingleFields': module.CorsPolicy_SingleFields
    })),
    'envoy/extensions/filters/http/credential_injector/v3/credential_injector': () => import('./envoy/extensions/filters/http/credential_injector/v3/credential_injector').then(module => ({
        'CredentialInjector': module.CredentialInjector,
        'CredentialInjector_SingleFields': module.CredentialInjector_SingleFields
    })),
    'envoy/extensions/filters/http/csrf/v3/csrf': () => import('./envoy/extensions/filters/http/csrf/v3/csrf').then(module => ({
        'CsrfPolicy': module.CsrfPolicy
    })),
    'envoy/extensions/filters/http/custom_response/v3/custom_response': () => import('./envoy/extensions/filters/http/custom_response/v3/custom_response').then(module => ({
        'CustomResponse': module.CustomResponse
    })),
    'envoy/extensions/filters/http/decompressor/v3/decompressor': () => import('./envoy/extensions/filters/http/decompressor/v3/decompressor').then(module => ({
        'Decompressor_CommonDirectionConfig': module.Decompressor_CommonDirectionConfig,
        'Decompressor_CommonDirectionConfig_SingleFields': module.Decompressor_CommonDirectionConfig_SingleFields,
        'Decompressor_RequestDirectionConfig': module.Decompressor_RequestDirectionConfig,
        'Decompressor_RequestDirectionConfig_SingleFields': module.Decompressor_RequestDirectionConfig_SingleFields,
        'Decompressor_ResponseDirectionConfig': module.Decompressor_ResponseDirectionConfig,
        'Decompressor': module.Decompressor
    })),
    'envoy/extensions/filters/http/dynamic_forward_proxy/v3/dynamic_forward_proxy': () => import('./envoy/extensions/filters/http/dynamic_forward_proxy/v3/dynamic_forward_proxy').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields,
        'PerRouteConfig': module.PerRouteConfig,
        'PerRouteConfig_SingleFields': module.PerRouteConfig_SingleFields,
        'SubClusterConfig': module.SubClusterConfig,
        'SubClusterConfig_SingleFields': module.SubClusterConfig_SingleFields
    })),
    'envoy/extensions/filters/http/dynamic_modules/v3/dynamic_modules': () => import('./envoy/extensions/filters/http/dynamic_modules/v3/dynamic_modules').then(module => ({
        'DynamicModuleFilter': module.DynamicModuleFilter,
        'DynamicModuleFilter_SingleFields': module.DynamicModuleFilter_SingleFields,
        'DynamicModuleFilterPerRoute': module.DynamicModuleFilterPerRoute,
        'DynamicModuleFilterPerRoute_SingleFields': module.DynamicModuleFilterPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/ext_authz/v3/ext_authz': () => import('./envoy/extensions/filters/http/ext_authz/v3/ext_authz').then(module => ({
        'BufferSettings': module.BufferSettings,
        'BufferSettings_SingleFields': module.BufferSettings_SingleFields,
        'ExtAuthz': module.ExtAuthz,
        'ExtAuthz_SingleFields': module.ExtAuthz_SingleFields,
        'AuthorizationRequest': module.AuthorizationRequest,
        'AuthorizationResponse': module.AuthorizationResponse,
        'HttpService': module.HttpService,
        'HttpService_SingleFields': module.HttpService_SingleFields,
        'ExtAuthzPerRoute': module.ExtAuthzPerRoute,
        'ExtAuthzPerRoute_SingleFields': module.ExtAuthzPerRoute_SingleFields,
        'CheckSettings': module.CheckSettings,
        'CheckSettings_SingleFields': module.CheckSettings_SingleFields,
        'CheckSettings_ContextExtensionsEntry': module.CheckSettings_ContextExtensionsEntry,
        'CheckSettings_ContextExtensionsEntry_SingleFields': module.CheckSettings_ContextExtensionsEntry_SingleFields
    })),
    'envoy/extensions/filters/http/ext_proc/v3/ext_proc': () => import('./envoy/extensions/filters/http/ext_proc/v3/ext_proc').then(module => ({
        'ExtProcHttpService': module.ExtProcHttpService,
        'HeaderForwardingRules': module.HeaderForwardingRules,
        'MetadataOptions_MetadataNamespaces': module.MetadataOptions_MetadataNamespaces,
        'MetadataOptions_MetadataNamespaces_SingleFields': module.MetadataOptions_MetadataNamespaces_SingleFields,
        'MetadataOptions': module.MetadataOptions,
        'ExternalProcessor': module.ExternalProcessor,
        'ExternalProcessor_SingleFields': module.ExternalProcessor_SingleFields,
        'ExtProcPerRoute': module.ExtProcPerRoute,
        'ExtProcPerRoute_SingleFields': module.ExtProcPerRoute_SingleFields,
        'ExtProcOverrides': module.ExtProcOverrides,
        'ExtProcOverrides_SingleFields': module.ExtProcOverrides_SingleFields
    })),
    'envoy/extensions/filters/http/ext_proc/v3/processing_mode': () => import('./envoy/extensions/filters/http/ext_proc/v3/processing_mode').then(module => ({
        'ProcessingMode': module.ProcessingMode,
        'ProcessingMode_SingleFields': module.ProcessingMode_SingleFields
    })),
    'envoy/extensions/filters/http/fault/v3/fault': () => import('./envoy/extensions/filters/http/fault/v3/fault').then(module => ({
        'FaultAbort': module.FaultAbort,
        'FaultAbort_SingleFields': module.FaultAbort_SingleFields,
        'HTTPFault': module.HTTPFault,
        'HTTPFault_SingleFields': module.HTTPFault_SingleFields
    })),
    'envoy/extensions/filters/http/file_system_buffer/v3/file_system_buffer': () => import('./envoy/extensions/filters/http/file_system_buffer/v3/file_system_buffer').then(module => ({
        'BufferBehavior': module.BufferBehavior,
        'StreamConfig': module.StreamConfig,
        'StreamConfig_SingleFields': module.StreamConfig_SingleFields,
        'FileSystemBufferFilterConfig': module.FileSystemBufferFilterConfig,
        'FileSystemBufferFilterConfig_SingleFields': module.FileSystemBufferFilterConfig_SingleFields
    })),
    'envoy/extensions/filters/http/gcp_authn/v3/gcp_authn': () => import('./envoy/extensions/filters/http/gcp_authn/v3/gcp_authn').then(module => ({
        'TokenCacheConfig': module.TokenCacheConfig,
        'TokenCacheConfig_SingleFields': module.TokenCacheConfig_SingleFields,
        'TokenHeader': module.TokenHeader,
        'TokenHeader_SingleFields': module.TokenHeader_SingleFields,
        'GcpAuthnFilterConfig': module.GcpAuthnFilterConfig,
        'GcpAuthnFilterConfig_SingleFields': module.GcpAuthnFilterConfig_SingleFields,
        'Audience': module.Audience,
        'Audience_SingleFields': module.Audience_SingleFields
    })),
    'envoy/extensions/filters/http/geoip/v3/geoip': () => import('./envoy/extensions/filters/http/geoip/v3/geoip').then(module => ({
        'Geoip_XffConfig': module.Geoip_XffConfig,
        'Geoip_XffConfig_SingleFields': module.Geoip_XffConfig_SingleFields,
        'Geoip': module.Geoip
    })),
    'envoy/extensions/filters/http/grpc_field_extraction/v3/config': () => import('./envoy/extensions/filters/http/grpc_field_extraction/v3/config').then(module => ({
        'GrpcFieldExtractionConfig': module.GrpcFieldExtractionConfig,
        'FieldExtractions': module.FieldExtractions,
        'GrpcFieldExtractionConfig_ExtractionsByMethodEntry': module.GrpcFieldExtractionConfig_ExtractionsByMethodEntry,
        'GrpcFieldExtractionConfig_ExtractionsByMethodEntry_SingleFields': module.GrpcFieldExtractionConfig_ExtractionsByMethodEntry_SingleFields,
        'RequestFieldValueDisposition': module.RequestFieldValueDisposition,
        'RequestFieldValueDisposition_SingleFields': module.RequestFieldValueDisposition_SingleFields,
        'FieldExtractions_RequestFieldExtractionsEntry': module.FieldExtractions_RequestFieldExtractionsEntry,
        'FieldExtractions_RequestFieldExtractionsEntry_SingleFields': module.FieldExtractions_RequestFieldExtractionsEntry_SingleFields
    })),
    'envoy/extensions/filters/http/grpc_http1_bridge/v3/config': () => import('./envoy/extensions/filters/http/grpc_http1_bridge/v3/config').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/filters/http/grpc_http1_reverse_bridge/v3/config': () => import('./envoy/extensions/filters/http/grpc_http1_reverse_bridge/v3/config').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields,
        'FilterConfigPerRoute': module.FilterConfigPerRoute,
        'FilterConfigPerRoute_SingleFields': module.FilterConfigPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/grpc_json_reverse_transcoder/v3/transcoder': () => import('./envoy/extensions/filters/http/grpc_json_reverse_transcoder/v3/transcoder').then(module => ({
        'GrpcJsonReverseTranscoder_PrintOptions': module.GrpcJsonReverseTranscoder_PrintOptions,
        'GrpcJsonReverseTranscoder_PrintOptions_SingleFields': module.GrpcJsonReverseTranscoder_PrintOptions_SingleFields,
        'GrpcJsonReverseTranscoder': module.GrpcJsonReverseTranscoder,
        'GrpcJsonReverseTranscoder_SingleFields': module.GrpcJsonReverseTranscoder_SingleFields
    })),
    'envoy/extensions/filters/http/grpc_json_transcoder/v3/transcoder': () => import('./envoy/extensions/filters/http/grpc_json_transcoder/v3/transcoder').then(module => ({
        'GrpcJsonTranscoder_PrintOptions': module.GrpcJsonTranscoder_PrintOptions,
        'GrpcJsonTranscoder_PrintOptions_SingleFields': module.GrpcJsonTranscoder_PrintOptions_SingleFields,
        'GrpcJsonTranscoder_RequestValidationOptions': module.GrpcJsonTranscoder_RequestValidationOptions,
        'GrpcJsonTranscoder_RequestValidationOptions_SingleFields': module.GrpcJsonTranscoder_RequestValidationOptions_SingleFields,
        'GrpcJsonTranscoder': module.GrpcJsonTranscoder,
        'GrpcJsonTranscoder_SingleFields': module.GrpcJsonTranscoder_SingleFields,
        'UnknownQueryParams': module.UnknownQueryParams,
        'UnknownQueryParams_Values': module.UnknownQueryParams_Values,
        'UnknownQueryParams_Values_SingleFields': module.UnknownQueryParams_Values_SingleFields,
        'UnknownQueryParams_KeyEntry': module.UnknownQueryParams_KeyEntry,
        'UnknownQueryParams_KeyEntry_SingleFields': module.UnknownQueryParams_KeyEntry_SingleFields
    })),
    'envoy/extensions/filters/http/grpc_stats/v3/config': () => import('./envoy/extensions/filters/http/grpc_stats/v3/config').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields,
        'FilterObject': module.FilterObject,
        'FilterObject_SingleFields': module.FilterObject_SingleFields
    })),
    'envoy/extensions/filters/http/gzip/v3/gzip': () => import('./envoy/extensions/filters/http/gzip/v3/gzip').then(module => ({
        'Gzip': module.Gzip,
        'Gzip_SingleFields': module.Gzip_SingleFields
    })),
    'envoy/extensions/filters/http/header_mutation/v3/header_mutation': () => import('./envoy/extensions/filters/http/header_mutation/v3/header_mutation').then(module => ({
        'Mutations': module.Mutations,
        'HeaderMutationPerRoute': module.HeaderMutationPerRoute,
        'HeaderMutation': module.HeaderMutation,
        'HeaderMutation_SingleFields': module.HeaderMutation_SingleFields
    })),
    'envoy/extensions/filters/http/header_to_metadata/v3/header_to_metadata': () => import('./envoy/extensions/filters/http/header_to_metadata/v3/header_to_metadata').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields,
        'Config_KeyValuePair': module.Config_KeyValuePair,
        'Config_KeyValuePair_SingleFields': module.Config_KeyValuePair_SingleFields,
        'Config_Rule': module.Config_Rule,
        'Config_Rule_SingleFields': module.Config_Rule_SingleFields
    })),
    'envoy/extensions/filters/http/health_check/v3/health_check': () => import('./envoy/extensions/filters/http/health_check/v3/health_check').then(module => ({
        'HealthCheck': module.HealthCheck,
        'HealthCheck_SingleFields': module.HealthCheck_SingleFields,
        'HealthCheck_ClusterMinHealthyPercentagesEntry': module.HealthCheck_ClusterMinHealthyPercentagesEntry,
        'HealthCheck_ClusterMinHealthyPercentagesEntry_SingleFields': module.HealthCheck_ClusterMinHealthyPercentagesEntry_SingleFields
    })),
    'envoy/extensions/filters/http/ip_tagging/v3/ip_tagging': () => import('./envoy/extensions/filters/http/ip_tagging/v3/ip_tagging').then(module => ({
        'IPTagging_IpTagHeader': module.IPTagging_IpTagHeader,
        'IPTagging_IpTagHeader_SingleFields': module.IPTagging_IpTagHeader_SingleFields,
        'IPTagging': module.IPTagging,
        'IPTagging_SingleFields': module.IPTagging_SingleFields,
        'IPTagging_IPTag': module.IPTagging_IPTag,
        'IPTagging_IPTag_SingleFields': module.IPTagging_IPTag_SingleFields
    })),
    'envoy/extensions/filters/http/json_to_metadata/v3/json_to_metadata': () => import('./envoy/extensions/filters/http/json_to_metadata/v3/json_to_metadata').then(module => ({
        'JsonToMetadata_MatchRules': module.JsonToMetadata_MatchRules,
        'JsonToMetadata_MatchRules_SingleFields': module.JsonToMetadata_MatchRules_SingleFields,
        'JsonToMetadata': module.JsonToMetadata,
        'JsonToMetadata_KeyValuePair': module.JsonToMetadata_KeyValuePair,
        'JsonToMetadata_KeyValuePair_SingleFields': module.JsonToMetadata_KeyValuePair_SingleFields,
        'JsonToMetadata_Selector': module.JsonToMetadata_Selector,
        'JsonToMetadata_Selector_SingleFields': module.JsonToMetadata_Selector_SingleFields,
        'JsonToMetadata_Rule': module.JsonToMetadata_Rule
    })),
    'envoy/extensions/filters/http/jwt_authn/v3/config': () => import('./envoy/extensions/filters/http/jwt_authn/v3/config').then(module => ({
        'JwtProvider_NormalizePayload': module.JwtProvider_NormalizePayload,
        'JwtProvider_NormalizePayload_SingleFields': module.JwtProvider_NormalizePayload_SingleFields,
        'JwtCacheConfig': module.JwtCacheConfig,
        'JwtCacheConfig_SingleFields': module.JwtCacheConfig_SingleFields,
        'JwtProvider': module.JwtProvider,
        'JwtProvider_SingleFields': module.JwtProvider_SingleFields,
        'JwksAsyncFetch': module.JwksAsyncFetch,
        'JwksAsyncFetch_SingleFields': module.JwksAsyncFetch_SingleFields,
        'RemoteJwks': module.RemoteJwks,
        'RemoteJwks_SingleFields': module.RemoteJwks_SingleFields,
        'JwtHeader': module.JwtHeader,
        'JwtHeader_SingleFields': module.JwtHeader_SingleFields,
        'ProviderWithAudiences': module.ProviderWithAudiences,
        'ProviderWithAudiences_SingleFields': module.ProviderWithAudiences_SingleFields,
        'JwtRequirement': module.JwtRequirement,
        'JwtRequirement_SingleFields': module.JwtRequirement_SingleFields,
        'JwtRequirementOrList': module.JwtRequirementOrList,
        'JwtRequirementAndList': module.JwtRequirementAndList,
        'RequirementRule': module.RequirementRule,
        'RequirementRule_SingleFields': module.RequirementRule_SingleFields,
        'FilterStateRule': module.FilterStateRule,
        'FilterStateRule_SingleFields': module.FilterStateRule_SingleFields,
        'FilterStateRule_RequiresEntry': module.FilterStateRule_RequiresEntry,
        'FilterStateRule_RequiresEntry_SingleFields': module.FilterStateRule_RequiresEntry_SingleFields,
        'JwtAuthentication': module.JwtAuthentication,
        'JwtAuthentication_SingleFields': module.JwtAuthentication_SingleFields,
        'JwtAuthentication_ProvidersEntry': module.JwtAuthentication_ProvidersEntry,
        'JwtAuthentication_ProvidersEntry_SingleFields': module.JwtAuthentication_ProvidersEntry_SingleFields,
        'JwtAuthentication_RequirementMapEntry': module.JwtAuthentication_RequirementMapEntry,
        'JwtAuthentication_RequirementMapEntry_SingleFields': module.JwtAuthentication_RequirementMapEntry_SingleFields,
        'PerRouteConfig': module.PerRouteConfig,
        'PerRouteConfig_SingleFields': module.PerRouteConfig_SingleFields,
        'JwtClaimToHeader': module.JwtClaimToHeader,
        'JwtClaimToHeader_SingleFields': module.JwtClaimToHeader_SingleFields
    })),
    'envoy/extensions/filters/http/kill_request/v3/kill_request': () => import('./envoy/extensions/filters/http/kill_request/v3/kill_request').then(module => ({
        'KillRequest': module.KillRequest,
        'KillRequest_SingleFields': module.KillRequest_SingleFields
    })),
    'envoy/extensions/filters/http/local_ratelimit/v3/local_rate_limit': () => import('./envoy/extensions/filters/http/local_ratelimit/v3/local_rate_limit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit,
        'LocalRateLimit_SingleFields': module.LocalRateLimit_SingleFields
    })),
    'envoy/extensions/filters/http/lua/v3/lua': () => import('./envoy/extensions/filters/http/lua/v3/lua').then(module => ({
        'Lua': module.Lua,
        'Lua_SingleFields': module.Lua_SingleFields,
        'Lua_SourceCodesEntry': module.Lua_SourceCodesEntry,
        'Lua_SourceCodesEntry_SingleFields': module.Lua_SourceCodesEntry_SingleFields,
        'LuaPerRoute': module.LuaPerRoute,
        'LuaPerRoute_SingleFields': module.LuaPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/oauth2/v3/oauth': () => import('./envoy/extensions/filters/http/oauth2/v3/oauth').then(module => ({
        'CookieConfig': module.CookieConfig,
        'CookieConfig_SingleFields': module.CookieConfig_SingleFields,
        'CookieConfigs': module.CookieConfigs,
        'OAuth2Credentials_CookieNames': module.OAuth2Credentials_CookieNames,
        'OAuth2Credentials_CookieNames_SingleFields': module.OAuth2Credentials_CookieNames_SingleFields,
        'OAuth2Credentials': module.OAuth2Credentials,
        'OAuth2Credentials_SingleFields': module.OAuth2Credentials_SingleFields,
        'OAuth2Config': module.OAuth2Config,
        'OAuth2Config_SingleFields': module.OAuth2Config_SingleFields,
        'OAuth2': module.OAuth2
    })),
    'envoy/extensions/filters/http/on_demand/v3/on_demand': () => import('./envoy/extensions/filters/http/on_demand/v3/on_demand').then(module => ({
        'OnDemandCds': module.OnDemandCds,
        'OnDemandCds_SingleFields': module.OnDemandCds_SingleFields,
        'OnDemand': module.OnDemand,
        'PerRouteConfig': module.PerRouteConfig
    })),
    'envoy/extensions/filters/http/original_src/v3/original_src': () => import('./envoy/extensions/filters/http/original_src/v3/original_src').then(module => ({
        'OriginalSrc': module.OriginalSrc,
        'OriginalSrc_SingleFields': module.OriginalSrc_SingleFields
    })),
    'envoy/extensions/filters/http/proto_api_scrubber/v3/config': () => import('./envoy/extensions/filters/http/proto_api_scrubber/v3/config').then(module => ({
        'DescriptorSet': module.DescriptorSet,
        'Restrictions': module.Restrictions,
        'ProtoApiScrubberConfig': module.ProtoApiScrubberConfig,
        'ProtoApiScrubberConfig_SingleFields': module.ProtoApiScrubberConfig_SingleFields,
        'MethodRestrictions': module.MethodRestrictions,
        'Restrictions_MethodRestrictionsEntry': module.Restrictions_MethodRestrictionsEntry,
        'Restrictions_MethodRestrictionsEntry_SingleFields': module.Restrictions_MethodRestrictionsEntry_SingleFields,
        'RestrictionConfig': module.RestrictionConfig,
        'MethodRestrictions_RequestFieldRestrictionsEntry': module.MethodRestrictions_RequestFieldRestrictionsEntry,
        'MethodRestrictions_RequestFieldRestrictionsEntry_SingleFields': module.MethodRestrictions_RequestFieldRestrictionsEntry_SingleFields,
        'MethodRestrictions_ResponseFieldRestrictionsEntry': module.MethodRestrictions_ResponseFieldRestrictionsEntry,
        'MethodRestrictions_ResponseFieldRestrictionsEntry_SingleFields': module.MethodRestrictions_ResponseFieldRestrictionsEntry_SingleFields
    })),
    'envoy/extensions/filters/http/proto_message_extraction/v3/config': () => import('./envoy/extensions/filters/http/proto_message_extraction/v3/config').then(module => ({
        'ProtoMessageExtractionConfig': module.ProtoMessageExtractionConfig,
        'ProtoMessageExtractionConfig_SingleFields': module.ProtoMessageExtractionConfig_SingleFields,
        'MethodExtraction': module.MethodExtraction,
        'ProtoMessageExtractionConfig_ExtractionByMethodEntry': module.ProtoMessageExtractionConfig_ExtractionByMethodEntry,
        'ProtoMessageExtractionConfig_ExtractionByMethodEntry_SingleFields': module.ProtoMessageExtractionConfig_ExtractionByMethodEntry_SingleFields,
        'MethodExtraction_RequestExtractionByFieldEntry': module.MethodExtraction_RequestExtractionByFieldEntry,
        'MethodExtraction_RequestExtractionByFieldEntry_SingleFields': module.MethodExtraction_RequestExtractionByFieldEntry_SingleFields,
        'MethodExtraction_ResponseExtractionByFieldEntry': module.MethodExtraction_ResponseExtractionByFieldEntry,
        'MethodExtraction_ResponseExtractionByFieldEntry_SingleFields': module.MethodExtraction_ResponseExtractionByFieldEntry_SingleFields
    })),
    'envoy/extensions/filters/http/rate_limit_quota/v3/rate_limit_quota': () => import('./envoy/extensions/filters/http/rate_limit_quota/v3/rate_limit_quota').then(module => ({
        'RateLimitQuotaFilterConfig': module.RateLimitQuotaFilterConfig,
        'RateLimitQuotaFilterConfig_SingleFields': module.RateLimitQuotaFilterConfig_SingleFields,
        'RateLimitQuotaOverride': module.RateLimitQuotaOverride,
        'RateLimitQuotaOverride_SingleFields': module.RateLimitQuotaOverride_SingleFields,
        'RateLimitQuotaBucketSettings_BucketIdBuilder': module.RateLimitQuotaBucketSettings_BucketIdBuilder,
        'RateLimitQuotaBucketSettings_DenyResponseSettings': module.RateLimitQuotaBucketSettings_DenyResponseSettings,
        'RateLimitQuotaBucketSettings_NoAssignmentBehavior': module.RateLimitQuotaBucketSettings_NoAssignmentBehavior,
        'RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior': module.RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior,
        'RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior_SingleFields': module.RateLimitQuotaBucketSettings_ExpiredAssignmentBehavior_SingleFields,
        'RateLimitQuotaBucketSettings': module.RateLimitQuotaBucketSettings,
        'RateLimitQuotaBucketSettings_SingleFields': module.RateLimitQuotaBucketSettings_SingleFields,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder': module.RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder_SingleFields': module.RateLimitQuotaBucketSettings_BucketIdBuilder_ValueBuilder_SingleFields,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry': module.RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry,
        'RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry_SingleFields': module.RateLimitQuotaBucketSettings_BucketIdBuilder_BucketIdBuilderEntry_SingleFields
    })),
    'envoy/extensions/filters/http/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/http/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit,
        'RateLimit_SingleFields': module.RateLimit_SingleFields,
        'RateLimitPerRoute': module.RateLimitPerRoute,
        'RateLimitPerRoute_SingleFields': module.RateLimitPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/rbac/v3/rbac': () => import('./envoy/extensions/filters/http/rbac/v3/rbac').then(module => ({
        'RBAC': module.RBAC,
        'RBAC_SingleFields': module.RBAC_SingleFields,
        'RBACPerRoute': module.RBACPerRoute
    })),
    'envoy/extensions/filters/http/router/v3/router': () => import('./envoy/extensions/filters/http/router/v3/router').then(module => ({
        'Router_UpstreamAccessLogOptions': module.Router_UpstreamAccessLogOptions,
        'Router_UpstreamAccessLogOptions_SingleFields': module.Router_UpstreamAccessLogOptions_SingleFields,
        'Router': module.Router,
        'Router_SingleFields': module.Router_SingleFields
    })),
    'envoy/extensions/filters/http/set_filter_state/v3/set_filter_state': () => import('./envoy/extensions/filters/http/set_filter_state/v3/set_filter_state').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/http/set_metadata/v3/set_metadata': () => import('./envoy/extensions/filters/http/set_metadata/v3/set_metadata').then(module => ({
        'Metadata': module.Metadata,
        'Metadata_SingleFields': module.Metadata_SingleFields,
        'Config': module.Config
    })),
    'envoy/extensions/filters/http/stateful_session/v3/stateful_session': () => import('./envoy/extensions/filters/http/stateful_session/v3/stateful_session').then(module => ({
        'StatefulSession': module.StatefulSession,
        'StatefulSession_SingleFields': module.StatefulSession_SingleFields,
        'StatefulSessionPerRoute': module.StatefulSessionPerRoute,
        'StatefulSessionPerRoute_SingleFields': module.StatefulSessionPerRoute_SingleFields
    })),
    'envoy/extensions/filters/http/tap/v3/tap': () => import('./envoy/extensions/filters/http/tap/v3/tap').then(module => ({
        'Tap': module.Tap,
        'Tap_SingleFields': module.Tap_SingleFields
    })),
    'envoy/extensions/filters/http/thrift_to_metadata/v3/thrift_to_metadata': () => import('./envoy/extensions/filters/http/thrift_to_metadata/v3/thrift_to_metadata').then(module => ({
        'KeyValuePair': module.KeyValuePair,
        'KeyValuePair_SingleFields': module.KeyValuePair_SingleFields,
        'FieldSelector': module.FieldSelector,
        'FieldSelector_SingleFields': module.FieldSelector_SingleFields,
        'Rule': module.Rule,
        'Rule_SingleFields': module.Rule_SingleFields,
        'ThriftToMetadata': module.ThriftToMetadata,
        'ThriftToMetadata_SingleFields': module.ThriftToMetadata_SingleFields,
        'ThriftToMetadataPerRoute': module.ThriftToMetadataPerRoute
    })),
    'envoy/extensions/filters/http/wasm/v3/wasm': () => import('./envoy/extensions/filters/http/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/filters/listener/local_ratelimit/v3/local_ratelimit': () => import('./envoy/extensions/filters/listener/local_ratelimit/v3/local_ratelimit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit,
        'LocalRateLimit_SingleFields': module.LocalRateLimit_SingleFields
    })),
    'envoy/extensions/filters/listener/original_src/v3/original_src': () => import('./envoy/extensions/filters/listener/original_src/v3/original_src').then(module => ({
        'OriginalSrc': module.OriginalSrc,
        'OriginalSrc_SingleFields': module.OriginalSrc_SingleFields
    })),
    'envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol': () => import('./envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol').then(module => ({
        'ProxyProtocol': module.ProxyProtocol,
        'ProxyProtocol_SingleFields': module.ProxyProtocol_SingleFields,
        'ProxyProtocol_KeyValuePair': module.ProxyProtocol_KeyValuePair,
        'ProxyProtocol_KeyValuePair_SingleFields': module.ProxyProtocol_KeyValuePair_SingleFields,
        'ProxyProtocol_Rule': module.ProxyProtocol_Rule,
        'ProxyProtocol_Rule_SingleFields': module.ProxyProtocol_Rule_SingleFields
    })),
    'envoy/extensions/filters/listener/tls_inspector/v3/tls_inspector': () => import('./envoy/extensions/filters/listener/tls_inspector/v3/tls_inspector').then(module => ({
        'TlsInspector': module.TlsInspector,
        'TlsInspector_SingleFields': module.TlsInspector_SingleFields
    })),
    'envoy/extensions/filters/network/connection_limit/v3/connection_limit': () => import('./envoy/extensions/filters/network/connection_limit/v3/connection_limit').then(module => ({
        'ConnectionLimit': module.ConnectionLimit,
        'ConnectionLimit_SingleFields': module.ConnectionLimit_SingleFields
    })),
    'envoy/extensions/filters/network/direct_response/v3/config': () => import('./envoy/extensions/filters/network/direct_response/v3/config').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/network/dubbo_proxy/v3/dubbo_proxy': () => import('./envoy/extensions/filters/network/dubbo_proxy/v3/dubbo_proxy').then(module => ({
        'Drds': module.Drds,
        'Drds_SingleFields': module.Drds_SingleFields,
        'DubboProxy': module.DubboProxy,
        'DubboProxy_SingleFields': module.DubboProxy_SingleFields,
        'DubboFilter': module.DubboFilter,
        'DubboFilter_SingleFields': module.DubboFilter_SingleFields
    })),
    'envoy/extensions/filters/network/dubbo_proxy/v3/route': () => import('./envoy/extensions/filters/network/dubbo_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_SingleFields': module.RouteConfiguration_SingleFields,
        'MethodMatch': module.MethodMatch,
        'RouteMatch': module.RouteMatch,
        'RouteAction': module.RouteAction,
        'RouteAction_SingleFields': module.RouteAction_SingleFields,
        'Route': module.Route,
        'MethodMatch_ParameterMatchSpecifier': module.MethodMatch_ParameterMatchSpecifier,
        'MethodMatch_ParameterMatchSpecifier_SingleFields': module.MethodMatch_ParameterMatchSpecifier_SingleFields,
        'MethodMatch_ParamsMatchEntry': module.MethodMatch_ParamsMatchEntry,
        'MethodMatch_ParamsMatchEntry_SingleFields': module.MethodMatch_ParamsMatchEntry_SingleFields,
        'MultipleRouteConfiguration': module.MultipleRouteConfiguration,
        'MultipleRouteConfiguration_SingleFields': module.MultipleRouteConfiguration_SingleFields
    })),
    'envoy/extensions/filters/network/ext_authz/v3/ext_authz': () => import('./envoy/extensions/filters/network/ext_authz/v3/ext_authz').then(module => ({
        'ExtAuthz': module.ExtAuthz,
        'ExtAuthz_SingleFields': module.ExtAuthz_SingleFields
    })),
    'envoy/extensions/filters/network/ext_proc/v3/ext_proc': () => import('./envoy/extensions/filters/network/ext_proc/v3/ext_proc').then(module => ({
        'ProcessingMode': module.ProcessingMode,
        'ProcessingMode_SingleFields': module.ProcessingMode_SingleFields,
        'MetadataOptions_MetadataNamespaces': module.MetadataOptions_MetadataNamespaces,
        'MetadataOptions_MetadataNamespaces_SingleFields': module.MetadataOptions_MetadataNamespaces_SingleFields,
        'MetadataOptions': module.MetadataOptions,
        'NetworkExternalProcessor': module.NetworkExternalProcessor,
        'NetworkExternalProcessor_SingleFields': module.NetworkExternalProcessor_SingleFields
    })),
    'envoy/extensions/filters/network/generic_proxy/action/v3/action': () => import('./envoy/extensions/filters/network/generic_proxy/action/v3/action').then(module => ({
        'RouteAction': module.RouteAction,
        'RouteAction_SingleFields': module.RouteAction_SingleFields,
        'RouteAction_PerFilterConfigEntry': module.RouteAction_PerFilterConfigEntry,
        'RouteAction_PerFilterConfigEntry_SingleFields': module.RouteAction_PerFilterConfigEntry_SingleFields
    })),
    'envoy/extensions/filters/network/generic_proxy/codecs/http1/v3/http1': () => import('./envoy/extensions/filters/network/generic_proxy/codecs/http1/v3/http1').then(module => ({
        'Http1CodecConfig': module.Http1CodecConfig,
        'Http1CodecConfig_SingleFields': module.Http1CodecConfig_SingleFields
    })),
    'envoy/extensions/filters/network/generic_proxy/matcher/v3/matcher': () => import('./envoy/extensions/filters/network/generic_proxy/matcher/v3/matcher').then(module => ({
        'PropertyMatchInput': module.PropertyMatchInput,
        'PropertyMatchInput_SingleFields': module.PropertyMatchInput_SingleFields,
        'KeyValueMatchEntry': module.KeyValueMatchEntry,
        'KeyValueMatchEntry_SingleFields': module.KeyValueMatchEntry_SingleFields,
        'RequestMatcher': module.RequestMatcher
    })),
    'envoy/extensions/filters/network/generic_proxy/router/v3/router': () => import('./envoy/extensions/filters/network/generic_proxy/router/v3/router').then(module => ({
        'Router': module.Router,
        'Router_SingleFields': module.Router_SingleFields
    })),
    'envoy/extensions/filters/network/generic_proxy/v3/generic_proxy': () => import('./envoy/extensions/filters/network/generic_proxy/v3/generic_proxy').then(module => ({
        'GenericProxy': module.GenericProxy,
        'GenericProxy_SingleFields': module.GenericProxy_SingleFields,
        'GenericRds': module.GenericRds,
        'GenericRds_SingleFields': module.GenericRds_SingleFields
    })),
    'envoy/extensions/filters/network/generic_proxy/v3/route': () => import('./envoy/extensions/filters/network/generic_proxy/v3/route').then(module => ({
        'VirtualHost': module.VirtualHost,
        'VirtualHost_SingleFields': module.VirtualHost_SingleFields,
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_SingleFields': module.RouteConfiguration_SingleFields
    })),
    'envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager': () => import('./envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager').then(module => ({
        'HttpConnectionManager_Tracing': module.HttpConnectionManager_Tracing,
        'HttpConnectionManager_Tracing_SingleFields': module.HttpConnectionManager_Tracing_SingleFields,
        'HttpConnectionManager_HcmAccessLogOptions': module.HttpConnectionManager_HcmAccessLogOptions,
        'HttpConnectionManager_HcmAccessLogOptions_SingleFields': module.HttpConnectionManager_HcmAccessLogOptions_SingleFields,
        'HttpConnectionManager_InternalAddressConfig': module.HttpConnectionManager_InternalAddressConfig,
        'HttpConnectionManager_InternalAddressConfig_SingleFields': module.HttpConnectionManager_InternalAddressConfig_SingleFields,
        'HttpConnectionManager_SetCurrentClientCertDetails': module.HttpConnectionManager_SetCurrentClientCertDetails,
        'HttpConnectionManager_SetCurrentClientCertDetails_SingleFields': module.HttpConnectionManager_SetCurrentClientCertDetails_SingleFields,
        'RequestIDExtension': module.RequestIDExtension,
        'LocalReplyConfig': module.LocalReplyConfig,
        'HttpConnectionManager_PathNormalizationOptions': module.HttpConnectionManager_PathNormalizationOptions,
        'HttpConnectionManager_ProxyStatusConfig': module.HttpConnectionManager_ProxyStatusConfig,
        'HttpConnectionManager_ProxyStatusConfig_SingleFields': module.HttpConnectionManager_ProxyStatusConfig_SingleFields,
        'HttpConnectionManager': module.HttpConnectionManager,
        'HttpConnectionManager_SingleFields': module.HttpConnectionManager_SingleFields,
        'HttpConnectionManager_UpgradeConfig': module.HttpConnectionManager_UpgradeConfig,
        'HttpConnectionManager_UpgradeConfig_SingleFields': module.HttpConnectionManager_UpgradeConfig_SingleFields,
        'ResponseMapper': module.ResponseMapper,
        'ResponseMapper_SingleFields': module.ResponseMapper_SingleFields,
        'Rds': module.Rds,
        'Rds_SingleFields': module.Rds_SingleFields,
        'ScopedRouteConfigurationsList': module.ScopedRouteConfigurationsList,
        'ScopedRoutes_ScopeKeyBuilder': module.ScopedRoutes_ScopeKeyBuilder,
        'ScopedRoutes': module.ScopedRoutes,
        'ScopedRoutes_SingleFields': module.ScopedRoutes_SingleFields,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_SingleFields': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_SingleFields,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement,
        'ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement_SingleFields': module.ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement_SingleFields,
        'ScopedRds': module.ScopedRds,
        'ScopedRds_SingleFields': module.ScopedRds_SingleFields,
        'HttpFilter': module.HttpFilter,
        'HttpFilter_SingleFields': module.HttpFilter_SingleFields,
        'EnvoyMobileHttpConnectionManager': module.EnvoyMobileHttpConnectionManager
    })),
    'envoy/extensions/filters/network/local_ratelimit/v3/local_rate_limit': () => import('./envoy/extensions/filters/network/local_ratelimit/v3/local_rate_limit').then(module => ({
        'LocalRateLimit': module.LocalRateLimit,
        'LocalRateLimit_SingleFields': module.LocalRateLimit_SingleFields
    })),
    'envoy/extensions/filters/network/mongo_proxy/v3/mongo_proxy': () => import('./envoy/extensions/filters/network/mongo_proxy/v3/mongo_proxy').then(module => ({
        'MongoProxy': module.MongoProxy,
        'MongoProxy_SingleFields': module.MongoProxy_SingleFields
    })),
    'envoy/extensions/filters/network/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/network/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit,
        'RateLimit_SingleFields': module.RateLimit_SingleFields
    })),
    'envoy/extensions/filters/network/rbac/v3/rbac': () => import('./envoy/extensions/filters/network/rbac/v3/rbac').then(module => ({
        'RBAC': module.RBAC,
        'RBAC_SingleFields': module.RBAC_SingleFields
    })),
    'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy': () => import('./envoy/extensions/filters/network/redis_proxy/v3/redis_proxy').then(module => ({
        'RedisProxy_ConnectionRateLimit': module.RedisProxy_ConnectionRateLimit,
        'RedisProxy_ConnectionRateLimit_SingleFields': module.RedisProxy_ConnectionRateLimit_SingleFields,
        'RedisProxy_ConnPoolSettings': module.RedisProxy_ConnPoolSettings,
        'RedisProxy_ConnPoolSettings_SingleFields': module.RedisProxy_ConnPoolSettings_SingleFields,
        'RedisProxy_PrefixRoutes_Route_ReadCommandPolicy': module.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy,
        'RedisProxy_PrefixRoutes_Route_ReadCommandPolicy_SingleFields': module.RedisProxy_PrefixRoutes_Route_ReadCommandPolicy_SingleFields,
        'RedisProxy_PrefixRoutes_Route': module.RedisProxy_PrefixRoutes_Route,
        'RedisProxy_PrefixRoutes_Route_SingleFields': module.RedisProxy_PrefixRoutes_Route_SingleFields,
        'RedisProxy_PrefixRoutes': module.RedisProxy_PrefixRoutes,
        'RedisProxy_PrefixRoutes_SingleFields': module.RedisProxy_PrefixRoutes_SingleFields,
        'RedisExternalAuthProvider': module.RedisExternalAuthProvider,
        'RedisExternalAuthProvider_SingleFields': module.RedisExternalAuthProvider_SingleFields,
        'RedisProxy': module.RedisProxy,
        'RedisProxy_SingleFields': module.RedisProxy_SingleFields,
        'RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy': module.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy,
        'RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy_SingleFields': module.RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy_SingleFields,
        'RedisProxy_RedisFault': module.RedisProxy_RedisFault,
        'RedisProxy_RedisFault_SingleFields': module.RedisProxy_RedisFault_SingleFields,
        'AwsIam': module.AwsIam,
        'AwsIam_SingleFields': module.AwsIam_SingleFields,
        'RedisProtocolOptions': module.RedisProtocolOptions
    })),
    'envoy/extensions/filters/network/reverse_tunnel/v3/reverse_tunnel': () => import('./envoy/extensions/filters/network/reverse_tunnel/v3/reverse_tunnel').then(module => ({
        'Validation': module.Validation,
        'Validation_SingleFields': module.Validation_SingleFields,
        'ReverseTunnel': module.ReverseTunnel,
        'ReverseTunnel_SingleFields': module.ReverseTunnel_SingleFields
    })),
    'envoy/extensions/filters/network/set_filter_state/v3/set_filter_state': () => import('./envoy/extensions/filters/network/set_filter_state/v3/set_filter_state').then(module => ({
        'Config': module.Config
    })),
    'envoy/extensions/filters/network/sni_dynamic_forward_proxy/v3/sni_dynamic_forward_proxy': () => import('./envoy/extensions/filters/network/sni_dynamic_forward_proxy/v3/sni_dynamic_forward_proxy').then(module => ({
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields
    })),
    'envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy': () => import('./envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy').then(module => ({
        'TcpProxy_OnDemand': module.TcpProxy_OnDemand,
        'TcpProxy_OnDemand_SingleFields': module.TcpProxy_OnDemand_SingleFields,
        'TcpProxy_TunnelingConfig': module.TcpProxy_TunnelingConfig,
        'TcpProxy_TunnelingConfig_SingleFields': module.TcpProxy_TunnelingConfig_SingleFields,
        'TcpProxy_TcpAccessLogOptions': module.TcpProxy_TcpAccessLogOptions,
        'TcpProxy_TcpAccessLogOptions_SingleFields': module.TcpProxy_TcpAccessLogOptions_SingleFields,
        'TcpProxy': module.TcpProxy,
        'TcpProxy_SingleFields': module.TcpProxy_SingleFields,
        'TcpProxy_WeightedCluster': module.TcpProxy_WeightedCluster,
        'TcpProxy_WeightedCluster_ClusterWeight': module.TcpProxy_WeightedCluster_ClusterWeight,
        'TcpProxy_WeightedCluster_ClusterWeight_SingleFields': module.TcpProxy_WeightedCluster_ClusterWeight_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/header_to_metadata/v3/header_to_metadata': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/header_to_metadata/v3/header_to_metadata').then(module => ({
        'HeaderToMetadata': module.HeaderToMetadata,
        'HeaderToMetadata_KeyValuePair': module.HeaderToMetadata_KeyValuePair,
        'HeaderToMetadata_KeyValuePair_SingleFields': module.HeaderToMetadata_KeyValuePair_SingleFields,
        'HeaderToMetadata_Rule': module.HeaderToMetadata_Rule,
        'HeaderToMetadata_Rule_SingleFields': module.HeaderToMetadata_Rule_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/payload_to_metadata/v3/payload_to_metadata': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/payload_to_metadata/v3/payload_to_metadata').then(module => ({
        'PayloadToMetadata': module.PayloadToMetadata,
        'PayloadToMetadata_KeyValuePair': module.PayloadToMetadata_KeyValuePair,
        'PayloadToMetadata_KeyValuePair_SingleFields': module.PayloadToMetadata_KeyValuePair_SingleFields,
        'PayloadToMetadata_FieldSelector': module.PayloadToMetadata_FieldSelector,
        'PayloadToMetadata_FieldSelector_SingleFields': module.PayloadToMetadata_FieldSelector_SingleFields,
        'PayloadToMetadata_Rule': module.PayloadToMetadata_Rule,
        'PayloadToMetadata_Rule_SingleFields': module.PayloadToMetadata_Rule_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/filters/ratelimit/v3/rate_limit': () => import('./envoy/extensions/filters/network/thrift_proxy/filters/ratelimit/v3/rate_limit').then(module => ({
        'RateLimit': module.RateLimit,
        'RateLimit_SingleFields': module.RateLimit_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/router/v3/router': () => import('./envoy/extensions/filters/network/thrift_proxy/router/v3/router').then(module => ({
        'Router': module.Router,
        'Router_SingleFields': module.Router_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/v3/route': () => import('./envoy/extensions/filters/network/thrift_proxy/v3/route').then(module => ({
        'RouteConfiguration': module.RouteConfiguration,
        'RouteConfiguration_SingleFields': module.RouteConfiguration_SingleFields,
        'RouteMatch': module.RouteMatch,
        'RouteMatch_SingleFields': module.RouteMatch_SingleFields,
        'RouteAction': module.RouteAction,
        'RouteAction_SingleFields': module.RouteAction_SingleFields,
        'Route': module.Route,
        'RouteAction_RequestMirrorPolicy': module.RouteAction_RequestMirrorPolicy,
        'RouteAction_RequestMirrorPolicy_SingleFields': module.RouteAction_RequestMirrorPolicy_SingleFields,
        'WeightedCluster': module.WeightedCluster,
        'WeightedCluster_ClusterWeight': module.WeightedCluster_ClusterWeight,
        'WeightedCluster_ClusterWeight_SingleFields': module.WeightedCluster_ClusterWeight_SingleFields
    })),
    'envoy/extensions/filters/network/thrift_proxy/v3/thrift_proxy': () => import('./envoy/extensions/filters/network/thrift_proxy/v3/thrift_proxy').then(module => ({
        'Trds': module.Trds,
        'Trds_SingleFields': module.Trds_SingleFields,
        'ThriftProxy': module.ThriftProxy,
        'ThriftProxy_SingleFields': module.ThriftProxy_SingleFields,
        'ThriftFilter': module.ThriftFilter,
        'ThriftFilter_SingleFields': module.ThriftFilter_SingleFields,
        'ThriftProtocolOptions': module.ThriftProtocolOptions,
        'ThriftProtocolOptions_SingleFields': module.ThriftProtocolOptions_SingleFields
    })),
    'envoy/extensions/filters/network/wasm/v3/wasm': () => import('./envoy/extensions/filters/network/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/filters/network/zookeeper_proxy/v3/zookeeper_proxy': () => import('./envoy/extensions/filters/network/zookeeper_proxy/v3/zookeeper_proxy').then(module => ({
        'ZooKeeperProxy': module.ZooKeeperProxy,
        'ZooKeeperProxy_SingleFields': module.ZooKeeperProxy_SingleFields,
        'LatencyThresholdOverride': module.LatencyThresholdOverride,
        'LatencyThresholdOverride_SingleFields': module.LatencyThresholdOverride_SingleFields
    })),
    'envoy/extensions/filters/udp/dns_filter/v3/dns_filter': () => import('./envoy/extensions/filters/udp/dns_filter/v3/dns_filter').then(module => ({
        'DnsFilterConfig_ServerContextConfig': module.DnsFilterConfig_ServerContextConfig,
        'DnsFilterConfig_ClientContextConfig': module.DnsFilterConfig_ClientContextConfig,
        'DnsFilterConfig_ClientContextConfig_SingleFields': module.DnsFilterConfig_ClientContextConfig_SingleFields,
        'DnsFilterConfig': module.DnsFilterConfig,
        'DnsFilterConfig_SingleFields': module.DnsFilterConfig_SingleFields
    })),
    'envoy/extensions/filters/udp/udp_proxy/session/dynamic_forward_proxy/v3/dynamic_forward_proxy': () => import('./envoy/extensions/filters/udp/udp_proxy/session/dynamic_forward_proxy/v3/dynamic_forward_proxy').then(module => ({
        'FilterConfig_BufferOptions': module.FilterConfig_BufferOptions,
        'FilterConfig_BufferOptions_SingleFields': module.FilterConfig_BufferOptions_SingleFields,
        'FilterConfig': module.FilterConfig,
        'FilterConfig_SingleFields': module.FilterConfig_SingleFields
    })),
    'envoy/extensions/filters/udp/udp_proxy/v3/route': () => import('./envoy/extensions/filters/udp/udp_proxy/v3/route').then(module => ({
        'Route': module.Route,
        'Route_SingleFields': module.Route_SingleFields
    })),
    'envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy': () => import('./envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy').then(module => ({
        'UdpProxyConfig_UdpTunnelingConfig_RetryOptions': module.UdpProxyConfig_UdpTunnelingConfig_RetryOptions,
        'UdpProxyConfig_UdpTunnelingConfig_RetryOptions_SingleFields': module.UdpProxyConfig_UdpTunnelingConfig_RetryOptions_SingleFields,
        'UdpProxyConfig_UdpTunnelingConfig_BufferOptions': module.UdpProxyConfig_UdpTunnelingConfig_BufferOptions,
        'UdpProxyConfig_UdpTunnelingConfig_BufferOptions_SingleFields': module.UdpProxyConfig_UdpTunnelingConfig_BufferOptions_SingleFields,
        'UdpProxyConfig_UdpTunnelingConfig': module.UdpProxyConfig_UdpTunnelingConfig,
        'UdpProxyConfig_UdpTunnelingConfig_SingleFields': module.UdpProxyConfig_UdpTunnelingConfig_SingleFields,
        'UdpProxyConfig_UdpAccessLogOptions': module.UdpProxyConfig_UdpAccessLogOptions,
        'UdpProxyConfig_UdpAccessLogOptions_SingleFields': module.UdpProxyConfig_UdpAccessLogOptions_SingleFields,
        'UdpProxyConfig': module.UdpProxyConfig,
        'UdpProxyConfig_SingleFields': module.UdpProxyConfig_SingleFields,
        'UdpProxyConfig_HashPolicy': module.UdpProxyConfig_HashPolicy,
        'UdpProxyConfig_HashPolicy_SingleFields': module.UdpProxyConfig_HashPolicy_SingleFields,
        'UdpProxyConfig_SessionFilter': module.UdpProxyConfig_SessionFilter,
        'UdpProxyConfig_SessionFilter_SingleFields': module.UdpProxyConfig_SessionFilter_SingleFields
    })),
    'envoy/extensions/geoip_providers/common/v3/common': () => import('./envoy/extensions/geoip_providers/common/v3/common').then(module => ({
        'CommonGeoipProviderConfig_GeolocationHeadersToAdd': module.CommonGeoipProviderConfig_GeolocationHeadersToAdd,
        'CommonGeoipProviderConfig_GeolocationHeadersToAdd_SingleFields': module.CommonGeoipProviderConfig_GeolocationHeadersToAdd_SingleFields,
        'CommonGeoipProviderConfig': module.CommonGeoipProviderConfig
    })),
    'envoy/extensions/geoip_providers/maxmind/v3/maxmind': () => import('./envoy/extensions/geoip_providers/maxmind/v3/maxmind').then(module => ({
        'MaxMindConfig': module.MaxMindConfig,
        'MaxMindConfig_SingleFields': module.MaxMindConfig_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/access_token/v3/access_token_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/access_token/v3/access_token_credentials').then(module => ({
        'AccessTokenCredentials': module.AccessTokenCredentials,
        'AccessTokenCredentials_SingleFields': module.AccessTokenCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/file_based_metadata/v3/file_based_metadata_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/file_based_metadata/v3/file_based_metadata_credentials').then(module => ({
        'FileBasedMetadataCallCredentials': module.FileBasedMetadataCallCredentials,
        'FileBasedMetadataCallCredentials_SingleFields': module.FileBasedMetadataCallCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/google_iam/v3/google_iam_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/google_iam/v3/google_iam_credentials').then(module => ({
        'GoogleIamCredentials': module.GoogleIamCredentials,
        'GoogleIamCredentials_SingleFields': module.GoogleIamCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/google_refresh_token/v3/google_refresh_token_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/google_refresh_token/v3/google_refresh_token_credentials').then(module => ({
        'GoogleRefreshTokenCredentials': module.GoogleRefreshTokenCredentials,
        'GoogleRefreshTokenCredentials_SingleFields': module.GoogleRefreshTokenCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/service_account_jwt_access/v3/service_account_jwt_access_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/service_account_jwt_access/v3/service_account_jwt_access_credentials').then(module => ({
        'ServiceAccountJwtAccessCredentials': module.ServiceAccountJwtAccessCredentials,
        'ServiceAccountJwtAccessCredentials_SingleFields': module.ServiceAccountJwtAccessCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/call_credentials/sts_service/v3/sts_service_credentials': () => import('./envoy/extensions/grpc_service/call_credentials/sts_service/v3/sts_service_credentials').then(module => ({
        'StsServiceCredentials': module.StsServiceCredentials,
        'StsServiceCredentials_SingleFields': module.StsServiceCredentials_SingleFields
    })),
    'envoy/extensions/grpc_service/channel_credentials/tls/v3/tls_credentials': () => import('./envoy/extensions/grpc_service/channel_credentials/tls/v3/tls_credentials').then(module => ({
        'TlsCredentials': module.TlsCredentials
    })),
    'envoy/extensions/grpc_service/channel_credentials/xds/v3/xds_credentials': () => import('./envoy/extensions/grpc_service/channel_credentials/xds/v3/xds_credentials').then(module => ({
        'XdsCredentials': module.XdsCredentials
    })),
    'envoy/extensions/health_check/event_sinks/file/v3/file': () => import('./envoy/extensions/health_check/event_sinks/file/v3/file').then(module => ({
        'HealthCheckEventFileSink': module.HealthCheckEventFileSink,
        'HealthCheckEventFileSink_SingleFields': module.HealthCheckEventFileSink_SingleFields
    })),
    'envoy/extensions/health_checkers/redis/v3/redis': () => import('./envoy/extensions/health_checkers/redis/v3/redis').then(module => ({
        'Redis': module.Redis,
        'Redis_SingleFields': module.Redis_SingleFields
    })),
    'envoy/extensions/health_checkers/thrift/v3/thrift': () => import('./envoy/extensions/health_checkers/thrift/v3/thrift').then(module => ({
        'Thrift': module.Thrift,
        'Thrift_SingleFields': module.Thrift_SingleFields
    })),
    'envoy/extensions/http/cache/file_system_http_cache/v3/file_system_http_cache': () => import('./envoy/extensions/http/cache/file_system_http_cache/v3/file_system_http_cache').then(module => ({
        'FileSystemHttpCacheConfig': module.FileSystemHttpCacheConfig,
        'FileSystemHttpCacheConfig_SingleFields': module.FileSystemHttpCacheConfig_SingleFields
    })),
    'envoy/extensions/http/cache_v2/file_system_http_cache/v3/file_system_http_cache': () => import('./envoy/extensions/http/cache_v2/file_system_http_cache/v3/file_system_http_cache').then(module => ({
        'FileSystemHttpCacheV2Config': module.FileSystemHttpCacheV2Config,
        'FileSystemHttpCacheV2Config_SingleFields': module.FileSystemHttpCacheV2Config_SingleFields
    })),
    'envoy/extensions/http/custom_response/local_response_policy/v3/local_response_policy': () => import('./envoy/extensions/http/custom_response/local_response_policy/v3/local_response_policy').then(module => ({
        'LocalResponsePolicy': module.LocalResponsePolicy,
        'LocalResponsePolicy_SingleFields': module.LocalResponsePolicy_SingleFields
    })),
    'envoy/extensions/http/custom_response/redirect_policy/v3/redirect_policy': () => import('./envoy/extensions/http/custom_response/redirect_policy/v3/redirect_policy').then(module => ({
        'RedirectPolicy': module.RedirectPolicy,
        'RedirectPolicy_SingleFields': module.RedirectPolicy_SingleFields
    })),
    'envoy/extensions/http/early_header_mutation/header_mutation/v3/header_mutation': () => import('./envoy/extensions/http/early_header_mutation/header_mutation/v3/header_mutation').then(module => ({
        'HeaderMutation': module.HeaderMutation
    })),
    'envoy/extensions/http/ext_proc/processing_request_modifiers/mapped_attribute_builder/v3/mapped_attribute_builder': () => import('./envoy/extensions/http/ext_proc/processing_request_modifiers/mapped_attribute_builder/v3/mapped_attribute_builder').then(module => ({
        'MappedAttributeBuilder': module.MappedAttributeBuilder,
        'MappedAttributeBuilder_MappedRequestAttributesEntry': module.MappedAttributeBuilder_MappedRequestAttributesEntry,
        'MappedAttributeBuilder_MappedRequestAttributesEntry_SingleFields': module.MappedAttributeBuilder_MappedRequestAttributesEntry_SingleFields
    })),
    'envoy/extensions/http/ext_proc/response_processors/save_processing_response/v3/save_processing_response': () => import('./envoy/extensions/http/ext_proc/response_processors/save_processing_response/v3/save_processing_response').then(module => ({
        'SaveProcessingResponse_SaveOptions': module.SaveProcessingResponse_SaveOptions,
        'SaveProcessingResponse_SaveOptions_SingleFields': module.SaveProcessingResponse_SaveOptions_SingleFields,
        'SaveProcessingResponse': module.SaveProcessingResponse,
        'SaveProcessingResponse_SingleFields': module.SaveProcessingResponse_SingleFields
    })),
    'envoy/extensions/http/header_formatters/preserve_case/v3/preserve_case': () => import('./envoy/extensions/http/header_formatters/preserve_case/v3/preserve_case').then(module => ({
        'PreserveCaseFormatterConfig': module.PreserveCaseFormatterConfig,
        'PreserveCaseFormatterConfig_SingleFields': module.PreserveCaseFormatterConfig_SingleFields
    })),
    'envoy/extensions/http/header_validators/envoy_default/v3/header_validator': () => import('./envoy/extensions/http/header_validators/envoy_default/v3/header_validator').then(module => ({
        'HeaderValidatorConfig_Http1ProtocolOptions': module.HeaderValidatorConfig_Http1ProtocolOptions,
        'HeaderValidatorConfig_Http1ProtocolOptions_SingleFields': module.HeaderValidatorConfig_Http1ProtocolOptions_SingleFields,
        'HeaderValidatorConfig_UriPathNormalizationOptions': module.HeaderValidatorConfig_UriPathNormalizationOptions,
        'HeaderValidatorConfig_UriPathNormalizationOptions_SingleFields': module.HeaderValidatorConfig_UriPathNormalizationOptions_SingleFields,
        'HeaderValidatorConfig': module.HeaderValidatorConfig,
        'HeaderValidatorConfig_SingleFields': module.HeaderValidatorConfig_SingleFields
    })),
    'envoy/extensions/http/injected_credentials/generic/v3/generic': () => import('./envoy/extensions/http/injected_credentials/generic/v3/generic').then(module => ({
        'Generic': module.Generic,
        'Generic_SingleFields': module.Generic_SingleFields
    })),
    'envoy/extensions/http/injected_credentials/oauth2/v3/oauth2': () => import('./envoy/extensions/http/injected_credentials/oauth2/v3/oauth2').then(module => ({
        'OAuth2': module.OAuth2,
        'OAuth2_SingleFields': module.OAuth2_SingleFields,
        'OAuth2_ClientCredentials': module.OAuth2_ClientCredentials,
        'OAuth2_ClientCredentials_SingleFields': module.OAuth2_ClientCredentials_SingleFields
    })),
    'envoy/extensions/http/original_ip_detection/custom_header/v3/custom_header': () => import('./envoy/extensions/http/original_ip_detection/custom_header/v3/custom_header').then(module => ({
        'CustomHeaderConfig': module.CustomHeaderConfig,
        'CustomHeaderConfig_SingleFields': module.CustomHeaderConfig_SingleFields
    })),
    'envoy/extensions/http/original_ip_detection/xff/v3/xff': () => import('./envoy/extensions/http/original_ip_detection/xff/v3/xff').then(module => ({
        'XffTrustedCidrs': module.XffTrustedCidrs,
        'XffConfig': module.XffConfig,
        'XffConfig_SingleFields': module.XffConfig_SingleFields
    })),
    'envoy/extensions/http/stateful_session/cookie/v3/cookie': () => import('./envoy/extensions/http/stateful_session/cookie/v3/cookie').then(module => ({
        'CookieBasedSessionState': module.CookieBasedSessionState
    })),
    'envoy/extensions/http/stateful_session/envelope/v3/envelope': () => import('./envoy/extensions/http/stateful_session/envelope/v3/envelope').then(module => ({
        'EnvelopeSessionState_Header': module.EnvelopeSessionState_Header,
        'EnvelopeSessionState_Header_SingleFields': module.EnvelopeSessionState_Header_SingleFields,
        'EnvelopeSessionState': module.EnvelopeSessionState
    })),
    'envoy/extensions/http/stateful_session/header/v3/header': () => import('./envoy/extensions/http/stateful_session/header/v3/header').then(module => ({
        'HeaderBasedSessionState': module.HeaderBasedSessionState,
        'HeaderBasedSessionState_SingleFields': module.HeaderBasedSessionState_SingleFields
    })),
    'envoy/extensions/internal_redirect/allow_listed_routes/v3/allow_listed_routes_config': () => import('./envoy/extensions/internal_redirect/allow_listed_routes/v3/allow_listed_routes_config').then(module => ({
        'AllowListedRoutesConfig': module.AllowListedRoutesConfig,
        'AllowListedRoutesConfig_SingleFields': module.AllowListedRoutesConfig_SingleFields
    })),
    'envoy/extensions/key_value/file_based/v3/config': () => import('./envoy/extensions/key_value/file_based/v3/config').then(module => ({
        'FileBasedKeyValueStoreConfig': module.FileBasedKeyValueStoreConfig,
        'FileBasedKeyValueStoreConfig_SingleFields': module.FileBasedKeyValueStoreConfig_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/client_side_weighted_round_robin': () => import('./envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/client_side_weighted_round_robin').then(module => ({
        'ClientSideWeightedRoundRobin': module.ClientSideWeightedRoundRobin,
        'ClientSideWeightedRoundRobin_SingleFields': module.ClientSideWeightedRoundRobin_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/common/v3/common': () => import('./envoy/extensions/load_balancing_policies/common/v3/common').then(module => ({
        'LocalityLbConfig': module.LocalityLbConfig,
        'LocalityLbConfig_ZoneAwareLbConfig_ForceLocalZone': module.LocalityLbConfig_ZoneAwareLbConfig_ForceLocalZone,
        'LocalityLbConfig_ZoneAwareLbConfig_ForceLocalZone_SingleFields': module.LocalityLbConfig_ZoneAwareLbConfig_ForceLocalZone_SingleFields,
        'LocalityLbConfig_ZoneAwareLbConfig': module.LocalityLbConfig_ZoneAwareLbConfig,
        'LocalityLbConfig_ZoneAwareLbConfig_SingleFields': module.LocalityLbConfig_ZoneAwareLbConfig_SingleFields,
        'SlowStartConfig': module.SlowStartConfig,
        'SlowStartConfig_SingleFields': module.SlowStartConfig_SingleFields,
        'ConsistentHashingLbConfig': module.ConsistentHashingLbConfig,
        'ConsistentHashingLbConfig_SingleFields': module.ConsistentHashingLbConfig_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/least_request/v3/least_request': () => import('./envoy/extensions/load_balancing_policies/least_request/v3/least_request').then(module => ({
        'LeastRequest': module.LeastRequest,
        'LeastRequest_SingleFields': module.LeastRequest_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/maglev/v3/maglev': () => import('./envoy/extensions/load_balancing_policies/maglev/v3/maglev').then(module => ({
        'Maglev': module.Maglev,
        'Maglev_SingleFields': module.Maglev_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/override_host/v3/override_host': () => import('./envoy/extensions/load_balancing_policies/override_host/v3/override_host').then(module => ({
        'OverrideHost': module.OverrideHost,
        'OverrideHost_OverrideHostSource': module.OverrideHost_OverrideHostSource,
        'OverrideHost_OverrideHostSource_SingleFields': module.OverrideHost_OverrideHostSource_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/pick_first/v3/pick_first': () => import('./envoy/extensions/load_balancing_policies/pick_first/v3/pick_first').then(module => ({
        'PickFirst': module.PickFirst,
        'PickFirst_SingleFields': module.PickFirst_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/random/v3/random': () => import('./envoy/extensions/load_balancing_policies/random/v3/random').then(module => ({
        'Random': module.Random
    })),
    'envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash': () => import('./envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash').then(module => ({
        'RingHash': module.RingHash,
        'RingHash_SingleFields': module.RingHash_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/round_robin/v3/round_robin': () => import('./envoy/extensions/load_balancing_policies/round_robin/v3/round_robin').then(module => ({
        'RoundRobin': module.RoundRobin
    })),
    'envoy/extensions/load_balancing_policies/subset/v3/subset': () => import('./envoy/extensions/load_balancing_policies/subset/v3/subset').then(module => ({
        'Subset': module.Subset,
        'Subset_SingleFields': module.Subset_SingleFields,
        'Subset_LbSubsetSelector': module.Subset_LbSubsetSelector,
        'Subset_LbSubsetSelector_SingleFields': module.Subset_LbSubsetSelector_SingleFields
    })),
    'envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality': () => import('./envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality').then(module => ({
        'WrrLocality': module.WrrLocality
    })),
    'envoy/extensions/matching/common_inputs/environment_variable/v3/input': () => import('./envoy/extensions/matching/common_inputs/environment_variable/v3/input').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/matching/common_inputs/network/v3/network_inputs': () => import('./envoy/extensions/matching/common_inputs/network/v3/network_inputs').then(module => ({
        'FilterStateInput': module.FilterStateInput,
        'FilterStateInput_SingleFields': module.FilterStateInput_SingleFields,
        'DynamicMetadataInput': module.DynamicMetadataInput,
        'DynamicMetadataInput_SingleFields': module.DynamicMetadataInput_SingleFields,
        'DynamicMetadataInput_PathSegment': module.DynamicMetadataInput_PathSegment,
        'DynamicMetadataInput_PathSegment_SingleFields': module.DynamicMetadataInput_PathSegment_SingleFields
    })),
    'envoy/extensions/matching/input_matchers/consistent_hashing/v3/consistent_hashing': () => import('./envoy/extensions/matching/input_matchers/consistent_hashing/v3/consistent_hashing').then(module => ({
        'ConsistentHashing': module.ConsistentHashing,
        'ConsistentHashing_SingleFields': module.ConsistentHashing_SingleFields
    })),
    'envoy/extensions/matching/input_matchers/ip/v3/ip': () => import('./envoy/extensions/matching/input_matchers/ip/v3/ip').then(module => ({
        'Ip': module.Ip,
        'Ip_SingleFields': module.Ip_SingleFields
    })),
    'envoy/extensions/matching/input_matchers/metadata/v3/metadata': () => import('./envoy/extensions/matching/input_matchers/metadata/v3/metadata').then(module => ({
        'Metadata': module.Metadata,
        'Metadata_SingleFields': module.Metadata_SingleFields
    })),
    'envoy/extensions/matching/input_matchers/runtime_fraction/v3/runtime_fraction': () => import('./envoy/extensions/matching/input_matchers/runtime_fraction/v3/runtime_fraction').then(module => ({
        'RuntimeFraction': module.RuntimeFraction,
        'RuntimeFraction_SingleFields': module.RuntimeFraction_SingleFields
    })),
    'envoy/extensions/network/dns_resolver/apple/v3/apple_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/apple/v3/apple_dns_resolver').then(module => ({
        'AppleDnsResolverConfig': module.AppleDnsResolverConfig,
        'AppleDnsResolverConfig_SingleFields': module.AppleDnsResolverConfig_SingleFields
    })),
    'envoy/extensions/network/dns_resolver/cares/v3/cares_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/cares/v3/cares_dns_resolver').then(module => ({
        'CaresDnsResolverConfig': module.CaresDnsResolverConfig,
        'CaresDnsResolverConfig_SingleFields': module.CaresDnsResolverConfig_SingleFields
    })),
    'envoy/extensions/network/dns_resolver/getaddrinfo/v3/getaddrinfo_dns_resolver': () => import('./envoy/extensions/network/dns_resolver/getaddrinfo/v3/getaddrinfo_dns_resolver').then(module => ({
        'GetAddrInfoDnsResolverConfig': module.GetAddrInfoDnsResolverConfig,
        'GetAddrInfoDnsResolverConfig_SingleFields': module.GetAddrInfoDnsResolverConfig_SingleFields
    })),
    'envoy/extensions/network/socket_interface/v3/default_socket_interface': () => import('./envoy/extensions/network/socket_interface/v3/default_socket_interface').then(module => ({
        'IoUringOptions': module.IoUringOptions,
        'IoUringOptions_SingleFields': module.IoUringOptions_SingleFields,
        'DefaultSocketInterface': module.DefaultSocketInterface
    })),
    'envoy/extensions/outlier_detection_monitors/common/v3/error_types': () => import('./envoy/extensions/outlier_detection_monitors/common/v3/error_types').then(module => ({
        'HttpErrors': module.HttpErrors,
        'ErrorBuckets': module.ErrorBuckets
    })),
    'envoy/extensions/outlier_detection_monitors/consecutive_errors/v3/consecutive_errors': () => import('./envoy/extensions/outlier_detection_monitors/consecutive_errors/v3/consecutive_errors').then(module => ({
        'ConsecutiveErrors': module.ConsecutiveErrors,
        'ConsecutiveErrors_SingleFields': module.ConsecutiveErrors_SingleFields
    })),
    'envoy/extensions/path/match/uri_template/v3/uri_template_match': () => import('./envoy/extensions/path/match/uri_template/v3/uri_template_match').then(module => ({
        'UriTemplateMatchConfig': module.UriTemplateMatchConfig,
        'UriTemplateMatchConfig_SingleFields': module.UriTemplateMatchConfig_SingleFields
    })),
    'envoy/extensions/path/rewrite/uri_template/v3/uri_template_rewrite': () => import('./envoy/extensions/path/rewrite/uri_template/v3/uri_template_rewrite').then(module => ({
        'UriTemplateRewriteConfig': module.UriTemplateRewriteConfig,
        'UriTemplateRewriteConfig_SingleFields': module.UriTemplateRewriteConfig_SingleFields
    })),
    'envoy/extensions/quic/connection_debug_visitor/quic_stats/v3/quic_stats': () => import('./envoy/extensions/quic/connection_debug_visitor/quic_stats/v3/quic_stats').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/quic/connection_id_generator/quic_lb/v3/quic_lb': () => import('./envoy/extensions/quic/connection_id_generator/quic_lb/v3/quic_lb').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/quic/server_preferred_address/v3/datasource': () => import('./envoy/extensions/quic/server_preferred_address/v3/datasource').then(module => ({
        'DataSourceServerPreferredAddressConfig_AddressFamilyConfig': module.DataSourceServerPreferredAddressConfig_AddressFamilyConfig,
        'DataSourceServerPreferredAddressConfig': module.DataSourceServerPreferredAddressConfig
    })),
    'envoy/extensions/quic/server_preferred_address/v3/fixed_server_preferred_address_config': () => import('./envoy/extensions/quic/server_preferred_address/v3/fixed_server_preferred_address_config').then(module => ({
        'FixedServerPreferredAddressConfig_AddressFamilyConfig': module.FixedServerPreferredAddressConfig_AddressFamilyConfig,
        'FixedServerPreferredAddressConfig': module.FixedServerPreferredAddressConfig,
        'FixedServerPreferredAddressConfig_SingleFields': module.FixedServerPreferredAddressConfig_SingleFields
    })),
    'envoy/extensions/rate_limit_descriptors/expr/v3/expr': () => import('./envoy/extensions/rate_limit_descriptors/expr/v3/expr').then(module => ({
        'Descriptor': module.Descriptor,
        'Descriptor_SingleFields': module.Descriptor_SingleFields
    })),
    'envoy/extensions/rbac/matchers/upstream_ip_port/v3/upstream_ip_port_matcher': () => import('./envoy/extensions/rbac/matchers/upstream_ip_port/v3/upstream_ip_port_matcher').then(module => ({
        'UpstreamIpPortMatcher': module.UpstreamIpPortMatcher
    })),
    'envoy/extensions/rbac/principals/mtls_authenticated/v3/mtls_authenticated': () => import('./envoy/extensions/rbac/principals/mtls_authenticated/v3/mtls_authenticated').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/request_id/uuid/v3/uuid': () => import('./envoy/extensions/request_id/uuid/v3/uuid').then(module => ({
        'UuidRequestIdConfig': module.UuidRequestIdConfig,
        'UuidRequestIdConfig_SingleFields': module.UuidRequestIdConfig_SingleFields
    })),
    'envoy/extensions/resource_monitors/cgroup_memory/v3/cgroup_memory': () => import('./envoy/extensions/resource_monitors/cgroup_memory/v3/cgroup_memory').then(module => ({
        'CgroupMemoryConfig': module.CgroupMemoryConfig,
        'CgroupMemoryConfig_SingleFields': module.CgroupMemoryConfig_SingleFields
    })),
    'envoy/extensions/resource_monitors/cpu_utilization/v3/cpu_utilization': () => import('./envoy/extensions/resource_monitors/cpu_utilization/v3/cpu_utilization').then(module => ({
        'CpuUtilizationConfig': module.CpuUtilizationConfig,
        'CpuUtilizationConfig_SingleFields': module.CpuUtilizationConfig_SingleFields
    })),
    'envoy/extensions/resource_monitors/downstream_connections/v3/downstream_connections': () => import('./envoy/extensions/resource_monitors/downstream_connections/v3/downstream_connections').then(module => ({
        'DownstreamConnectionsConfig': module.DownstreamConnectionsConfig,
        'DownstreamConnectionsConfig_SingleFields': module.DownstreamConnectionsConfig_SingleFields
    })),
    'envoy/extensions/resource_monitors/fixed_heap/v3/fixed_heap': () => import('./envoy/extensions/resource_monitors/fixed_heap/v3/fixed_heap').then(module => ({
        'FixedHeapConfig': module.FixedHeapConfig,
        'FixedHeapConfig_SingleFields': module.FixedHeapConfig_SingleFields
    })),
    'envoy/extensions/resource_monitors/injected_resource/v3/injected_resource': () => import('./envoy/extensions/resource_monitors/injected_resource/v3/injected_resource').then(module => ({
        'InjectedResourceConfig': module.InjectedResourceConfig,
        'InjectedResourceConfig_SingleFields': module.InjectedResourceConfig_SingleFields
    })),
    'envoy/extensions/retry/host/omit_host_metadata/v3/omit_host_metadata_config': () => import('./envoy/extensions/retry/host/omit_host_metadata/v3/omit_host_metadata_config').then(module => ({
        'OmitHostMetadataConfig': module.OmitHostMetadataConfig
    })),
    'envoy/extensions/retry/priority/previous_priorities/v3/previous_priorities_config': () => import('./envoy/extensions/retry/priority/previous_priorities/v3/previous_priorities_config').then(module => ({
        'PreviousPrioritiesConfig': module.PreviousPrioritiesConfig,
        'PreviousPrioritiesConfig_SingleFields': module.PreviousPrioritiesConfig_SingleFields
    })),
    'envoy/extensions/router/cluster_specifiers/lua/v3/lua': () => import('./envoy/extensions/router/cluster_specifiers/lua/v3/lua').then(module => ({
        'LuaConfig': module.LuaConfig,
        'LuaConfig_SingleFields': module.LuaConfig_SingleFields
    })),
    'envoy/extensions/router/cluster_specifiers/matcher/v3/matcher': () => import('./envoy/extensions/router/cluster_specifiers/matcher/v3/matcher').then(module => ({
        'ClusterAction': module.ClusterAction,
        'ClusterAction_SingleFields': module.ClusterAction_SingleFields,
        'MatcherClusterSpecifier': module.MatcherClusterSpecifier
    })),
    'envoy/extensions/stat_sinks/graphite_statsd/v3/graphite_statsd': () => import('./envoy/extensions/stat_sinks/graphite_statsd/v3/graphite_statsd').then(module => ({
        'GraphiteStatsdSink': module.GraphiteStatsdSink,
        'GraphiteStatsdSink_SingleFields': module.GraphiteStatsdSink_SingleFields
    })),
    'envoy/extensions/stat_sinks/open_telemetry/v3/open_telemetry': () => import('./envoy/extensions/stat_sinks/open_telemetry/v3/open_telemetry').then(module => ({
        'SinkConfig': module.SinkConfig,
        'SinkConfig_SingleFields': module.SinkConfig_SingleFields,
        'SinkConfig_ConversionAction': module.SinkConfig_ConversionAction,
        'SinkConfig_ConversionAction_SingleFields': module.SinkConfig_ConversionAction_SingleFields
    })),
    'envoy/extensions/stat_sinks/wasm/v3/wasm': () => import('./envoy/extensions/stat_sinks/wasm/v3/wasm').then(module => ({
        'Wasm': module.Wasm
    })),
    'envoy/extensions/string_matcher/lua/v3/lua': () => import('./envoy/extensions/string_matcher/lua/v3/lua').then(module => ({
        'Lua': module.Lua
    })),
    'envoy/extensions/tracers/fluentd/v3/fluentd': () => import('./envoy/extensions/tracers/fluentd/v3/fluentd').then(module => ({
        'FluentdConfig': module.FluentdConfig,
        'FluentdConfig_SingleFields': module.FluentdConfig_SingleFields
    })),
    'envoy/extensions/tracers/opentelemetry/resource_detectors/v3/static_config_resource_detector': () => import('./envoy/extensions/tracers/opentelemetry/resource_detectors/v3/static_config_resource_detector').then(module => ({
        'StaticConfigResourceDetectorConfig': module.StaticConfigResourceDetectorConfig,
        'StaticConfigResourceDetectorConfig_AttributesEntry': module.StaticConfigResourceDetectorConfig_AttributesEntry,
        'StaticConfigResourceDetectorConfig_AttributesEntry_SingleFields': module.StaticConfigResourceDetectorConfig_AttributesEntry_SingleFields
    })),
    'envoy/extensions/tracers/opentelemetry/samplers/v3/cel_sampler': () => import('./envoy/extensions/tracers/opentelemetry/samplers/v3/cel_sampler').then(module => ({
        'CELSamplerConfig': module.CELSamplerConfig
    })),
    'envoy/extensions/tracers/opentelemetry/samplers/v3/dynatrace_sampler': () => import('./envoy/extensions/tracers/opentelemetry/samplers/v3/dynatrace_sampler').then(module => ({
        'DynatraceSamplerConfig': module.DynatraceSamplerConfig,
        'DynatraceSamplerConfig_SingleFields': module.DynatraceSamplerConfig_SingleFields
    })),
    'envoy/extensions/tracers/opentelemetry/samplers/v3/parent_based_sampler': () => import('./envoy/extensions/tracers/opentelemetry/samplers/v3/parent_based_sampler').then(module => ({
        'ParentBasedSamplerConfig': module.ParentBasedSamplerConfig
    })),
    'envoy/extensions/tracers/opentelemetry/samplers/v3/trace_id_ratio_based_sampler': () => import('./envoy/extensions/tracers/opentelemetry/samplers/v3/trace_id_ratio_based_sampler').then(module => ({
        'TraceIdRatioBasedSamplerConfig': module.TraceIdRatioBasedSamplerConfig
    })),
    'envoy/extensions/transport_sockets/alts/v3/alts': () => import('./envoy/extensions/transport_sockets/alts/v3/alts').then(module => ({
        'Alts': module.Alts,
        'Alts_SingleFields': module.Alts_SingleFields
    })),
    'envoy/extensions/transport_sockets/http_11_proxy/v3/upstream_http_11_connect': () => import('./envoy/extensions/transport_sockets/http_11_proxy/v3/upstream_http_11_connect').then(module => ({
        'Http11ProxyUpstreamTransport': module.Http11ProxyUpstreamTransport
    })),
    'envoy/extensions/transport_sockets/internal_upstream/v3/internal_upstream': () => import('./envoy/extensions/transport_sockets/internal_upstream/v3/internal_upstream').then(module => ({
        'InternalUpstreamTransport': module.InternalUpstreamTransport,
        'InternalUpstreamTransport_MetadataValueSource': module.InternalUpstreamTransport_MetadataValueSource,
        'InternalUpstreamTransport_MetadataValueSource_SingleFields': module.InternalUpstreamTransport_MetadataValueSource_SingleFields
    })),
    'envoy/extensions/transport_sockets/proxy_protocol/v3/upstream_proxy_protocol': () => import('./envoy/extensions/transport_sockets/proxy_protocol/v3/upstream_proxy_protocol').then(module => ({
        'ProxyProtocolUpstreamTransport': module.ProxyProtocolUpstreamTransport,
        'ProxyProtocolUpstreamTransport_SingleFields': module.ProxyProtocolUpstreamTransport_SingleFields
    })),
    'envoy/extensions/transport_sockets/quic/v3/quic_transport': () => import('./envoy/extensions/transport_sockets/quic/v3/quic_transport').then(module => ({
        'QuicDownstreamTransport': module.QuicDownstreamTransport,
        'QuicDownstreamTransport_SingleFields': module.QuicDownstreamTransport_SingleFields,
        'QuicUpstreamTransport': module.QuicUpstreamTransport
    })),
    'envoy/extensions/transport_sockets/s2a/v3/s2a': () => import('./envoy/extensions/transport_sockets/s2a/v3/s2a').then(module => ({
        'S2AConfiguration': module.S2AConfiguration,
        'S2AConfiguration_SingleFields': module.S2AConfiguration_SingleFields
    })),
    'envoy/extensions/transport_sockets/starttls/v3/starttls': () => import('./envoy/extensions/transport_sockets/starttls/v3/starttls').then(module => ({
        'StartTlsConfig': module.StartTlsConfig,
        'UpstreamStartTlsConfig': module.UpstreamStartTlsConfig
    })),
    'envoy/extensions/transport_sockets/tap/v3/tap': () => import('./envoy/extensions/transport_sockets/tap/v3/tap').then(module => ({
        'SocketTapConfig': module.SocketTapConfig,
        'SocketTapConfig_SingleFields': module.SocketTapConfig_SingleFields,
        'Tap': module.Tap
    })),
    'envoy/extensions/transport_sockets/tcp_stats/v3/tcp_stats': () => import('./envoy/extensions/transport_sockets/tcp_stats/v3/tcp_stats').then(module => ({
        'Config': module.Config,
        'Config_SingleFields': module.Config_SingleFields
    })),
    'envoy/extensions/transport_sockets/tls/v3/common': () => import('./envoy/extensions/transport_sockets/tls/v3/common').then(module => ({
        'TlsParameters': module.TlsParameters,
        'TlsParameters_SingleFields': module.TlsParameters_SingleFields,
        'PrivateKeyProvider': module.PrivateKeyProvider,
        'PrivateKeyProvider_SingleFields': module.PrivateKeyProvider_SingleFields,
        'TlsCertificate': module.TlsCertificate,
        'TlsSessionTicketKeys': module.TlsSessionTicketKeys,
        'CertificateProviderPluginInstance': module.CertificateProviderPluginInstance,
        'CertificateProviderPluginInstance_SingleFields': module.CertificateProviderPluginInstance_SingleFields,
        'SubjectAltNameMatcher': module.SubjectAltNameMatcher,
        'SubjectAltNameMatcher_SingleFields': module.SubjectAltNameMatcher_SingleFields,
        'CertificateValidationContext': module.CertificateValidationContext,
        'CertificateValidationContext_SingleFields': module.CertificateValidationContext_SingleFields
    })),
    'envoy/extensions/transport_sockets/tls/v3/secret': () => import('./envoy/extensions/transport_sockets/tls/v3/secret').then(module => ({
        'GenericSecret': module.GenericSecret,
        'GenericSecret_SecretsEntry': module.GenericSecret_SecretsEntry,
        'GenericSecret_SecretsEntry_SingleFields': module.GenericSecret_SecretsEntry_SingleFields,
        'SdsSecretConfig': module.SdsSecretConfig,
        'SdsSecretConfig_SingleFields': module.SdsSecretConfig_SingleFields,
        'Secret': module.Secret,
        'Secret_SingleFields': module.Secret_SingleFields
    })),
    'envoy/extensions/transport_sockets/tls/v3/tls': () => import('./envoy/extensions/transport_sockets/tls/v3/tls').then(module => ({
        'CommonTlsContext_CertificateProvider': module.CommonTlsContext_CertificateProvider,
        'CommonTlsContext_CertificateProvider_SingleFields': module.CommonTlsContext_CertificateProvider_SingleFields,
        'CommonTlsContext_CertificateProviderInstance': module.CommonTlsContext_CertificateProviderInstance,
        'CommonTlsContext_CertificateProviderInstance_SingleFields': module.CommonTlsContext_CertificateProviderInstance_SingleFields,
        'TlsKeyLog': module.TlsKeyLog,
        'TlsKeyLog_SingleFields': module.TlsKeyLog_SingleFields,
        'CommonTlsContext': module.CommonTlsContext,
        'CommonTlsContext_SingleFields': module.CommonTlsContext_SingleFields,
        'UpstreamTlsContext': module.UpstreamTlsContext,
        'UpstreamTlsContext_SingleFields': module.UpstreamTlsContext_SingleFields,
        'DownstreamTlsContext': module.DownstreamTlsContext,
        'DownstreamTlsContext_SingleFields': module.DownstreamTlsContext_SingleFields,
        'CommonTlsContext_CombinedCertificateValidationContext': module.CommonTlsContext_CombinedCertificateValidationContext
    })),
    'envoy/extensions/transport_sockets/tls/v3/tls_spiffe_validator_config': () => import('./envoy/extensions/transport_sockets/tls/v3/tls_spiffe_validator_config').then(module => ({
        'SPIFFECertValidatorConfig': module.SPIFFECertValidatorConfig,
        'SPIFFECertValidatorConfig_TrustDomain': module.SPIFFECertValidatorConfig_TrustDomain,
        'SPIFFECertValidatorConfig_TrustDomain_SingleFields': module.SPIFFECertValidatorConfig_TrustDomain_SingleFields
    })),
    'envoy/extensions/upstreams/http/v3/http_protocol_options': () => import('./envoy/extensions/upstreams/http/v3/http_protocol_options').then(module => ({
        'HttpProtocolOptions_OutlierDetection': module.HttpProtocolOptions_OutlierDetection,
        'HttpProtocolOptions': module.HttpProtocolOptions,
        'HttpProtocolOptions_ExplicitHttpConfig': module.HttpProtocolOptions_ExplicitHttpConfig,
        'HttpProtocolOptions_UseDownstreamHttpConfig': module.HttpProtocolOptions_UseDownstreamHttpConfig,
        'HttpProtocolOptions_AutoHttpConfig': module.HttpProtocolOptions_AutoHttpConfig
    })),
    'envoy/extensions/upstreams/tcp/v3/tcp_protocol_options': () => import('./envoy/extensions/upstreams/tcp/v3/tcp_protocol_options').then(module => ({
        'TcpProtocolOptions': module.TcpProtocolOptions,
        'TcpProtocolOptions_SingleFields': module.TcpProtocolOptions_SingleFields
    })),
    'envoy/extensions/wasm/v3/wasm': () => import('./envoy/extensions/wasm/v3/wasm').then(module => ({
        'ReloadConfig': module.ReloadConfig,
        'CapabilityRestrictionConfig': module.CapabilityRestrictionConfig,
        'CapabilityRestrictionConfig_AllowedCapabilitiesEntry': module.CapabilityRestrictionConfig_AllowedCapabilitiesEntry,
        'CapabilityRestrictionConfig_AllowedCapabilitiesEntry_SingleFields': module.CapabilityRestrictionConfig_AllowedCapabilitiesEntry_SingleFields,
        'EnvironmentVariables': module.EnvironmentVariables,
        'EnvironmentVariables_SingleFields': module.EnvironmentVariables_SingleFields,
        'VmConfig': module.VmConfig,
        'VmConfig_SingleFields': module.VmConfig_SingleFields,
        'EnvironmentVariables_KeyValuesEntry': module.EnvironmentVariables_KeyValuesEntry,
        'EnvironmentVariables_KeyValuesEntry_SingleFields': module.EnvironmentVariables_KeyValuesEntry_SingleFields,
        'PluginConfig': module.PluginConfig,
        'PluginConfig_SingleFields': module.PluginConfig_SingleFields,
        'WasmService': module.WasmService,
        'WasmService_SingleFields': module.WasmService_SingleFields
    })),
    'envoy/extensions/watchdog/profile_action/v3/profile_action': () => import('./envoy/extensions/watchdog/profile_action/v3/profile_action').then(module => ({
        'ProfileActionConfig': module.ProfileActionConfig,
        'ProfileActionConfig_SingleFields': module.ProfileActionConfig_SingleFields
    })),
    'envoy/service/accesslog/v3/als': () => import('./envoy/service/accesslog/v3/als').then(module => ({
        'StreamAccessLogsMessage_Identifier': module.StreamAccessLogsMessage_Identifier,
        'StreamAccessLogsMessage_Identifier_SingleFields': module.StreamAccessLogsMessage_Identifier_SingleFields,
        'StreamAccessLogsMessage': module.StreamAccessLogsMessage,
        'StreamAccessLogsMessage_HTTPAccessLogEntries': module.StreamAccessLogsMessage_HTTPAccessLogEntries,
        'StreamAccessLogsMessage_TCPAccessLogEntries': module.StreamAccessLogsMessage_TCPAccessLogEntries
    })),
    'envoy/service/auth/v3/attribute_context': () => import('./envoy/service/auth/v3/attribute_context').then(module => ({
        'AttributeContext_Peer': module.AttributeContext_Peer,
        'AttributeContext_Peer_SingleFields': module.AttributeContext_Peer_SingleFields,
        'AttributeContext_HttpRequest': module.AttributeContext_HttpRequest,
        'AttributeContext_HttpRequest_SingleFields': module.AttributeContext_HttpRequest_SingleFields,
        'AttributeContext_Request': module.AttributeContext_Request,
        'AttributeContext_TLSSession': module.AttributeContext_TLSSession,
        'AttributeContext_TLSSession_SingleFields': module.AttributeContext_TLSSession_SingleFields,
        'AttributeContext': module.AttributeContext,
        'AttributeContext_Peer_LabelsEntry': module.AttributeContext_Peer_LabelsEntry,
        'AttributeContext_Peer_LabelsEntry_SingleFields': module.AttributeContext_Peer_LabelsEntry_SingleFields,
        'AttributeContext_HttpRequest_HeadersEntry': module.AttributeContext_HttpRequest_HeadersEntry,
        'AttributeContext_HttpRequest_HeadersEntry_SingleFields': module.AttributeContext_HttpRequest_HeadersEntry_SingleFields,
        'AttributeContext_ContextExtensionsEntry': module.AttributeContext_ContextExtensionsEntry,
        'AttributeContext_ContextExtensionsEntry_SingleFields': module.AttributeContext_ContextExtensionsEntry_SingleFields
    })),
    'envoy/service/auth/v3/external_auth': () => import('./envoy/service/auth/v3/external_auth').then(module => ({
        'CheckRequest': module.CheckRequest,
        'DeniedHttpResponse': module.DeniedHttpResponse,
        'DeniedHttpResponse_SingleFields': module.DeniedHttpResponse_SingleFields,
        'OkHttpResponse': module.OkHttpResponse,
        'OkHttpResponse_SingleFields': module.OkHttpResponse_SingleFields,
        'CheckResponse': module.CheckResponse
    })),
    'envoy/service/discovery/v3/discovery': () => import('./envoy/service/discovery/v3/discovery').then(module => ({
        'ResourceLocator': module.ResourceLocator,
        'ResourceLocator_SingleFields': module.ResourceLocator_SingleFields,
        'ResourceLocator_DynamicParametersEntry': module.ResourceLocator_DynamicParametersEntry,
        'ResourceLocator_DynamicParametersEntry_SingleFields': module.ResourceLocator_DynamicParametersEntry_SingleFields,
        'DynamicParameterConstraints': module.DynamicParameterConstraints,
        'ResourceName': module.ResourceName,
        'ResourceName_SingleFields': module.ResourceName_SingleFields,
        'ResourceError': module.ResourceError,
        'DiscoveryRequest': module.DiscoveryRequest,
        'DiscoveryRequest_SingleFields': module.DiscoveryRequest_SingleFields,
        'DiscoveryResponse': module.DiscoveryResponse,
        'DiscoveryResponse_SingleFields': module.DiscoveryResponse_SingleFields,
        'DeltaDiscoveryRequest': module.DeltaDiscoveryRequest,
        'DeltaDiscoveryRequest_SingleFields': module.DeltaDiscoveryRequest_SingleFields,
        'DeltaDiscoveryRequest_InitialResourceVersionsEntry': module.DeltaDiscoveryRequest_InitialResourceVersionsEntry,
        'DeltaDiscoveryRequest_InitialResourceVersionsEntry_SingleFields': module.DeltaDiscoveryRequest_InitialResourceVersionsEntry_SingleFields,
        'DeltaDiscoveryResponse': module.DeltaDiscoveryResponse,
        'DeltaDiscoveryResponse_SingleFields': module.DeltaDiscoveryResponse_SingleFields,
        'DynamicParameterConstraints_SingleConstraint': module.DynamicParameterConstraints_SingleConstraint,
        'DynamicParameterConstraints_SingleConstraint_SingleFields': module.DynamicParameterConstraints_SingleConstraint_SingleFields,
        'DynamicParameterConstraints_ConstraintList': module.DynamicParameterConstraints_ConstraintList,
        'Resource_CacheControl': module.Resource_CacheControl,
        'Resource_CacheControl_SingleFields': module.Resource_CacheControl_SingleFields,
        'Resource': module.Resource,
        'Resource_SingleFields': module.Resource_SingleFields
    })),
    'envoy/service/event_reporting/v3/event_reporting_service': () => import('./envoy/service/event_reporting/v3/event_reporting_service').then(module => ({
        'StreamEventsRequest_Identifier': module.StreamEventsRequest_Identifier,
        'StreamEventsRequest': module.StreamEventsRequest
    })),
    'envoy/service/ext_proc/v3/external_processor': () => import('./envoy/service/ext_proc/v3/external_processor').then(module => ({
        'ProtocolConfiguration': module.ProtocolConfiguration,
        'ProtocolConfiguration_SingleFields': module.ProtocolConfiguration_SingleFields,
        'ProcessingRequest': module.ProcessingRequest,
        'ProcessingRequest_SingleFields': module.ProcessingRequest_SingleFields,
        'ProcessingRequest_AttributesEntry': module.ProcessingRequest_AttributesEntry,
        'ProcessingRequest_AttributesEntry_SingleFields': module.ProcessingRequest_AttributesEntry_SingleFields,
        'ProcessingResponse': module.ProcessingResponse,
        'ProcessingResponse_SingleFields': module.ProcessingResponse_SingleFields,
        'HttpHeaders': module.HttpHeaders,
        'HttpHeaders_SingleFields': module.HttpHeaders_SingleFields,
        'HttpHeaders_AttributesEntry': module.HttpHeaders_AttributesEntry,
        'HttpHeaders_AttributesEntry_SingleFields': module.HttpHeaders_AttributesEntry_SingleFields,
        'HttpBody': module.HttpBody,
        'HttpBody_SingleFields': module.HttpBody_SingleFields,
        'HttpTrailers': module.HttpTrailers,
        'HeaderMutation': module.HeaderMutation,
        'HeaderMutation_SingleFields': module.HeaderMutation_SingleFields,
        'BodyMutation': module.BodyMutation,
        'BodyMutation_SingleFields': module.BodyMutation_SingleFields,
        'CommonResponse': module.CommonResponse,
        'CommonResponse_SingleFields': module.CommonResponse_SingleFields,
        'HeadersResponse': module.HeadersResponse,
        'BodyResponse': module.BodyResponse,
        'TrailersResponse': module.TrailersResponse,
        'GrpcStatus': module.GrpcStatus,
        'GrpcStatus_SingleFields': module.GrpcStatus_SingleFields,
        'ImmediateResponse': module.ImmediateResponse,
        'ImmediateResponse_SingleFields': module.ImmediateResponse_SingleFields,
        'StreamedBodyResponse': module.StreamedBodyResponse,
        'StreamedBodyResponse_SingleFields': module.StreamedBodyResponse_SingleFields
    })),
    'envoy/service/health/v3/hds': () => import('./envoy/service/health/v3/hds').then(module => ({
        'Capability': module.Capability,
        'HealthCheckRequest': module.HealthCheckRequest,
        'EndpointHealth': module.EndpointHealth,
        'EndpointHealth_SingleFields': module.EndpointHealth_SingleFields,
        'LocalityEndpointsHealth': module.LocalityEndpointsHealth,
        'ClusterEndpointsHealth': module.ClusterEndpointsHealth,
        'ClusterEndpointsHealth_SingleFields': module.ClusterEndpointsHealth_SingleFields,
        'EndpointHealthResponse': module.EndpointHealthResponse,
        'HealthCheckRequestOrEndpointHealthResponse': module.HealthCheckRequestOrEndpointHealthResponse,
        'LocalityEndpoints': module.LocalityEndpoints,
        'ClusterHealthCheck': module.ClusterHealthCheck,
        'ClusterHealthCheck_SingleFields': module.ClusterHealthCheck_SingleFields,
        'HealthCheckSpecifier': module.HealthCheckSpecifier,
        'HealthCheckSpecifier_SingleFields': module.HealthCheckSpecifier_SingleFields
    })),
    'envoy/service/load_stats/v3/lrs': () => import('./envoy/service/load_stats/v3/lrs').then(module => ({
        'LoadStatsRequest': module.LoadStatsRequest,
        'LoadStatsResponse': module.LoadStatsResponse,
        'LoadStatsResponse_SingleFields': module.LoadStatsResponse_SingleFields
    })),
    'envoy/service/metrics/v3/metrics_service': () => import('./envoy/service/metrics/v3/metrics_service').then(module => ({
        'StreamMetricsMessage_Identifier': module.StreamMetricsMessage_Identifier,
        'StreamMetricsMessage': module.StreamMetricsMessage
    })),
    'envoy/service/network_ext_proc/v3/network_external_processor': () => import('./envoy/service/network_ext_proc/v3/network_external_processor').then(module => ({
        'Data': module.Data,
        'Data_SingleFields': module.Data_SingleFields,
        'ProcessingRequest': module.ProcessingRequest,
        'ProcessingResponse': module.ProcessingResponse,
        'ProcessingResponse_SingleFields': module.ProcessingResponse_SingleFields
    })),
    'envoy/service/rate_limit_quota/v3/rlqs': () => import('./envoy/service/rate_limit_quota/v3/rlqs').then(module => ({
        'RateLimitQuotaUsageReports': module.RateLimitQuotaUsageReports,
        'RateLimitQuotaUsageReports_SingleFields': module.RateLimitQuotaUsageReports_SingleFields,
        'BucketId': module.BucketId,
        'RateLimitQuotaUsageReports_BucketQuotaUsage': module.RateLimitQuotaUsageReports_BucketQuotaUsage,
        'RateLimitQuotaUsageReports_BucketQuotaUsage_SingleFields': module.RateLimitQuotaUsageReports_BucketQuotaUsage_SingleFields,
        'RateLimitQuotaResponse': module.RateLimitQuotaResponse,
        'RateLimitQuotaResponse_BucketAction': module.RateLimitQuotaResponse_BucketAction,
        'RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction': module.RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction,
        'RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction_SingleFields': module.RateLimitQuotaResponse_BucketAction_QuotaAssignmentAction_SingleFields,
        'BucketId_BucketEntry': module.BucketId_BucketEntry,
        'BucketId_BucketEntry_SingleFields': module.BucketId_BucketEntry_SingleFields
    })),
    'envoy/service/ratelimit/v3/rls': () => import('./envoy/service/ratelimit/v3/rls').then(module => ({
        'RateLimitRequest': module.RateLimitRequest,
        'RateLimitRequest_SingleFields': module.RateLimitRequest_SingleFields,
        'RateLimitResponse_Quota': module.RateLimitResponse_Quota,
        'RateLimitResponse_Quota_SingleFields': module.RateLimitResponse_Quota_SingleFields,
        'RateLimitResponse': module.RateLimitResponse,
        'RateLimitResponse_SingleFields': module.RateLimitResponse_SingleFields,
        'RateLimitResponse_RateLimit': module.RateLimitResponse_RateLimit,
        'RateLimitResponse_RateLimit_SingleFields': module.RateLimitResponse_RateLimit_SingleFields,
        'RateLimitResponse_DescriptorStatus': module.RateLimitResponse_DescriptorStatus,
        'RateLimitResponse_DescriptorStatus_SingleFields': module.RateLimitResponse_DescriptorStatus_SingleFields
    })),
    'envoy/service/redis_auth/v3/redis_external_auth': () => import('./envoy/service/redis_auth/v3/redis_external_auth').then(module => ({
        'RedisProxyExternalAuthRequest': module.RedisProxyExternalAuthRequest,
        'RedisProxyExternalAuthRequest_SingleFields': module.RedisProxyExternalAuthRequest_SingleFields,
        'RedisProxyExternalAuthResponse': module.RedisProxyExternalAuthResponse,
        'RedisProxyExternalAuthResponse_SingleFields': module.RedisProxyExternalAuthResponse_SingleFields
    })),
    'envoy/service/runtime/v3/rtds': () => import('./envoy/service/runtime/v3/rtds').then(module => ({
        'Runtime': module.Runtime,
        'Runtime_SingleFields': module.Runtime_SingleFields
    })),
    'envoy/service/status/v3/csds': () => import('./envoy/service/status/v3/csds').then(module => ({
        'ClientStatusRequest': module.ClientStatusRequest,
        'ClientStatusRequest_SingleFields': module.ClientStatusRequest_SingleFields,
        'PerXdsConfig': module.PerXdsConfig,
        'PerXdsConfig_SingleFields': module.PerXdsConfig_SingleFields,
        'ClientConfig': module.ClientConfig,
        'ClientConfig_SingleFields': module.ClientConfig_SingleFields,
        'ClientConfig_GenericXdsConfig': module.ClientConfig_GenericXdsConfig,
        'ClientConfig_GenericXdsConfig_SingleFields': module.ClientConfig_GenericXdsConfig_SingleFields,
        'ClientStatusResponse': module.ClientStatusResponse
    })),
    'envoy/service/tap/v3/tap': () => import('./envoy/service/tap/v3/tap').then(module => ({
        'StreamTapsRequest_Identifier': module.StreamTapsRequest_Identifier,
        'StreamTapsRequest_Identifier_SingleFields': module.StreamTapsRequest_Identifier_SingleFields,
        'StreamTapsRequest': module.StreamTapsRequest,
        'StreamTapsRequest_SingleFields': module.StreamTapsRequest_SingleFields
    })),
    'envoy/type/hash_policy': () => import('./envoy/type/hash_policy').then(module => ({
        'HashPolicy': module.HashPolicy
    })),
    'envoy/type/http/v3/cookie': () => import('./envoy/type/http/v3/cookie').then(module => ({
        'Cookie': module.Cookie,
        'Cookie_SingleFields': module.Cookie_SingleFields,
        'CookieAttribute': module.CookieAttribute,
        'CookieAttribute_SingleFields': module.CookieAttribute_SingleFields
    })),
    'envoy/type/http/v3/path_transformation': () => import('./envoy/type/http/v3/path_transformation').then(module => ({
        'PathTransformation': module.PathTransformation,
        'PathTransformation_Operation': module.PathTransformation_Operation
    })),
    'envoy/type/http_status': () => import('./envoy/type/http_status').then(module => ({
        'HttpStatus': module.HttpStatus,
        'HttpStatus_SingleFields': module.HttpStatus_SingleFields
    })),
    'envoy/type/matcher/metadata': () => import('./envoy/type/matcher/metadata').then(module => ({
        'MetadataMatcher': module.MetadataMatcher,
        'MetadataMatcher_SingleFields': module.MetadataMatcher_SingleFields,
        'MetadataMatcher_PathSegment': module.MetadataMatcher_PathSegment,
        'MetadataMatcher_PathSegment_SingleFields': module.MetadataMatcher_PathSegment_SingleFields
    })),
    'envoy/type/matcher/node': () => import('./envoy/type/matcher/node').then(module => ({
        'NodeMatcher': module.NodeMatcher
    })),
    'envoy/type/matcher/number': () => import('./envoy/type/matcher/number').then(module => ({
        'DoubleMatcher': module.DoubleMatcher,
        'DoubleMatcher_SingleFields': module.DoubleMatcher_SingleFields
    })),
    'envoy/type/matcher/path': () => import('./envoy/type/matcher/path').then(module => ({
        'PathMatcher': module.PathMatcher
    })),
    'envoy/type/matcher/regex': () => import('./envoy/type/matcher/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher,
        'RegexMatcher_SingleFields': module.RegexMatcher_SingleFields,
        'RegexMatcher_GoogleRE2': module.RegexMatcher_GoogleRE2,
        'RegexMatchAndSubstitute': module.RegexMatchAndSubstitute,
        'RegexMatchAndSubstitute_SingleFields': module.RegexMatchAndSubstitute_SingleFields
    })),
    'envoy/type/matcher/string': () => import('./envoy/type/matcher/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'StringMatcher_SingleFields': module.StringMatcher_SingleFields,
        'ListStringMatcher': module.ListStringMatcher
    })),
    'envoy/type/matcher/struct': () => import('./envoy/type/matcher/struct').then(module => ({
        'StructMatcher': module.StructMatcher,
        'StructMatcher_PathSegment': module.StructMatcher_PathSegment,
        'StructMatcher_PathSegment_SingleFields': module.StructMatcher_PathSegment_SingleFields
    })),
    'envoy/type/matcher/v3/address': () => import('./envoy/type/matcher/v3/address').then(module => ({
        'AddressMatcher': module.AddressMatcher
    })),
    'envoy/type/matcher/v3/filter_state': () => import('./envoy/type/matcher/v3/filter_state').then(module => ({
        'FilterStateMatcher': module.FilterStateMatcher,
        'FilterStateMatcher_SingleFields': module.FilterStateMatcher_SingleFields
    })),
    'envoy/type/matcher/v3/http_inputs': () => import('./envoy/type/matcher/v3/http_inputs').then(module => ({
        'HttpRequestHeaderMatchInput': module.HttpRequestHeaderMatchInput,
        'HttpRequestHeaderMatchInput_SingleFields': module.HttpRequestHeaderMatchInput_SingleFields,
        'HttpRequestTrailerMatchInput': module.HttpRequestTrailerMatchInput,
        'HttpRequestTrailerMatchInput_SingleFields': module.HttpRequestTrailerMatchInput_SingleFields,
        'HttpResponseHeaderMatchInput': module.HttpResponseHeaderMatchInput,
        'HttpResponseHeaderMatchInput_SingleFields': module.HttpResponseHeaderMatchInput_SingleFields,
        'HttpResponseTrailerMatchInput': module.HttpResponseTrailerMatchInput,
        'HttpResponseTrailerMatchInput_SingleFields': module.HttpResponseTrailerMatchInput_SingleFields,
        'HttpRequestQueryParamMatchInput': module.HttpRequestQueryParamMatchInput,
        'HttpRequestQueryParamMatchInput_SingleFields': module.HttpRequestQueryParamMatchInput_SingleFields
    })),
    'envoy/type/matcher/v3/metadata': () => import('./envoy/type/matcher/v3/metadata').then(module => ({
        'MetadataMatcher': module.MetadataMatcher,
        'MetadataMatcher_SingleFields': module.MetadataMatcher_SingleFields,
        'MetadataMatcher_PathSegment': module.MetadataMatcher_PathSegment,
        'MetadataMatcher_PathSegment_SingleFields': module.MetadataMatcher_PathSegment_SingleFields
    })),
    'envoy/type/matcher/v3/node': () => import('./envoy/type/matcher/v3/node').then(module => ({
        'NodeMatcher': module.NodeMatcher
    })),
    'envoy/type/matcher/v3/number': () => import('./envoy/type/matcher/v3/number').then(module => ({
        'DoubleMatcher': module.DoubleMatcher,
        'DoubleMatcher_SingleFields': module.DoubleMatcher_SingleFields
    })),
    'envoy/type/matcher/v3/path': () => import('./envoy/type/matcher/v3/path').then(module => ({
        'PathMatcher': module.PathMatcher
    })),
    'envoy/type/matcher/v3/regex': () => import('./envoy/type/matcher/v3/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher,
        'RegexMatcher_SingleFields': module.RegexMatcher_SingleFields,
        'RegexMatcher_GoogleRE2': module.RegexMatcher_GoogleRE2,
        'RegexMatchAndSubstitute': module.RegexMatchAndSubstitute,
        'RegexMatchAndSubstitute_SingleFields': module.RegexMatchAndSubstitute_SingleFields
    })),
    'envoy/type/matcher/v3/string': () => import('./envoy/type/matcher/v3/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'StringMatcher_SingleFields': module.StringMatcher_SingleFields,
        'ListStringMatcher': module.ListStringMatcher
    })),
    'envoy/type/matcher/v3/struct': () => import('./envoy/type/matcher/v3/struct').then(module => ({
        'StructMatcher': module.StructMatcher,
        'StructMatcher_PathSegment': module.StructMatcher_PathSegment,
        'StructMatcher_PathSegment_SingleFields': module.StructMatcher_PathSegment_SingleFields
    })),
    'envoy/type/matcher/v3/value': () => import('./envoy/type/matcher/v3/value').then(module => ({
        'ValueMatcher': module.ValueMatcher,
        'ValueMatcher_SingleFields': module.ValueMatcher_SingleFields,
        'ListMatcher': module.ListMatcher,
        'OrMatcher': module.OrMatcher
    })),
    'envoy/type/matcher/value': () => import('./envoy/type/matcher/value').then(module => ({
        'ValueMatcher': module.ValueMatcher,
        'ValueMatcher_SingleFields': module.ValueMatcher_SingleFields,
        'ListMatcher': module.ListMatcher
    })),
    'envoy/type/metadata/v3/metadata': () => import('./envoy/type/metadata/v3/metadata').then(module => ({
        'MetadataKey': module.MetadataKey,
        'MetadataKey_SingleFields': module.MetadataKey_SingleFields,
        'MetadataKey_PathSegment': module.MetadataKey_PathSegment,
        'MetadataKey_PathSegment_SingleFields': module.MetadataKey_PathSegment_SingleFields,
        'MetadataKind': module.MetadataKind
    })),
    'envoy/type/percent': () => import('./envoy/type/percent').then(module => ({
        'Percent': module.Percent,
        'Percent_SingleFields': module.Percent_SingleFields,
        'FractionalPercent': module.FractionalPercent,
        'FractionalPercent_SingleFields': module.FractionalPercent_SingleFields
    })),
    'envoy/type/range': () => import('./envoy/type/range').then(module => ({
        'Int64Range': module.Int64Range,
        'Int64Range_SingleFields': module.Int64Range_SingleFields,
        'Int32Range': module.Int32Range,
        'Int32Range_SingleFields': module.Int32Range_SingleFields,
        'DoubleRange': module.DoubleRange,
        'DoubleRange_SingleFields': module.DoubleRange_SingleFields
    })),
    'envoy/type/semantic_version': () => import('./envoy/type/semantic_version').then(module => ({
        'SemanticVersion': module.SemanticVersion,
        'SemanticVersion_SingleFields': module.SemanticVersion_SingleFields
    })),
    'envoy/type/token_bucket': () => import('./envoy/type/token_bucket').then(module => ({
        'TokenBucket': module.TokenBucket,
        'TokenBucket_SingleFields': module.TokenBucket_SingleFields
    })),
    'envoy/type/tracing/v3/custom_tag': () => import('./envoy/type/tracing/v3/custom_tag').then(module => ({
        'CustomTag': module.CustomTag,
        'CustomTag_SingleFields': module.CustomTag_SingleFields,
        'CustomTag_Literal': module.CustomTag_Literal,
        'CustomTag_Literal_SingleFields': module.CustomTag_Literal_SingleFields,
        'CustomTag_Environment': module.CustomTag_Environment,
        'CustomTag_Environment_SingleFields': module.CustomTag_Environment_SingleFields,
        'CustomTag_Header': module.CustomTag_Header,
        'CustomTag_Header_SingleFields': module.CustomTag_Header_SingleFields,
        'CustomTag_Metadata': module.CustomTag_Metadata,
        'CustomTag_Metadata_SingleFields': module.CustomTag_Metadata_SingleFields
    })),
    'envoy/type/v3/hash_policy': () => import('./envoy/type/v3/hash_policy').then(module => ({
        'HashPolicy': module.HashPolicy,
        'HashPolicy_FilterState': module.HashPolicy_FilterState,
        'HashPolicy_FilterState_SingleFields': module.HashPolicy_FilterState_SingleFields
    })),
    'envoy/type/v3/http_status': () => import('./envoy/type/v3/http_status').then(module => ({
        'HttpStatus': module.HttpStatus,
        'HttpStatus_SingleFields': module.HttpStatus_SingleFields
    })),
    'envoy/type/v3/percent': () => import('./envoy/type/v3/percent').then(module => ({
        'Percent': module.Percent,
        'Percent_SingleFields': module.Percent_SingleFields,
        'FractionalPercent': module.FractionalPercent,
        'FractionalPercent_SingleFields': module.FractionalPercent_SingleFields
    })),
    'envoy/type/v3/range': () => import('./envoy/type/v3/range').then(module => ({
        'Int64Range': module.Int64Range,
        'Int64Range_SingleFields': module.Int64Range_SingleFields,
        'Int32Range': module.Int32Range,
        'Int32Range_SingleFields': module.Int32Range_SingleFields,
        'DoubleRange': module.DoubleRange,
        'DoubleRange_SingleFields': module.DoubleRange_SingleFields
    })),
    'envoy/type/v3/ratelimit_strategy': () => import('./envoy/type/v3/ratelimit_strategy').then(module => ({
        'RateLimitStrategy': module.RateLimitStrategy,
        'RateLimitStrategy_SingleFields': module.RateLimitStrategy_SingleFields,
        'RateLimitStrategy_RequestsPerTimeUnit': module.RateLimitStrategy_RequestsPerTimeUnit,
        'RateLimitStrategy_RequestsPerTimeUnit_SingleFields': module.RateLimitStrategy_RequestsPerTimeUnit_SingleFields
    })),
    'envoy/type/v3/semantic_version': () => import('./envoy/type/v3/semantic_version').then(module => ({
        'SemanticVersion': module.SemanticVersion,
        'SemanticVersion_SingleFields': module.SemanticVersion_SingleFields
    })),
    'envoy/type/v3/token_bucket': () => import('./envoy/type/v3/token_bucket').then(module => ({
        'TokenBucket': module.TokenBucket,
        'TokenBucket_SingleFields': module.TokenBucket_SingleFields
    })),
    'envoy/watchdog/v3/abort_action': () => import('./envoy/watchdog/v3/abort_action').then(module => ({
        'AbortActionConfig': module.AbortActionConfig,
        'AbortActionConfig_SingleFields': module.AbortActionConfig_SingleFields
    })),
    'google/api/expr/v1alpha1/checked': () => import('./google/api/expr/v1alpha1/checked').then(module => ({
        'CheckedExpr': module.CheckedExpr,
        'CheckedExpr_SingleFields': module.CheckedExpr_SingleFields,
        'Reference': module.Reference,
        'Reference_SingleFields': module.Reference_SingleFields,
        'CheckedExpr_ReferenceMapEntry': module.CheckedExpr_ReferenceMapEntry,
        'CheckedExpr_ReferenceMapEntry_SingleFields': module.CheckedExpr_ReferenceMapEntry_SingleFields,
        'Type': module.Type,
        'Type_SingleFields': module.Type_SingleFields,
        'CheckedExpr_TypeMapEntry': module.CheckedExpr_TypeMapEntry,
        'CheckedExpr_TypeMapEntry_SingleFields': module.CheckedExpr_TypeMapEntry_SingleFields,
        'Type_ListType': module.Type_ListType,
        'Type_MapType': module.Type_MapType,
        'Type_FunctionType': module.Type_FunctionType,
        'Type_AbstractType': module.Type_AbstractType,
        'Type_AbstractType_SingleFields': module.Type_AbstractType_SingleFields,
        'Decl': module.Decl,
        'Decl_SingleFields': module.Decl_SingleFields,
        'Decl_IdentDecl': module.Decl_IdentDecl,
        'Decl_IdentDecl_SingleFields': module.Decl_IdentDecl_SingleFields,
        'Decl_FunctionDecl': module.Decl_FunctionDecl,
        'Decl_FunctionDecl_Overload': module.Decl_FunctionDecl_Overload,
        'Decl_FunctionDecl_Overload_SingleFields': module.Decl_FunctionDecl_Overload_SingleFields
    })),
    'google/api/expr/v1alpha1/syntax': () => import('./google/api/expr/v1alpha1/syntax').then(module => ({
        'Expr': module.Expr,
        'Expr_SingleFields': module.Expr_SingleFields,
        'SourceInfo': module.SourceInfo,
        'SourceInfo_SingleFields': module.SourceInfo_SingleFields,
        'ParsedExpr': module.ParsedExpr,
        'Expr_Ident': module.Expr_Ident,
        'Expr_Ident_SingleFields': module.Expr_Ident_SingleFields,
        'Expr_Select': module.Expr_Select,
        'Expr_Select_SingleFields': module.Expr_Select_SingleFields,
        'Expr_Call': module.Expr_Call,
        'Expr_Call_SingleFields': module.Expr_Call_SingleFields,
        'Expr_CreateList': module.Expr_CreateList,
        'Expr_CreateStruct': module.Expr_CreateStruct,
        'Expr_CreateStruct_SingleFields': module.Expr_CreateStruct_SingleFields,
        'Expr_CreateStruct_Entry': module.Expr_CreateStruct_Entry,
        'Expr_CreateStruct_Entry_SingleFields': module.Expr_CreateStruct_Entry_SingleFields,
        'Expr_Comprehension': module.Expr_Comprehension,
        'Expr_Comprehension_SingleFields': module.Expr_Comprehension_SingleFields,
        'Constant': module.Constant,
        'Constant_SingleFields': module.Constant_SingleFields,
        'SourceInfo_PositionsEntry': module.SourceInfo_PositionsEntry,
        'SourceInfo_PositionsEntry_SingleFields': module.SourceInfo_PositionsEntry_SingleFields,
        'SourceInfo_MacroCallsEntry': module.SourceInfo_MacroCallsEntry,
        'SourceInfo_MacroCallsEntry_SingleFields': module.SourceInfo_MacroCallsEntry_SingleFields,
        'SourcePosition': module.SourcePosition,
        'SourcePosition_SingleFields': module.SourcePosition_SingleFields
    })),
    'google/api/http': () => import('./google/api/http').then(module => ({
        'Http': module.Http,
        'Http_SingleFields': module.Http_SingleFields,
        'HttpRule': module.HttpRule,
        'HttpRule_SingleFields': module.HttpRule_SingleFields,
        'CustomHttpPattern': module.CustomHttpPattern,
        'CustomHttpPattern_SingleFields': module.CustomHttpPattern_SingleFields
    })),
    'google/protobuf/any': () => import('./google/protobuf/any').then(module => ({
        'Any': module.Any,
        'Any_SingleFields': module.Any_SingleFields
    })),
    'google/protobuf/descriptor': () => import('./google/protobuf/descriptor').then(module => ({
        'FileDescriptorSet': module.FileDescriptorSet,
        'FileOptions': module.FileOptions,
        'FileOptions_SingleFields': module.FileOptions_SingleFields,
        'SourceCodeInfo': module.SourceCodeInfo,
        'FileDescriptorProto': module.FileDescriptorProto,
        'FileDescriptorProto_SingleFields': module.FileDescriptorProto_SingleFields,
        'MessageOptions': module.MessageOptions,
        'MessageOptions_SingleFields': module.MessageOptions_SingleFields,
        'DescriptorProto': module.DescriptorProto,
        'DescriptorProto_SingleFields': module.DescriptorProto_SingleFields,
        'ExtensionRangeOptions': module.ExtensionRangeOptions,
        'DescriptorProto_ExtensionRange': module.DescriptorProto_ExtensionRange,
        'DescriptorProto_ExtensionRange_SingleFields': module.DescriptorProto_ExtensionRange_SingleFields,
        'DescriptorProto_ReservedRange': module.DescriptorProto_ReservedRange,
        'DescriptorProto_ReservedRange_SingleFields': module.DescriptorProto_ReservedRange_SingleFields,
        'FieldOptions': module.FieldOptions,
        'FieldOptions_SingleFields': module.FieldOptions_SingleFields,
        'FieldDescriptorProto': module.FieldDescriptorProto,
        'FieldDescriptorProto_SingleFields': module.FieldDescriptorProto_SingleFields,
        'OneofOptions': module.OneofOptions,
        'OneofDescriptorProto': module.OneofDescriptorProto,
        'OneofDescriptorProto_SingleFields': module.OneofDescriptorProto_SingleFields,
        'EnumOptions': module.EnumOptions,
        'EnumOptions_SingleFields': module.EnumOptions_SingleFields,
        'EnumDescriptorProto': module.EnumDescriptorProto,
        'EnumDescriptorProto_SingleFields': module.EnumDescriptorProto_SingleFields,
        'EnumDescriptorProto_EnumReservedRange': module.EnumDescriptorProto_EnumReservedRange,
        'EnumDescriptorProto_EnumReservedRange_SingleFields': module.EnumDescriptorProto_EnumReservedRange_SingleFields,
        'EnumValueOptions': module.EnumValueOptions,
        'EnumValueOptions_SingleFields': module.EnumValueOptions_SingleFields,
        'EnumValueDescriptorProto': module.EnumValueDescriptorProto,
        'EnumValueDescriptorProto_SingleFields': module.EnumValueDescriptorProto_SingleFields,
        'ServiceOptions': module.ServiceOptions,
        'ServiceOptions_SingleFields': module.ServiceOptions_SingleFields,
        'ServiceDescriptorProto': module.ServiceDescriptorProto,
        'ServiceDescriptorProto_SingleFields': module.ServiceDescriptorProto_SingleFields,
        'MethodOptions': module.MethodOptions,
        'MethodOptions_SingleFields': module.MethodOptions_SingleFields,
        'MethodDescriptorProto': module.MethodDescriptorProto,
        'MethodDescriptorProto_SingleFields': module.MethodDescriptorProto_SingleFields,
        'UninterpretedOption': module.UninterpretedOption,
        'UninterpretedOption_SingleFields': module.UninterpretedOption_SingleFields,
        'UninterpretedOption_NamePart': module.UninterpretedOption_NamePart,
        'UninterpretedOption_NamePart_SingleFields': module.UninterpretedOption_NamePart_SingleFields,
        'SourceCodeInfo_Location': module.SourceCodeInfo_Location,
        'SourceCodeInfo_Location_SingleFields': module.SourceCodeInfo_Location_SingleFields,
        'GeneratedCodeInfo': module.GeneratedCodeInfo,
        'GeneratedCodeInfo_Annotation': module.GeneratedCodeInfo_Annotation,
        'GeneratedCodeInfo_Annotation_SingleFields': module.GeneratedCodeInfo_Annotation_SingleFields
    })),
    'google/protobuf/duration': () => import('./google/protobuf/duration').then(module => ({
        'Duration': module.Duration,
        'Duration_SingleFields': module.Duration_SingleFields
    })),
    'google/protobuf/struct': () => import('./google/protobuf/struct').then(module => ({
        'Struct': module.Struct,
        'Struct_FieldsEntry': module.Struct_FieldsEntry,
        'Struct_FieldsEntry_SingleFields': module.Struct_FieldsEntry_SingleFields,
        'Value': module.Value,
        'Value_SingleFields': module.Value_SingleFields,
        'ListValue': module.ListValue
    })),
    'google/protobuf/timestamp': () => import('./google/protobuf/timestamp').then(module => ({
        'Timestamp': module.Timestamp,
        'Timestamp_SingleFields': module.Timestamp_SingleFields
    })),
    'google/protobuf/wrappers': () => import('./google/protobuf/wrappers').then(module => ({
        'DoubleValue': module.DoubleValue,
        'DoubleValue_SingleFields': module.DoubleValue_SingleFields,
        'FloatValue': module.FloatValue,
        'FloatValue_SingleFields': module.FloatValue_SingleFields,
        'Int64Value': module.Int64Value,
        'Int64Value_SingleFields': module.Int64Value_SingleFields,
        'UInt64Value': module.UInt64Value,
        'UInt64Value_SingleFields': module.UInt64Value_SingleFields,
        'Int32Value': module.Int32Value,
        'Int32Value_SingleFields': module.Int32Value_SingleFields,
        'UInt32Value': module.UInt32Value,
        'UInt32Value_SingleFields': module.UInt32Value_SingleFields,
        'BoolValue': module.BoolValue,
        'BoolValue_SingleFields': module.BoolValue_SingleFields,
        'StringValue': module.StringValue,
        'StringValue_SingleFields': module.StringValue_SingleFields,
        'BytesValue': module.BytesValue
    })),
    'google/rpc/status': () => import('./google/rpc/status').then(module => ({
        'Status': module.Status,
        'Status_SingleFields': module.Status_SingleFields
    })),
    'io/prometheus/client/metrics': () => import('./io/prometheus/client/metrics').then(module => ({
        'LabelPair': module.LabelPair,
        'LabelPair_SingleFields': module.LabelPair_SingleFields,
        'Gauge': module.Gauge,
        'Gauge_SingleFields': module.Gauge_SingleFields,
        'Exemplar': module.Exemplar,
        'Exemplar_SingleFields': module.Exemplar_SingleFields,
        'Counter': module.Counter,
        'Counter_SingleFields': module.Counter_SingleFields,
        'Quantile': module.Quantile,
        'Quantile_SingleFields': module.Quantile_SingleFields,
        'Summary': module.Summary,
        'Summary_SingleFields': module.Summary_SingleFields,
        'Untyped': module.Untyped,
        'Untyped_SingleFields': module.Untyped_SingleFields,
        'Histogram': module.Histogram,
        'Histogram_SingleFields': module.Histogram_SingleFields,
        'Bucket': module.Bucket,
        'Bucket_SingleFields': module.Bucket_SingleFields,
        'Metric': module.Metric,
        'Metric_SingleFields': module.Metric_SingleFields,
        'MetricFamily': module.MetricFamily,
        'MetricFamily_SingleFields': module.MetricFamily_SingleFields
    })),
    'opentelemetry/proto/common/v1/common': () => import('./opentelemetry/proto/common/v1/common').then(module => ({
        'AnyValue': module.AnyValue,
        'AnyValue_SingleFields': module.AnyValue_SingleFields,
        'ArrayValue': module.ArrayValue,
        'KeyValueList': module.KeyValueList,
        'KeyValue': module.KeyValue,
        'KeyValue_SingleFields': module.KeyValue_SingleFields,
        'InstrumentationScope': module.InstrumentationScope,
        'InstrumentationScope_SingleFields': module.InstrumentationScope_SingleFields
    })),
    'udpa/annotations/migrate': () => import('./udpa/annotations/migrate').then(module => ({
        'MigrateAnnotation': module.MigrateAnnotation,
        'MigrateAnnotation_SingleFields': module.MigrateAnnotation_SingleFields,
        'FieldMigrateAnnotation': module.FieldMigrateAnnotation,
        'FieldMigrateAnnotation_SingleFields': module.FieldMigrateAnnotation_SingleFields,
        'FileMigrateAnnotation': module.FileMigrateAnnotation,
        'FileMigrateAnnotation_SingleFields': module.FileMigrateAnnotation_SingleFields
    })),
    'udpa/annotations/security': () => import('./udpa/annotations/security').then(module => ({
        'FieldSecurityAnnotation': module.FieldSecurityAnnotation,
        'FieldSecurityAnnotation_SingleFields': module.FieldSecurityAnnotation_SingleFields
    })),
    'udpa/annotations/status': () => import('./udpa/annotations/status').then(module => ({
        'StatusAnnotation': module.StatusAnnotation,
        'StatusAnnotation_SingleFields': module.StatusAnnotation_SingleFields
    })),
    'udpa/annotations/versioning': () => import('./udpa/annotations/versioning').then(module => ({
        'VersioningAnnotation': module.VersioningAnnotation,
        'VersioningAnnotation_SingleFields': module.VersioningAnnotation_SingleFields
    })),
    'validate/validate': () => import('./validate/validate').then(module => ({
        'MessageRules': module.MessageRules,
        'MessageRules_SingleFields': module.MessageRules_SingleFields,
        'FieldRules': module.FieldRules,
        'FloatRules': module.FloatRules,
        'FloatRules_SingleFields': module.FloatRules_SingleFields,
        'DoubleRules': module.DoubleRules,
        'DoubleRules_SingleFields': module.DoubleRules_SingleFields,
        'Int32Rules': module.Int32Rules,
        'Int32Rules_SingleFields': module.Int32Rules_SingleFields,
        'Int64Rules': module.Int64Rules,
        'Int64Rules_SingleFields': module.Int64Rules_SingleFields,
        'UInt32Rules': module.UInt32Rules,
        'UInt32Rules_SingleFields': module.UInt32Rules_SingleFields,
        'UInt64Rules': module.UInt64Rules,
        'UInt64Rules_SingleFields': module.UInt64Rules_SingleFields,
        'SInt32Rules': module.SInt32Rules,
        'SInt32Rules_SingleFields': module.SInt32Rules_SingleFields,
        'SInt64Rules': module.SInt64Rules,
        'SInt64Rules_SingleFields': module.SInt64Rules_SingleFields,
        'Fixed32Rules': module.Fixed32Rules,
        'Fixed32Rules_SingleFields': module.Fixed32Rules_SingleFields,
        'Fixed64Rules': module.Fixed64Rules,
        'Fixed64Rules_SingleFields': module.Fixed64Rules_SingleFields,
        'SFixed32Rules': module.SFixed32Rules,
        'SFixed32Rules_SingleFields': module.SFixed32Rules_SingleFields,
        'SFixed64Rules': module.SFixed64Rules,
        'SFixed64Rules_SingleFields': module.SFixed64Rules_SingleFields,
        'BoolRules': module.BoolRules,
        'BoolRules_SingleFields': module.BoolRules_SingleFields,
        'StringRules': module.StringRules,
        'StringRules_SingleFields': module.StringRules_SingleFields,
        'BytesRules': module.BytesRules,
        'BytesRules_SingleFields': module.BytesRules_SingleFields,
        'EnumRules': module.EnumRules,
        'EnumRules_SingleFields': module.EnumRules_SingleFields,
        'RepeatedRules': module.RepeatedRules,
        'RepeatedRules_SingleFields': module.RepeatedRules_SingleFields,
        'MapRules': module.MapRules,
        'MapRules_SingleFields': module.MapRules_SingleFields,
        'AnyRules': module.AnyRules,
        'AnyRules_SingleFields': module.AnyRules_SingleFields,
        'DurationRules': module.DurationRules,
        'DurationRules_SingleFields': module.DurationRules_SingleFields,
        'TimestampRules': module.TimestampRules,
        'TimestampRules_SingleFields': module.TimestampRules_SingleFields
    })),
    'xds/annotations/v3/status': () => import('./xds/annotations/v3/status').then(module => ({
        'FileStatusAnnotation': module.FileStatusAnnotation,
        'FileStatusAnnotation_SingleFields': module.FileStatusAnnotation_SingleFields,
        'MessageStatusAnnotation': module.MessageStatusAnnotation,
        'MessageStatusAnnotation_SingleFields': module.MessageStatusAnnotation_SingleFields,
        'FieldStatusAnnotation': module.FieldStatusAnnotation,
        'FieldStatusAnnotation_SingleFields': module.FieldStatusAnnotation_SingleFields,
        'StatusAnnotation': module.StatusAnnotation,
        'StatusAnnotation_SingleFields': module.StatusAnnotation_SingleFields
    })),
    'xds/core/v3/authority': () => import('./xds/core/v3/authority').then(module => ({
        'Authority': module.Authority,
        'Authority_SingleFields': module.Authority_SingleFields
    })),
    'xds/core/v3/cidr': () => import('./xds/core/v3/cidr').then(module => ({
        'CidrRange': module.CidrRange,
        'CidrRange_SingleFields': module.CidrRange_SingleFields
    })),
    'xds/core/v3/collection_entry': () => import('./xds/core/v3/collection_entry').then(module => ({
        'CollectionEntry': module.CollectionEntry,
        'CollectionEntry_InlineEntry': module.CollectionEntry_InlineEntry,
        'CollectionEntry_InlineEntry_SingleFields': module.CollectionEntry_InlineEntry_SingleFields
    })),
    'xds/core/v3/context_params': () => import('./xds/core/v3/context_params').then(module => ({
        'ContextParams': module.ContextParams,
        'ContextParams_ParamsEntry': module.ContextParams_ParamsEntry,
        'ContextParams_ParamsEntry_SingleFields': module.ContextParams_ParamsEntry_SingleFields
    })),
    'xds/core/v3/extension': () => import('./xds/core/v3/extension').then(module => ({
        'TypedExtensionConfig': module.TypedExtensionConfig,
        'TypedExtensionConfig_SingleFields': module.TypedExtensionConfig_SingleFields
    })),
    'xds/core/v3/resource_locator': () => import('./xds/core/v3/resource_locator').then(module => ({
        'ResourceLocator': module.ResourceLocator,
        'ResourceLocator_SingleFields': module.ResourceLocator_SingleFields,
        'ResourceLocator_Directive': module.ResourceLocator_Directive,
        'ResourceLocator_Directive_SingleFields': module.ResourceLocator_Directive_SingleFields
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
        'Matcher_MatcherTree_MatchMap_MapEntry': module.Matcher_MatcherTree_MatchMap_MapEntry,
        'Matcher_MatcherTree_MatchMap_MapEntry_SingleFields': module.Matcher_MatcherTree_MatchMap_MapEntry_SingleFields
    })),
    'xds/type/matcher/v3/regex': () => import('./xds/type/matcher/v3/regex').then(module => ({
        'RegexMatcher': module.RegexMatcher,
        'RegexMatcher_SingleFields': module.RegexMatcher_SingleFields
    })),
    'xds/type/matcher/v3/string': () => import('./xds/type/matcher/v3/string').then(module => ({
        'StringMatcher': module.StringMatcher,
        'StringMatcher_SingleFields': module.StringMatcher_SingleFields,
        'ListStringMatcher': module.ListStringMatcher
    })),
    'xds/type/v3/cel': () => import('./xds/type/v3/cel').then(module => ({
        'CelExpression': module.CelExpression,
        'CelExtractString': module.CelExtractString,
        'CelExtractString_SingleFields': module.CelExtractString_SingleFields
    })),
};