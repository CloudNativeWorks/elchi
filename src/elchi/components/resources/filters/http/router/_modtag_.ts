import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_router = [
    {
        alias: 'rtr',
        relativePath: 'envoy/extensions/filters/http/router/v3/router',
        names: ['Router', 'Router_SingleFields'],
    },
];

export const modtag_us_router: TagsType = {
    "HttpRouter": [
        'start_child_span',
        'upstream_log',
        'upstream_log_options',
        'upstream_http_filters'
    ],
}
