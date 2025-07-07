import {OutType} from '@elchi/tags/tagsType';


export const RBAC_AuditLoggingOptions: OutType = { "RBAC_AuditLoggingOptions": [
  {
    "name": "audit_condition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_AuditLoggingOptions_AuditCondition",
    "enums": [
      "NONE",
      "ON_DENY",
      "ON_ALLOW",
      "ON_DENY_AND_ALLOW"
    ],
    "comment": "Condition for the audit logging to happen. If this condition is met, all the audit loggers configured here will be invoked.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "logger_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_AuditLoggingOptions_AuditLoggerConfig[]",
    "enums": null,
    "comment": "Configurations for RBAC-based authorization audit loggers.\n\n[#not-implemented-hide:]",
    "notImp": true
  }
] };

export const RBAC_AuditLoggingOptions_SingleFields = [
  "audit_condition"
];

export const RBAC: OutType = { "RBAC": [
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_Action",
    "enums": [
      "ALLOW",
      "DENY",
      "LOG"
    ],
    "comment": "The action to take if a policy matches. Every action either allows or denies a request, and can also carry out action-specific operations.\n\nActions:\n\n * ``ALLOW``: Allows the request if and only if there is a policy that matches the request. * ``DENY``: Allows the request if and only if there are no policies that match the request. * ``LOG``: Allows all requests. If at least one policy matches, the dynamic metadata key ``access_log_hint`` is set to the value ``true`` under the shared key namespace ``envoy.common``. If no policies match, it is set to ``false``. Other actions do not modify this key.",
    "notImp": false
  },
  {
    "name": "policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Policy>",
    "enums": null,
    "comment": "Maps from policy name to policy. A match occurs when at least one policy matches the request. The policies are evaluated in lexicographic order of the policy name.",
    "notImp": false
  },
  {
    "name": "audit_logging_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_AuditLoggingOptions",
    "enums": null,
    "comment": "Audit logging options that include the condition for audit logging to happen and audit logger configurations.\n\n[#not-implemented-hide:]",
    "notImp": true
  }
] };

export const RBAC_SingleFields = [
  "action"
];

export const RBAC_AuditLoggingOptions_AuditLoggerConfig: OutType = { "RBAC_AuditLoggingOptions_AuditLoggerConfig": [
  {
    "name": "audit_logger",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Typed logger configuration.\n\nextension-category: envoy.rbac.audit_loggers",
    "notImp": false
  },
  {
    "name": "is_optional",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, when the logger is not supported, the data plane will not NACK but simply ignore it.",
    "notImp": false
  }
] };

export const RBAC_AuditLoggingOptions_AuditLoggerConfig_SingleFields = [
  "is_optional"
];

export const Policy: OutType = { "Policy": [
  {
    "name": "permissions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Permission[]",
    "enums": null,
    "comment": "Required. The set of permissions that define a role. Each permission is matched with OR semantics. To match all actions for this policy, a single Permission with the ``any`` field set to true should be used.",
    "notImp": false
  },
  {
    "name": "principals",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Principal[]",
    "enums": null,
    "comment": "Required. The set of principals that are assigned/denied the role based on “action”. Each principal is matched with OR semantics. To match all downstreams for this policy, a single Principal with the ``any`` field set to true should be used.",
    "notImp": false
  },
  {
    "name": "condition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "An optional symbolic expression specifying an access control `condition`. The condition is combined with the permissions and the principals as a clause with AND semantics. Only be used when checked_condition is not used.",
    "notImp": false
  },
  {
    "name": "checked_condition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CheckedExpr",
    "enums": null,
    "comment": "[#not-implemented-hide:] An optional symbolic expression that has been successfully type checked. Only be used when condition is not used.",
    "notImp": true
  }
] };

export const RBAC_PoliciesEntry: OutType = { "RBAC_PoliciesEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Policy",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RBAC_PoliciesEntry_SingleFields = [
  "key"
];

export const SourcedMetadata: OutType = { "SourcedMetadata": [
  {
    "name": "metadata_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Metadata matcher configuration that defines what metadata to match against. This includes the filter name, metadata key path, and expected value.",
    "notImp": false
  },
  {
    "name": "metadata_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataSource",
    "enums": [
      "DYNAMIC",
      "ROUTE"
    ],
    "comment": "Specifies which metadata source should be used for matching. If not set, defaults to DYNAMIC (dynamic metadata). Set to ROUTE to match against static metadata configured on the route entry.",
    "notImp": false
  }
] };

export const SourcedMetadata_SingleFields = [
  "metadata_source"
];

export const Permission: OutType = { "Permission": [
  {
    "name": "rule.and_rules",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Permission_Set",
    "enums": null,
    "comment": "A set of rules that all must match in order to define the action.",
    "notImp": false
  },
  {
    "name": "rule.or_rules",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Permission_Set",
    "enums": null,
    "comment": "A set of rules where at least one must match in order to define the action.",
    "notImp": false
  },
  {
    "name": "rule.any",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When any is set, it matches any action.",
    "notImp": false
  },
  {
    "name": "rule.header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher",
    "enums": null,
    "comment": "A header (or pseudo-header such as `:path` or :method) on the incoming HTTP request. Only available for HTTP request. Note: the pseudo-header `:path` includes the query and fragment string. Use the ``url_path`` field if you want to match the URL path without the query and fragment string.",
    "notImp": false
  },
  {
    "name": "rule.url_path",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "PathMatcher",
    "enums": null,
    "comment": "A URL path on the incoming HTTP request. Only available for HTTP.",
    "notImp": false
  },
  {
    "name": "rule.destination_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CidrRange",
    "enums": null,
    "comment": "A CIDR block that describes the destination IP.",
    "notImp": false
  },
  {
    "name": "rule.destination_port",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A port number that describes the destination port connecting to.",
    "notImp": false
  },
  {
    "name": "rule.destination_port_range",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int32Range",
    "enums": null,
    "comment": "A port number range that describes a range of destination ports connecting to.",
    "notImp": false
  },
  {
    "name": "rule.metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Metadata that describes additional information about the action. This field is deprecated; please use `sourced_metadata` instead.",
    "notImp": false
  },
  {
    "name": "rule.not_rule",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Permission",
    "enums": null,
    "comment": "Negates matching the provided permission. For instance, if the value of ``not_rule`` would match, this permission would not match. Conversely, if the value of ``not_rule`` would not match, this permission would match.",
    "notImp": false
  },
  {
    "name": "rule.requested_server_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The request server from the client's connection request. This is typically TLS SNI.\n\n:::attention\n\nThe behavior of this field may be affected by how Envoy is configured as explained below. \n:::\n\n  * If the `TLS Inspector` filter is not added, and if a ``FilterChainMatch`` is not defined for the `server name`, a TLS connection's requested SNI server name will be treated as if it wasn't present.\n\n  * A `listener filter` may overwrite a connection's requested server name within Envoy.\n\nPlease refer to `this FAQ entry` to learn to setup SNI.",
    "notImp": false
  },
  {
    "name": "rule.matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension for configuring custom matchers for RBAC. extension-category: envoy.rbac.matchers",
    "notImp": false
  },
  {
    "name": "rule.uri_template",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "URI template path matching. extension-category: envoy.path.match",
    "notImp": false
  },
  {
    "name": "rule.sourced_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SourcedMetadata",
    "enums": null,
    "comment": "Matches against metadata from either dynamic state or route configuration. Preferred over the ``metadata`` field as it provides more flexibility in metadata source selection.",
    "notImp": false
  }
] };

export const Permission_SingleFields = [
  "rule.any",
  "rule.destination_port"
];

export const Permission_Set: OutType = { "Permission_Set": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Permission[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Principal: OutType = { "Principal": [
  {
    "name": "identifier.and_ids",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Principal_Set",
    "enums": null,
    "comment": "A set of identifiers that all must match in order to define the downstream.",
    "notImp": false
  },
  {
    "name": "identifier.or_ids",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Principal_Set",
    "enums": null,
    "comment": "A set of identifiers at least one must match in order to define the downstream.",
    "notImp": false
  },
  {
    "name": "identifier.any",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When any is set, it matches any downstream.",
    "notImp": false
  },
  {
    "name": "identifier.authenticated",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Principal_Authenticated",
    "enums": null,
    "comment": "Authenticated attributes that identify the downstream.",
    "notImp": false
  },
  {
    "name": "identifier.source_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CidrRange",
    "enums": null,
    "comment": "A CIDR block that describes the downstream IP. This address will honor proxy protocol, but will not honor XFF.\n\nThis field is deprecated; either use `remote_ip` for the same behavior, or use `direct_remote_ip`.",
    "notImp": false
  },
  {
    "name": "identifier.direct_remote_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CidrRange",
    "enums": null,
    "comment": "A CIDR block that describes the downstream remote/origin address. Note: This is always the physical peer even if the `remote_ip` is inferred from for example the x-forwarder-for header, proxy protocol, etc.",
    "notImp": false
  },
  {
    "name": "identifier.remote_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CidrRange",
    "enums": null,
    "comment": "A CIDR block that describes the downstream remote/origin address. Note: This may not be the physical peer and could be different from the `direct_remote_ip`. E.g, if the remote ip is inferred from for example the x-forwarder-for header, proxy protocol, etc.",
    "notImp": false
  },
  {
    "name": "identifier.header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher",
    "enums": null,
    "comment": "A header (or pseudo-header such as `:path` or :method) on the incoming HTTP request. Only available for HTTP request. Note: the pseudo-header `:path` includes the query and fragment string. Use the ``url_path`` field if you want to match the URL path without the query and fragment string.",
    "notImp": false
  },
  {
    "name": "identifier.url_path",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "PathMatcher",
    "enums": null,
    "comment": "A URL path on the incoming HTTP request. Only available for HTTP.",
    "notImp": false
  },
  {
    "name": "identifier.metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Metadata that describes additional information about the principal. This field is deprecated; please use `sourced_metadata` instead.",
    "notImp": false
  },
  {
    "name": "identifier.filter_state",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FilterStateMatcher",
    "enums": null,
    "comment": "Identifies the principal using a filter state object.",
    "notImp": false
  },
  {
    "name": "identifier.not_id",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Principal",
    "enums": null,
    "comment": "Negates matching the provided principal. For instance, if the value of ``not_id`` would match, this principal would not match. Conversely, if the value of ``not_id`` would not match, this principal would match.",
    "notImp": false
  },
  {
    "name": "identifier.sourced_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SourcedMetadata",
    "enums": null,
    "comment": "Matches against metadata from either dynamic state or route configuration. Preferred over the ``metadata`` field as it provides more flexibility in metadata source selection.",
    "notImp": false
  }
] };

export const Principal_SingleFields = [
  "identifier.any"
];

export const Principal_Set: OutType = { "Principal_Set": [
  {
    "name": "ids",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Principal[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Principal_Authenticated: OutType = { "Principal_Authenticated": [
  {
    "name": "principal_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The name of the principal. If set, The URI SAN or DNS SAN in that order is used from the certificate, otherwise the subject field is used. If unset, it applies to any user that is authenticated.",
    "notImp": false
  }
] };

export const Action: OutType = { "Action": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name indicates the policy name.",
    "notImp": false
  },
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RBAC_Action",
    "enums": [
      "ALLOW",
      "DENY",
      "LOG"
    ],
    "comment": "The action to take if the matcher matches. Every action either allows or denies a request, and can also carry out action-specific operations.\n\nActions:\n\n * ``ALLOW``: If the request gets matched on ALLOW, it is permitted. * ``DENY``: If the request gets matched on DENY, it is not permitted. * ``LOG``: If the request gets matched on LOG, it is permitted. Besides, the dynamic metadata key ``access_log_hint`` under the shared key namespace ``envoy.common`` will be set to the value ``true``. * If the request cannot get matched, it will fallback to ``DENY``.\n\nLog behavior:\n\n If the RBAC matcher contains at least one LOG action, the dynamic metadata key ``access_log_hint`` will be set based on if the request get matched on the LOG action.",
    "notImp": false
  }
] };

export const Action_SingleFields = [
  "name",
  "action"
];