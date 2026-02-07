import {OutType} from '@elchi/tags/tagsType';


export const DescriptorSet: OutType = { "DescriptorSet": [
  {
    "name": "data_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "It could be passed by a local file through ``Datasource.filename`` or embedded in the ``Datasource.inline_bytes``.",
    "notImp": false
  }
] };

export const Restrictions: OutType = { "Restrictions": [
  {
    "name": "method_restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MethodRestrictions>",
    "enums": null,
    "comment": "Specifies the method restrictions. Key - Fully qualified method name e.g., ``endpoints.examples.bookstore.BookStore/GetShelf``. Value - Method restrictions.",
    "notImp": false
  },
  {
    "name": "message_restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MessageRestrictions>",
    "enums": null,
    "comment": "Specifies the message restrictions. Key - Fully qualified message name e.g., ``endpoints.examples.bookstore.Book``. Value - Message restrictions.",
    "notImp": false
  }
] };

export const ProtoApiScrubberConfig: OutType = { "ProtoApiScrubberConfig": [
  {
    "name": "descriptor_set",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DescriptorSet",
    "enums": null,
    "comment": "The proto descriptor set for the proto services.",
    "notImp": false
  },
  {
    "name": "restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Restrictions",
    "enums": null,
    "comment": "Contains the restrictions for the supported proto elements.",
    "notImp": false
  },
  {
    "name": "filtering_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtoApiScrubberConfig_FilteringMode",
    "enums": [],
    "comment": "Specifies the filtering mode of this filter.",
    "notImp": false
  }
] };

export const ProtoApiScrubberConfig_SingleFields = [
  "filtering_mode"
];

export const RestrictionConfig: OutType = { "RestrictionConfig": [
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "Matcher tree for matching requests and responses with the configured restrictions.",
    "notImp": false
  }
] };

export const MethodRestrictions: OutType = { "MethodRestrictions": [
  {
    "name": "request_field_restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, RestrictionConfig>",
    "enums": null,
    "comment": "Restrictions that apply to request fields of the method. Key - field mask like path of the field e.g., foo.bar.baz Value - Restrictions map containing the mapping from restriction name to the restriction values.",
    "notImp": false
  },
  {
    "name": "response_field_restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, RestrictionConfig>",
    "enums": null,
    "comment": "Restrictions that apply to response fields of the method. Key - field mask like path of the field e.g., foo.bar.baz Value - Restrictions map containing the mapping from restriction name to the restriction values.",
    "notImp": false
  },
  {
    "name": "method_restriction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RestrictionConfig",
    "enums": null,
    "comment": "Optional restriction that applies to the entire method. If present, this rule takes precedence for the method itself over field-level or message-level rules. The 'matcher' within RestrictionConfig will determine if the method is denied/scrubbed. If the matcher evaluates to true:\n\n- The request is **denied**, and further processing is stopped. - The implementation should generate an immediate error response (e.g., an HTTP 403 Forbidden status) and send it to the client.",
    "notImp": false
  }
] };

export const Restrictions_MethodRestrictionsEntry: OutType = { "Restrictions_MethodRestrictionsEntry": [
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
    "fieldType": "MethodRestrictions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Restrictions_MethodRestrictionsEntry_SingleFields = [
  "key"
];

export const MessageRestrictions: OutType = { "MessageRestrictions": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RestrictionConfig",
    "enums": null,
    "comment": "The core restriction to apply to this message type. The 'matcher' within RestrictionConfig will determine if the message is scrubbed/denied/allowed.",
    "notImp": false
  },
  {
    "name": "field_restrictions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, RestrictionConfig>",
    "enums": null,
    "comment": "Restrictions that apply to specific fields within this message type. Key - field mask (e.g. \"social_security_number\"). Value - The restriction configuration for that field.",
    "notImp": false
  }
] };

export const Restrictions_MessageRestrictionsEntry: OutType = { "Restrictions_MessageRestrictionsEntry": [
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
    "fieldType": "MessageRestrictions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Restrictions_MessageRestrictionsEntry_SingleFields = [
  "key"
];

export const MethodRestrictions_RequestFieldRestrictionsEntry: OutType = { "MethodRestrictions_RequestFieldRestrictionsEntry": [
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
    "fieldType": "RestrictionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MethodRestrictions_RequestFieldRestrictionsEntry_SingleFields = [
  "key"
];

export const MethodRestrictions_ResponseFieldRestrictionsEntry: OutType = { "MethodRestrictions_ResponseFieldRestrictionsEntry": [
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
    "fieldType": "RestrictionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MethodRestrictions_ResponseFieldRestrictionsEntry_SingleFields = [
  "key"
];

export const MessageRestrictions_FieldRestrictionsEntry: OutType = { "MessageRestrictions_FieldRestrictionsEntry": [
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
    "fieldType": "RestrictionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MessageRestrictions_FieldRestrictionsEntry_SingleFields = [
  "key"
];