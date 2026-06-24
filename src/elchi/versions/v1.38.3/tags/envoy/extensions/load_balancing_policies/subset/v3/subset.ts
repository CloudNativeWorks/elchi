import {OutType} from '@elchi/tags/tagsType';


export const Subset: OutType = { "Subset": [
  {
    "name": "fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Subset_LbSubsetFallbackPolicy",
    "enums": [
      "NO_FALLBACK",
      "ANY_ENDPOINT",
      "DEFAULT_SUBSET"
    ],
    "comment": "The behavior used when no endpoint subset matches the selected route's metadata. The value defaults to `NO_FALLBACK`.",
    "notImp": false
  },
  {
    "name": "default_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Specifies the default subset of endpoints used during fallback if fallback_policy is `DEFAULT_SUBSET`. Each field in default_subset is compared to the matching LbEndpoint.Metadata under the ``envoy.lb`` namespace. It is valid for no hosts to match, in which case the behavior is the same as a fallback_policy of `NO_FALLBACK`.",
    "notImp": false
  },
  {
    "name": "subset_selectors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Subset_LbSubsetSelector[]",
    "enums": null,
    "comment": "For each entry, LbEndpoint.Metadata's ``envoy.lb`` namespace is traversed and a subset is created for each unique combination of key and value. For example:\n\n```json\n\n  { \"subset_selectors\": [\n      { \"keys\": [ \"version\" ] },\n      { \"keys\": [ \"stage\", \"hardware_type\" ] }\n  ]}\n```\n\nA subset is matched when the metadata from the selected route and weighted cluster contains the same keys and values as the subset's metadata. The same host may appear in multiple subsets.",
    "notImp": false
  },
  {
    "name": "allow_redundant_keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, only when the request metadata has exactly the **same** keys as one of subset selectors and the values of the related keys are matched, the load balancer will have a valid subset for the request. For example, given the following subset selectors:\n\n```json\n\n  { \"subset_selectors\": [\n      { \"keys\": [ \"version\" ] },\n      { \"keys\": [ \"stage\", \"version\" ] }\n  ]}\n```\n\nA request with metadata ``{\"redundant-key\": \"redundant-value\", \"stage\": \"prod\", \"version\": \"v1\"}`` or ``{\"redundant-key\": \"redundant-value\", \"version\": \"v1\"}`` will not have a valid subset even if the values of keys ``stage`` and ``version`` are matched because of the redundant key/value pair in the request metadata.\n\nBy setting this field to true, the most appropriate keys will be filtered out from the request metadata according to the subset selectors. And then the filtered keys and related values will be matched to find the valid host subset. By this way, redundant key/value pairs are allowed in the request metadata. The keys of a request metadata could be superset of the keys of the subset selectors and need not to be exactly the same as the keys of the subset selectors.\n\nMore specifically, if the keys of a request metadata is a superset of one of the subset selectors, then only the values of the keys that in the selector keys will be matched. Take the above example, if the request metadata is ``{\"redundant-key\": \"redundant-value\", \"stage\": \"prod\", \"version\": \"v1\"}``, the load balancer will only match the values of ``stage`` and ``version`` to find an appropriate subset because ``stage`` ``version`` are contained by the second subset selector and the redundant ``redundant-key`` will be ignored.\n\n:::note\nIf the keys of request metadata is superset of multiple different subset selectors keys, the subset selector with most keys to win. For example, given subset selectors ``{\"subset_selectors\": [\"keys\": [\"A\", \"B\", \"C\"], [\"A\", \"B\"]]}`` and request metadata ``{\"A\": \"-\", \"B\": \"-\", \"C\": \"-\", \"D\": \"-\"}``, keys ``A``, ``B``, ``C`` will be evaluated. If the keys of request metadata is superset of multiple different subset selectors keys and the number of selector keys are same, then the one placed in front to win. For example, given subset selectors ``{\"subset_selectors\": [\"keys\": [\"A\", \"B\"], [\"C\", \"D\"]]}`` and request metadata ``{\"A\": \"-\", \"B\": \"-\", \"C\": \"-\", \"D\": \"-\"}``, keys ``A``, ``B`` will be evaluated.",
    "notImp": false
  },
  {
    "name": "locality_weight_aware",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, routing to subsets will take into account the localities and locality weights of the endpoints when making the routing decision.\n\nThere are some potential pitfalls associated with enabling this feature, as the resulting traffic split after applying both a subset match and locality weights might be undesirable.\n\nConsider for example a situation in which you have 50/50 split across two localities X/Y which have 100 hosts each without subsetting. If the subset LB results in X having only 1 host selected but Y having 100, then a lot more load is being dumped on the single host in X than originally anticipated in the load balancing assignment delivered via EDS.",
    "notImp": false
  },
  {
    "name": "scale_locality_weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When used with locality_weight_aware, scales the weight of each locality by the ratio of hosts in the subset vs hosts in the original subset. This aims to even out the load going to an individual locality if said locality is disproportionately affected by the subset predicate.",
    "notImp": false
  },
  {
    "name": "panic_mode_any",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, when a fallback policy is configured and its corresponding subset fails to find a host this will cause any host to be selected instead.\n\nThis is useful when using the default subset as the fallback policy, given the default subset might become empty. With this option enabled, if that happens the LB will attempt to select a host from the entire cluster.",
    "notImp": false
  },
  {
    "name": "list_as_any",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, metadata specified for a metadata key will be matched against the corresponding endpoint metadata if the endpoint metadata matches the value exactly OR it is a list value and any of the elements in the list matches the criteria.",
    "notImp": false
  },
  {
    "name": "metadata_fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Subset_LbSubsetMetadataFallbackPolicy",
    "enums": [
      "METADATA_NO_FALLBACK",
      "FALLBACK_LIST"
    ],
    "comment": "Fallback mechanism that allows to try different route metadata until a host is found. If load balancing process, including all its mechanisms (like `fallback_policy`) fails to select a host, this policy decides if and how the process is repeated using another metadata.\n\nThe value defaults to `METADATA_NO_FALLBACK`.",
    "notImp": false
  },
  {
    "name": "subset_lb_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadBalancingPolicy",
    "enums": null,
    "comment": "The child LB policy to create for endpoint-picking within the chosen subset.",
    "notImp": false
  }
] };

export const Subset_SingleFields = [
  "fallback_policy",
  "allow_redundant_keys",
  "locality_weight_aware",
  "scale_locality_weight",
  "panic_mode_any",
  "list_as_any",
  "metadata_fallback_policy"
];

export const Subset_LbSubsetSelector: OutType = { "Subset_LbSubsetSelector": [
  {
    "name": "keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "List of keys to match with the weighted cluster metadata.",
    "notImp": false
  },
  {
    "name": "single_host_per_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Selects a mode of operation in which each subset has only one host. This mode uses the same rules for choosing a host, but updating hosts is faster, especially for large numbers of hosts.\n\nIf a match is found to a host, that host will be used regardless of priority levels.\n\nWhen this mode is enabled, configurations that contain more than one host with the same metadata value for the single key in ``keys`` will use only one of the hosts with the given key; no requests will be routed to the others. The cluster gauge `lb_subsets_single_host_per_subset_duplicate` indicates how many duplicates are present in the current configuration.",
    "notImp": false
  },
  {
    "name": "fallback_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Subset_LbSubsetSelector_LbSubsetSelectorFallbackPolicy",
    "enums": [
      "NOT_DEFINED",
      "NO_FALLBACK",
      "ANY_ENDPOINT",
      "DEFAULT_SUBSET",
      "KEYS_SUBSET"
    ],
    "comment": "The behavior used when no endpoint subset matches the selected route's metadata.",
    "notImp": false
  },
  {
    "name": "fallback_keys_subset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Subset of `keys` used by `KEYS_SUBSET` fallback policy. It has to be a non empty list if KEYS_SUBSET fallback policy is selected. For any other fallback policy the parameter is not used and should not be set. Only values also present in `keys` are allowed, but ``fallback_keys_subset`` cannot be equal to ``keys``.",
    "notImp": false
  }
] };

export const Subset_LbSubsetSelector_SingleFields = [
  "keys",
  "single_host_per_subset",
  "fallback_policy",
  "fallback_keys_subset"
];