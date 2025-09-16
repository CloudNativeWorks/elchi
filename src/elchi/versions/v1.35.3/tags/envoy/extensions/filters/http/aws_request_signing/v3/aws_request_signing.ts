import {OutType} from '@elchi/tags/tagsType';


export const AwsRequestSigning_QueryString: OutType = { "AwsRequestSigning_QueryString": [
  {
    "name": "expiration_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional expiration time for the query string parameters. As query string parameter based requests are replayable, in effect representing an API call that has already been authenticated, it is recommended to keep this expiration time as short as feasible. This value will default to 5 seconds and has a maximum value of 3600 seconds (1 hour).",
    "notImp": false
  }
] };

export const AwsRequestSigning_QueryString_SingleFields = [
  "expiration_time"
];

export const AwsRequestSigning: OutType = { "AwsRequestSigning": [
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The `service namespace <https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-aws-service-namespaces>`_ of the HTTP endpoint.\n\nExample: s3",
    "notImp": false
  },
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional region string. If region is not provided, the region will be retrieved from the environment or AWS configuration files. See `config_http_filters_aws_request_signing_region` for more details.\n\nWhen signing_algorithm is set to ``AWS_SIGV4`` the region is a standard AWS `region <https://docs.aws.amazon.com/general/latest/gr/rande.html>`_ string for the service hosting the HTTP endpoint.\n\nExample: us-west-2\n\nWhen signing_algorithm is set to ``AWS_SIGV4A`` the region is used as a region set.\n\nA region set is a comma separated list of AWS regions, such as ``us-east-1,us-east-2`` or wildcard ``*`` or even region strings containing wildcards such as ``us-east-*``\n\nExample: '*'\n\nBy configuring a region set, a SigV4A signed request can be sent to multiple regions, rather than being valid for only a single region destination.",
    "notImp": false
  },
  {
    "name": "host_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that before signing headers, the host header will be swapped with this value. If not set or empty, the original host header value will be used and no rewrite will happen.\n\nNote: this rewrite affects both signing and host header forwarding. However, this option shouldn't be used with `HCM host rewrite` given that the value set here would be used for signing whereas the value set in the HCM would be used for host header forwarding which is not the desired outcome.",
    "notImp": false
  },
  {
    "name": "use_unsigned_payload",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Instead of buffering the request to calculate the payload hash, use the literal string ``UNSIGNED-PAYLOAD`` to calculate the payload hash. Not all services support this option. See the `S3 <https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-header-based-auth.html>`_ policy for details.",
    "notImp": false
  },
  {
    "name": "match_excluded_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "A list of request header string matchers that will be excluded from signing. The excluded header can be matched by any patterns defined in the StringMatcher proto (e.g. exact string, prefix, regex, etc).\n\nExample: match_excluded_headers: - prefix: x-envoy - exact: foo - exact: bar When applied, all headers that start with \"x-envoy\" and headers \"foo\" and \"bar\" will not be signed.",
    "notImp": false
  },
  {
    "name": "signing_algorithm",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsRequestSigning_SigningAlgorithm",
    "enums": [
      "AWS_SIGV4",
      "AWS_SIGV4A"
    ],
    "comment": "Optional Signing algorithm specifier, either ``AWS_SIGV4`` or ``AWS_SIGV4A``, defaulting to ``AWS_SIGV4``.",
    "notImp": false
  },
  {
    "name": "query_string",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsRequestSigning_QueryString",
    "enums": null,
    "comment": "If set, use the query string to store output of SigV4 or SigV4A calculation, rather than HTTP headers. The ``Authorization`` header will not be modified if ``query_string`` is configured.\n\nExample: query_string: {}",
    "notImp": false
  },
  {
    "name": "credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsCredentialProvider",
    "enums": null,
    "comment": "The credential provider for signing the request. This is optional and if not set, it will be retrieved using the procedure described in `config_http_filters_aws_request_signing`.",
    "notImp": false
  }
] };

export const AwsRequestSigning_SingleFields = [
  "service_name",
  "region",
  "host_rewrite",
  "use_unsigned_payload",
  "signing_algorithm"
];

export const AwsRequestSigningPerRoute: OutType = { "AwsRequestSigningPerRoute": [
  {
    "name": "aws_request_signing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsRequestSigning",
    "enums": null,
    "comment": "Override the global configuration of the filter with this new config. This overrides the entire message of AwsRequestSigning and not at field level.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting stats.",
    "notImp": false
  }
] };

export const AwsRequestSigningPerRoute_SingleFields = [
  "stat_prefix"
];