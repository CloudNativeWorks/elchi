import {OutType} from '@elchi/tags/tagsType';


export const CgroupMemoryConfig: OutType = { "CgroupMemoryConfig": [
  {
    "name": "max_memory_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional max memory limit in bytes used for memory pressure calculations. If set, this value is used as an upper bound on the memory limit, taking the minimum between this value and the system's cgroup memory limit. If not set, the system's cgroup memory limit is always used.",
    "notImp": false
  }
] };

export const CgroupMemoryConfig_SingleFields = [
  "max_memory_bytes"
];