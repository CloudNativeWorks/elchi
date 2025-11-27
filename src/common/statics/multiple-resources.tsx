
export const multipleResource: Record<string, { name: string, defaultValue: string, options: { value: string, label: string }[] }> = {
    "secret/Secret": {
        name: "Secret Type",
        defaultValue: "envoy.extensions.transport_sockets.tls.v3.TlsCertificate",
        options: [
            { value: "envoy.extensions.transport_sockets.tls.v3.TlsCertificate", label: "Tls Certificate" },
            { value: "envoy.extensions.transport_sockets.tls.v3.CertificateValidationContext", label: "Certificate Validation Context" },
            { value: "envoy.extensions.transport_sockets.tls.v3.GenericSecret", label: "Generic Secret" },
            { value: "envoy.extensions.transport_sockets.tls.v3.TlsSessionTicketKeys", label: "Session Ticket Keys" },
        ]
    },
    "extension/access-log/AccessLog": {
        name: "Access Log Type",
        defaultValue: "envoy.extensions.access_loggers.file.v3.FileAccessLog",
        options: [
            { value: "envoy.extensions.access_loggers.file.v3.FileAccessLog", label: "File Access Log" },
            { value: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig", label: "Fluentd Access Log" },
            { value: "envoy.extensions.access_loggers.stream.v3.StdoutAccessLog", label: "Stdout Access Log" },
            { value: "envoy.extensions.access_loggers.stream.v3.StderrAccessLog", label: "Stderr Access Log" }
        ]
    },
    "filters/http/basic-auth/BasicAuths": {
        name: "Basic Auth",
        defaultValue: "envoy.extensions.filters.http.basic_auth.v3.BasicAuth",
        options: [
            { value: "envoy.extensions.filters.http.basic_auth.v3.BasicAuth", label: "Basic Auth" },
            { value: "envoy.extensions.filters.http.basic_auth.v3.BasicAuthPerRoute", label: "Basic Auth Per Route" },
        ]
    },
    "filters/http/cors/Corses": {
        name: "Cors",
        defaultValue: "envoy.extensions.filters.http.cors.v3.CorsPolicy",
        options: [
            { value: "envoy.extensions.filters.http.cors.v3.Cors", label: "Cors" },
            { value: "envoy.extensions.filters.http.cors.v3.CorsPolicy", label: "Cors Policy" },
        ]
    },
    "filters/http/compressor/Compressors": {
        name: "Compressor",
        defaultValue: "envoy.extensions.filters.http.compressor.v3.Compressor",
        options: [
            { value: "envoy.extensions.filters.http.compressor.v3.Compressor", label: "Compressor" },
            { value: "envoy.extensions.filters.http.compressor.v3.CompressorPerRoute", label: "Compressor Per Route" },
        ]
    },
    "extension/compressor-library/CompressorLibrary": {
        name: "Compressor Library",
        defaultValue: "envoy.extensions.compression.gzip.compressor.v3.Gzip",
        options: [
            { value: "envoy.extensions.compression.gzip.compressor.v3.Gzip", label: "Gzip" },
            { value: "envoy.extensions.compression.brotli.compressor.v3.Brotli", label: "Brotli" },
            { value: "envoy.extensions.compression.zstd.compressor.v3.Zstd", label: "Zstd" },
        ]
    },
    "filters/http/lua/Luas": {
        name: "Lua",
        defaultValue: "envoy.extensions.filters.http.lua.v3.Lua",
        options: [
            { value: "envoy.extensions.filters.http.lua.v3.Lua", label: "Lua" },
            { value: "envoy.extensions.filters.http.lua.v3.LuaPerRoute", label: "Lua Per Route" },
        ]
    },
    "filters/http/buffer/Buffers": {
        name: "Buffer",
        defaultValue: "envoy.extensions.filters.http.buffer.v3.Buffer",
        options: [
            { value: "envoy.extensions.filters.http.buffer.v3.Buffer", label: "Buffer" },
            { value: "envoy.extensions.filters.http.buffer.v3.BufferPerRoute", label: "Buffer Per Route" },
        ]
    },
    "filters/http/rbac/Rbacs": {
        name: "Rbac",
        defaultValue: "envoy.extensions.filters.http.rbac.v3.RBAC",
        options: [
            { value: "envoy.extensions.filters.http.rbac.v3.RBAC", label: "RBAC" },
            { value: "envoy.extensions.filters.http.rbac.v3.RBACPerRoute", label: "RBAC Per Route" },
        ]
    },
    "filters/http/stateful-session/StatefulSessions": {
        name: "Stateful Session",
        defaultValue: "envoy.extensions.filters.http.stateful_session.v3.StatefulSession",
        options: [
            { value: "envoy.extensions.filters.http.stateful_session.v3.StatefulSession", label: "Stateful Session" },
            { value: "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute", label: "Stateful Session Per Route" },
        ]
    },
    "filters/http/ext-proc/ExtProcs": {
        name: "External Processor",
        defaultValue: "envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor",
        options: [
            { value: "envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor", label: "External Processor" },
            { value: "envoy.extensions.filters.http.ext_proc.v3.ExtProcPerRoute", label: "Ext Proc Per Route" },
        ]
    },
    "filters/http/ext-authz/ExtAuthzs": {
        name: "External Authorization",
        defaultValue: "envoy.extensions.filters.http.ext_authz.v3.ExtAuthz",
        options: [
            { value: "envoy.extensions.filters.http.ext_authz.v3.ExtAuthz", label: "Ext Authz" },
            { value: "envoy.extensions.filters.http.ext_authz.v3.ExtAuthzPerRoute", label: "Ext Authz Per Route" },
        ]
    },
    "filters/http/jwt-authn/JwtAuthns": {
        name: "JWT Authentication",
        defaultValue: "envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication",
        options: [
            { value: "envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication", label: "JWT Authentication" },
            { value: "envoy.extensions.filters.http.jwt_authn.v3.PerRouteConfig", label: "JWT Authn Per Route" },
        ]
    },
    "filters/http/dynamic-forward-proxy/DynamicForwardProxies": {
        name: "Dynamic Forward Proxy",
        defaultValue: "envoy.extensions.filters.http.dynamic_forward_proxy.v3.FilterConfig",
        options: [
            { value: "envoy.extensions.filters.http.dynamic_forward_proxy.v3.FilterConfig", label: "Dynamic Forward Proxy" },
            { value: "envoy.extensions.filters.http.dynamic_forward_proxy.v3.PerRouteConfig", label: "Dynamic Forward Proxy Per Route" },
        ]
    },
    "extension/session-state/SessionState": {
        name: "Stateful Session State",
        defaultValue: "envoy.extensions.http.stateful_session.header.v3.HeaderBasedSessionState",
        options: [
            { value: "envoy.extensions.http.stateful_session.header.v3.HeaderBasedSessionState", label: "Stateful Session Header" },
            { value: "envoy.extensions.http.stateful_session.cookie.v3.CookieBasedSessionState", label: "Stateful Session Cookie" },
        ]
    },
    "tls/TLS": {
        name: "Transport Socket Layer",
        defaultValue: "envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext",
        options: [
            { value: "envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext", label: "Downstream Tls Context" },
            { value: "envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext", label: "Upstream Tls Context" },
            { value: "envoy.extensions.transport_sockets.quic.v3.QuicDownstreamTransport", label: "QUIC Downstream Transport" },
        ]
    },

    "extension/stat-sinks/StatSinks": {
        name: "Stat Sink Type",
        defaultValue: "envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig",
        options: [
            { value: "envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig", label: "Open Telemetry" },
        ]
    },
};
