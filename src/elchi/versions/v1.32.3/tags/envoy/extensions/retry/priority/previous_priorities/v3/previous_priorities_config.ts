import {OutType} from '@/elchi/tags/tagsType';


export const PreviousPrioritiesConfig: OutType = { "PreviousPrioritiesConfig": [
  {
    "name": "update_frequency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "How often the priority load should be updated based on previously attempted priorities. Useful to allow each priorities to receive more than one request before being excluded or to reduce the number of times that the priority load has to be recomputed.\n\nFor example, by setting this to 2, then the first two attempts (initial attempt and first retry) will use the unmodified priority load. The third and fourth attempt will use priority load which excludes the priorities routed to with the first two attempts, and the fifth and sixth attempt will use the priority load excluding the priorities used for the first four attempts.\n\nMust be greater than 0.",
    "notImp": false
  }
] };

export const PreviousPrioritiesConfig_SingleFields = [
  "update_frequency"
];