import {OutType} from '@elchi/tags/tagsType';


export const Geoip: OutType = { "Geoip": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting statistics. This is useful when there are multiple listeners configured with geoip filters, allowing stats to be grouped per listener. For example, with ``stat_prefix: \"listener_1.\"``, stats would be emitted as ``listener_1.geoip.total``.",
    "notImp": false
  },
  {
    "name": "provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Geoip driver specific configuration which depends on the driver being instantiated. extension-category: envoy.geoip_providers",
    "notImp": false
  },
  {
    "name": "client_ip",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Configuration for dynamically extracting the client IP address used for geolocation lookups.\n\nThis field accepts the same `format specifiers` as used for `HTTP access logging` to extract the client IP. The formatted result must be a valid IPv4 or IPv6 address string. For example:\n\n* ``%FILTER_STATE(my.custom.client.ip:PLAIN)%`` - Read from filter state populated by a preceding filter. * ``%DYNAMIC_METADATA(namespace:key)%`` - Read from dynamic metadata. * ``%REQ(X-Forwarded-For)%`` - Extract from request header (if applicable in context).\n\nIf not specified, defaults to the downstream connection's remote address. If specified but the result is empty, ``-``, or not a valid IP address, the filter falls back to the downstream connection's remote address.\n\nExample reading from filter state:\n\n```yaml\n\n  client_ip: \"%FILTER_STATE(my.custom.client.ip:PLAIN)%\"",
    "notImp": false
  }
] };

export const Geoip_SingleFields = [
  "stat_prefix",
  "client_ip"
];