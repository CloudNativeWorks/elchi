import {OutType} from '@elchi/tags/tagsType';


export const RocketmqProxy: OutType = { "RocketmqProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics.",
    "notImp": false
  },
  {
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration",
    "enums": null,
    "comment": "The route table for the connection manager is specified in this property.",
    "notImp": false
  },
  {
    "name": "transient_object_life_span",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The largest duration transient object expected to live, more than 10s is recommended.",
    "notImp": false
  },
  {
    "name": "develop_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If develop_mode is enabled, this proxy plugin may work without dedicated traffic intercepting facility without considering backward compatibility of exiting RocketMQ client SDK.",
    "notImp": false
  }
] };

export const RocketmqProxy_SingleFields = [
  "stat_prefix",
  "transient_object_life_span",
  "develop_mode"
];