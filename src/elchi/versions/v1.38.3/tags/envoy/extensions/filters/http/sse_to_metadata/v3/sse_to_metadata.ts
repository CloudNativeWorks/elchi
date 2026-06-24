import {OutType} from '@elchi/tags/tagsType';


export const SseToMetadata_ProcessingRules: OutType = { "SseToMetadata_ProcessingRules": [
  {
    "name": "content_parser",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Content parser configuration for parsing event content and extracting metadata.\n\nThe content parser specifies: - How to parse the event data (e.g., JSON, XML, plaintext) - Which values to extract from the parsed content (e.g., JSON paths like usage.total_tokens) - How to map extracted values to metadata (namespace, key, type conversions) - When to write metadata (on_present, on_missing, on_error actions) extension-category: envoy.content_parsers",
    "notImp": false
  },
  {
    "name": "max_event_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum size in bytes for a single SSE event before it's considered invalid and discarded. This protects against unbounded memory growth from malicious or malformed streams that never send event delimiters (blank lines).\n\nDefault is 8192 bytes (8KB), which is sufficient for most legitimate events. Set to 0 to disable the limit (not recommended for production). Maximum allowed value is 10485760 bytes (10MB).",
    "notImp": false
  }
] };

export const SseToMetadata_ProcessingRules_SingleFields = [
  "max_event_size"
];

export const SseToMetadata: OutType = { "SseToMetadata": [
  {
    "name": "response_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SseToMetadata_ProcessingRules",
    "enums": null,
    "comment": "Rules for processing SSE response streams.",
    "notImp": false
  }
] };