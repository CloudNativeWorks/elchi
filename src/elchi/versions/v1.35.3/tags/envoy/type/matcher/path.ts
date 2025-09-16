import {OutType} from '@elchi/tags/tagsType';


export const PathMatcher: OutType = { "PathMatcher": [
  {
    "name": "rule.path",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The `path` must match the URL path portion of the `:path` header. The query and fragment string (if present) are removed in the URL path portion. For example, the path * /data* will match the *:path* header * /data#fragment?param=value*.",
    "notImp": false
  }
] };