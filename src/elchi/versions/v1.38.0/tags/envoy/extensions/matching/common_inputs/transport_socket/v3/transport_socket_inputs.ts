import {OutType} from '@elchi/tags/tagsType';


export const EndpointMetadataInput: OutType = { "EndpointMetadataInput": [
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter name to retrieve the Struct from the endpoint metadata. If not specified, defaults to ``envoy.lb`` which is commonly used for load balancing metadata.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointMetadataInput_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the Value from the Struct.",
    "notImp": false
  }
] };

export const EndpointMetadataInput_SingleFields = [
  "filter"
];

export const EndpointMetadataInput_PathSegment: OutType = { "EndpointMetadataInput_PathSegment": [
  {
    "name": "segment.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, use the key to retrieve the value in a Struct.",
    "notImp": false
  }
] };

export const EndpointMetadataInput_PathSegment_SingleFields = [
  "segment.key"
];

export const LocalityMetadataInput: OutType = { "LocalityMetadataInput": [
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter name to retrieve the Struct from the locality metadata. If not specified, defaults to ``envoy.lb`` which is commonly used for load balancing metadata.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LocalityMetadataInput_PathSegment[]",
    "enums": null,
    "comment": "The path to retrieve the Value from the Struct.",
    "notImp": false
  }
] };

export const LocalityMetadataInput_SingleFields = [
  "filter"
];

export const LocalityMetadataInput_PathSegment: OutType = { "LocalityMetadataInput_PathSegment": [
  {
    "name": "segment.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, use the key to retrieve the value in a Struct.",
    "notImp": false
  }
] };

export const LocalityMetadataInput_PathSegment_SingleFields = [
  "segment.key"
];

export const FilterStateInput: OutType = { "FilterStateInput": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key of the filter state object to retrieve. The object must implement serializeAsString() to be used for matching.",
    "notImp": false
  }
] };

export const FilterStateInput_SingleFields = [
  "key"
];

export const TransportSocketNameAction: OutType = { "TransportSocketNameAction": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the transport socket to use. This name must reference a named transport socket in the cluster's transport_socket_matches.",
    "notImp": false
  }
] };

export const TransportSocketNameAction_SingleFields = [
  "name"
];