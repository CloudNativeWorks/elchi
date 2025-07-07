import {OutType} from '@/elchi/tags/tagsType';


export const GetAddrInfoDnsResolverConfig: OutType = { "GetAddrInfoDnsResolverConfig": [
  {
    "name": "num_retries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the number of retries before the resolver gives up. If not specified, the resolver will retry indefinitely until it succeeds or the DNS query times out.",
    "notImp": false
  }
] };

export const GetAddrInfoDnsResolverConfig_SingleFields = [
  "num_retries"
];