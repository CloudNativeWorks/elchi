import {OutType} from '@elchi/tags/tagsType';


export const SaveProcessingResponse_SaveOptions: OutType = { "SaveProcessingResponse_SaveOptions": [
  {
    "name": "save_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether or not to save the response for the response type.",
    "notImp": false
  },
  {
    "name": "save_on_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When true, saves the response if there was an error when processing the response from the external processor.",
    "notImp": false
  }
] };

export const SaveProcessingResponse_SaveOptions_SingleFields = [
  "save_response",
  "save_on_error"
];

export const SaveProcessingResponse: OutType = { "SaveProcessingResponse": [
  {
    "name": "filter_state_name_suffix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The default filter state name is \"envoy.http.ext_proc.response_processors.save_processing_response\". If defined, ``filter_state_name_suffix`` is appended to this. For example, setting ``filter_state_name_suffix`` to \"xyz\" will set the filter state name to \"envoy.http.ext_proc.response_processors.save_processing_response.xyz\"",
    "notImp": false
  },
  {
    "name": "save_request_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SaveProcessingResponse_SaveOptions",
    "enums": null,
    "comment": "Save the response to filter state when `request_headers` is set.",
    "notImp": false
  },
  {
    "name": "save_response_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SaveProcessingResponse_SaveOptions",
    "enums": null,
    "comment": "Save the response to filter state when `response_headers` is set.",
    "notImp": false
  },
  {
    "name": "save_request_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SaveProcessingResponse_SaveOptions",
    "enums": null,
    "comment": "Save the response to filter state when `request_trailers` is set.",
    "notImp": false
  },
  {
    "name": "save_response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SaveProcessingResponse_SaveOptions",
    "enums": null,
    "comment": "Save the response to filter state when `response_trailers` is set.",
    "notImp": false
  },
  {
    "name": "save_immediate_response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SaveProcessingResponse_SaveOptions",
    "enums": null,
    "comment": "Save the response to filter state when `immediate_response` is set.",
    "notImp": false
  }
] };

export const SaveProcessingResponse_SingleFields = [
  "filter_state_name_suffix"
];