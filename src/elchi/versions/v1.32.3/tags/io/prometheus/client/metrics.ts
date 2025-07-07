import {OutType} from '@/elchi/tags/tagsType';


export const LabelPair: OutType = { "LabelPair": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const LabelPair_SingleFields = [
  "name",
  "value"
];

export const Gauge: OutType = { "Gauge": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Gauge_SingleFields = [
  "value"
];

export const Exemplar: OutType = { "Exemplar": [
  {
    "name": "label",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LabelPair[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "timestamp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "OpenMetrics-style.",
    "notImp": false
  }
] };

export const Exemplar_SingleFields = [
  "value"
];

export const Counter: OutType = { "Counter": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "exemplar",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Exemplar",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Counter_SingleFields = [
  "value"
];

export const Quantile: OutType = { "Quantile": [
  {
    "name": "quantile",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Quantile_SingleFields = [
  "quantile",
  "value"
];

export const Summary: OutType = { "Summary": [
  {
    "name": "sample_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "sample_sum",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "quantile",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Quantile[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Summary_SingleFields = [
  "sample_count",
  "sample_sum"
];

export const Untyped: OutType = { "Untyped": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Untyped_SingleFields = [
  "value"
];

export const Histogram: OutType = { "Histogram": [
  {
    "name": "sample_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "sample_sum",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "bucket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bucket[]",
    "enums": null,
    "comment": "Ordered in increasing order of upper_bound, +Inf bucket is optional.",
    "notImp": false
  }
] };

export const Histogram_SingleFields = [
  "sample_count",
  "sample_sum"
];

export const Bucket: OutType = { "Bucket": [
  {
    "name": "cumulative_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Cumulative in increasing order.",
    "notImp": false
  },
  {
    "name": "upper_bound",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Inclusive.",
    "notImp": false
  },
  {
    "name": "exemplar",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Exemplar",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Bucket_SingleFields = [
  "cumulative_count",
  "upper_bound"
];

export const Metric: OutType = { "Metric": [
  {
    "name": "label",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LabelPair[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "gauge",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Gauge",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "counter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Counter",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "summary",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Summary",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "untyped",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Untyped",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "histogram",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Histogram",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "timestamp_ms",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Metric_SingleFields = [
  "timestamp_ms"
];

export const MetricFamily: OutType = { "MetricFamily": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "help",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetricType",
    "enums": [
      "COUNTER",
      "GAUGE",
      "SUMMARY",
      "UNTYPED",
      "HISTOGRAM"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "metric",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metric[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MetricFamily_SingleFields = [
  "name",
  "help",
  "type"
];