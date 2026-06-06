import {OutType} from '@elchi/tags/tagsType';


export const XRayConfig_SegmentFields: OutType = { "XRayConfig_SegmentFields": [
  {
    "name": "origin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The type of AWS resource, e.g. \"AWS::AppMesh::Proxy\".",
    "notImp": false
  },
  {
    "name": "aws",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "AWS resource metadata dictionary. See: `X-Ray Segment Document documentation <https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html#api-segmentdocuments-aws>`__",
    "notImp": false
  }
] };

export const XRayConfig_SegmentFields_SingleFields = [
  "origin"
];

export const XRayConfig: OutType = { "XRayConfig": [
  {
    "name": "daemon_endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "The UDP endpoint of the X-Ray Daemon where the spans will be sent. If this value is not set, the default value of 127.0.0.1:2000 will be used.",
    "notImp": false
  },
  {
    "name": "segment_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the X-Ray segment.",
    "notImp": false
  },
  {
    "name": "sampling_rule_manifest",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The location of a local custom sampling rules JSON file. For an example of the sampling rules see: `X-Ray SDK documentation <https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-go-configuration.html#xray-sdk-go-configuration-sampling>`_",
    "notImp": false
  },
  {
    "name": "segment_fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "XRayConfig_SegmentFields",
    "enums": null,
    "comment": "Optional custom fields to be added to each trace segment. see: `X-Ray Segment Document documentation <https://docs.aws.amazon.com/xray/latest/devguide/xray-api-segmentdocuments.html>`__",
    "notImp": false
  }
] };

export const XRayConfig_SingleFields = [
  "segment_name"
];