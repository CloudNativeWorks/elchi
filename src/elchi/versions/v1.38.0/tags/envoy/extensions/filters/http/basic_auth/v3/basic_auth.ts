import {OutType} from '@elchi/tags/tagsType';


export const BasicAuth: OutType = { "BasicAuth": [
  {
    "name": "users",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Username-password pairs used to verify user credentials in the \"Authorization\" header. The value needs to be the htpasswd format. Reference to https://httpd.apache.org/docs/2.4/programs/htpasswd.html",
    "notImp": false
  },
  {
    "name": "forward_username_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field specifies the header name to forward a successfully authenticated user to the backend. The header will be added to the request with the username as the value.\n\nIf it is not specified, the username will not be forwarded.",
    "notImp": false
  },
  {
    "name": "authentication_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field specifies the request header to load the basic credential from.\n\nIf it is not specified, the filter loads the credential from  the \"Authorization\" header.",
    "notImp": false
  }
] };

export const BasicAuth_SingleFields = [
  "forward_username_header",
  "authentication_header"
];

export const BasicAuthPerRoute: OutType = { "BasicAuthPerRoute": [
  {
    "name": "users",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Username-password pairs for this route.",
    "notImp": false
  }
] };