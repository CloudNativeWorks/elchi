import {OutType} from '@elchi/tags/tagsType';


export const EnvelopeSessionState_Header: OutType = { "EnvelopeSessionState_Header": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Iff the header specified by the ``name`` field is present in the response (assume the ``name`` is set to ``session-header`` and original header value is ``xxxxxx``), then the upstream host address and value of ``name`` field specified header will be encoded in following format and the output will be used to update the ``name`` field specified header in the response:\n\n.. code-block:: none\n\n  session-header: \"MS4yLjMuNDo4MAo=;UV:eHh4eHh4Cg==\" # base64(1.2.3.4:80);UV:base64(xxxxxx)\n\nThe ``UV`` (upstream value) part is used to store the original upstream header value of ``name`` field specified header.\n\nIf this mode is used then Envoy will assume that the header in the request will also be in the same format and will contain the ``UV`` part. This extension will parse the upstream host address and update the ``name`` field specified header in the request to the ``UV`` part.",
    "notImp": false
  }
] };

export const EnvelopeSessionState_Header_SingleFields = [
  "name"
];

export const EnvelopeSessionState: OutType = { "EnvelopeSessionState": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnvelopeSessionState_Header",
    "enums": null,
    "comment": "Set the header config to track the session state.",
    "notImp": false
  }
] };