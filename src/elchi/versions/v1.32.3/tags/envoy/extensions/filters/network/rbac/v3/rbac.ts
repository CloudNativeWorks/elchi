import {OutType} from '@/elchi/tags/tagsType';


export const RBAC: OutType = { "RBAC": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "Specify the RBAC rules to be applied globally. If absent, no enforcing RBAC policy will be applied. If present and empty, DENY. If both rules and matcher are configured, rules will be ignored.",
    "notImp": false
  },
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving RBAC action for incoming connections. Connections do not match any matcher will be denied. If absent, no enforcing RBAC matcher will be applied. If present and empty, deny all connections.",
    "notImp": false
  },
  {
    "name": "shadow_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "Shadow rules are not enforced by the filter but will emit stats and logs and can be used for rule testing. If absent, no shadow RBAC policy will be applied. If both shadow rules and shadow matcher are configured, shadow rules will be ignored.",
    "notImp": false
  },
  {
    "name": "shadow_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use for emitting stats and logs which can be used for rule testing for incoming connections. If absent, no shadow matcher will be applied.",
    "notImp": false
  },
  {
    "name": "shadow_rules_stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, shadow rules will emit stats with the given prefix. This is useful to distinguish the stat when there are more than 1 RBAC filter configured with shadow rules.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting statistics.",
    "notImp": false
  },
  {
    "name": "enforcement_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_EnforcementType",
    "enums": [
      "ONE_TIME_ON_FIRST_BYTE",
      "CONTINUOUS"
    ],
    "comment": "RBAC enforcement strategy. By default RBAC will be enforced only once when the first byte of data arrives from the downstream. When used in conjunction with filters that emit dynamic metadata after decoding every payload (e.g., Mongo, MySQL, Kafka) set the enforcement type to CONTINUOUS to enforce RBAC policies on every message boundary.",
    "notImp": false
  }
] };

export const RBAC_SingleFields = [
  "shadow_rules_stat_prefix",
  "stat_prefix",
  "enforcement_type"
];