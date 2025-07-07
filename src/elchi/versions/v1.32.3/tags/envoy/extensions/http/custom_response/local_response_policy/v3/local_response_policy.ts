import {OutType} from '@/elchi/tags/tagsType';


export const LocalResponsePolicy: OutType = { "LocalResponsePolicy": [
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Optional new local reply body text. It will be used in the ``%LOCAL_REPLY_BODY%`` command operator in the ``body_format``.",
    "notImp": false
  },
  {
    "name": "body_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Optional body format to be used for this response. If ``body_format`` is  not provided, and ``body`` is, the contents of ``body`` will be used to populate the body of the local reply without formatting.",
    "notImp": false
  },
  {
    "name": "status_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The new response status code if specified.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "HTTP headers to add to the response. This allows the response policy to append, to add or to override headers of the original response for local body, or the custom response from the remote body, before it is sent to a downstream client.",
    "notImp": false
  }
] };

export const LocalResponsePolicy_SingleFields = [
  "status_code"
];