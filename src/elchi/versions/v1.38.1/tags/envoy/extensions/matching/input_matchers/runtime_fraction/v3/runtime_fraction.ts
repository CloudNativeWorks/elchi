import {OutType} from '@elchi/tags/tagsType';


export const RuntimeFraction: OutType = { "RuntimeFraction": [
  {
    "name": "runtime_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Match the input against the given runtime key. The specified default value is used if key is not present in the runtime configuration.",
    "notImp": false
  },
  {
    "name": "seed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional seed passed through the hash function. This allows using additional information when computing the hash value: by changing the seed value, a potentially different outcome can be achieved for the same input.",
    "notImp": false
  }
] };

export const RuntimeFraction_SingleFields = [
  "seed"
];