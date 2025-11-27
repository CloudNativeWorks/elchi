import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_quic_options = [
    {
        alias: 'qo',
        relativePath: 'envoy/config/listener/v3/quic_config',
        names: ['QuicProtocolOptions', 'QuicProtocolOptions_SingleFields'],
    },
];

export const modtag_us_quic_options: TagsType = {
    "QuicProtocolOptions": [
        "enabled",
        "crypto_stream_config",
        "proof_source_config",
        "connection_id_generator_config",
        "server_preferred_address_config",
        "connection_debug_visitor_config"
    ]
};
