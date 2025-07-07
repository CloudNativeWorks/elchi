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
    "name": "rules_stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, rules will emit stats with the given prefix. This is useful to distinguish the stat when there are more than 1 RBAC filter configured with rules.",
    "notImp": false
  },
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving RBAC action for incoming requests. Requests do not match any matcher will be denied. If absent, no enforcing RBAC matcher will be applied. If present and empty, deny all requests.",
    "notImp": false
  },
  {
    "name": "shadow_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "Shadow rules are not enforced by the filter (i.e., returning a 403) but will emit stats and logs and can be used for rule testing. If absent, no shadow RBAC policy will be applied. If both shadow rules and shadow matcher are configured, shadow rules will be ignored.",
    "notImp": false
  },
  {
    "name": "shadow_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use for emitting stats and logs which can be used for rule testing for incoming requests. If absent, no shadow matcher will be applied.",
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
    "name": "track_per_rule_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If track_per_rule_stats is true, counters will be published for each rule and shadow rule.",
    "notImp": false
  }
] };

export const RBAC_SingleFields = [
  "rules_stat_prefix",
  "shadow_rules_stat_prefix",
  "track_per_rule_stats"
];

export const RBACPerRoute: OutType = { "RBACPerRoute": [
  {
    "name": "rbac",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "Override the global configuration of the filter with this new config. If absent, the global RBAC policy will be disabled for this route.",
    "notImp": false
  }
] };