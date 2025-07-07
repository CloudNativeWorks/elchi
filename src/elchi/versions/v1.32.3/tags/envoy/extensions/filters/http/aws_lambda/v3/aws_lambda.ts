import {OutType} from '@/elchi/tags/tagsType';


export const Credentials: OutType = { "Credentials": [
  {
    "name": "access_key_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "AWS access key id.",
    "notImp": false
  },
  {
    "name": "secret_access_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "AWS secret access key.",
    "notImp": false
  },
  {
    "name": "session_token",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "AWS session token. This parameter is optional. If it is set to empty string it will not be consider in the request. It is required if temporary security credentials retrieved directly from AWS STS operations are used.",
    "notImp": false
  }
] };

export const Credentials_SingleFields = [
  "access_key_id",
  "secret_access_key",
  "session_token"
];

export const Config: OutType = { "Config": [
  {
    "name": "arn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The ARN of the AWS Lambda to invoke when the filter is engaged Must be in the following format: arn:<partition>:lambda:<region>:<account-number>:function:<function-name>",
    "notImp": false
  },
  {
    "name": "payload_passthrough",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to transform the request (headers and body) to a JSON payload or pass it as is.",
    "notImp": false
  },
  {
    "name": "invocation_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_InvocationMode",
    "enums": [
      "SYNCHRONOUS",
      "ASYNCHRONOUS"
    ],
    "comment": "Determines the way to invoke the Lambda function.",
    "notImp": false
  },
  {
    "name": "host_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that before signing headers, the host header will be swapped with this value. If not set or empty, the original host header value will be used and no rewrite will happen.\n\nNote: this rewrite affects both signing and host header forwarding. However, this option shouldn't be used with `HCM host rewrite` given that the value set here would be used for signing whereas the value set in the HCM would be used for host header forwarding which is not the desired outcome. Changing the value of the host header can result in a different route to be selected if an HTTP filter after AWS lambda re-evaluates the route (clears route cache).",
    "notImp": false
  },
  {
    "name": "credentials_profile",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the credentials profile to be used from the AWS credentials file. This parameter is optional. If set, it will override the value set in the AWS_PROFILE env variable and the provider chain is limited to the AWS credentials file Provider. If credentials configuration is provided, this configuration will be ignored. If this field is provided, then the default providers chain specified in the documentation will be ignored. (See `default credentials providers`).",
    "notImp": false
  },
  {
    "name": "credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Credentials",
    "enums": null,
    "comment": "Specifies the credentials to be used. This parameter is optional and if it is set, it will override other providers and will take precedence over credentials_profile. The provider chain is limited to the configuration credentials provider. If this field is provided, then the default providers chain specified in the documentation will be ignored. (See `default credentials providers`).\n\n:::warning\nDistributing the AWS credentials via this configuration should not be done in production.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "arn",
  "payload_passthrough",
  "invocation_mode",
  "host_rewrite",
  "credentials_profile"
];

export const PerRouteConfig: OutType = { "PerRouteConfig": [
  {
    "name": "invoke_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };