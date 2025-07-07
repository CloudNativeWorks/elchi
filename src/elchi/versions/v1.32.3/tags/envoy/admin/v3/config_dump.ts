import {OutType} from '@/elchi/tags/tagsType';


export const ConfigDump: OutType = { "ConfigDump": [
  {
    "name": "configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any[]",
    "enums": null,
    "comment": "This list is serialized and dumped in its entirety at the `/config_dump` endpoint.\n\nThe following configurations are currently supported and will be dumped in the order given below:\n\n* ``bootstrap``: `BootstrapConfigDump` * ``clusters``: `ClustersConfigDump` * ``ecds_filter_http``: `EcdsConfigDump` * ``ecds_filter_quic_listener``: `EcdsConfigDump` * ``ecds_filter_tcp_listener``: `EcdsConfigDump` * ``endpoints``:  `EndpointsConfigDump` * ``listeners``: `ListenersConfigDump` * ``scoped_routes``: `ScopedRoutesConfigDump` * ``routes``:  `RoutesConfigDump` * ``secrets``:  `SecretsConfigDump`\n\nEDS Configuration will only be dumped by using parameter ``?include_eds``\n\nCurrently ECDS is supported in HTTP and listener filters. Note, ECDS configuration for either HTTP or listener filter will only be dumped if it is actually configured.\n\nYou can filter output with the resource and mask query parameters. See `/config_dump?resource={}`, `/config_dump?mask={}`, or `/config_dump?resource={},mask={}` for more information.",
    "notImp": false
  }
] };

export const BootstrapConfigDump: OutType = { "BootstrapConfigDump": [
  {
    "name": "bootstrap",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the BootstrapConfig was last updated.",
    "notImp": false
  }
] };

export const SecretsConfigDump: OutType = { "SecretsConfigDump": [
  {
    "name": "static_secrets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SecretsConfigDump_StaticSecret[]",
    "enums": null,
    "comment": "The statically loaded secrets.",
    "notImp": false
  },
  {
    "name": "dynamic_active_secrets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SecretsConfigDump_DynamicSecret[]",
    "enums": null,
    "comment": "The dynamically loaded active secrets. These are secrets that are available to service clusters or listeners.",
    "notImp": false
  },
  {
    "name": "dynamic_warming_secrets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SecretsConfigDump_DynamicSecret[]",
    "enums": null,
    "comment": "The dynamically loaded warming secrets. These are secrets that are currently undergoing warming in preparation to service clusters or listeners.",
    "notImp": false
  }
] };

export const SecretsConfigDump_DynamicSecret: OutType = { "SecretsConfigDump_DynamicSecret": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the secret.",
    "notImp": false
  },
  {
    "name": "version_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the per-resource version information.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the secret was last updated.",
    "notImp": false
  },
  {
    "name": "secret",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The actual secret information. Security sensitive information is redacted (replaced with \"[redacted]\") for private keys and passwords in TLS certificates.",
    "notImp": false
  },
  {
    "name": "error_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpdateFailureState",
    "enums": null,
    "comment": "Set if the last update failed, cleared after the next successful update. The *error_state* field contains the rejected version of this particular resource along with the reason and timestamp. For successfully updated or acknowledged resource, this field should be empty. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "client_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClientResourceStatus",
    "enums": [
      "UNKNOWN",
      "REQUESTED",
      "DOES_NOT_EXIST",
      "ACKED",
      "NACKED"
    ],
    "comment": "The client status of this resource. [#not-implemented-hide:]",
    "notImp": true
  }
] };

export const SecretsConfigDump_DynamicSecret_SingleFields = [
  "name",
  "version_info",
  "client_status"
];

export const SecretsConfigDump_StaticSecret: OutType = { "SecretsConfigDump_StaticSecret": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name assigned to the secret.",
    "notImp": false
  },
  {
    "name": "last_updated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the secret was last updated.",
    "notImp": false
  },
  {
    "name": "secret",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The actual secret information. Security sensitive information is redacted (replaced with \"[redacted]\") for private keys and passwords in TLS certificates.",
    "notImp": false
  }
] };

export const SecretsConfigDump_StaticSecret_SingleFields = [
  "name"
];