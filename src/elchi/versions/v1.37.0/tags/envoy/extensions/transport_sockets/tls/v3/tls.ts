import {OutType} from '@elchi/tags/tagsType';


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
    "comment": "Path to save the TLS key log.",
    "notImp": false
  },
  {
    "name": "local_address_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "Local IP address ranges to filter connections for TLS key logging. If not set, matches any local IP address.",
    "notImp": false
  },
  {
    "name": "remote_address_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "Remote IP address ranges to filter connections for TLS key logging. If not set, matches any remote IP address.",
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
    "comment": "Configs for fetching TLS certificates via SDS API. Note SDS API allows certificates to be fetched/refreshed over the network asynchronously with respect to the TLS handshake.\n\nThe same number and types of certificates as `tls_certificates` are valid in the certificates fetched through this setting.\n\nIf ``tls_certificates`` or ``tls_certificate_provider_instance`` are set, this field is ignored.",
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
    "comment": "Custom TLS certificate selector.\n\nSelect TLS certificate based on TLS client hello. If empty, defaults to native TLS certificate selection behavior: DNS SANs or Subject Common Name in TLS certificates is extracted as server name pattern to match SNI. extension-category: envoy.tls.certificate_selectors",
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
    "comment": "Combines the default ``CertificateValidationContext`` with the SDS-provided dynamic context for certificate validation.\n\nWhen the SDS server returns a dynamic ``CertificateValidationContext``, it is merged with the default context using ``Message::MergeFrom()``. The merging rules are as follows:\n\n* **Singular Fields:** Dynamic fields override the default singular fields. * **Repeated Fields:** Dynamic repeated fields are concatenated with the default repeated fields. * **Boolean Fields:** Boolean fields are combined using a logical OR operation.\n\nThe resulting ``CertificateValidationContext`` is used to perform certificate validation.",
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
    "comment": "Common TLS context settings.\n\n:::attention\n\nServer certificate verification is not enabled by default. To enable verification, configure `trusted_ca`.",
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
    "name": "auto_host_sni",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, replaces the SNI for the connection with the hostname of the upstream host, if the hostname is known due to either a DNS cluster type or the `hostname` is set on the host.\n\nSee `SNI configuration` for details on how this interacts with other validation options.",
    "notImp": false
  },
  {
    "name": "auto_sni_san_validation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, replaces any Subject Alternative Name (SAN) validations with a validation for a DNS SAN matching the SNI value sent. The validation uses the actual requested SNI, regardless of how the SNI is configured.\n\nFor common cases where an SNI value is present and the server certificate should include a corresponding SAN, this option ensures the SAN is properly validated.\n\nSee the `validation configuration` for how this interacts with other validation options.",
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
    "comment": "Maximum number of session keys (Pre-Shared Keys for TLSv1.3+, Session IDs and Session Tickets for TLSv1.2 and older) to be stored for session resumption.\n\nDefaults to 1, setting this to 0 disables session resumption.",
    "notImp": false
  },
  {
    "name": "enforce_rsa_key_usage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Controls enforcement of the ``keyUsage`` extension in peer certificates. If set to ``true``, the handshake will fail if the ``keyUsage`` is incompatible with TLS usage.\n\n:::note\nThe default value is ``false`` (i.e., enforcement off). It is expected to change to ``true`` in a future release. \n:::\n\nThe ``ssl.was_key_usage_invalid`` in `listener metrics` metric will be incremented for configurations that would fail if this option were enabled.",
    "notImp": false
  }
] };

export const UpstreamTlsContext_SingleFields = [
  "sni",
  "auto_host_sni",
  "auto_sni_san_validation",
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
    "comment": "If ``true``, the TLS server will not maintain a session cache of TLS sessions.\n\n:::note\nThis applies only to TLSv1.2 and earlier.",
    "notImp": false
  },
  {
    "name": "session_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Maximum lifetime of TLS sessions. If specified, ``session_timeout`` will change the maximum lifetime of the TLS session.\n\nThis serves as a hint for the `TLS session ticket lifetime (for TLSv1.2) <https://tools.ietf.org/html/rfc5077#section-5.6>`_. Only whole seconds are considered; fractional seconds are ignored.",
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
    "comment": "Configuration for handling certificates without an OCSP response or with expired responses.\n\nDefaults to ``LENIENT_STAPLING``",
    "notImp": false
  },
  {
    "name": "full_scan_certs_on_sni_mismatch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Multiple certificates are allowed in Downstream transport socket to serve different SNI. This option controls the behavior when no matching certificate is found for the received SNI value, or no SNI value was sent. If enabled, all certificates will be evaluated for a match for non-SNI criteria such as key type and OCSP settings. If disabled, the first provided certificate will be used. Defaults to ``false``. See more details in `Multiple TLS certificates`.",
    "notImp": false
  },
  {
    "name": "prefer_client_ciphers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``true``, the downstream client's preferred cipher is used during the handshake. If ``false``, Envoy uses its preferred cipher.\n\n:::note\nThis has no effect when using TLSv1_3.",
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