import {OutType} from '@elchi/tags/tagsType';


export const HttpStatus: OutType = { "HttpStatus": [
  {
    "name": "code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StatusCode",
    "enums": [
      "Empty",
      "Continue",
      "OK",
      "Created",
      "Accepted",
      "NonAuthoritativeInformation",
      "NoContent",
      "ResetContent",
      "PartialContent",
      "MultiStatus",
      "AlreadyReported",
      "IMUsed",
      "MultipleChoices",
      "MovedPermanently",
      "Found",
      "SeeOther",
      "NotModified",
      "UseProxy",
      "TemporaryRedirect",
      "PermanentRedirect",
      "BadRequest",
      "Unauthorized",
      "PaymentRequired",
      "Forbidden",
      "NotFound",
      "MethodNotAllowed",
      "NotAcceptable",
      "ProxyAuthenticationRequired",
      "RequestTimeout",
      "Conflict",
      "Gone",
      "LengthRequired",
      "PreconditionFailed",
      "PayloadTooLarge",
      "URITooLong",
      "UnsupportedMediaType",
      "RangeNotSatisfiable",
      "ExpectationFailed",
      "MisdirectedRequest",
      "UnprocessableEntity",
      "Locked",
      "FailedDependency",
      "UpgradeRequired",
      "PreconditionRequired",
      "TooManyRequests",
      "RequestHeaderFieldsTooLarge",
      "InternalServerError",
      "NotImplemented",
      "BadGateway",
      "ServiceUnavailable",
      "GatewayTimeout",
      "HTTPVersionNotSupported",
      "VariantAlsoNegotiates",
      "InsufficientStorage",
      "LoopDetected",
      "NotExtended",
      "NetworkAuthenticationRequired"
    ],
    "comment": "Supplies HTTP response code.",
    "notImp": false
  }
] };

export const HttpStatus_SingleFields = [
  "code"
];