import {OutType} from '@/elchi/tags/tagsType';


export const GraphiteStatsdSink: OutType = { "GraphiteStatsdSink": [
  {
    "name": "statsd_specifier.address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The UDP address of a running Graphite-compliant listener. If specified, statistics will be flushed to this address.",
    "notImp": false
  },
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional custom metric name prefix. See `StatsdSink's prefix field` for more details.",
    "notImp": false
  },
  {
    "name": "max_bytes_per_datagram",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional max datagram size to use when sending UDP messages. By default Envoy will emit one metric per datagram. By specifying a max-size larger than a single metric, Envoy will emit multiple, new-line separated metrics. The max datagram size should not exceed your network's MTU.\n\nNote that this value may not be respected if smaller than a single metric.",
    "notImp": false
  }
] };

export const GraphiteStatsdSink_SingleFields = [
  "prefix",
  "max_bytes_per_datagram"
];