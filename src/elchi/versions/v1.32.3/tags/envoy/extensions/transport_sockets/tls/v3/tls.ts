import {OutType} from '@/elchi/tags/tagsType';


export const CommonTlsContext_CertificateProvider: OutType = { "CommonTlsContext_CertificateProvider": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "opaque name used to specify certificate instances or types. For example, \"ROOTCA\" to specify a root-certificate (validation context) or \"TLS\" to specify a new tls-certificate.",
    "notImp": false
  },
  {
    "name": "config.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Provider specific config. Note: an implementation is expected to dedup multiple instances of the same config to maintain a single certificate-provider instance. The sharing can happen, for example, among multiple clusters or between the tls_certificate and validation_context certificate providers of a cluster. This config could be supplied inline or (in future) a named xDS resource.",
    "notImp": false
  }
] };

export const CommonTlsContext_CertificateProvider_SingleFields = [
  "name"
];

export const CommonTlsContext_CertificateProviderInstance: OutType = { "CommonTlsContext_CertificateProviderInstance": [
  {
    "name": "instance_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Provider instance name. This name must be defined in the client's configuration (e.g., a bootstrap file) to correspond to a provider instance (i.e., the same data in the typed_config field that would be sent in the CertificateProvider message if the config was sent by the control plane). If not present, defaults to \"default\".\n\nInstance names should generally be defined not in terms of the underlying provider implementation (e.g., \"file_watcher\") but rather in terms of the function of the certificates (e.g., \"foo_deployment_identity\").",
    "notImp": false
  },
  {
    "name": "certificate_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Opaque name used to specify certificate instances or types. For example, \"ROOTCA\" to specify a root-certificate (validation context) or \"example.com\" to specify a certificate for a particular domain. Not all provider instances will actually use this field, so the value defaults to the empty string.",
    "notImp": false
  }
] };

export const CommonTlsContext_CertificateProviderInstance_SingleFields = [
  "instance_name",
  "certificate_name"
];

export const TlsKeyLog: OutType = { "TlsKeyLog": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path to save the TLS key log.",
    "notImp": false
  },
  {
    "name": "local_address_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "The local IP address that will be used to filter the connection which should save the TLS key log If it is not set, any local IP address  will be matched.",
    "notImp": false
  },
  {
    "name": "remote_address_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "The remote IP address that will be used to filter the connection which should save the TLS key log If it is not set, any remote IP address will be matched.",
    "notImp": false
  }
] };

export const TlsKeyLog_SingleFields = [
  "path"
];

export const CommonTlsContext: OutType = { "CommonTlsContext": [
  {
    "name": "tls_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlsParameters",
    "enums": null,
    "comment": "TLS protocol versions, cipher suites etc.",
    "notImp": false
  },
  {
    "name": "tls_certificates",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlsCertificate[]",
    "enums": null,
    "comment": "Only a single TLS certificate is supported in client contexts. In server contexts, `Multiple TLS certificates` can be associated with the same context to allow both RSA and ECDSA certificates and support SNI-based selection.\n\nIf ``tls_certificate_provider_instance`` is set, this field is ignored. If this field is set, ``tls_certificate_sds_secret_configs`` is ignored.",
    "notImp": false
  },
  {
    "name": "tls_certificate_sds_secret_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig[]",
    "enums": null,
    "comment": "Configs for fetching TLS certificates via SDS API. Note SDS API allows certificates to be fetched/refreshed over the network asynchronously with respect to the TLS handshake.\n\nThe same number and types of certificates as `tls_certificates` are valid in the the certificates fetched through this setting.\n\nIf ``tls_certificates`` or ``tls_certificate_provider_instance`` are set, this field is ignored.",
    "notImp": false
  },
  {
    "name": "tls_certificate_provider_instance",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateProviderPluginInstance",
    "enums": null,
    "comment": "Certificate provider instance for fetching TLS certs.\n\nIf this field is set, ``tls_certificates`` and ``tls_certificate_provider_instance`` are ignored. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "custom_tls_certificate_selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Custom TLS certificate selector.\n\nSelect TLS certificate based on TLS client hello. If empty, defaults to native TLS certificate selection behavior: DNS SANs or Subject Common Name in TLS certificates is extracted as server name pattern to match SNI.",
    "notImp": false
  },
  {
    "name": "tls_certificate_certificate_provider",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CommonTlsContext_CertificateProvider",
    "enums": null,
    "comment": "Certificate provider for fetching TLS certificates. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "tls_certificate_certificate_provider_instance",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CommonTlsContext_CertificateProviderInstance",
    "enums": null,
    "comment": "Certificate provider instance for fetching TLS certificates. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "validation_context_type.validation_context",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CertificateValidationContext",
    "enums": null,
    "comment": "How to validate peer certificates.",
    "notImp": false
  },
  {
    "name": "validation_context_type.validation_context_sds_secret_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "Config for fetching validation context via SDS API. Note SDS API allows certificates to be fetched/refreshed over the network asynchronously with respect to the TLS handshake.",
    "notImp": false
  },
  {
    "name": "validation_context_type.combined_validation_context",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext_CombinedCertificateValidationContext",
    "enums": null,
    "comment": "Combined certificate validation context holds a default CertificateValidationContext and SDS config. When SDS server returns dynamic CertificateValidationContext, both dynamic and default CertificateValidationContext are merged into a new CertificateValidationContext for validation. This merge is done by Message::MergeFrom(), so dynamic CertificateValidationContext overwrites singular fields in default CertificateValidationContext, and concatenates repeated fields to default CertificateValidationContext, and logical OR is applied to boolean fields.",
    "notImp": false
  },
  {
    "name": "validation_context_type.validation_context_certificate_provider",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext_CertificateProvider",
    "enums": null,
    "comment": "Certificate provider for fetching validation context. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "validation_context_type.validation_context_certificate_provider_instance",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext_CertificateProviderInstance",
    "enums": null,
    "comment": "Certificate provider instance for fetching validation context. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "alpn_protocols",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Supplies the list of ALPN protocols that the listener should expose. In practice this is likely to be set to one of two values (see the `codec_type` parameter in the HTTP connection manager for more information):\n\n* \"h2,http/1.1\" If the listener is going to support both HTTP/2 and HTTP/1.1. * \"http/1.1\" If the listener is only going to support HTTP/1.1.\n\nThere is no default for this parameter. If empty, Envoy will not expose ALPN.",
    "notImp": false
  },
  {
    "name": "custom_handshaker",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Custom TLS handshaker. If empty, defaults to native TLS handshaking behavior.",
    "notImp": false
  },
  {
    "name": "key_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlsKeyLog",
    "enums": null,
    "comment": "TLS key log configuration",
    "notImp": false
  }
] };

export const CommonTlsContext_SingleFields = [
  "alpn_protocols"
];

export const UpstreamTlsContext: OutType = { "UpstreamTlsContext": [
  {
    "name": "common_tls_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext",
    "enums": null,
    "comment": "Common TLS context settings.\n\n:::attention\n\nServer certificate verification is not enabled by default. Configure `trusted_ca` to enable verification.",
    "notImp": false
  },
  {
    "name": "sni",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "SNI string to use when creating TLS backend connections.",
    "notImp": false
  },
  {
    "name": "allow_renegotiation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, server-initiated TLS renegotiation will be allowed.\n\n:::attention\n\nTLS renegotiation is considered insecure and shouldn't be used unless absolutely necessary.",
    "notImp": false
  },
  {
    "name": "max_session_keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of session keys (Pre-Shared Keys for TLSv1.3+, Session IDs and Session Tickets for TLSv1.2 and older) to store for the purpose of session resumption.\n\nDefaults to 1, setting this to 0 disables session resumption.",
    "notImp": false
  },
  {
    "name": "enforce_rsa_key_usage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "This field is used to control the enforcement, whereby the handshake will fail if the keyUsage extension is present and incompatible with the TLS usage. Currently, the default value is false (i.e., enforcement off) but it is expected to be changed to true by default in a future release. ``ssl.was_key_usage_invalid`` in `listener metrics` will be set for certificate configurations that would fail if this option were set to true.",
    "notImp": false
  }
] };

export const UpstreamTlsContext_SingleFields = [
  "sni",
  "allow_renegotiation",
  "max_session_keys",
  "enforce_rsa_key_usage"
];

export const DownstreamTlsContext: OutType = { "DownstreamTlsContext": [
  {
    "name": "common_tls_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonTlsContext",
    "enums": null,
    "comment": "Common TLS context settings.",
    "notImp": false
  },
  {
    "name": "require_client_certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, Envoy will reject connections without a valid client certificate.",
    "notImp": false
  },
  {
    "name": "require_sni",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, Envoy will reject connections without a valid and matching SNI. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "session_ticket_keys_type.session_ticket_keys",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TlsSessionTicketKeys",
    "enums": null,
    "comment": "TLS session ticket key settings.",
    "notImp": false
  },
  {
    "name": "session_ticket_keys_type.session_ticket_keys_sds_secret_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "Config for fetching TLS session ticket keys via SDS API.",
    "notImp": false
  },
  {
    "name": "session_ticket_keys_type.disable_stateless_session_resumption",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Config for controlling stateless TLS session resumption: setting this to true will cause the TLS server to not issue TLS session tickets for the purposes of stateless TLS session resumption. If set to false, the TLS server will issue TLS session tickets and encrypt/decrypt them using the keys specified through either `session_ticket_keys` or `session_ticket_keys_sds_secret_config`. If this config is set to false and no keys are explicitly configured, the TLS server will issue TLS session tickets and encrypt/decrypt them using an internally-generated and managed key, with the implication that sessions cannot be resumed across hot restarts or on different hosts.",
    "notImp": false
  },
  {
    "name": "disable_stateful_session_resumption",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the TLS server will not maintain a session cache of TLS sessions. (This is relevant only for TLSv1.2 and earlier.)",
    "notImp": false
  },
  {
    "name": "session_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If specified, ``session_timeout`` will change the maximum lifetime (in seconds) of the TLS session. Currently this value is used as a hint for the `TLS session ticket lifetime (for TLSv1.2) <https://tools.ietf.org/html/rfc5077#section-5.6>`_. Only seconds can be specified (fractional seconds are ignored).",
    "notImp": false
  },
  {
    "name": "ocsp_staple_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DownstreamTlsContext_OcspStaplePolicy",
    "enums": [
      "LENIENT_STAPLING",
      "STRICT_STAPLING",
      "MUST_STAPLE"
    ],
    "comment": "Config for whether to use certificates if they do not have an accompanying OCSP response or if the response expires at runtime. Defaults to LENIENT_STAPLING",
    "notImp": false
  },
  {
    "name": "full_scan_certs_on_sni_mismatch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Multiple certificates are allowed in Downstream transport socket to serve different SNI. If the client provides SNI but no such cert matched, it will decide to full scan certificates or not based on this config. Defaults to false. See more details in `Multiple TLS certificates`.",
    "notImp": false
  },
  {
    "name": "prefer_client_ciphers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, Envoy as a server uses its preferred cipher during the handshake. Setting this to true would allow the downstream client's preferred cipher to be used instead. Has no effect when using TLSv1_3.",
    "notImp": false
  }
] };

export const DownstreamTlsContext_SingleFields = [
  "require_client_certificate",
  "require_sni",
  "session_ticket_keys_type.disable_stateless_session_resumption",
  "disable_stateful_session_resumption",
  "session_timeout",
  "ocsp_staple_policy",
  "full_scan_certs_on_sni_mismatch",
  "prefer_client_ciphers"
];

export const CommonTlsContext_CombinedCertificateValidationContext: OutType = { "CommonTlsContext_CombinedCertificateValidationContext": [
  {
    "name": "default_validation_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateValidationContext",
    "enums": null,
    "comment": "How to validate peer certificates.",
    "notImp": false
  },
  {
    "name": "validation_context_sds_secret_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "Config for fetching validation context via SDS API. Note SDS API allows certificates to be fetched/refreshed over the network asynchronously with respect to the TLS handshake.",
    "notImp": false
  },
  {
    "name": "validation_context_certificate_provider",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CommonTlsContext_CertificateProvider",
    "enums": null,
    "comment": "Certificate provider for fetching CA certs. This will populate the ``default_validation_context.trusted_ca`` field. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "validation_context_certificate_provider_instance",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "CommonTlsContext_CertificateProviderInstance",
    "enums": null,
    "comment": "Certificate provider instance for fetching CA certs. This will populate the ``default_validation_context.trusted_ca`` field. [#not-implemented-hide:]",
    "notImp": true
  }
] };