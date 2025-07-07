import {OutType} from '@/elchi/tags/tagsType';


export const TlsParameters: OutType = { "TlsParameters": [
  {
    "name": "tls_minimum_protocol_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlsParameters_TlsProtocol",
    "enums": [
      "TLS_AUTO",
      "TLSv1_0",
      "TLSv1_1",
      "TLSv1_2",
      "TLSv1_3"
    ],
    "comment": "Minimum TLS protocol version. By default, it's ``TLSv1_2`` for both clients and servers.\n\nTLS protocol versions below TLSv1_2 require setting compatible ciphers with the ``cipher_suites`` setting as the default ciphers no longer include compatible ciphers.\n\n:::attention\n\nUsing TLS protocol versions below TLSv1_2 has serious security considerations and risks.",
    "notImp": false
  },
  {
    "name": "tls_maximum_protocol_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlsParameters_TlsProtocol",
    "enums": [
      "TLS_AUTO",
      "TLSv1_0",
      "TLSv1_1",
      "TLSv1_2",
      "TLSv1_3"
    ],
    "comment": "Maximum TLS protocol version. By default, it's ``TLSv1_2`` for clients and ``TLSv1_3`` for servers.",
    "notImp": false
  },
  {
    "name": "cipher_suites",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "If specified, the TLS listener will only support the specified `cipher list <https://commondatastorage.googleapis.com/chromium-boringssl-docs/ssl.h.html#Cipher-suite-configuration>`_ when negotiating TLS 1.0-1.2 (this setting has no effect when negotiating TLS 1.3).\n\nIf not specified, a default list will be used. Defaults are different for server (downstream) and client (upstream) TLS configurations. Defaults will change over time in response to security considerations; If you care, configure it instead of using the default.\n\nIn non-FIPS builds, the default server cipher list is:\n\n.. code-block:: none\n\n  [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305] [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305] ECDHE-ECDSA-AES256-GCM-SHA384 ECDHE-RSA-AES256-GCM-SHA384\n\nIn builds using `BoringSSL FIPS`, the default server cipher list is:\n\n.. code-block:: none\n\n  ECDHE-ECDSA-AES128-GCM-SHA256 ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES256-GCM-SHA384 ECDHE-RSA-AES256-GCM-SHA384\n\nIn non-FIPS builds, the default client cipher list is:\n\n.. code-block:: none\n\n  [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305] [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305] ECDHE-ECDSA-AES256-GCM-SHA384 ECDHE-RSA-AES256-GCM-SHA384\n\nIn builds using `BoringSSL FIPS`, the default client cipher list is:\n\n.. code-block:: none\n\n  ECDHE-ECDSA-AES128-GCM-SHA256 ECDHE-RSA-AES128-GCM-SHA256 ECDHE-ECDSA-AES256-GCM-SHA384 ECDHE-RSA-AES256-GCM-SHA384",
    "notImp": false
  },
  {
    "name": "ecdh_curves",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "If specified, the TLS connection will only support the specified ECDH curves. If not specified, the default curves will be used.\n\nIn non-FIPS builds, the default curves are:\n\n.. code-block:: none\n\n  X25519 P-256\n\nIn builds using `BoringSSL FIPS`, the default curve is:\n\n.. code-block:: none\n\n  P-256",
    "notImp": false
  },
  {
    "name": "signature_algorithms",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "If specified, the TLS connection will only support the specified signature algorithms. The list is ordered by preference. If not specified, the default signature algorithms defined by BoringSSL will be used.\n\nDefault signature algorithms selected by BoringSSL (may be out of date):\n\n.. code-block:: none\n\n  ecdsa_secp256r1_sha256 rsa_pss_rsae_sha256 rsa_pkcs1_sha256 ecdsa_secp384r1_sha384 rsa_pss_rsae_sha384 rsa_pkcs1_sha384 rsa_pss_rsae_sha512 rsa_pkcs1_sha512 rsa_pkcs1_sha1\n\nSignature algorithms supported by BoringSSL (may be out of date):\n\n.. code-block:: none\n\n  rsa_pkcs1_sha256 rsa_pkcs1_sha384 rsa_pkcs1_sha512 ecdsa_secp256r1_sha256 ecdsa_secp384r1_sha384 ecdsa_secp521r1_sha512 rsa_pss_rsae_sha256 rsa_pss_rsae_sha384 rsa_pss_rsae_sha512 ed25519 rsa_pkcs1_sha1 ecdsa_sha1",
    "notImp": false
  }
] };

export const TlsParameters_SingleFields = [
  "tls_minimum_protocol_version",
  "tls_maximum_protocol_version",
  "cipher_suites",
  "ecdh_curves",
  "signature_algorithms"
];

export const PrivateKeyProvider: OutType = { "PrivateKeyProvider": [
  {
    "name": "provider_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Private key method provider name. The name must match a supported private key method provider type.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Private key method provider specific configuration.",
    "notImp": false
  },
  {
    "name": "fallback",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If the private key provider isn't available (eg. the required hardware capability doesn't existed), Envoy will fallback to the BoringSSL default implementation when the ``fallback`` is true. The default value is ``false``.",
    "notImp": false
  }
] };

export const PrivateKeyProvider_SingleFields = [
  "provider_name",
  "fallback"
];

export const TlsCertificate: OutType = { "TlsCertificate": [
  {
    "name": "certificate_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The TLS certificate chain.\n\nIf ``certificate_chain`` is a filesystem path, a watch will be added to the parent directory for any file moves to support rotation. This currently only applies to dynamic secrets, when the ``TlsCertificate`` is delivered via SDS.",
    "notImp": false
  },
  {
    "name": "private_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The TLS private key.\n\nIf ``private_key`` is a filesystem path, a watch will be added to the parent directory for any file moves to support rotation. This currently only applies to dynamic secrets, when the ``TlsCertificate`` is delivered via SDS.",
    "notImp": false
  },
  {
    "name": "pkcs12",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "``Pkcs12`` data containing TLS certificate, chain, and private key.\n\nIf ``pkcs12`` is a filesystem path, the file will be read, but no watch will be added to the parent directory, since ``pkcs12`` isn't used by SDS. This field is mutually exclusive with ``certificate_chain``, ``private_key`` and ``private_key_provider``. This can't be marked as ``oneof`` due to API compatibility reasons. Setting both `private_key`, `certificate_chain`, or `private_key_provider` and `pkcs12` fields will result in an error. Use `password` to specify the password to unprotect the ``PKCS12`` data, if necessary.",
    "notImp": false
  },
  {
    "name": "watched_directory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WatchedDirectory",
    "enums": null,
    "comment": "If specified, updates of file-based ``certificate_chain`` and ``private_key`` sources will be triggered by this watch. The certificate/key pair will be read together and validated for atomic read consistency (i.e. no intervening modification occurred between cert/key read, verified by file hash comparisons). This allows explicit control over the path watched, by default the parent directories of the filesystem paths in ``certificate_chain`` and ``private_key`` are watched if this field is not specified. This only applies when a ``TlsCertificate`` is delivered by SDS with references to filesystem paths. See the `SDS key rotation` documentation for further details.",
    "notImp": false
  },
  {
    "name": "private_key_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PrivateKeyProvider",
    "enums": null,
    "comment": "BoringSSL private key method provider. This is an alternative to `private_key` field. This can't be marked as ``oneof`` due to API compatibility reasons. Setting both `private_key` and `private_key_provider` fields will result in an error.",
    "notImp": false
  },
  {
    "name": "password",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The password to decrypt the TLS private key. If this field is not set, it is assumed that the TLS private key is not password encrypted.",
    "notImp": false
  },
  {
    "name": "ocsp_staple",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The OCSP response to be stapled with this certificate during the handshake. The response must be DER-encoded and may only be  provided via ``filename`` or ``inline_bytes``. The response may pertain to only one certificate.",
    "notImp": false
  },
  {
    "name": "signed_certificate_timestamp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource[]",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
  }
] };

export const TlsSessionTicketKeys: OutType = { "TlsSessionTicketKeys": [
  {
    "name": "keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource[]",
    "enums": null,
    "comment": "Keys for encrypting and decrypting TLS session tickets. The first key in the array contains the key to encrypt all new sessions created by this context. All keys are candidates for decrypting received tickets. This allows for easy rotation of keys by, for example, putting the new key first, and the previous key second.\n\nIf `session_ticket_keys` is not specified, the TLS library will still support resuming sessions via tickets, but it will use an internally-generated and managed key, so sessions cannot be resumed across hot restarts or on different hosts.\n\nEach key must contain exactly 80 bytes of cryptographically-secure random data. For example, the output of ``openssl rand 80``.\n\n:::attention\n\nUsing this feature has serious security considerations and risks. Improper handling of keys may result in loss of secrecy in connections, even if ciphers supporting perfect forward secrecy are used. See https://www.imperialviolet.org/2013/06/27/botchingpfs.html for some discussion. To minimize the risk, you must: \n:::\n\n  * Keep the session ticket keys at least as secure as your TLS certificate private keys * Rotate session ticket keys at least daily, and preferably hourly * Always generate keys using a cryptographically-secure random data source",
    "notImp": false
  }
] };

export const CertificateProviderPluginInstance: OutType = { "CertificateProviderPluginInstance": [
  {
    "name": "instance_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Provider instance name.\n\nInstance names should generally be defined not in terms of the underlying provider implementation (e.g., \"file_watcher\") but rather in terms of the function of the certificates (e.g., \"foo_deployment_identity\").",
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

export const CertificateProviderPluginInstance_SingleFields = [
  "instance_name",
  "certificate_name"
];

export const SubjectAltNameMatcher: OutType = { "SubjectAltNameMatcher": [
  {
    "name": "san_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubjectAltNameMatcher_SanType",
    "enums": [
      "SAN_TYPE_UNSPECIFIED",
      "EMAIL",
      "DNS",
      "URI",
      "IP_ADDRESS",
      "OTHER_NAME"
    ],
    "comment": "Specification of type of SAN. Note that the default enum value is an invalid choice.",
    "notImp": false
  },
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Matcher for SAN value.\n\nThe string matching for OTHER_NAME SAN values depends on their ASN.1 type:\n\n         * OBJECT: Validated against its dotted numeric notation (e.g., \"1.2.3.4\") * BOOLEAN: Validated against strings \"true\" or \"false\" * INTEGER/ENUMERATED: Validated against a string containing the integer value * NULL: Validated against an empty string * Other types: Validated directly against the string value",
    "notImp": false
  },
  {
    "name": "oid",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "OID Value which is required if OTHER_NAME SAN type is used. For example, UPN OID is 1.3.6.1.4.1.311.20.2.3 (Reference: http://oid-info.com/get/1.3.6.1.4.1.311.20.2.3).\n\nIf set for SAN types other than OTHER_NAME, it will be ignored.",
    "notImp": false
  }
] };

export const SubjectAltNameMatcher_SingleFields = [
  "san_type",
  "oid"
];

export const CertificateValidationContext: OutType = { "CertificateValidationContext": [
  {
    "name": "trusted_ca",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "TLS certificate data containing certificate authority certificates to use in verifying a presented peer certificate (e.g. server certificate for clusters or client certificate for listeners). If not specified and a peer certificate is presented it will not be verified. By default, a client certificate is optional, unless one of the additional options (`require_client_certificate`, `verify_certificate_spki`, `verify_certificate_hash`, or `match_typed_subject_alt_names`) is also specified.\n\nIt can optionally contain certificate revocation lists, in which case Envoy will verify that the presented peer certificate has not been revoked by one of the included CRLs. Note that if a CRL is provided for any certificate authority in a trust chain, a CRL must be provided for all certificate authorities in that chain. Failure to do so will result in verification failure for both revoked and unrevoked certificates from that chain. The behavior of requiring all certificates to contain CRLs can be altered by setting `only_verify_leaf_cert_crl` true. If set to true, only the final certificate in the chain undergoes CRL verification.\n\nSee `the TLS overview` for a list of common system CA locations.\n\nIf ``trusted_ca`` is a filesystem path, a watch will be added to the parent directory for any file moves to support rotation. This currently only applies to dynamic secrets, when the ``CertificateValidationContext`` is delivered via SDS.\n\nX509_V_FLAG_PARTIAL_CHAIN is set by default, so non-root/intermediate ca certificate in ``trusted_ca`` can be treated as trust anchor as well. It allows verification with building valid partial chain instead of a full chain.\n\nIf ``ca_certificate_provider_instance`` is set, it takes precedence over ``trusted_ca``.",
    "notImp": false
  },
  {
    "name": "ca_certificate_provider_instance",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateProviderPluginInstance",
    "enums": null,
    "comment": "Certificate provider instance for fetching TLS certificates.\n\nIf set, takes precedence over ``trusted_ca``. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "system_root_certs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateValidationContext_SystemRootCerts",
    "enums": null,
    "comment": "Use system root certs for validation. If present, system root certs are used only if neither of the ``trusted_ca`` or ``ca_certificate_provider_instance`` fields are set. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "watched_directory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WatchedDirectory",
    "enums": null,
    "comment": "If specified, updates of a file-based ``trusted_ca`` source will be triggered by this watch. This allows explicit control over the path watched, by default the parent directory of the filesystem path in ``trusted_ca`` is watched if this field is not specified. This only applies when a ``CertificateValidationContext`` is delivered by SDS with references to filesystem paths. See the `SDS key rotation` documentation for further details.",
    "notImp": false
  },
  {
    "name": "verify_certificate_spki",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "An optional list of base64-encoded SHA-256 hashes. If specified, Envoy will verify that the SHA-256 of the DER-encoded Subject Public Key Information (SPKI) of the presented certificate matches one of the specified values.\n\nA base64-encoded SHA-256 of the Subject Public Key Information (SPKI) of the certificate can be generated with the following command:\n\n.. code-block:: bash\n\n  $ openssl x509 -in path/to/client.crt -noout -pubkey | openssl pkey -pubin -outform DER | openssl dgst -sha256 -binary | openssl enc -base64 NvqYIYSbgK2vCJpQhObf77vv+bQWtc5ek5RIOwPiC9A=\n\nThis is the format used in HTTP Public Key Pinning.\n\nWhen both: `verify_certificate_hash` and `verify_certificate_spki` are specified, a hash matching value from either of the lists will result in the certificate being accepted.\n\n:::attention\n\nThis option is preferred over `verify_certificate_hash`, because SPKI is tied to a private key, so it doesn't change when the certificate is renewed using the same private key.",
    "notImp": false
  },
  {
    "name": "verify_certificate_hash",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "An optional list of hex-encoded SHA-256 hashes. If specified, Envoy will verify that the SHA-256 of the DER-encoded presented certificate matches one of the specified values.\n\nA hex-encoded SHA-256 of the certificate can be generated with the following command:\n\n.. code-block:: bash\n\n  $ openssl x509 -in path/to/client.crt -outform DER | openssl dgst -sha256 | cut -d\" \" -f2 df6ff72fe9116521268f6f2dd4966f51df479883fe7037b39f75916ac3049d1a\n\nA long hex-encoded and colon-separated SHA-256 (a.k.a. \"fingerprint\") of the certificate can be generated with the following command:\n\n.. code-block:: bash\n\n  $ openssl x509 -in path/to/client.crt -noout -fingerprint -sha256 | cut -d\"=\" -f2 DF:6F:F7:2F:E9:11:65:21:26:8F:6F:2D:D4:96:6F:51:DF:47:98:83:FE:70:37:B3:9F:75:91:6A:C3:04:9D:1A\n\nBoth of those formats are acceptable.\n\nWhen both: `verify_certificate_hash` and `verify_certificate_spki` are specified, a hash matching value from either of the lists will result in the certificate being accepted.",
    "notImp": false
  },
  {
    "name": "match_typed_subject_alt_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubjectAltNameMatcher[]",
    "enums": null,
    "comment": "An optional list of Subject Alternative name matchers. If specified, Envoy will verify that the Subject Alternative Name of the presented certificate matches one of the specified matchers. The matching uses \"any\" semantics, that is to say, the SAN is verified if at least one matcher is matched.\n\nWhen a certificate has wildcard DNS SAN entries, to match a specific client, it should be configured with exact match type in the `string matcher`. For example if the certificate has \"\\*.example.com\" as DNS SAN entry, to allow only \"api.example.com\", it should be configured as shown below.\n\n```yaml\n\n match_typed_subject_alt_names:\n - san_type: DNS\n   matcher:\n     exact: \"api.example.com\"\n```\n\n:::attention\n\nSubject Alternative Names are easily spoofable and verifying only them is insecure, therefore this option must be used together with `trusted_ca`.",
    "notImp": false
  },
  {
    "name": "match_subject_alt_names",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "This field is deprecated in favor of `match_typed_subject_alt_names`. Note that if both this field and `match_typed_subject_alt_names` are specified, the former (deprecated field) is ignored.",
    "notImp": false
  },
  {
    "name": "require_signed_certificate_timestamp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:] Must present signed certificate time-stamp.",
    "notImp": true
  },
  {
    "name": "crl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "An optional `certificate revocation list <https://en.wikipedia.org/wiki/Certificate_revocation_list>`_ (in PEM format). If specified, Envoy will verify that the presented peer certificate has not been revoked by this CRL. If this DataSource contains multiple CRLs, all of them will be used. Note that if a CRL is provided for any certificate authority in a trust chain, a CRL must be provided for all certificate authorities in that chain. Failure to do so will result in verification failure for both revoked and unrevoked certificates from that chain. This default behavior can be altered by setting `only_verify_leaf_cert_crl` to true.\n\nIf ``crl`` is a filesystem path, a watch will be added to the parent directory for any file moves to support rotation. This currently only applies to dynamic secrets, when the ``CertificateValidationContext`` is delivered via SDS.",
    "notImp": false
  },
  {
    "name": "allow_expired_certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If specified, Envoy will not reject expired certificates.",
    "notImp": false
  },
  {
    "name": "trust_chain_verification",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateValidationContext_TrustChainVerification",
    "enums": [
      "VERIFY_TRUST_CHAIN",
      "ACCEPT_UNTRUSTED"
    ],
    "comment": "Certificate trust chain verification mode.",
    "notImp": false
  },
  {
    "name": "custom_validator_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The configuration of an extension specific certificate validator. If specified, all validation is done by the specified validator, and the behavior of all other validation settings is defined by the specified validator (and may be entirely ignored, unused, and unvalidated). Refer to the documentation for the specified validator. If you do not want a custom validation algorithm, do not set this field. extension-category: envoy.tls.cert_validator",
    "notImp": false
  },
  {
    "name": "only_verify_leaf_cert_crl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If this option is set to true, only the certificate at the end of the certificate chain will be subject to validation by `CRL`.",
    "notImp": false
  },
  {
    "name": "max_verify_depth",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Defines maximum depth of a certificate chain accepted in verification, the default limit is 100, though this can be system-dependent. This number does not include the leaf but includes the trust anchor, so a depth of 1 allows the leaf and one CA certificate. If a trusted issuer appears in the chain, but in a depth larger than configured, the certificate validation will fail. This matches the semantics of ``SSL_CTX_set_verify_depth`` in OpenSSL 1.0.x and older versions of BoringSSL. It differs from ``SSL_CTX_set_verify_depth`` in OpenSSL 1.1.x and newer versions of BoringSSL in that the trust anchor is included. Trusted issues are specified by setting `trusted_ca`",
    "notImp": false
  }
] };

export const CertificateValidationContext_SingleFields = [
  "verify_certificate_spki",
  "verify_certificate_hash",
  "require_signed_certificate_timestamp",
  "allow_expired_certificate",
  "trust_chain_verification",
  "only_verify_leaf_cert_crl",
  "max_verify_depth"
];