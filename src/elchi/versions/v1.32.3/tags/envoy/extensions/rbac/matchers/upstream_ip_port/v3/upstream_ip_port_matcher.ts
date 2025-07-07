import {OutType} from '@/elchi/tags/tagsType';


export const UpstreamIpPortMatcher: OutType = { "UpstreamIpPortMatcher": [
  {
    "name": "upstream_ip",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange",
    "enums": null,
    "comment": "A CIDR block that will be used to match the upstream IP. Both Ipv4 and Ipv6 ranges can be matched.",
    "notImp": false
  },
  {
    "name": "upstream_port_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Int64Range",
    "enums": null,
    "comment": "A port range that will be used to match the upstream port.",
    "notImp": false
  }
] };