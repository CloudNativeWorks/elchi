export const modtag_header_mutation = [
    {
        alias: 'hm',
        relativePath: 'envoy/extensions/filters/http/header_mutation/v3/header_mutation',
        names: ['HeaderMutation', 'HeaderMutation_SingleFields', 'Mutations'],
    },
];

export const modtag_header_mutation_per_route = [
    {
        alias: 'hmpr',
        relativePath: 'envoy/extensions/filters/http/header_mutation/v3/header_mutation',
        names: ['HeaderMutationPerRoute'],
    },
];

export const modtag_mutations = [
    {
        alias: 'hm',
        relativePath: 'envoy/extensions/filters/http/header_mutation/v3/header_mutation',
        names: ['Mutations'],
    },
    {
        alias: 'kvm',
        relativePath: 'envoy/config/core/v3/base',
        names: ['KeyValueMutation', 'KeyValueAppend'],
    },
];
