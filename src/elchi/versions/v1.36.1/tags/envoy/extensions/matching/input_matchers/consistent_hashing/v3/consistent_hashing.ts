import {OutType} from '@elchi/tags/tagsType';


export const ConsistentHashing: OutType = { "ConsistentHashing": [
  {
    "name": "threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The threshold the resulting hash must be over in order for this matcher to evaluate to true. This value must be below the configured modulo value. Setting this to 0 is equivalent to this matcher always matching.",
    "notImp": false
  },
  {
    "name": "modulo",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The value to use for the modulus in the calculation. This effectively  bounds the hash output, specifying the range of possible values. This value must be above the configured threshold.",
    "notImp": false
  },
  {
    "name": "seed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional seed passed through the hash function. This allows using additional information when computing the hash value: by changing the seed value, a different partition of matching and non-matching inputs will be created that remains consistent for that seed value.",
    "notImp": false
  }
] };

export const ConsistentHashing_SingleFields = [
  "threshold",
  "modulo",
  "seed"
];