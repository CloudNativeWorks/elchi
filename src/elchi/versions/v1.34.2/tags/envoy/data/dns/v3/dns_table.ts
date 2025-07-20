import {OutType} from '@elchi/tags/tagsType';


export const DnsTable: OutType = { "DnsTable": [
  {
    "name": "external_retry_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Control how many times Envoy makes an attempt to forward a query to an external DNS server",
    "notImp": false
  },
  {
    "name": "virtual_domains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsVirtualDomain[]",
    "enums": null,
    "comment": "Fully qualified domain names for which Envoy will respond to DNS queries. By leaving this list empty, Envoy will forward all queries to external resolvers",
    "notImp": false
  },
  {
    "name": "known_suffixes",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "This field is deprecated and no longer used in Envoy. The filter's behavior has changed internally to use a different data structure allowing the filter to determine whether a query is for known domain without the use of this field.\n\nThis field serves to help Envoy determine whether it can authoritatively answer a query for a name matching a suffix in this list. If the query name does not match a suffix in this list, Envoy will forward the query to an upstream DNS server",
    "notImp": false
  }
] };

export const DnsTable_SingleFields = [
  "external_retry_count"
];

export const DnsTable_AddressList: OutType = { "DnsTable_AddressList": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "This field contains a well formed IP address that is returned in the answer for a name query. The address field can be an IPv4 or IPv6 address. Address family detection is done automatically when Envoy parses the string. Since this field is repeated, Envoy will return as many entries from this list in the DNS response while keeping the response under 512 bytes",
    "notImp": false
  }
] };

export const DnsTable_AddressList_SingleFields = [
  "address"
];

export const DnsTable_DnsServiceProtocol: OutType = { "DnsTable_DnsServiceProtocol": [
  {
    "name": "protocol_config.number",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specify the protocol number for the service. Envoy will try to resolve the number to the protocol name. For example, 6 will resolve to \"tcp\". Refer to: https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml for protocol names and numbers",
    "notImp": false
  },
  {
    "name": "protocol_config.name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specify the protocol name for the service.",
    "notImp": false
  }
] };

export const DnsTable_DnsServiceProtocol_SingleFields = [
  "protocol_config.number",
  "protocol_config.name"
];

export const DnsTable_DnsServiceTarget: OutType = { "DnsTable_DnsServiceTarget": [
  {
    "name": "endpoint_type.host_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use a resolvable hostname as the endpoint for a service.",
    "notImp": false
  },
  {
    "name": "endpoint_type.cluster_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use a cluster name as the endpoint for a service.",
    "notImp": false
  },
  {
    "name": "priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The priority of the service record target",
    "notImp": false
  },
  {
    "name": "weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The weight of the service record target",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port to which the service is bound. This value is optional if the target is a cluster. Setting port to zero in this case makes the filter use the port value from the cluster host",
    "notImp": false
  }
] };

export const DnsTable_DnsServiceTarget_SingleFields = [
  "endpoint_type.host_name",
  "endpoint_type.cluster_name",
  "priority",
  "weight",
  "port"
];

export const DnsTable_DnsService: OutType = { "DnsTable_DnsService": [
  {
    "name": "service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the service without the protocol or domain name",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsServiceProtocol",
    "enums": null,
    "comment": "The service protocol. This can be specified as a string or the numeric value of the protocol",
    "notImp": false
  },
  {
    "name": "ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The service entry time to live. This is independent from the DNS Answer record TTL",
    "notImp": false
  },
  {
    "name": "targets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsServiceTarget[]",
    "enums": null,
    "comment": "The list of targets hosting the service",
    "notImp": false
  }
] };

export const DnsTable_DnsService_SingleFields = [
  "service_name",
  "ttl"
];

export const DnsTable_DnsServiceList: OutType = { "DnsTable_DnsServiceList": [
  {
    "name": "services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsService[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const DnsTable_DnsEndpoint: OutType = { "DnsTable_DnsEndpoint": [
  {
    "name": "endpoint_config.address_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsTable_AddressList",
    "enums": null,
    "comment": "Define a list of addresses to return for the specified endpoint",
    "notImp": false
  },
  {
    "name": "endpoint_config.cluster_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Define a cluster whose addresses are returned for the specified endpoint",
    "notImp": false
  },
  {
    "name": "endpoint_config.service_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsServiceList",
    "enums": null,
    "comment": "Define a DNS Service List for the specified endpoint",
    "notImp": false
  }
] };

export const DnsTable_DnsEndpoint_SingleFields = [
  "endpoint_config.cluster_name"
];

export const DnsTable_DnsVirtualDomain: OutType = { "DnsTable_DnsVirtualDomain": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A domain name for which Envoy will respond to query requests. Wildcard records are supported on the first label only, e.g. ``*.example.com`` or ``*.subdomain.example.com``. Names such as ``*example.com``, ``subdomain.*.example.com``, ``*subdomain.example.com``, etc are not valid wildcard names and asterisk will be interpreted as a literal ``*`` character. Wildcard records match subdomains on any levels, e.g. ``*.example.com`` will match ``foo.example.com``, ``bar.foo.example.com``, ``baz.bar.foo.example.com``, etc. In case there are multiple wildcard records, the longest wildcard match will be used, e.g. if there are wildcard records for ``*.example.com`` and ``*.foo.example.com`` and the query is for ``bar.foo.example.com``, the latter will be used. Specific records will always take precedence over wildcard records.",
    "notImp": false
  },
  {
    "name": "endpoint",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DnsTable_DnsEndpoint",
    "enums": null,
    "comment": "The configuration containing the method to determine the address of this endpoint",
    "notImp": false
  },
  {
    "name": "answer_ttl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Sets the TTL in DNS answers from Envoy returned to the client. The default TTL is 300s",
    "notImp": false
  }
] };

export const DnsTable_DnsVirtualDomain_SingleFields = [
  "name",
  "answer_ttl"
];