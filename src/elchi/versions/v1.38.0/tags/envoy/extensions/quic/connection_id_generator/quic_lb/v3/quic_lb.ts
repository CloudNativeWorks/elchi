import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "server_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Must be at least 1 octet. The length of server_id and nonce_length_bytes must be 18 or less. See https://datatracker.ietf.org/doc/html/draft-ietf-quic-load-balancers#name-server-id-allocation.",
    "notImp": false
  },
  {
    "name": "server_id_base64_encoded",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, indicates that the `server_id` is base64 encoded.\n\nThis can be useful if the ID may contain binary data and must be transmitted as a string, for example in an environment variable.",
    "notImp": false
  },
  {
    "name": "expected_server_id_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional validation of the expected server ID length. If this is non-zero and the value in ``server_id`` does not have a matching length, a configuration error is generated. This can be useful for validating that the server ID is valid.",
    "notImp": false
  },
  {
    "name": "nonce_length_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The nonce length must be at least 4 bytes. The length of server_id and nonce_length_bytes must be 18 bytes or less.",
    "notImp": false
  },
  {
    "name": "encryption_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SdsSecretConfig",
    "enums": null,
    "comment": "Configuration to fetch the encryption key and configuration version.\n\nThe SDS service is for a `GenericSecret`. The data should populate `secrets`:\n\n\"encryption_key\" must contain the 16 byte encryption key.\n\n\"configuration_version\" must contain a 1 byte unsigned integer of value less than 7. See https://datatracker.ietf.org/doc/html/draft-ietf-quic-load-balancers#name-config-rotation.",
    "notImp": false
  },
  {
    "name": "unencrypted_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use the unencrypted mode. This is useful for testing or a simplified implementation of the downstream load balancer, but allows for linking different CIDs for the same connection, and leaks information about the valid server IDs in use. This mode does not comply with the RFC.\n\nNote that in this mode, `encryption_parameters` is still required because it contains ``configuration_version``, which is still needed. ``encryption_key`` can be set to ``inline_string: '0000000000000000'``.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "server_id_base64_encoded",
  "expected_server_id_length",
  "nonce_length_bytes",
  "unencrypted_mode"
];