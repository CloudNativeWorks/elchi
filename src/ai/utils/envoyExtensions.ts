/* eslint-disable */
// Envoy Extensions utility based on Elchi frontend gtypes.ts
// This utility maps Envoy extensions to form categories for AI Config Generator

export enum GTypes {
    BootStrap = "envoy.config.bootstrap.v3.Bootstrap",
    Listener = "envoy.config.listener.v3.Listener",
    HTTPConnectionManager = "envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager",
    Router = "envoy.extensions.filters.http.router.v3.Router",
    Cluster = "envoy.config.cluster.v3.Cluster",
    Endpoint = "envoy.config.endpoint.v3.ClusterLoadAssignment",
    Route = "envoy.config.route.v3.RouteConfiguration",
    VirtualHost = "envoy.config.route.v3.VirtualHost",
    TcpProxy = "envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy",
    
    // Access Loggers
    FluentdAccessLog = "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig",
    FileAccessLog = "envoy.extensions.access_loggers.file.v3.FileAccessLog",
    StdoutAccessLog = "envoy.extensions.access_loggers.stream.v3.StdoutAccessLog",
    StdErrAccessLog = "envoy.extensions.access_loggers.stream.v3.StderrAccessLog",
    
    // TLS/Security
    DownstreamTlsContext = "envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext",
    UpstreamTlsContext = "envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext",
    TlsCertificate = "envoy.extensions.transport_sockets.tls.v3.TlsCertificate",
    CertificateValidationContext = "envoy.extensions.transport_sockets.tls.v3.CertificateValidationContext",
    GenericSecret = "envoy.extensions.transport_sockets.tls.v3.GenericSecret",
    TLSSessionTicketKeys = "envoy.extensions.transport_sockets.tls.v3.TlsSessionTicketKeys",
    
    // Authentication & Authorization
    HttpRBAC = "envoy.extensions.filters.http.rbac.v3.RBAC",
    HttpRBACPerRoute = "envoy.extensions.filters.http.rbac.v3.RBACPerRoute",
    NetworkRBAC = "envoy.extensions.filters.network.rbac.v3.RBAC",
    BasicAuth = "envoy.extensions.filters.http.basic_auth.v3.BasicAuth",
    BasicAuthPerRoute = "envoy.extensions.filters.http.basic_auth.v3.BasicAuthPerRoute",
    OAuth2 = "envoy.extensions.filters.http.oauth2.v3.OAuth2",
    
    // CORS & HTTP Features
    Cors = "envoy.extensions.filters.http.cors.v3.Cors",
    CorsPolicy = "envoy.extensions.filters.http.cors.v3.CorsPolicy",
    
    // Performance & Rate Limiting
    BandwidthLimit = "envoy.extensions.filters.http.bandwidth_limit.v3.BandwidthLimit",
    HttpLocalRatelimit = "envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit",
    NetworkLocalRatelimit = "envoy.extensions.filters.network.local_ratelimit.v3.LocalRateLimit",
    ListenerLocalRateLimit = "envoy.extensions.filters.listener.local_ratelimit.v3.LocalRateLimit",
    AdaptiveConcurrency = "envoy.extensions.filters.http.adaptive_concurrency.v3.AdaptiveConcurrency",
    AdmissionControl = "envoy.extensions.filters.http.admission_control.v3.AdmissionControl",
    Buffer = "envoy.extensions.filters.http.buffer.v3.Buffer",
    BufferPerRoute = "envoy.extensions.filters.http.buffer.v3.BufferPerRoute",
    
    // Compression
    Compressor = "envoy.extensions.filters.http.compressor.v3.Compressor",
    CompressorPerRoute = "envoy.extensions.filters.http.compressor.v3.CompressorPerRoute",
    GzipCompressor = "envoy.extensions.compression.gzip.compressor.v3.Gzip",
    BrotliCompressor = "envoy.extensions.compression.brotli.compressor.v3.Brotli",
    ZstdCompressor = "envoy.extensions.compression.zstd.compressor.v3.Zstd",
    
    // Session Management
    StatefulSession = "envoy.extensions.filters.http.stateful_session.v3.StatefulSession",
    StatefulSessionPerRoute = "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute",
    HeaderBasedSessionState = "envoy.extensions.http.stateful_session.header.v3.HeaderBasedSessionState",
    CookieBasedSessionState = "envoy.extensions.http.stateful_session.cookie.v3.CookieBasedSessionState",
    
    // Custom Processing
    Lua = "envoy.extensions.filters.http.lua.v3.Lua",
    LuaPerRoute = "envoy.extensions.filters.http.lua.v3.LuaPerRoute",
    
    // Security Filters
    CsrfPolicy = "envoy.extensions.filters.http.csrf.v3.CsrfPolicy",
    ConnectionLimit = "envoy.extensions.filters.network.connection_limit.v3.ConnectionLimit",
    
    // Listener Filters
    ListenerHttpInspector = "envoy.extensions.filters.listener.http_inspector.v3.HttpInspector",
    ListenerOriginalDst = "envoy.extensions.filters.listener.original_dst.v3.OriginalDst",
    ListenerOriginalSrc = "envoy.extensions.filters.listener.original_src.v3.OriginalSrc",
    ListenerTlsInspector = "envoy.extensions.filters.listener.tls_inspector.v3.TlsInspector",
    ListenerDnsFilter = "envoy.extensions.filters.udp.dns_filter.v3.DnsFilterConfig",
    ListenerProxyProtocol = "envoy.extensions.filters.listener.proxy_protocol.v3.ProxyProtocol",
    
    // Monitoring & Observability
    OpenTelemetry = "envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig",
    HCEFS = "envoy.extensions.health_check.event_sinks.file.v3.HealthCheckEventFileSink",
    
    // Protocol Options
    HttpProtocolOptions = "envoy.extensions.upstreams.http.v3.HttpProtocolOptions",
    UTM = "envoy.extensions.path.match.uri_template.v3.UriTemplateMatchConfig",
}

export interface EnvoyExtension {
    gtype: GTypes;
    name: string;
    prettyName: string;
    description: string;
    category: 'security' | 'performance' | 'observability' | 'functionality' | 'custom';
    collection: 'filters' | 'extensions' | 'listeners' | 'clusters' | 'routes' | 'secrets' | 'tls';
    type: string;
    recommended?: boolean;
    complexity: 'basic' | 'intermediate' | 'advanced';
}

export const SECURITY_EXTENSIONS: EnvoyExtension[] = [
    {
        gtype: GTypes.HttpRBAC,
        name: 'http_rbac',
        prettyName: 'HTTP RBAC',
        description: 'Role-based access control for HTTP traffic',
        category: 'security',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.NetworkRBAC,
        name: 'network_rbac',
        prettyName: 'Network RBAC',
        description: 'Role-based access control for network connections',
        category: 'security',
        collection: 'filters',
        type: 'network_filter',
        recommended: true,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.BasicAuth,
        name: 'basic_auth',
        prettyName: 'Basic Authentication',
        description: 'Username/password authentication',
        category: 'security',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'basic'
    },
    {
        gtype: GTypes.OAuth2,
        name: 'oauth2',
        prettyName: 'OAuth2 Authentication',
        description: 'OAuth2/OIDC authentication flow',
        category: 'security',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.CsrfPolicy,
        name: 'csrf_policy',
        prettyName: 'CSRF Protection',
        description: 'Cross-site request forgery protection',
        category: 'security',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.DownstreamTlsContext,
        name: 'downstream_tls',
        prettyName: 'Downstream TLS',
        description: 'TLS termination for client connections',
        category: 'security',
        collection: 'tls',
        type: 'tls',
        recommended: true,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.UpstreamTlsContext,
        name: 'upstream_tls',
        prettyName: 'Upstream TLS',
        description: 'TLS connections to backend services',
        category: 'security',
        collection: 'tls',
        type: 'tls',
        recommended: true,
        complexity: 'intermediate'
    }
];

export const PERFORMANCE_EXTENSIONS: EnvoyExtension[] = [
    {
        gtype: GTypes.HttpLocalRatelimit,
        name: 'h_local_ratelimit',
        prettyName: 'HTTP Rate Limiting',
        description: 'Request rate limiting for HTTP traffic',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.NetworkLocalRatelimit,
        name: 'n_local_ratelimit',
        prettyName: 'Network Rate Limiting',
        description: 'Connection rate limiting for network traffic',
        category: 'performance',
        collection: 'filters',
        type: 'network_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.BandwidthLimit,
        name: 'bandwidth_limit',
        prettyName: 'Bandwidth Limiting',
        description: 'Limit bandwidth usage per connection',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.AdaptiveConcurrency,
        name: 'adaptive_concurrency',
        prettyName: 'Adaptive Concurrency',
        description: 'Dynamic concurrency limiting based on latency',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.AdmissionControl,
        name: 'admission_control',
        prettyName: 'Admission Control',
        description: 'Request admission control based on system load',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.Buffer,
        name: 'buffer',
        prettyName: 'Request Buffering',
        description: 'Buffer requests before forwarding',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.Compressor,
        name: 'compressor',
        prettyName: 'Response Compression',
        description: 'Compress responses to reduce bandwidth',
        category: 'performance',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.ConnectionLimit,
        name: 'connection_limit',
        prettyName: 'Connection Limiting',
        description: 'Limit concurrent connections per IP',
        category: 'performance',
        collection: 'filters',
        type: 'network_filter',
        recommended: true,
        complexity: 'basic'
    }
];

export const OBSERVABILITY_EXTENSIONS: EnvoyExtension[] = [
    {
        gtype: GTypes.FileAccessLog,
        name: 'file_access_log',
        prettyName: 'File Access Logging',
        description: 'Log requests to files',
        category: 'observability',
        collection: 'extensions',
        type: 'access_log',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.StdoutAccessLog,
        name: 'stdout_access_log',
        prettyName: 'Stdout Access Logging',
        description: 'Log requests to stdout',
        category: 'observability',
        collection: 'extensions',
        type: 'access_log',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.FluentdAccessLog,
        name: 'fluentd_access_log',
        prettyName: 'Fluentd Access Logging',
        description: 'Send logs to Fluentd',
        category: 'observability',
        collection: 'extensions',
        type: 'access_log',
        recommended: false,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.OpenTelemetry,
        name: 'open_telemetry',
        prettyName: 'OpenTelemetry',
        description: 'Export metrics to OpenTelemetry',
        category: 'observability',
        collection: 'extensions',
        type: 'stat_sinks',
        recommended: true,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.HCEFS,
        name: 'hcefs',
        prettyName: 'Health Check File Sink',
        description: 'Export health check events to files',
        category: 'observability',
        collection: 'extensions',
        type: 'hcefs',
        recommended: false,
        complexity: 'basic'
    }
];

export const FUNCTIONALITY_EXTENSIONS: EnvoyExtension[] = [
    {
        gtype: GTypes.Cors,
        name: 'cors',
        prettyName: 'CORS Support',
        description: 'Cross-origin resource sharing support',
        category: 'functionality',
        collection: 'filters',
        type: 'http_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.StatefulSession,
        name: 'stateful_session',
        prettyName: 'Stateful Sessions',
        description: 'Session affinity and stickiness',
        category: 'functionality',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'intermediate'
    },
    {
        gtype: GTypes.ListenerHttpInspector,
        name: 'http_inspector',
        prettyName: 'HTTP Inspector',
        description: 'Detect HTTP protocol on connections',
        category: 'functionality',
        collection: 'filters',
        type: 'listener_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.ListenerTlsInspector,
        name: 'tls_inspector',
        prettyName: 'TLS Inspector',
        description: 'Inspect TLS connections for SNI',
        category: 'functionality',
        collection: 'filters',
        type: 'listener_filter',
        recommended: true,
        complexity: 'basic'
    },
    {
        gtype: GTypes.ListenerOriginalDst,
        name: 'original_dst',
        prettyName: 'Original Destination',
        description: 'Restore original destination IP',
        category: 'functionality',
        collection: 'filters',
        type: 'listener_filter',
        recommended: false,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.ListenerProxyProtocol,
        name: 'proxy_protocol',
        prettyName: 'Proxy Protocol',
        description: 'Support for proxy protocol',
        category: 'functionality',
        collection: 'filters',
        type: 'listener_filter',
        recommended: false,
        complexity: 'intermediate'
    }
];

export const CUSTOM_EXTENSIONS: EnvoyExtension[] = [
    {
        gtype: GTypes.Lua,
        name: 'lua',
        prettyName: 'Lua Script Filter',
        description: 'Execute custom Lua scripts',
        category: 'custom',
        collection: 'filters',
        type: 'http_filter',
        recommended: false,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.HttpProtocolOptions,
        name: 'http_protocol_options',
        prettyName: 'HTTP Protocol Options',
        description: 'Advanced HTTP protocol configuration',
        category: 'custom',
        collection: 'extensions',
        type: 'http_protocol_options',
        recommended: false,
        complexity: 'advanced'
    },
    {
        gtype: GTypes.UTM,
        name: 'uri_template_match',
        prettyName: 'URI Template Matching',
        description: 'Advanced URI pattern matching',
        category: 'custom',
        collection: 'extensions',
        type: 'utm',
        recommended: false,
        complexity: 'advanced'
    }
];

export const ALL_EXTENSIONS = [
    ...SECURITY_EXTENSIONS,
    ...PERFORMANCE_EXTENSIONS,
    ...OBSERVABILITY_EXTENSIONS,
    ...FUNCTIONALITY_EXTENSIONS,
    ...CUSTOM_EXTENSIONS
];

export function getExtensionsByCategory(category: EnvoyExtension['category']): EnvoyExtension[] {
    return ALL_EXTENSIONS.filter(ext => ext.category === category);
}

export function getExtensionsByComplexity(complexity: EnvoyExtension['complexity']): EnvoyExtension[] {
    return ALL_EXTENSIONS.filter(ext => ext.complexity === complexity);
}

export function getRecommendedExtensions(): EnvoyExtension[] {
    return ALL_EXTENSIONS.filter(ext => ext.recommended);
}

export function getExtensionByGType(gtype: GTypes): EnvoyExtension | undefined {
    return ALL_EXTENSIONS.find(ext => ext.gtype === gtype);
}

export function getExtensionByName(name: string): EnvoyExtension | undefined {
    return ALL_EXTENSIONS.find(ext => ext.name === name);
}

// Default feature selections based on common use cases
export const DEFAULT_FEATURES = {
    web_application: [
        'cors',
        'h_local_ratelimit',
        'file_access_log',
        'downstream_tls',
        'compressor',
        'http_inspector',
        'tls_inspector'
    ],
    api_gateway: [
        'http_rbac',
        'oauth2',
        'h_local_ratelimit',
        'cors',
        'file_access_log',
        'open_telemetry',
        'downstream_tls',
        'csrf_policy'
    ],
    microservices: [
        'http_rbac',
        'h_local_ratelimit',
        'file_access_log',
        'open_telemetry',
        'downstream_tls',
        'upstream_tls',
        'connection_limit'
    ],
    high_performance: [
        'h_local_ratelimit',
        'adaptive_concurrency',
        'compressor',
        'buffer',
        'connection_limit',
        'stdout_access_log'
    ],
    secure_application: [
        'http_rbac',
        'network_rbac',
        'oauth2',
        'csrf_policy',
        'downstream_tls',
        'upstream_tls',
        'file_access_log'
    ]
};

export function getDefaultFeatures(useCase: keyof typeof DEFAULT_FEATURES): string[] {
    return DEFAULT_FEATURES[useCase] || [];
}