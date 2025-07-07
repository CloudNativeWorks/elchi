import {OutType} from '@elchi/tags/tagsType';


export const AwsIamConfig: OutType = { "AwsIamConfig": [
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The `service namespace <https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-aws-service-namespaces>`_ of the Grpc endpoint.\n\nExample: appmesh",
    "notImp": false
  },
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The `region <https://docs.aws.amazon.com/general/latest/gr/rande.html>`_ hosting the Grpc endpoint. If unspecified, the extension will use the value in the ``AWS_REGION`` environment variable.\n\nExample: us-west-2",
    "notImp": false
  }
] };