import {OutType} from '@/elchi/tags/tagsType';


export const TLSProperties_CertificateProperties: OutType = { "TLSProperties_CertificateProperties": [
  {
    "name": "subject_alt_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TLSProperties_CertificateProperties_SubjectAltName[]",
    "enums": null,
    "comment": "SANs present in the certificate.",
    "notImp": false
  },
  {
    "name": "subject",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The subject field of the certificate.",
    "notImp": false
  },
  {
    "name": "issuer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The issuer field of the certificate.",
    "notImp": false
  }
] };

export const TLSProperties_CertificateProperties_SingleFields = [
  "subject",
  "issuer"
];

export const TLSProperties: OutType = { "TLSProperties": [
  {
    "name": "tls_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TLSProperties_TLSVersion",
    "enums": [
      "VERSION_UNSPECIFIED",
      "TLSv1",
      "TLSv1_1",
      "TLSv1_2",
      "TLSv1_3"
    ],
    "comment": "Version of TLS that was negotiated.",
    "notImp": false
  },
  {
    "name": "tls_cipher_suite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "TLS cipher suite negotiated during handshake. The value is a four-digit hex code defined by the IANA TLS Cipher Suite Registry (e.g. ``009C`` for ``TLS_RSA_WITH_AES_128_GCM_SHA256``).\n\nHere it is expressed as an integer.",
    "notImp": false
  },
  {
    "name": "tls_sni_hostname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "SNI hostname from handshake.",
    "notImp": false
  },
  {
    "name": "local_certificate_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TLSProperties_CertificateProperties",
    "enums": null,
    "comment": "Properties of the local certificate used to negotiate TLS.",
    "notImp": false
  },
  {
    "name": "peer_certificate_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TLSProperties_CertificateProperties",
    "enums": null,
    "comment": "Properties of the peer certificate used to negotiate TLS.",
    "notImp": false
  },
  {
    "name": "tls_session_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The TLS session ID.",
    "notImp": false
  },
  {
    "name": "ja3_fingerprint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ``JA3`` fingerprint when ``JA3`` fingerprinting is enabled.",
    "notImp": false
  }
] };

export const TLSProperties_SingleFields = [
  "tls_version",
  "tls_cipher_suite",
  "tls_sni_hostname",
  "tls_session_id",
  "ja3_fingerprint"
];

export const ResponseFlags_Unauthorized: OutType = { "ResponseFlags_Unauthorized": [
  {
    "name": "reason",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResponseFlags_Unauthorized_Reason",
    "enums": [
      "REASON_UNSPECIFIED",
      "EXTERNAL_SERVICE"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const ResponseFlags_Unauthorized_SingleFields = [
  "reason"
];

export const ResponseFlags: OutType = { "ResponseFlags": [
  {
    "name": "failed_local_healthcheck",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates local server healthcheck failed.",
    "notImp": false
  },
  {
    "name": "no_healthy_upstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates there was no healthy upstream.",
    "notImp": false
  },
  {
    "name": "upstream_request_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates an there was an upstream request timeout.",
    "notImp": false
  },
  {
    "name": "local_reset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates local codec level reset was sent on the stream.",
    "notImp": false
  },
  {
    "name": "upstream_remote_reset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates remote codec level reset was received on the stream.",
    "notImp": false
  },
  {
    "name": "upstream_connection_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates there was a local reset by a connection pool due to an initial connection failure.",
    "notImp": false
  },
  {
    "name": "upstream_connection_termination",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates the stream was reset due to an upstream connection termination.",
    "notImp": false
  },
  {
    "name": "upstream_overflow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates the stream was reset because of a resource overflow.",
    "notImp": false
  },
  {
    "name": "no_route_found",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates no route was found for the request.",
    "notImp": false
  },
  {
    "name": "delay_injected",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the request was delayed before proxying.",
    "notImp": false
  },
  {
    "name": "fault_injected",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the request was aborted with an injected error code.",
    "notImp": false
  },
  {
    "name": "rate_limited",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the request was rate-limited locally.",
    "notImp": false
  },
  {
    "name": "unauthorized_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResponseFlags_Unauthorized",
    "enums": null,
    "comment": "Indicates if the request was deemed unauthorized and the reason for it.",
    "notImp": false
  },
  {
    "name": "rate_limit_service_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the request was rejected because there was an error in rate limit service.",
    "notImp": false
  },
  {
    "name": "downstream_connection_termination",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates the stream was reset due to a downstream connection termination.",
    "notImp": false
  },
  {
    "name": "upstream_retry_limit_exceeded",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the upstream retry limit was exceeded, resulting in a downstream error.",
    "notImp": false
  },
  {
    "name": "stream_idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the stream idle timeout was hit, resulting in a downstream 408.",
    "notImp": false
  },
  {
    "name": "invalid_envoy_request_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the request was rejected because an envoy request header failed strict validation.",
    "notImp": false
  },
  {
    "name": "downstream_protocol_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates there was an HTTP protocol error on the downstream request.",
    "notImp": false
  },
  {
    "name": "upstream_max_stream_duration_reached",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates there was a max stream duration reached on the upstream request.",
    "notImp": false
  },
  {
    "name": "response_from_cache_filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates the response was served from a cache filter.",
    "notImp": false
  },
  {
    "name": "no_filter_config_found",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that a filter configuration is not available.",
    "notImp": false
  },
  {
    "name": "duration_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that request or connection exceeded the downstream connection duration.",
    "notImp": false
  },
  {
    "name": "upstream_protocol_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates there was an HTTP protocol error in the upstream response.",
    "notImp": false
  },
  {
    "name": "no_cluster_found",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates no cluster was found for the request.",
    "notImp": false
  },
  {
    "name": "overload_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates overload manager terminated the request.",
    "notImp": false
  },
  {
    "name": "dns_resolution_failure",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates a DNS resolution failed.",
    "notImp": false
  },
  {
    "name": "downstream_remote_reset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates a downstream remote codec level reset was received on the stream",
    "notImp": false
  }
] };

export const ResponseFlags_SingleFields = [
  "failed_local_healthcheck",
  "no_healthy_upstream",
  "upstream_request_timeout",
  "local_reset",
  "upstream_remote_reset",
  "upstream_connection_failure",
  "upstream_connection_termination",
  "upstream_overflow",
  "no_route_found",
  "delay_injected",
  "fault_injected",
  "rate_limited",
  "rate_limit_service_error",
  "downstream_connection_termination",
  "upstream_retry_limit_exceeded",
  "stream_idle_timeout",
  "invalid_envoy_request_headers",
  "downstream_protocol_error",
  "upstream_max_stream_duration_reached",
  "response_from_cache_filter",
  "no_filter_config_found",
  "duration_timeout",
  "upstream_protocol_error",
  "no_cluster_found",
  "overload_manager",
  "dns_resolution_failure",
  "downstream_remote_reset"
];

export const AccessLogCommon: OutType = { "AccessLogCommon": [
  {
    "name": "sample_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#not-implemented-hide:] This field indicates the rate at which this log entry was sampled. Valid range is (0.0, 1.0].",
    "notImp": true
  },
  {
    "name": "downstream_remote_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "This field is the remote/origin address on which the request from the user was received. Note: This may not be the physical peer. E.g, if the remote address is inferred from for example the x-forwarder-for header, proxy protocol, etc.",
    "notImp": false
  },
  {
    "name": "downstream_local_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "This field is the local/destination address on which the request from the user was received.",
    "notImp": false
  },
  {
    "name": "tls_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TLSProperties",
    "enums": null,
    "comment": "If the connection is secure,S this field will contain TLS properties.",
    "notImp": false
  },
  {
    "name": "start_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The time that Envoy started servicing this request. This is effectively the time that the first downstream byte is received.",
    "notImp": false
  },
  {
    "name": "time_to_last_rx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the last downstream byte received (i.e. time it takes to receive a request).",
    "notImp": false
  },
  {
    "name": "time_to_first_upstream_tx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the first upstream byte sent. There may by considerable delta between ``time_to_last_rx_byte`` and this value due to filters. Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about not accounting for kernel socket buffer time, etc.",
    "notImp": false
  },
  {
    "name": "time_to_last_upstream_tx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the last upstream byte sent. There may by considerable delta between ``time_to_last_rx_byte`` and this value due to filters. Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about not accounting for kernel socket buffer time, etc.",
    "notImp": false
  },
  {
    "name": "time_to_first_upstream_rx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the first upstream byte received (i.e. time it takes to start receiving a response).",
    "notImp": false
  },
  {
    "name": "time_to_last_upstream_rx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the last upstream byte received (i.e. time it takes to receive a complete response).",
    "notImp": false
  },
  {
    "name": "time_to_first_downstream_tx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the first downstream byte sent. There may be a considerable delta between the ``time_to_first_upstream_rx_byte`` and this field due to filters. Additionally, the same caveats apply as documented in ``time_to_last_downstream_tx_byte`` about not accounting for kernel socket buffer time, etc.",
    "notImp": false
  },
  {
    "name": "time_to_last_downstream_tx_byte",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval between the first downstream byte received and the last downstream byte sent. Depending on protocol, buffering, windowing, filters, etc. there may be a considerable delta between ``time_to_last_upstream_rx_byte`` and this field. Note also that this is an approximate time. In the current implementation it does not include kernel socket buffer time. In the current implementation it also does not include send window buffering inside the HTTP/2 codec. In the future it is likely that work will be done to make this duration more accurate.",
    "notImp": false
  },
  {
    "name": "upstream_remote_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The upstream remote/destination address that handles this exchange. This does not include retries.",
    "notImp": false
  },
  {
    "name": "upstream_local_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The upstream local/origin address that handles this exchange. This does not include retries.",
    "notImp": false
  },
  {
    "name": "upstream_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The upstream cluster that ``upstream_remote_address`` belongs to.",
    "notImp": false
  },
  {
    "name": "response_flags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResponseFlags",
    "enums": null,
    "comment": "Flags indicating occurrences during request/response processing.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "All metadata encountered during request processing, including endpoint selection.\n\nThis can be used to associate IDs attached to the various configurations used to process this request with the access log entry. For example, a route created from a higher level forwarding rule with some ID can place that ID in this field and cross reference later. It can also be used to determine if a canary endpoint was used or not.",
    "notImp": false
  },
  {
    "name": "upstream_transport_failure_reason",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If upstream connection failed due to transport socket (e.g. TLS handshake), provides the failure reason from the transport socket. The format of this field depends on the configured upstream transport socket. Common TLS failures are in `TLS trouble shooting`.",
    "notImp": false
  },
  {
    "name": "route_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route",
    "notImp": false
  },
  {
    "name": "downstream_direct_remote_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "This field is the downstream direct remote address on which the request from the user was received. Note: This is always the physical peer, even if the remote address is inferred from for example the x-forwarder-for header, proxy protocol, etc.",
    "notImp": false
  },
  {
    "name": "filter_state_objects",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "Map of filter state in stream info that have been configured to be logged. If the filter state serialized to any message other than ``google.protobuf.Any`` it will be packed into ``google.protobuf.Any``.",
    "notImp": false
  },
  {
    "name": "custom_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "A list of custom tags, which annotate logs with additional information. To configure this value, users should configure `custom_tags`.",
    "notImp": false
  },
  {
    "name": "duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "For HTTP: Total duration in milliseconds of the request from the start time to the last byte out. For TCP: Total duration in milliseconds of the downstream connection. This is the total duration of the request (i.e., when the request's ActiveStream is destroyed) and may be longer than ``time_to_last_downstream_tx_byte``.",
    "notImp": false
  },
  {
    "name": "upstream_request_attempt_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For HTTP: Number of times the request is attempted upstream. Note that the field is omitted when the request was never attempted upstream. For TCP: Number of times the connection request is attempted upstream. Note that the field is omitted when the connect request was never attempted upstream.",
    "notImp": false
  },
  {
    "name": "connection_termination_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Connection termination details may provide additional information about why the connection was terminated by Envoy for L4 reasons.",
    "notImp": false
  },
  {
    "name": "stream_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional unique id of stream (TCP connection, long-live HTTP2 stream, HTTP request) for logging and tracing. This could be any format string that could be used to identify one stream.",
    "notImp": false
  },
  {
    "name": "intermediate_log_entry",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If this log entry is final log entry that flushed after the stream completed or intermediate log entry that flushed periodically during the stream. There may be multiple intermediate log entries and only one final log entry for each long-live stream (TCP connection, long-live HTTP2 stream). And if it is necessary, unique ID or identifier can be added to the log entry `stream_id` to correlate all these intermediate log entries and final log entry.\n\n:::attention\n\nThis field is deprecated in favor of ``access_log_type`` for better indication of the type of the access log record. \n:::",
    "notImp": false
  },
  {
    "name": "downstream_transport_failure_reason",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If downstream connection in listener failed due to transport socket (e.g. TLS handshake), provides the failure reason from the transport socket. The format of this field depends on the configured downstream transport socket. Common TLS failures are in `TLS trouble shooting`.",
    "notImp": false
  },
  {
    "name": "downstream_wire_bytes_sent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For HTTP: Total number of bytes sent to the downstream by the http stream. For TCP: Total number of bytes sent to the downstream by the tcp proxy.",
    "notImp": false
  },
  {
    "name": "downstream_wire_bytes_received",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For HTTP: Total number of bytes received from the downstream by the http stream. Envoy over counts sizes of received HTTP/1.1 pipelined requests by adding up bytes of requests in the pipeline to the one currently being processed. For TCP: Total number of bytes received from the downstream by the tcp proxy.",
    "notImp": false
  },
  {
    "name": "upstream_wire_bytes_sent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For HTTP: Total number of bytes sent to the upstream by the http stream. This value accumulates during upstream retries. For TCP: Total number of bytes sent to the upstream by the tcp proxy.",
    "notImp": false
  },
  {
    "name": "upstream_wire_bytes_received",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For HTTP: Total number of bytes received from the upstream by the http stream. For TCP: Total number of bytes sent to the upstream by the tcp proxy.",
    "notImp": false
  },
  {
    "name": "access_log_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogType",
    "enums": [
      "NotSet",
      "TcpUpstreamConnected",
      "TcpPeriodic",
      "TcpConnectionEnd",
      "DownstreamStart",
      "DownstreamPeriodic",
      "DownstreamEnd",
      "UpstreamPoolReady",
      "UpstreamPeriodic",
      "UpstreamEnd",
      "DownstreamTunnelSuccessfullyEstablished",
      "UdpTunnelUpstreamConnected",
      "UdpPeriodic",
      "UdpSessionEnd"
    ],
    "comment": "The type of the access log, which indicates when the log was recorded. See `ACCESS_LOG_TYPE` for the available values. In case the access log was recorded by a flow which does not correspond to one of the supported values, then the default value will be ``NotSet``. For more information about how access log behaves and when it is being recorded, please refer to `access logging`.",
    "notImp": false
  }
] };

export const AccessLogCommon_SingleFields = [
  "sample_rate",
  "time_to_last_rx_byte",
  "time_to_first_upstream_tx_byte",
  "time_to_last_upstream_tx_byte",
  "time_to_first_upstream_rx_byte",
  "time_to_last_upstream_rx_byte",
  "time_to_first_downstream_tx_byte",
  "time_to_last_downstream_tx_byte",
  "upstream_cluster",
  "upstream_transport_failure_reason",
  "route_name",
  "duration",
  "upstream_request_attempt_count",
  "connection_termination_details",
  "stream_id",
  "downstream_transport_failure_reason",
  "downstream_wire_bytes_sent",
  "downstream_wire_bytes_received",
  "upstream_wire_bytes_sent",
  "upstream_wire_bytes_received",
  "access_log_type"
];

export const ConnectionProperties: OutType = { "ConnectionProperties": [
  {
    "name": "received_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of bytes received from downstream.",
    "notImp": false
  },
  {
    "name": "sent_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of bytes sent to downstream.",
    "notImp": false
  }
] };

export const ConnectionProperties_SingleFields = [
  "received_bytes",
  "sent_bytes"
];

export const TCPAccessLogEntry: OutType = { "TCPAccessLogEntry": [
  {
    "name": "common_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogCommon",
    "enums": null,
    "comment": "Common properties shared by all Envoy access logs.",
    "notImp": false
  },
  {
    "name": "connection_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConnectionProperties",
    "enums": null,
    "comment": "Properties of the TCP connection.",
    "notImp": false
  }
] };

export const HTTPRequestProperties: OutType = { "HTTPRequestProperties": [
  {
    "name": "request_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequestMethod",
    "enums": [
      "METHOD_UNSPECIFIED",
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      "CONNECT",
      "OPTIONS",
      "TRACE",
      "PATCH"
    ],
    "comment": "The request method (RFC 7231/2616).",
    "notImp": false
  },
  {
    "name": "scheme",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The scheme portion of the incoming request URI.",
    "notImp": false
  },
  {
    "name": "authority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "HTTP/2 ``:authority`` or HTTP/1.1 ``Host`` header value.",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port of the incoming request URI (unused currently, as port is composed onto authority).",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path portion from the incoming request URI.",
    "notImp": false
  },
  {
    "name": "user_agent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Value of the ``User-Agent`` request header.",
    "notImp": false
  },
  {
    "name": "referer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Value of the ``Referer`` request header.",
    "notImp": false
  },
  {
    "name": "forwarded_for",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Value of the ``X-Forwarded-For`` request header.",
    "notImp": false
  },
  {
    "name": "request_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Value of the ``X-Request-Id`` request header\n\nThis header is used by Envoy to uniquely identify a request. It will be generated for all external requests and internal requests that do not already have a request ID.",
    "notImp": false
  },
  {
    "name": "original_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Value of the ``X-Envoy-Original-Path`` request header.",
    "notImp": false
  },
  {
    "name": "request_headers_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Size of the HTTP request headers in bytes.\n\nThis value is captured from the OSI layer 7 perspective, i.e. it does not include overhead from framing or encoding at other networking layers.",
    "notImp": false
  },
  {
    "name": "request_body_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Size of the HTTP request body in bytes.\n\nThis value is captured from the OSI layer 7 perspective, i.e. it does not include overhead from framing or encoding at other networking layers.",
    "notImp": false
  },
  {
    "name": "request_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Map of additional headers that have been configured to be logged.",
    "notImp": false
  },
  {
    "name": "upstream_header_bytes_sent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of header bytes sent to the upstream by the http stream, including protocol overhead.\n\nThis value accumulates during upstream retries.",
    "notImp": false
  },
  {
    "name": "downstream_header_bytes_received",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of header bytes received from the downstream by the http stream, including protocol overhead.",
    "notImp": false
  }
] };

export const HTTPRequestProperties_SingleFields = [
  "request_method",
  "scheme",
  "authority",
  "port",
  "path",
  "user_agent",
  "referer",
  "forwarded_for",
  "request_id",
  "original_path",
  "request_headers_bytes",
  "request_body_bytes",
  "upstream_header_bytes_sent",
  "downstream_header_bytes_received"
];

export const HTTPResponseProperties: OutType = { "HTTPResponseProperties": [
  {
    "name": "response_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The HTTP response code returned by Envoy.",
    "notImp": false
  },
  {
    "name": "response_headers_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Size of the HTTP response headers in bytes.\n\nThis value is captured from the OSI layer 7 perspective, i.e. it does not include protocol overhead or overhead from framing or encoding at other networking layers.",
    "notImp": false
  },
  {
    "name": "response_body_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Size of the HTTP response body in bytes.\n\nThis value is captured from the OSI layer 7 perspective, i.e. it does not include overhead from framing or encoding at other networking layers.",
    "notImp": false
  },
  {
    "name": "response_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Map of additional headers configured to be logged.",
    "notImp": false
  },
  {
    "name": "response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Map of trailers configured to be logged.",
    "notImp": false
  },
  {
    "name": "response_code_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP response code details.",
    "notImp": false
  },
  {
    "name": "upstream_header_bytes_received",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of header bytes received from the upstream by the http stream, including protocol overhead.",
    "notImp": false
  },
  {
    "name": "downstream_header_bytes_sent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of header bytes sent to the downstream by the http stream, including protocol overhead.",
    "notImp": false
  }
] };

export const HTTPResponseProperties_SingleFields = [
  "response_code",
  "response_headers_bytes",
  "response_body_bytes",
  "response_code_details",
  "upstream_header_bytes_received",
  "downstream_header_bytes_sent"
];

export const HTTPAccessLogEntry: OutType = { "HTTPAccessLogEntry": [
  {
    "name": "common_properties",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogCommon",
    "enums": null,
    "comment": "Common properties shared by all Envoy access logs.",
    "notImp": false
  },
  {
    "name": "protocol_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HTTPAccessLogEntry_HTTPVersion",
    "enums": [
      "PROTOCOL_UNSPECIFIED",
      "HTTP10",
      "HTTP11",
      "HTTP2",
      "HTTP3"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HTTPRequestProperties",
    "enums": null,
    "comment": "Description of the incoming HTTP request.",
    "notImp": false
  },
  {
    "name": "response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HTTPResponseProperties",
    "enums": null,
    "comment": "Description of the outgoing HTTP response.",
    "notImp": false
  }
] };

export const HTTPAccessLogEntry_SingleFields = [
  "protocol_version"
];

export const AccessLogCommon_FilterStateObjectsEntry: OutType = { "AccessLogCommon_FilterStateObjectsEntry": [
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

export const AccessLogCommon_FilterStateObjectsEntry_SingleFields = [
  "key"
];

export const AccessLogCommon_CustomTagsEntry: OutType = { "AccessLogCommon_CustomTagsEntry": [
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
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const AccessLogCommon_CustomTagsEntry_SingleFields = [
  "key",
  "value"
];

export const TLSProperties_CertificateProperties_SubjectAltName: OutType = { "TLSProperties_CertificateProperties_SubjectAltName": [
  {
    "name": "san.uri",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "san.dns",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
  }
] };

export const TLSProperties_CertificateProperties_SubjectAltName_SingleFields = [
  "san.uri",
  "san.dns"
];

export const HTTPRequestProperties_RequestHeadersEntry: OutType = { "HTTPRequestProperties_RequestHeadersEntry": [
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
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HTTPRequestProperties_RequestHeadersEntry_SingleFields = [
  "key",
  "value"
];

export const HTTPResponseProperties_ResponseHeadersEntry: OutType = { "HTTPResponseProperties_ResponseHeadersEntry": [
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
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HTTPResponseProperties_ResponseHeadersEntry_SingleFields = [
  "key",
  "value"
];

export const HTTPResponseProperties_ResponseTrailersEntry: OutType = { "HTTPResponseProperties_ResponseTrailersEntry": [
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
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HTTPResponseProperties_ResponseTrailersEntry_SingleFields = [
  "key",
  "value"
];