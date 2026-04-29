import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "on_request_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateValue[]",
    "enums": null,
    "comment": "A sequence of the filter state values to apply in the specified order when a new request is received.",
    "notImp": false
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Clear the route cache for the current client request. This is necessary if the route configuration may depend on the filter state values set by this filter.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "clear_route_cache"
];