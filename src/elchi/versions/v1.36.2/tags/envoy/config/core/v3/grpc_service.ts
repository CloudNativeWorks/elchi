import {OutType} from '@elchi/tags/tagsType';


export const GrpcService: OutType = { "GrpcService": [
  {
    "name": "target_specifier.envoy_grpc",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_EnvoyGrpc",
    "enums": null,
    "comment": "Envoy's in-built gRPC client. See the `gRPC services overview` documentation for discussion on gRPC client selection.",
    "notImp": false
  },
  {
    "name": "target_specifier.google_grpc",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc",
    "enums": null,
    "comment": "`Google C++ gRPC client <https://github.com/grpc/grpc>`_ See the `gRPC services overview` documentation for discussion on gRPC client selection.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout for the gRPC request. This is the timeout for a specific request.",
    "notImp": false
  },
  {
    "name": "initial_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "Additional metadata to include in streams initiated to the GrpcService. This can be used for scenarios in which additional ad hoc authorization headers (e.g. ``x-foo-bar: baz-key``) are to be injected. For more information, including details on header value syntax, see the documentation on `custom request headers`.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Optional default retry policy for streams toward the service. If an async stream doesn't have retry policy configured in its stream options, this retry policy is used.",
    "notImp": false
  }
] };

export const GrpcService_SingleFields = [
  "timeout"
];

export const GrpcService_EnvoyGrpc: OutType = { "GrpcService_EnvoyGrpc": [
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the upstream gRPC cluster. SSL credentials will be supplied in the `Cluster` `transport_socket`.",
    "notImp": false
  },
  {
    "name": "authority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ``:authority`` header in the grpc request. If this field is not set, the authority header value will be ``cluster_name``. Note that this authority does not override the SNI. The SNI is provided by the transport socket of the cluster.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Indicates the retry policy for re-establishing the gRPC stream This field is optional. If max interval is not provided, it will be set to ten times the provided base interval. Currently only supported for xDS gRPC streams. If not set, xDS gRPC streams default base interval:500ms, maximum interval:30s will be applied.",
    "notImp": false
  },
  {
    "name": "max_receive_message_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum gRPC message size that is allowed to be received. If a message over this limit is received, the gRPC stream is terminated with the RESOURCE_EXHAUSTED error. This limit is applied to individual messages in the streaming response and not the total size of streaming response. Defaults to 0, which means unlimited.",
    "notImp": false
  },
  {
    "name": "skip_envoy_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "This provides gRPC client level control over envoy generated headers. If false, the header will be sent but it can be overridden by per stream option. If true, the header will be removed and can not be overridden by per stream option. Default to false.",
    "notImp": false
  }
] };

export const GrpcService_EnvoyGrpc_SingleFields = [
  "cluster_name",
  "authority",
  "max_receive_message_length",
  "skip_envoy_headers"
];

export const GrpcService_GoogleGrpc_ChannelCredentials: OutType = { "GrpcService_GoogleGrpc_ChannelCredentials": [
  {
    "name": "credential_specifier.ssl_credentials",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_SslCredentials",
    "enums": null,
    "comment": "See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call credential types.",
    "notImp": false
  },
  {
    "name": "credential_specifier.google_default",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61",
    "notImp": false
  },
  {
    "name": "credential_specifier.local_credentials",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_GoogleLocalCredentials",
    "enums": null,
    "comment": "See https://grpc.io/docs/guides/auth.html#credential-types to understand Channel and Call credential types.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_ChannelArgs: OutType = { "GrpcService_GoogleGrpc_ChannelArgs": [
  {
    "name": "args",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, GrpcService_GoogleGrpc_ChannelArgs_Value>",
    "enums": null,
    "comment": "See grpc_types.h GRPC_ARG #defines for keys that work here.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc: OutType = { "GrpcService_GoogleGrpc": [
  {
    "name": "target_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The target URI when using the `Google C++ gRPC client <https://github.com/grpc/grpc>`_.",
    "notImp": false
  },
  {
    "name": "channel_credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_ChannelCredentials",
    "enums": null,
    "comment": "The channel credentials to use. See `channel credentials <https://grpc.io/docs/guides/auth.html#credential-types>`_. Ignored if ``channel_credentials_plugin`` is set.",
    "notImp": false
  },
  {
    "name": "channel_credentials_plugin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "A list of channel credentials plugins. The data plane will iterate over the list in order and stop at the first credential type that it supports. This provides a mechanism for starting to use new credential types that are not yet supported by all data planes. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "call_credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_CallCredentials[]",
    "enums": null,
    "comment": "The call credentials to use. See `channel credentials <https://grpc.io/docs/guides/auth.html#credential-types>`_. Ignored if ``call_credentials_plugin`` is set.",
    "notImp": false
  },
  {
    "name": "call_credentials_plugin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "A list of call credentials plugins. All supported plugins will be used. Unsupported plugin types will be ignored. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics for the gRPC service.\n\n.. csv-table:: :header: Name, Type, Description :widths: 1, 1, 2\n\n   streams_total, Counter, Total number of streams opened streams_closed_<gRPC status code>, Counter, Total streams closed with <gRPC status code>",
    "notImp": false
  },
  {
    "name": "credentials_factory_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the Google gRPC credentials factory to use. This must have been registered with Envoy. If this is empty, a default credentials factory will be used that sets up channel credentials based on other configuration parameters.",
    "notImp": false
  },
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Additional configuration for site-specific customizations of the Google gRPC library.",
    "notImp": false
  },
  {
    "name": "per_stream_buffer_limit_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "How many bytes each stream can buffer internally. If not set an implementation defined default is applied (1MiB).",
    "notImp": false
  },
  {
    "name": "channel_args",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_ChannelArgs",
    "enums": null,
    "comment": "Custom channels args.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_SingleFields = [
  "target_uri",
  "stat_prefix",
  "credentials_factory_name",
  "per_stream_buffer_limit_bytes"
];

export const GrpcService_GoogleGrpc_SslCredentials: OutType = { "GrpcService_GoogleGrpc_SslCredentials": [
  {
    "name": "root_certs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "PEM encoded server root certificates.",
    "notImp": false
  },
  {
    "name": "private_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "PEM encoded client private key.",
    "notImp": false
  },
  {
    "name": "cert_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "PEM encoded client certificate chain.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials: OutType = { "GrpcService_GoogleGrpc_CallCredentials": [
  {
    "name": "credential_specifier.access_token",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Access token credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#ad3a80da696ffdaea943f0f858d7a360d.",
    "notImp": false
  },
  {
    "name": "credential_specifier.google_compute_engine",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "Google Compute Engine credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#a6beb3ac70ff94bd2ebbd89b8f21d1f61",
    "notImp": false
  },
  {
    "name": "credential_specifier.google_refresh_token",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Google refresh token credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#a96901c997b91bc6513b08491e0dca37c.",
    "notImp": false
  },
  {
    "name": "credential_specifier.service_account_jwt_access",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials",
    "enums": null,
    "comment": "Service Account JWT Access credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#a92a9f959d6102461f66ee973d8e9d3aa.",
    "notImp": false
  },
  {
    "name": "credential_specifier.google_iam",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials",
    "enums": null,
    "comment": "Google IAM credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#a9fc1fc101b41e680d47028166e76f9d0.",
    "notImp": false
  },
  {
    "name": "credential_specifier.from_plugin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin",
    "enums": null,
    "comment": "Custom authenticator credentials. https://grpc.io/grpc/cpp/namespacegrpc.html#a823c6a4b19ffc71fb33e90154ee2ad07. https://grpc.io/docs/guides/auth.html#extending-grpc-to-support-other-authentication-mechanisms.",
    "notImp": false
  },
  {
    "name": "credential_specifier.sts_service",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcService_GoogleGrpc_CallCredentials_StsService",
    "enums": null,
    "comment": "Custom security token service which implements OAuth 2.0 token exchange. https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-16 See https://github.com/grpc/grpc/pull/19587.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials_SingleFields = [
  "credential_specifier.access_token",
  "credential_specifier.google_refresh_token"
];

export const GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials: OutType = { "GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials": [
  {
    "name": "json_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "token_lifetime_seconds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials_ServiceAccountJWTAccessCredentials_SingleFields = [
  "json_key",
  "token_lifetime_seconds"
];

export const GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials: OutType = { "GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials": [
  {
    "name": "authorization_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "authority_selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials_GoogleIAMCredentials_SingleFields = [
  "authorization_token",
  "authority_selector"
];

export const GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin: OutType = { "GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "extension-category: envoy.grpc_credentials",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials_MetadataCredentialsFromPlugin_SingleFields = [
  "name"
];

export const GrpcService_GoogleGrpc_CallCredentials_StsService: OutType = { "GrpcService_GoogleGrpc_CallCredentials_StsService": [
  {
    "name": "token_exchange_service_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "URI of the token exchange service that handles token exchange requests.",
    "notImp": false
  },
  {
    "name": "resource",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Location of the target service or resource where the client intends to use the requested security token.",
    "notImp": false
  },
  {
    "name": "audience",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Logical name of the target service where the client intends to use the requested security token.",
    "notImp": false
  },
  {
    "name": "scope",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The desired scope of the requested security token in the context of the service or resource where the token will be used.",
    "notImp": false
  },
  {
    "name": "requested_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the requested security token.",
    "notImp": false
  },
  {
    "name": "subject_token_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path of subject token, a security token that represents the identity of the party on behalf of whom the request is being made.",
    "notImp": false
  },
  {
    "name": "subject_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the subject token.",
    "notImp": false
  },
  {
    "name": "actor_token_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path of actor token, a security token that represents the identity of the acting party. The acting party is authorized to use the requested security token and act on behalf of the subject.",
    "notImp": false
  },
  {
    "name": "actor_token_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type of the actor token.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_CallCredentials_StsService_SingleFields = [
  "token_exchange_service_uri",
  "resource",
  "audience",
  "scope",
  "requested_token_type",
  "subject_token_path",
  "subject_token_type",
  "actor_token_path",
  "actor_token_type"
];

export const GrpcService_GoogleGrpc_ChannelArgs_Value: OutType = { "GrpcService_GoogleGrpc_ChannelArgs_Value": [
  {
    "name": "value_specifier.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Pointer values are not supported, since they don't make any sense when delivered via the API.",
    "notImp": false
  },
  {
    "name": "value_specifier.int_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Pointer values are not supported, since they don't make any sense when delivered via the API.",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_ChannelArgs_Value_SingleFields = [
  "value_specifier.string_value",
  "value_specifier.int_value"
];

export const GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry: OutType = { "GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry": [
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
    "fieldType": "GrpcService_GoogleGrpc_ChannelArgs_Value",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GrpcService_GoogleGrpc_ChannelArgs_ArgsEntry_SingleFields = [
  "key"
];