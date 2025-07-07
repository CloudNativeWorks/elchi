import {OutType} from '@/elchi/tags/tagsType';


export const Squash: OutType = { "Squash": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cluster that hosts the Squash server.",
    "notImp": false
  },
  {
    "name": "attachment_template",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "When the filter requests the Squash server to create a DebugAttachment, it will use this structure as template for the body of the request. It can contain reference to environment variables in the form of '{{ ENV_VAR_NAME }}'. These can be used to provide the Squash server with more information to find the process to attach the debugger to. For example, in a Istio/k8s environment, this will contain information on the pod:\n\n```json\n\n {\n   \"spec\": {\n     \"attachment\": {\n       \"pod\": \"{{ POD_NAME }}\",\n       \"namespace\": \"{{ POD_NAMESPACE }}\"\n     },\n     \"match_request\": true\n   }\n }\n```\n\n(where POD_NAME, POD_NAMESPACE are configured in the pod via the Downward API)",
    "notImp": false
  },
  {
    "name": "request_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout for individual requests sent to the Squash cluster. Defaults to 1 second.",
    "notImp": false
  },
  {
    "name": "attachment_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The total timeout Squash will delay a request and wait for it to be attached. Defaults to 60 seconds.",
    "notImp": false
  },
  {
    "name": "attachment_poll_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Amount of time to poll for the status of the attachment object in the Squash server (to check if has been attached). Defaults to 1 second.",
    "notImp": false
  }
] };

export const Squash_SingleFields = [
  "cluster",
  "request_timeout",
  "attachment_timeout",
  "attachment_poll_period"
];