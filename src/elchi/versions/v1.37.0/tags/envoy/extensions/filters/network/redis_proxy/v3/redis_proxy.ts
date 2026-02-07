import {OutType} from '@elchi/tags/tagsType';


export const RedisProxy_ConnectionRateLimit: OutType = { "RedisProxy_ConnectionRateLimit": [
  {
    "name": "connection_rate_limit_per_sec",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Reconnection rate per sec. Rate limiting is implemented with TokenBucket.",
    "notImp": false
  }
] };

export const RedisProxy_ConnectionRateLimit_SingleFields = [
  "connection_rate_limit_per_sec"
];

export const RedisProxy_ConnPoolSettings: OutType = { "RedisProxy_ConnPoolSettings": [
  {
    "name": "op_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Per-operation timeout in milliseconds. The timer starts when the first command of a pipeline is written to the backend connection. Each response received from Redis resets the timer since it signifies that the next command is being processed by the backend. The only exception to this behavior is when a connection to a backend is not yet established. In that case, the connect timeout on the cluster will govern the timeout until the connection is ready.",
    "notImp": false
  },
  {
    "name": "enable_hashtagging",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use hash tagging on every redis key to guarantee that keys with the same hash tag will be forwarded to the same upstream. The hash key used for determining the upstream in a consistent hash ring configuration will be computed from the hash tagged key instead of the whole key. The algorithm used to compute the hash tag is identical to the `redis-cluster implementation <https://redis.io/topics/cluster-spec#keys-hash-tags>`_.\n\nExamples:\n\n* '{user1000}.following' and '{user1000}.followers' **will** be sent to the same upstream * '{user1000}.following' and '{user1001}.following' **might** be sent to the same upstream",
    "notImp": false
  },
  {
    "name": "enable_redirection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Accept `moved and ask redirection <https://redis.io/topics/cluster-spec#redirection-and-resharding>`_ errors from upstream redis servers, and retry commands to the specified target server. The target server does not need to be known to the cluster manager. If the command cannot be redirected, then the original error is passed downstream unchanged. By default, this support is not enabled.",
    "notImp": false
  },
  {
    "name": "dns_cache_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "If ``enable_redirection`` is set to true this option configures the DNS cache that the connection pool will use to resolve hostnames that are returned with MOVED and ASK responses. If no configuration is provided, DNS lookups will not be performed (and thus the MOVED/ASK errors will be propagated verbatim to the user).",
    "notImp": false
  },
  {
    "name": "max_buffer_size_before_flush",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum size of encoded request buffer before flush is triggered and encoded requests are sent upstream. If this is unset, the buffer flushes whenever it receives data and performs no batching. This feature makes it possible for multiple clients to send requests to Envoy and have them batched- for example if one is running several worker processes, each with its own Redis connection. There is no benefit to using this with a single downstream process. Recommended size (if enabled) is 1024 bytes.",
    "notImp": false
  },
  {
    "name": "buffer_flush_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The encoded request buffer is flushed N milliseconds after the first request has been encoded, unless the buffer size has already exceeded ``max_buffer_size_before_flush``. If ``max_buffer_size_before_flush`` is not set, this flush timer is not used. Otherwise, the timer should be set according to the number of clients, overall request rate and desired maximum latency for a single command. For example, if there are many requests being batched together at a high rate, the buffer will likely be filled before the timer fires. Alternatively, if the request rate is lower the buffer will not be filled as often before the timer fires. If ``max_buffer_size_before_flush`` is set, but ``buffer_flush_timeout`` is not, the latter defaults to 3ms.",
    "notImp": false
  },
  {
    "name": "max_upstream_unknown_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "``max_upstream_unknown_connections`` controls how many upstream connections to unknown hosts can be created at any given time by any given worker thread (see ``enable_redirection`` for more details). If the host is unknown and a connection cannot be created due to enforcing this limit, then redirection will fail and the original redirection error will be passed downstream unchanged. This limit defaults to 100.",
    "notImp": false
  },
  {
    "name": "enable_command_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable per-command statistics per upstream cluster, in addition to the filter level aggregate count. These commands are measured in microseconds.",
    "notImp": false
  },
  {
    "name": "read_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_ConnPoolSettings_ReadPolicy",
    "enums": [
      "MASTER",
      "PREFER_MASTER",
      "REPLICA",
      "PREFER_REPLICA",
      "ANY"
    ],
    "comment": "Read policy. The default is to read from the primary.",
    "notImp": false
  },
  {
    "name": "connection_rate_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_ConnectionRateLimit",
    "enums": null,
    "comment": "Ops or connection timeout triggers reconnection to redis server which could result in reconnection storm to busy redis server. This config is a protection to rate limit reconnection rate. If not set, there will be no rate limiting on the reconnection.",
    "notImp": false
  }
] };

export const RedisProxy_ConnPoolSettings_SingleFields = [
  "op_timeout",
  "enable_hashtagging",
  "enable_redirection",
  "max_buffer_size_before_flush",
  "buffer_flush_timeout",
  "max_upstream_unknown_connections",
  "enable_command_stats",
  "read_policy"
];

export const RedisProxy_PrefixRoutes_Route_ReadCommandPolicy: OutType = { "RedisProxy_PrefixRoutes_Route_ReadCommandPolicy": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RedisProxy_PrefixRoutes_Route_ReadCommandPolicy_SingleFields = [
  "cluster"
];

export const RedisProxy_PrefixRoutes_Route: OutType = { "RedisProxy_PrefixRoutes_Route": [
  {
    "name": "prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "String prefix that must match the beginning of the keys. Envoy will always favor the longest match.",
    "notImp": false
  },
  {
    "name": "remove_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates if the prefix needs to be removed from the key when forwarded.",
    "notImp": false
  },
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Upstream cluster to forward the command to.",
    "notImp": false
  },
  {
    "name": "request_mirror_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Indicates that the route has a request mirroring policy.",
    "notImp": false
  },
  {
    "name": "key_formatter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates how redis key should be formatted. To substitute redis key into the formatting expression, use %KEY% as a string replacement command.",
    "notImp": false
  },
  {
    "name": "read_command_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_PrefixRoutes_Route_ReadCommandPolicy",
    "enums": null,
    "comment": "Indicates that the route has a read command policy",
    "notImp": false
  }
] };

export const RedisProxy_PrefixRoutes_Route_SingleFields = [
  "prefix",
  "remove_prefix",
  "cluster",
  "key_formatter"
];

export const RedisProxy_PrefixRoutes: OutType = { "RedisProxy_PrefixRoutes": [
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_PrefixRoutes_Route[]",
    "enums": null,
    "comment": "List of prefix routes.",
    "notImp": false
  },
  {
    "name": "case_insensitive",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that prefix matching should be case insensitive.",
    "notImp": false
  },
  {
    "name": "catch_all_route",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_PrefixRoutes_Route",
    "enums": null,
    "comment": "Optional catch-all route to forward commands that doesn't match any of the routes. The catch-all route becomes required when no routes are specified.",
    "notImp": false
  }
] };

export const RedisProxy_PrefixRoutes_SingleFields = [
  "case_insensitive"
];

export const RedisExternalAuthProvider: OutType = { "RedisExternalAuthProvider": [
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "External auth gRPC service configuration. It will be called every time an AUTH command is received from a client.",
    "notImp": false
  },
  {
    "name": "enable_auth_expiration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the filter will expect an expiration timestamp in the response from the external auth service. This timestamp will be used to disable any further commands from the client after the expiration time, unless a new AUTH command is received and the external auth service returns a new expiration timestamp.",
    "notImp": false
  }
] };

export const RedisExternalAuthProvider_SingleFields = [
  "enable_auth_expiration"
];

export const RedisProxy: OutType = { "RedisProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "settings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_ConnPoolSettings",
    "enums": null,
    "comment": "Network settings for the connection pool to the upstream clusters.",
    "notImp": false
  },
  {
    "name": "latency_in_micros",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that latency stat should be computed in microseconds. By default it is computed in milliseconds. This does not apply to upstream command stats currently.",
    "notImp": false
  },
  {
    "name": "prefix_routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_PrefixRoutes",
    "enums": null,
    "comment": "List of **unique** prefixes used to separate keys from different workloads to different clusters. Envoy will always favor the longest match first in case of overlap. A catch-all cluster can be used to forward commands when there is no match. Time complexity of the lookups are in O(min(longest key prefix, key length)).\n\nExample:\n\n```yaml\n\n   prefix_routes:\n     routes:\n       - prefix: \"ab\"\n         cluster: \"cluster_a\"\n       - prefix: \"abc\"\n         cluster: \"cluster_b\"\n```\n\nWhen using the above routes, the following prefixes would be sent to:\n\n* ``get abc:users`` would retrieve the key 'abc:users' from cluster_b. * ``get ab:users`` would retrieve the key 'ab:users' from cluster_a. * ``get z:users`` would return a NoUpstreamHost error. A `catch-all route` would have retrieved the key from that cluster instead.\n\nSee the `configuration section` of the architecture overview for recommendations on configuring the backing clusters.",
    "notImp": false
  },
  {
    "name": "downstream_auth_password",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Authenticate Redis client connections locally by forcing downstream clients to issue a `Redis AUTH command <https://redis.io/commands/auth>`_ with this password before enabling any other command. If an AUTH command's password matches this password, an \"OK\" response will be returned to the client. If the AUTH command password does not match this password, then an \"ERR invalid password\" error will be returned. If any other command is received before AUTH when this password is set, then a \"NOAUTH Authentication required.\" error response will be sent to the client. If an AUTH command is received when the password is not set, then an \"ERR Client sent AUTH, but no password is set\" error will be returned.\n\n:::attention\nThis field is deprecated. Use `downstream_auth_passwords`. \n:::",
    "notImp": false
  },
  {
    "name": "downstream_auth_passwords",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource[]",
    "enums": null,
    "comment": "Authenticate Redis client connections locally by forcing downstream clients to issue a `Redis AUTH command <https://redis.io/commands/auth>`_ with one of these passwords before enabling any other command. If an AUTH command's password matches one of these passwords, an \"OK\" response will be returned to the client. If the AUTH command password does not match, then an \"ERR invalid password\" error will be returned. If any other command is received before AUTH when the password(s) are set, then a \"NOAUTH Authentication required.\" error response will be sent to the client. If an AUTH command is received when the password is not set, then an \"ERR Client sent AUTH, but no password is set\" error will be returned.",
    "notImp": false
  },
  {
    "name": "faults",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_RedisFault[]",
    "enums": null,
    "comment": "List of faults to inject. Faults currently come in two flavors: - Delay, which delays a request. - Error, which responds to a request with an error. Errors can also have delays attached.\n\nExample:\n\n```yaml\n\n   faults:\n   - fault_type: ERROR\n     fault_enabled:\n       default_value:\n         numerator: 10\n         denominator: HUNDRED\n       runtime_key: \"bogus_key\"\n       commands:\n       - GET\n     - fault_type: DELAY\n       fault_enabled:\n         default_value:\n           numerator: 10\n           denominator: HUNDRED\n         runtime_key: \"bogus_key\"\n       delay: 2s\n```\n\nSee the `fault injection section` for more information on how to configure this.",
    "notImp": false
  },
  {
    "name": "downstream_auth_username",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "If a username is provided an ACL style AUTH command will be required with a username and password. Authenticate Redis client connections locally by forcing downstream clients to issue a `Redis AUTH command <https://redis.io/commands/auth>`_ with this username and the ``downstream_auth_password`` before enabling any other command. If an AUTH command's username and password matches this username and the ``downstream_auth_password`` , an \"OK\" response will be returned to the client. If the AUTH command username or password does not match this username or the ``downstream_auth_password``, then an \"WRONGPASS invalid username-password pair\" error will be returned. If any other command is received before AUTH when this password is set, then a \"NOAUTH Authentication required.\" error response will be sent to the client. If an AUTH command is received when the password is not set, then an \"ERR Client sent AUTH, but no ACL is set\" error will be returned.",
    "notImp": false
  },
  {
    "name": "external_auth_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisExternalAuthProvider",
    "enums": null,
    "comment": "External authentication configuration. If set, instead of validating username and password against ``downstream_auth_username`` and ``downstream_auth_password``, the filter will call an external gRPC service to authenticate the client. A typical usage of this feature is for situations where the password is a one-time token that needs to be validated against a remote service, like a sidecar. Expiration is also supported, which will disable any further commands from the client after the expiration time, unless a new AUTH command is received and the external auth service returns a new expiration time. If the external auth service returns an error, authentication is considered failed. If this setting is set together with ``downstream_auth_username`` and ``downstream_auth_password``, the external auth service will be source of truth, but those fields will still be used for downstream authentication to the cluster. The API is defined by `RedisProxyExternalAuthRequest`.",
    "notImp": false
  },
  {
    "name": "custom_commands",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Optional configure redis custom commands for the proxy, eg -> [\"my_custom_cmd1\", \"my_custom_cmd2\"]\n\n:::note\nThe is to support redis's feature wherein new commands can be added using redis' modules api: https://redis.io/docs/latest/develop/reference/modules/",
    "notImp": false
  }
] };

export const RedisProxy_SingleFields = [
  "stat_prefix",
  "latency_in_micros",
  "custom_commands"
];

export const RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy: OutType = { "RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the cluster that requests will be mirrored to. The cluster must exist in the cluster manager configuration.",
    "notImp": false
  },
  {
    "name": "runtime_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If not specified or the runtime key is not present, all requests to the target cluster will be mirrored.\n\nIf specified, Envoy will lookup the runtime key to get the percentage of requests to the mirror.",
    "notImp": false
  },
  {
    "name": "exclude_read_commands",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set this to TRUE to only mirror write commands, this is effectively replicating the writes in a \"fire and forget\" manner.",
    "notImp": false
  }
] };

export const RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy_SingleFields = [
  "cluster",
  "exclude_read_commands"
];

export const RedisProxy_RedisFault: OutType = { "RedisProxy_RedisFault": [
  {
    "name": "fault_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProxy_RedisFault_RedisFaultType",
    "enums": [
      "DELAY",
      "ERROR"
    ],
    "comment": "Fault type.",
    "notImp": false
  },
  {
    "name": "fault_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Percentage of requests fault applies to.",
    "notImp": false
  },
  {
    "name": "delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Delay for all faults. If not set, defaults to zero",
    "notImp": false
  },
  {
    "name": "commands",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Commands fault is restricted to, if any. If not set, fault applies to all commands other than auth and ping (due to special handling of those commands in Envoy).",
    "notImp": false
  }
] };

export const RedisProxy_RedisFault_SingleFields = [
  "fault_type",
  "delay",
  "commands"
];

export const AwsIam: OutType = { "AwsIam": [
  {
    "name": "credential_provider",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsCredentialProvider",
    "enums": null,
    "comment": "An AwsCredentialProvider, allowing the use of a specific credential provider chain or specific provider settings",
    "notImp": false
  },
  {
    "name": "cache_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the cache, used when generating the authentication token.",
    "notImp": false
  },
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The optional service name to be used in AWS IAM authentication. If not provided, the service name will be set to ``elasticache``. For Amazon MemoryDB the service name should be set to ``memorydb``.",
    "notImp": false
  },
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The optional AWS region that your cache is located in. If not provided, the region will be deduced using the region provider chain as described in `config_http_filters_aws_request_signing_region`.",
    "notImp": false
  },
  {
    "name": "expiration_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Number of seconds before the IAM authentication token will expire. If not set, defaults to 60s (1 minute). Maximum of 900s (15 minutes) Expiration of the current authentication token will automatically trigger generation of a new token. As envoy will automatically continue to generate new tokens as required, there is no substantial benefit to using a long expiration value here.",
    "notImp": false
  }
] };

export const AwsIam_SingleFields = [
  "cache_name",
  "service_name",
  "region",
  "expiration_time"
];

export const RedisProtocolOptions: OutType = { "RedisProtocolOptions": [
  {
    "name": "auth_password",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Upstream server password as defined by the ``requirepass`` directive `<https://redis.io/topics/config>`_ in the server's configuration file. If ``aws_iam`` is set, this field is ignored.",
    "notImp": false
  },
  {
    "name": "auth_username",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Upstream server username as defined by the ``user`` directive `<https://redis.io/topics/acl>`_ in the server's configuration file. If ``aws_iam``` is set, this field will be used as the authenticating user for redis IAM authentication. See ``Create a new IAM-enabled user`` under `Setup <https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/auth-iam.html#auth-iam-setup>`_ for more details.",
    "notImp": false
  },
  {
    "name": "aws_iam",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AwsIam",
    "enums": null,
    "comment": "The cluster level configuration for AWS IAM authentication",
    "notImp": false
  },
  {
    "name": "credentials",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RedisProtocolOptions_Credential[]",
    "enums": null,
    "comment": "If specified, these credentials are used when connecting to upstream endpoints. Which credential is used is determined by matching the resolved ``address`` field here with each endpoint's resolved ``address`` field. The first entry for a given ``address`` here takes precedence. If no entry in ``credentials`` matches, then the ``auth_password`` and ``auth_username`` fields are used as defaults.",
    "notImp": false
  }
] };

export const RedisProtocolOptions_Credential: OutType = { "RedisProtocolOptions_Credential": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The address to which this username and password applies.",
    "notImp": false
  },
  {
    "name": "auth_password",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Upstream server password as defined by the ``requirepass`` directive `<https://redis.io/topics/config>`_ in the server's configuration file.",
    "notImp": false
  },
  {
    "name": "auth_username",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Upstream server username as defined by the ``user`` directive `<https://redis.io/topics/acl>`_ in the server's configuration file.",
    "notImp": false
  }
] };