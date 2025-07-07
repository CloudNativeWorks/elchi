import {OutType} from '@/elchi/tags/tagsType';


export const AllowListedRoutesConfig: OutType = { "AllowListedRoutesConfig": [
  {
    "name": "allowed_route_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The list of routes that's allowed as redirect target by this predicate, identified by the route's `name`. Empty route names are not allowed.",
    "notImp": false
  }
] };

export const AllowListedRoutesConfig_SingleFields = [
  "allowed_route_names"
];