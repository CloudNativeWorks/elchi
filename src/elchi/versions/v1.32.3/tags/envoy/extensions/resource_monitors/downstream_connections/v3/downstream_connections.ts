import {OutType} from '@/elchi/tags/tagsType';


export const DownstreamConnectionsConfig: OutType = { "DownstreamConnectionsConfig": [
  {
    "name": "max_active_downstream_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum threshold for global open downstream connections, defaults to 0. If monitor is enabled in Overload manager api, this field should be explicitly configured with value greater than 0.",
    "notImp": false
  }
] };

export const DownstreamConnectionsConfig_SingleFields = [
  "max_active_downstream_connections"
];