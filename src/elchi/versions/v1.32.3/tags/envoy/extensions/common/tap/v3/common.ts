import {OutType} from '@/elchi/tags/tagsType';


export const CommonExtensionConfig: OutType = { "CommonExtensionConfig": [
  {
    "name": "config_type.admin_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AdminConfig",
    "enums": null,
    "comment": "If specified, the tap filter will be configured via an admin handler.",
    "notImp": false
  },
  {
    "name": "config_type.static_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TapConfig",
    "enums": null,
    "comment": "If specified, the tap filter will be configured via a static configuration that cannot be changed.",
    "notImp": false
  }
] };

export const AdminConfig: OutType = { "AdminConfig": [
  {
    "name": "config_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Opaque configuration ID. When requests are made to the admin handler, the passed opaque ID is matched to the configured filter opaque ID to determine which filter to configure.",
    "notImp": false
  }
] };

export const AdminConfig_SingleFields = [
  "config_id"
];