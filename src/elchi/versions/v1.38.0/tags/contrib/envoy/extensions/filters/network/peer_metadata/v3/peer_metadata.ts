import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "baggage_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Filter state key under which the baggage value encoding the proxy workload is stored. The upstream filter that populates the baggage header in the HBONE request should use the same key.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "baggage_key"
];