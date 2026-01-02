import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_tls_certificate = [
    {
        alias: 'tc',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/common',
        names: ['TlsCertificate', 'TlsCertificate_SingleFields'],
    },
];

export const modtag_certificate_validation_context = [
    {
        alias: 'cvc',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/common',
        names: ['CertificateValidationContext', 'CertificateValidationContext_SingleFields'],
    },
];

export const modtag_generic_secret = [
    {
        alias: 'gs',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/secret',
        names: ['GenericSecret'],
    },
];

export const modtag_tls_session_ticket_keys = [
    {
        alias: 'tstk',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/common',
        names: ['TlsSessionTicketKeys'],
    },
];

export const modtag_us_secret: TagsType = {
    "DownstreamTlsContext": [
        "session_ticket_keys_sds_secret_config",
        "require_sni",
        "disable_stateless_session_resumption",
        "session_ticket_keys_type.session_ticket_keys",
    ],
    "common_tls_context": [
        "tls_certificates",
        "tls_certificate_provider_instance",
        "validation_context_type.validation_context",
        "validation_context_type.combined_validation_context",
        "custom_handshaker",
        "tls_certificate_certificate_provider",
        "tls_certificate_certificate_provider_instance",
        "validation_context_certificate_provider_instance",
        "validation_context_certificate_provider",
        "custom_tls_certificate_selector"
    ],
    "tls_certificates": [
        "private_key_provider",
        "pkcs12",
        "signed_certificate_timestamp"
    ],
    "validation_context": [
        "custom_validator_config",
        "ca_certificate_provider_instance",
        "match_subject_alt_names",
        "require_signed_certificate_timestamp",
        "match_typed_subject_alt_names"
    ]
}
