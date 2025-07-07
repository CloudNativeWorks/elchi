import {OutType} from '@/elchi/tags/tagsType';


export const FileBasedKeyValueStoreConfig: OutType = { "FileBasedKeyValueStoreConfig": [
  {
    "name": "filename",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filename to read the keys and values from, and write the keys and values to.",
    "notImp": false
  },
  {
    "name": "flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval at which the key value store should be flushed to the file.",
    "notImp": false
  },
  {
    "name": "max_entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of entries to cache, or 0 to allow for unlimited entries. Defaults to 1000 if not present.",
    "notImp": false
  }
] };

export const FileBasedKeyValueStoreConfig_SingleFields = [
  "filename",
  "flush_interval",
  "max_entries"
];