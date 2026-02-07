import {OutType} from '@elchi/tags/tagsType';


export const StatefulSession: OutType = { "StatefulSession": [
  {
    "name": "session_state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Specifies the implementation of session state. This session state is used to store and retrieve the address of the upstream host assigned to the session.\n\nextension-category: envoy.http.stateful_session",
    "notImp": false
  },
  {
    "name": "strict",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Determines whether the HTTP request must be strictly routed to the requested destination. When set to ``true``, if the requested destination is unavailable, Envoy will return a 503 status code. The default value is ``false``, which allows Envoy to fall back to its load balancing mechanism. In this case, if the requested destination is not found, the request will be routed according to the load balancing algorithm.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional stat prefix. If specified, the filter will emit statistics in the ``http.<stat_prefix>.stateful_session.<stat_prefix>.`` namespace. If not specified, no statistics will be emitted.\n\n:::note\n\nPer-route configuration overrides do not support statistics and will not emit stats even if this field is set in the per-route config.",
    "notImp": false
  }
] };

export const StatefulSession_SingleFields = [
  "strict",
  "stat_prefix"
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