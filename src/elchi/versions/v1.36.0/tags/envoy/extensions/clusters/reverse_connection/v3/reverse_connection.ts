import {OutType} from '@elchi/tags/tagsType';


export const ReverseConnectionClusterConfig: OutType = { "ReverseConnectionClusterConfig": [
  {
    "name": "cleanup_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Time interval after which Envoy removes unused dynamic hosts created for reverse connections. Hosts that are not referenced by any connection pool are deleted during cleanup.\n\nIf unset, Envoy uses a default of 60s.",
    "notImp": false
  },
  {
    "name": "host_id_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Host identifier format string.\n\nThis format string is evaluated against the downstream request context to compute the host identifier for selecting the reverse connection endpoint. The format string supports Envoy's standard formatter syntax, including:\n\n* ``%REQ(header-name)%``: Extract request header value. * ``%DYNAMIC_METADATA(namespace:key)%``: Extract dynamic metadata value. * ``%CEL(expression)%``: Evaluate CEL expression. * ``%DOWNSTREAM_REMOTE_ADDRESS%``: Downstream connection address. * ``%DOWNSTREAM_LOCAL_ADDRESS%``: Downstream local address. * Plain text and combinations of the above.\n\nExamples:\n\n* ``%REQ(x-remote-node-id)%``: Use the value of the ``x-remote-node-id`` header. * ``%REQ(host):EXTRACT_FIRST_PART%``: Extract the first part of the Host header before a dot. * ``%CEL(request.headers['x-node-id'] | orValue('default'))%``: Use CEL with fallback. * ``node-%REQ(x-tenant-id)%-%REQ(x-region)%``: Combine multiple values.\n\nIf the format string evaluates to an empty value, the request will not be routed.",
    "notImp": false
  }
] };

export const ReverseConnectionClusterConfig_SingleFields = [
  "cleanup_interval",
  "host_id_format"
];