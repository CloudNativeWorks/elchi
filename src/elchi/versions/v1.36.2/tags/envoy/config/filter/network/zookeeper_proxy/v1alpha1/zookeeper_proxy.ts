import {OutType} from '@elchi/tags/tagsType';


export const ZooKeeperProxy: OutType = { "ZooKeeperProxy": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:] The optional path to use for writing ZooKeeper access logs. If the access log field is empty, access logs will not be written.",
    "notImp": true
  },
  {
    "name": "max_packet_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Messages — requests, responses and events — that are bigger than this value will be ignored. If it is not set, the default value is 1Mb.\n\nThe value here should match the jute.maxbuffer property in your cluster configuration:\n\nhttps://zookeeper.apache.org/doc/r3.4.10/zookeeperAdmin.html#Unsafe+Options\n\nif that is set. If it isn't, ZooKeeper's default is also 1Mb.",
    "notImp": false
  }
] };

export const ZooKeeperProxy_SingleFields = [
  "stat_prefix",
  "access_log",
  "max_packet_bytes"
];