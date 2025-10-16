import {OutType} from '@elchi/tags/tagsType';


export const OmitHostMetadataConfig: OutType = { "OmitHostMetadataConfig": [
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Retry host predicate metadata match criteria. The hosts in the upstream cluster with matching metadata will be omitted while attempting a retry of a failed request. The metadata should be specified under the ``envoy.lb`` key.",
    "notImp": false
  }
] };