import {OutType} from '@/elchi/tags/tagsType';


export const TlvsMetadata: OutType = { "TlvsMetadata": [
  {
    "name": "typed_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Uint8Array<ArrayBufferLike>>",
    "enums": null,
    "comment": "Typed metadata for `Proxy protocol filter`, that represents a map of TLVs. Each entry in the map consists of a key which corresponds to a configured `rule key` and a value (TLV value in bytes). When runtime flag ``envoy.reloadable_features.use_typed_metadata_in_proxy_protocol_listener`` is enabled, `Proxy protocol filter` will populate typed metadata and regular metadata. By default filter will populate typed and untyped metadata.",
    "notImp": false
  }
] };

export const TlvsMetadata_TypedMetadataEntry: OutType = { "TlvsMetadata_TypedMetadataEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const TlvsMetadata_TypedMetadataEntry_SingleFields = [
  "key"
];