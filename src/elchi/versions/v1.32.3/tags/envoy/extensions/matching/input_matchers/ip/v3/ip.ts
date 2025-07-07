import {OutType} from '@/elchi/tags/tagsType';


export const Ip: OutType = { "Ip": [
  {
    "name": "cidr_ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "Match if the IP belongs to any of these CIDR ranges.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics for the IP input matcher. Names in the table below are concatenated to this prefix.\n\n.. csv-table:: :header: Name, Type, Description :widths: 1, 1, 2\n\n   ip_parsing_failed, Counter, Total number of IP addresses the matcher was unable to parse",
    "notImp": false
  }
] };

export const Ip_SingleFields = [
  "stat_prefix"
];