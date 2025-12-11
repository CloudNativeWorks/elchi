import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_wasm = [
    {
        alias: 'wsm',
        relativePath: 'envoy/extensions/filters/http/wasm/v3/wasm',
        names: ['Wasm'],
    },
];

export const modtag_config = [
    {
        alias: 'cnfg',
        relativePath: 'envoy/extensions/wasm/v3/wasm',
        names: ['PluginConfig', 'PluginConfig_SingleFields'],
    },
];

export const modtag_vm_config = [
    {
        alias: 'vm',
        relativePath: 'envoy/extensions/wasm/v3/wasm',
        names: ['VmConfig', 'VmConfig_SingleFields'],
    },
];

export const modtag_us_wasm: TagsType = {
    "config": [
        "fail_open",
        "capability_restriction_config",
    ],
    "vm_config": [
        "environment_variables",
    ]
}
