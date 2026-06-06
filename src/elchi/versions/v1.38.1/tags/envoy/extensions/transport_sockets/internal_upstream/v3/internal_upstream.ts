import {OutType} from '@elchi/tags/tagsType';


export const InternalUpstreamTransport: OutType = { "InternalUpstreamTransport": [
  {
    "name": "passthrough_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "InternalUpstreamTransport_MetadataValueSource[]",
    "enums": null,
    "comment": "Specifies the metadata namespaces and values to insert into the downstream internal connection dynamic metadata when an internal address is used as a host. If the destination name is repeated across two metadata source locations, and both locations contain the metadata with the given name, then the latter in the list overrides the former.",
    "notImp": false
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The underlying transport socket being wrapped.",
    "notImp": false
  }
] };

export const InternalUpstreamTransport_MetadataValueSource: OutType = { "InternalUpstreamTransport_MetadataValueSource": [
  {
    "name": "kind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKind",
    "enums": null,
    "comment": "Specifies what kind of metadata.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name is the filter namespace used in the dynamic metadata.",
    "notImp": false
  }
] };

export const InternalUpstreamTransport_MetadataValueSource_SingleFields = [
  "name"
];