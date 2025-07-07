import {OutType} from '@/elchi/tags/tagsType';


export const VirtualHost: OutType = { "VirtualHost": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the virtual host.",
    "notImp": false
  },
  {
    "name": "hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of hosts that will be matched to this virtual host. Wildcard hosts are supported in the suffix or prefix form.\n\nHost search order: 1. Exact names: ``www.foo.com``. 2. Suffix wildcards: ``*.foo.com`` or ``*-bar.foo.com``. 3. Prefix wildcards: ``foo.*`` or ``foo-*``. 4. Special wildcard ``*`` matching any host and will be the default virtual host.\n\n:::note\n\nThe wildcard will not match the empty string. e.g. ``*-bar.foo.com`` will match ``baz-bar.foo.com`` but not ``-bar.foo.com``. The longest wildcards match first. Only a single virtual host in the entire route configuration can match on ``*``. A domain must be unique across all virtual hosts or the config will fail to load.",
    "notImp": false
  },
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving route actions for incoming requests.",
    "notImp": false
  }
] };

export const VirtualHost_SingleFields = [
  "name",
  "hosts"
];

export const RouteConfiguration: OutType = { "RouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. For example, it might match route_config_name in envoy.extensions.filters.network.generic_proxy.v3.Rds.",
    "notImp": false
  },
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving route actions for incoming requests. If no any virtual host is configured in the ``virtual_hosts`` field or no special wildcard virtual host is configured, the ``routes`` field will be used as the default route table. If both the wildcard virtual host and ``routes`` are configured, the configuration will fail to load.",
    "notImp": false
  },
  {
    "name": "virtual_hosts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "VirtualHost[]",
    "enums": null,
    "comment": "An array of virtual hosts that make up the route table.",
    "notImp": false
  }
] };

export const RouteConfiguration_SingleFields = [
  "name"
];