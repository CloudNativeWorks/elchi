import {OutType} from '@elchi/tags/tagsType';


export const RBAC: OutType = { "RBAC": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "The primary RBAC policy which will be applied globally, to all the incoming requests.\n\n* If absent, no RBAC enforcement occurs. * If set but empty, all requests are denied.\n\n:::note\n\nWhen both ``rules`` and ``matcher`` are configured, ``rules`` will be ignored.",
    "notImp": false
  },
  {
    "name": "rules_stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, rules will emit stats with the given prefix. This is useful for distinguishing metrics when multiple RBAC filters are configured.",
    "notImp": false
  },
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "Match tree for evaluating RBAC actions on incoming requests. Requests not matching any matcher will be denied.\n\n* If absent, no RBAC enforcement occurs. * If set but empty, all requests are denied.",
    "notImp": false
  },
  {
    "name": "shadow_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC",
    "enums": null,
    "comment": "Shadow policy for testing RBAC rules without enforcing them. These rules generate stats and logs but do not deny requests. If absent, no shadow RBAC policy will be applied.\n\n:::note\n\nWhen both ``shadow_rules`` and ``shadow_matcher`` are configured, ``shadow_rules`` will be ignored.",
    "notImp": false
  },
  {
    "name": "shadow_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "If absent, no shadow matcher will be applied. Match tree for testing RBAC rules through stats and logs without enforcing them. If absent, no shadow matching occurs.",
    "notImp": false
  },
  {
    "name": "shadow_rules_stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, shadow rules will emit stats with the given prefix. This is useful for distinguishing metrics when multiple RBAC filters use shadow rules.",
    "notImp": false
  },
  {
    "name": "track_per_rule_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If ``track_per_rule_stats`` is ``true``, counters will be published for each rule and shadow rule.",
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
    "comment": "Per-route specific RBAC configuration that overrides the global RBAC configuration. If absent, RBAC policy will be disabled for this route.",
    "notImp": false
  }
] };