import {OutType} from '@/elchi/tags/tagsType';


export const UnnamedEndpointLoadMetricStats: OutType = { "UnnamedEndpointLoadMetricStats": [
  {
    "name": "num_requests_finished_with_metric",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of calls that finished and included this metric.",
    "notImp": false
  },
  {
    "name": "total_metric_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Sum of metric values across all calls that finished with this metric for load_reporting_interval.",
    "notImp": false
  }
] };

export const UnnamedEndpointLoadMetricStats_SingleFields = [
  "num_requests_finished_with_metric",
  "total_metric_value"
];

export const UpstreamLocalityStats: OutType = { "UpstreamLocalityStats": [
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "Name of zone, region and optionally endpoint group these metrics were collected from. Zone and region names could be empty if unknown.",
    "notImp": false
  },
  {
    "name": "total_successful_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests successfully completed by the endpoints in the locality.",
    "notImp": false
  },
  {
    "name": "total_requests_in_progress",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of unfinished requests",
    "notImp": false
  },
  {
    "name": "total_error_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests that failed due to errors at the endpoint, aggregated over all endpoints in the locality.",
    "notImp": false
  },
  {
    "name": "total_issued_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests that were issued by this Envoy since the last report. This information is aggregated over all the upstream endpoints in the locality.",
    "notImp": false
  },
  {
    "name": "total_active_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of connections in an established state at the time of the report. This field is aggregated over all the upstream endpoints in the locality. In Envoy, this information may be based on ``upstream_cx_active metric``. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "total_new_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of connections opened since the last report. This field is aggregated over all the upstream endpoints in the locality. In Envoy, this information may be based on ``upstream_cx_total`` metric compared to itself between start and end of an interval, i.e. ``upstream_cx_total``(now) - ``upstream_cx_total``(now - load_report_interval). [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "total_fail_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of connection failures since the last report. This field is aggregated over all the upstream endpoints in the locality. In Envoy, this information may be based on ``upstream_cx_connect_fail`` metric compared to itself between start and end of an interval, i.e. ``upstream_cx_connect_fail``(now) - ``upstream_cx_connect_fail``(now - load_report_interval). [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "cpu_utilization",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UnnamedEndpointLoadMetricStats",
    "enums": null,
    "comment": "CPU utilization stats for multi-dimensional load balancing. This typically comes from endpoint metrics reported via ORCA.",
    "notImp": false
  },
  {
    "name": "mem_utilization",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UnnamedEndpointLoadMetricStats",
    "enums": null,
    "comment": "Memory utilization for multi-dimensional load balancing. This typically comes from endpoint metrics reported via ORCA.",
    "notImp": false
  },
  {
    "name": "application_utilization",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UnnamedEndpointLoadMetricStats",
    "enums": null,
    "comment": "Blended application-defined utilization for multi-dimensional load balancing. This typically comes from endpoint metrics reported via ORCA.",
    "notImp": false
  },
  {
    "name": "load_metric_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointLoadMetricStats[]",
    "enums": null,
    "comment": "Named stats for multi-dimensional load balancing. These typically come from endpoint metrics reported via ORCA.",
    "notImp": false
  },
  {
    "name": "upstream_endpoint_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamEndpointStats[]",
    "enums": null,
    "comment": "Endpoint granularity stats information for this locality. This information is populated if the Server requests it by setting `LoadStatsResponse.report_endpoint_granularity`.",
    "notImp": false
  },
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#not-implemented-hide:] The priority of the endpoint group these metrics were collected from.",
    "notImp": true
  }
] };

export const UpstreamLocalityStats_SingleFields = [
  "total_successful_requests",
  "total_requests_in_progress",
  "total_error_requests",
  "total_issued_requests",
  "total_active_connections",
  "total_new_connections",
  "total_fail_connections",
  "priority"
];

export const UpstreamEndpointStats: OutType = { "UpstreamEndpointStats": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Upstream host address.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Opaque and implementation dependent metadata of the endpoint. Envoy will pass this directly to the management server.",
    "notImp": false
  },
  {
    "name": "total_successful_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests successfully completed by the endpoints in the locality. These include non-5xx responses for HTTP, where errors originate at the client and the endpoint responded successfully. For gRPC, the grpc-status values are those not covered by total_error_requests below.",
    "notImp": false
  },
  {
    "name": "total_requests_in_progress",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of unfinished requests for this endpoint.",
    "notImp": false
  },
  {
    "name": "total_error_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests that failed due to errors at the endpoint. For HTTP these are responses with 5xx status codes and for gRPC the grpc-status values:\n\n  - DeadlineExceeded - Unimplemented - Internal - Unavailable - Unknown - DataLoss",
    "notImp": false
  },
  {
    "name": "total_issued_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The total number of requests that were issued to this endpoint since the last report. A single TCP connection, HTTP or gRPC request or stream is counted as one request.",
    "notImp": false
  },
  {
    "name": "load_metric_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EndpointLoadMetricStats[]",
    "enums": null,
    "comment": "Stats for multi-dimensional load balancing.",
    "notImp": false
  }
] };

export const UpstreamEndpointStats_SingleFields = [
  "total_successful_requests",
  "total_requests_in_progress",
  "total_error_requests",
  "total_issued_requests"
];

export const EndpointLoadMetricStats: OutType = { "EndpointLoadMetricStats": [
  {
    "name": "metric_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the metric; may be empty.",
    "notImp": false
  },
  {
    "name": "num_requests_finished_with_metric",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Number of calls that finished and included this metric.",
    "notImp": false
  },
  {
    "name": "total_metric_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Sum of metric values across all calls that finished with this metric for load_reporting_interval.",
    "notImp": false
  }
] };

export const EndpointLoadMetricStats_SingleFields = [
  "metric_name",
  "num_requests_finished_with_metric",
  "total_metric_value"
];

export const ClusterStats: OutType = { "ClusterStats": [
  {
    "name": "cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cluster.",
    "notImp": false
  },
  {
    "name": "cluster_service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The eds_cluster_config service_name of the cluster. It's possible that two clusters send the same service_name to EDS, in that case, the management server is supposed to do aggregation on the load reports.",
    "notImp": false
  },
  {
    "name": "upstream_locality_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamLocalityStats[]",
    "enums": null,
    "comment": "Need at least one.",
    "notImp": false
  },
  {
    "name": "total_dropped_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Cluster-level stats such as total_successful_requests may be computed by summing upstream_locality_stats. In addition, below there are additional cluster-wide stats.\n\nThe total number of dropped requests. This covers requests deliberately dropped by the drop_overload policy and circuit breaking.",
    "notImp": false
  },
  {
    "name": "dropped_requests",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterStats_DroppedRequests[]",
    "enums": null,
    "comment": "Information about deliberately dropped requests for each category specified in the DropOverload policy.",
    "notImp": false
  },
  {
    "name": "load_report_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Period over which the actual load report occurred. This will be guaranteed to include every request reported. Due to system load and delays between the ``LoadStatsRequest`` sent from Envoy and the ``LoadStatsResponse`` message sent from the management server, this may be longer than the requested load reporting interval in the ``LoadStatsResponse``.",
    "notImp": false
  }
] };

export const ClusterStats_SingleFields = [
  "cluster_name",
  "cluster_service_name",
  "total_dropped_requests",
  "load_report_interval"
];

export const ClusterStats_DroppedRequests: OutType = { "ClusterStats_DroppedRequests": [
  {
    "name": "category",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Identifier for the policy specifying the drop.",
    "notImp": false
  },
  {
    "name": "dropped_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Total number of deliberately dropped requests for the category.",
    "notImp": false
  }
] };

export const ClusterStats_DroppedRequests_SingleFields = [
  "category",
  "dropped_count"
];