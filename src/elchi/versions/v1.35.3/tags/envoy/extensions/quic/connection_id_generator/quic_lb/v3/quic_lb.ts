import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "unsafe_unencrypted_testing_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use the unencrypted mode. This is useful for testing, but allows for linking different CIDs for the same connection, and leaks information about the valid server IDs in use. This should only be used for testing.",
    "notImp": false
  },
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
  }
] };

export const Config_SingleFields = [
  "unsafe_unencrypted_testing_mode",
  "expected_server_id_length",
  "nonce_length_bytes"
];