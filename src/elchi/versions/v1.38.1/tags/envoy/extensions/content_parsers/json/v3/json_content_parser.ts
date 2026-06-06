import {OutType} from '@elchi/tags/tagsType';


export const JsonContentParser: OutType = { "JsonContentParser": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonContentParser_RuleConfig[]",
    "enums": null,
    "comment": "The rules to apply for extracting values from JSON content. Rules are evaluated in order for each content item provided. At least one rule must be specified.",
    "notImp": false
  }
] };

export const JsonContentParser_RuleConfig: OutType = { "JsonContentParser_RuleConfig": [
  {
    "name": "rule",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "JsonToMetadata_Rule",
    "enums": null,
    "comment": "The json-to-metadata rule to apply for extracting values from JSON content. See `json_to_metadata rule` for available configuration options including selectors, on_present, on_missing, on_error actions.",
    "notImp": false
  },
  {
    "name": "stop_processing_after_matches",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Controls how many times this rule should successfully match before stopping evaluation of this rule for subsequent content items.\n\n- If set to 0 (default): This rule is evaluated against all content items provided. Later matches may overwrite earlier values (unless `preserve_existing_metadata_value` is set in the rule), effectively extracting the LAST occurrence.\n\n- If set to 1: Stop evaluating this rule after the first successful match. This is useful for extracting values that appear early in the stream to avoid unnecessary processing of subsequent content.\n\n- If set to N > 1: Reserved for future use (e.g., aggregating multiple values). Values > 1 are currently rejected to prevent behavioral changes when this feature is implemented.\n\nExample use cases:\n\n- Extract model name from early content: ``stop_processing_after_matches: 1`` (Stops checking this rule after first match, doesn't process remaining content for this rule)\n\n- Extract token usage from final content: ``stop_processing_after_matches: 0`` (Processes all content items, extracts value from the last one that contains it)",
    "notImp": false
  }
] };

export const JsonContentParser_RuleConfig_SingleFields = [
  "stop_processing_after_matches"
];