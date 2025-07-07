import {OutType} from '@/elchi/tags/tagsType';


export const StatefulSession: OutType = { "StatefulSession": [
  {
    "name": "session_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Specific implementation of session state. This session state will be used to store and get address of the upstream host to which the session is assigned.\n\nextension-category: envoy.http.stateful_session",
    "notImp": false
  },
  {
    "name": "strict",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to True, the HTTP request must be routed to the requested destination. If the requested destination is not available, Envoy returns 503. Defaults to False.",
    "notImp": false
  }
] };

export const StatefulSession_SingleFields = [
  "strict"
];

export const StatefulSessionPerRoute: OutType = { "StatefulSessionPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable the stateful session filter for this particular vhost or route. If disabled is specified in multiple per-filter-configs, the most specific one will be used.",
    "notImp": false
  },
  {
    "name": "override.stateful_session",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StatefulSession",
    "enums": null,
    "comment": "Per-route stateful session configuration that can be served by RDS or static route table.",
    "notImp": false
  }
] };

export const StatefulSessionPerRoute_SingleFields = [
  "override.disabled"
];