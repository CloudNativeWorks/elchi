import {OutType} from '@elchi/tags/tagsType';


export const StatsSink: OutType = { "StatsSink": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the stats sink to instantiate. The name must match a supported stats sink. See the `extensions listed in typed_config below` for the default list of available stats sink. Sinks optionally support tagged/multiple dimensional metrics.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Configuration for pluggable stats sinks.",
    "notImp": false
  }
] };

export const StatsSink_SingleFields = [
  "name"
];

export const StatsMatcher: OutType = { "StatsMatcher": [
  {
    "name": "stats_matcher.reject_all",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Configuration for disabling stat instantiation.",
    "notImp": false
  },
  {
    "name": "stats_matcher.exclusion_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "Configuration for disabling stat instantiation.",
    "notImp": false
  },
  {
    "name": "stats_matcher.inclusion_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListStringMatcher",
    "enums": null,
    "comment": "Configuration for disabling stat instantiation.",
    "notImp": false
  }
] };

export const StatsMatcher_SingleFields = [
  "stats_matcher.reject_all"
];

export const StatsConfig: OutType = { "StatsConfig": [
  {
    "name": "stats_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TagSpecifier[]",
    "enums": null,
    "comment": "Each stat name is independently processed through these tag specifiers. When a tag is matched, the first capture group is not immediately removed from the name, so later `TagSpecifiers` can also match that same portion of the match. After all tag matching is complete, a tag-extracted version of the name is produced and is used in stats sinks that represent tags, such as Prometheus.",
    "notImp": false
  },
  {
    "name": "use_all_default_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use all default tag regexes specified in Envoy. These can be combined with custom tags specified in `stats_tags`. They will be processed before the custom tags.\n\nSee :repo:`well_known_names.h <source/common/config/well_known_names.h>` for a list of the default tags in Envoy.\n\nIf not provided, the value is assumed to be true.",
    "notImp": false
  },
  {
    "name": "stats_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StatsMatcher",
    "enums": null,
    "comment": "Inclusion/exclusion matcher for stat name creation. If not provided, all stats are instantiated as normal. Preventing the instantiation of certain families of stats can improve memory performance for Envoys running especially large configs.\n\n:::warning\nExcluding stats may affect Envoy's behavior in undocumented ways. See `issue #8771 <https://github.com/envoyproxy/envoy/issues/8771>`_ for more information. If any unexpected behavior changes are observed, please open a new issue immediately.",
    "notImp": false
  },
  {
    "name": "histogram_bucket_settings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HistogramBucketSettings[]",
    "enums": null,
    "comment": "Defines rules for setting the histogram buckets. Rules are evaluated in order, and the first match is applied. If no match is found (or if no rules are set), the following default buckets are used:\n\n```json\n\n    [\n      0.5,\n      1,\n      5,\n      10,\n      25,\n      50,\n      100,\n      250,\n      500,\n      1000,\n      2500,\n      5000,\n      10000,\n      30000,\n      60000,\n      300000,\n      600000,\n      1800000,\n      3600000\n    ]",
    "notImp": false
  }
] };

export const StatsConfig_SingleFields = [
  "use_all_default_tags"
];

export const TagSpecifier: OutType = { "TagSpecifier": [
  {
    "name": "tag_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Attaches an identifier to the tag values to identify the tag being in the sink. Envoy has a set of default names and regexes to extract dynamic portions of existing stats, which can be found in :repo:`well_known_names.h <source/common/config/well_known_names.h>` in the Envoy repository. If a `tag_name` is provided in the config and neither `regex` or `fixed_value` were specified, Envoy will attempt to find that name in its set of defaults and use the accompanying regex.\n\n:::note\n\nA stat name may be spelled in such a way that it matches two different tag extractors for the same tag name. In that case, all but one of the tag values will be dropped. It is not specified which tag value will be retained. The extraction will only occur for one of the extractors, and only the matched extraction will be removed from the tag name.",
    "notImp": false
  },
  {
    "name": "tag_value.regex",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Designates a tag name and value pair. The value may be either a fixed value or a regex providing the value via capture groups. The specified tag will be unconditionally set if a fixed value, otherwise it will only be set if one or more capture groups in the regex match.",
    "notImp": false
  },
  {
    "name": "tag_value.fixed_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Designates a tag name and value pair. The value may be either a fixed value or a regex providing the value via capture groups. The specified tag will be unconditionally set if a fixed value, otherwise it will only be set if one or more capture groups in the regex match.",
    "notImp": false
  }
] };

export const TagSpecifier_SingleFields = [
  "tag_name",
  "tag_value.regex",
  "tag_value.fixed_value"
];

export const HistogramBucketSettings: OutType = { "HistogramBucketSettings": [
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The stats that this rule applies to. The match is applied to the original stat name before tag-extraction, for example ``cluster.exampleclustername.upstream_cx_length_ms``.",
    "notImp": false
  },
  {
    "name": "buckets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Each value is the upper bound of a bucket. Each bucket must be greater than 0 and unique. The order of the buckets does not matter.",
    "notImp": false
  },
  {
    "name": "bins",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Initial number of bins for the ``circllhist`` thread local histogram per time series. Default value is 100.",
    "notImp": false
  }
] };

export const HistogramBucketSettings_SingleFields = [
  "buckets",
  "bins"
];

export const StatsdSink: OutType = { "StatsdSink": [
  {
    "name": "statsd_specifier.address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Stats configuration proto schema for built-in ``envoy.stat_sinks.statsd`` sink. This sink does not support tagged metrics. [#extension: envoy.stat_sinks.statsd]",
    "notImp": false
  },
  {
    "name": "statsd_specifier.tcp_cluster_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Stats configuration proto schema for built-in ``envoy.stat_sinks.statsd`` sink. This sink does not support tagged metrics. [#extension: envoy.stat_sinks.statsd]",
    "notImp": false
  },
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional custom prefix for StatsdSink. If specified, this will override the default prefix. For example:\n\n```json\n\n  {\n    \"prefix\" : \"envoy-prod\"\n  }\n```\n\nwill change emitted stats to\n\n.. code-block:: cpp\n\n  envoy-prod.test_counter:1|c envoy-prod.test_timer:5|ms\n\nNote that the default prefix, \"envoy\", will be used if a prefix is not specified.\n\nStats with default prefix:\n\n.. code-block:: cpp\n\n  envoy.test_counter:1|c envoy.test_timer:5|ms",
    "notImp": false
  }
] };

export const StatsdSink_SingleFields = [
  "statsd_specifier.tcp_cluster_name",
  "prefix"
];

export const DogStatsdSink: OutType = { "DogStatsdSink": [
  {
    "name": "dog_statsd_specifier.address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Stats configuration proto schema for built-in ``envoy.stat_sinks.dog_statsd`` sink. The sink emits stats with `DogStatsD <https://docs.datadoghq.com/guides/dogstatsd/>`_ compatible tags. Tags are configurable via `StatsConfig`. [#extension: envoy.stat_sinks.dog_statsd]",
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

export const DogStatsdSink_SingleFields = [
  "prefix",
  "max_bytes_per_datagram"
];

export const HystrixSink: OutType = { "HystrixSink": [
  {
    "name": "num_buckets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of buckets the rolling statistical window is divided into.\n\nEach time the sink is flushed, all relevant Envoy statistics are sampled and added to the rolling window (removing the oldest samples in the window in the process). The sink then outputs the aggregate statistics across the current rolling window to the event stream(s).\n\n``rolling_window(ms)`` = ``stats_flush_interval(ms)`` * ``num_of_buckets``\n\nMore detailed explanation can be found in `Hystrix wiki <https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring#hystrixrollingnumber>`_.",
    "notImp": false
  }
] };

export const HystrixSink_SingleFields = [
  "num_buckets"
];