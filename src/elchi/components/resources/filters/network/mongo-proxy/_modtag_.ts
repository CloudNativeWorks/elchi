import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_mongo_proxy = [
    {
        alias: 'mp',
        relativePath: 'envoy/extensions/filters/network/mongo_proxy/v3/mongo_proxy',
        names: ['MongoProxy', 'MongoProxy_SingleFields'],
    },
];

export const modtag_us_mongoproxy: TagsType = {
    'MongoProxy': []
}
