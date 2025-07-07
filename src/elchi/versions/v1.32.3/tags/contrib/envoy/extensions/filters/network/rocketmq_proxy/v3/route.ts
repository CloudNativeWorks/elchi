import {OutType} from '@/elchi/tags/tagsType';


export const RouteConfiguration: OutType = { "RouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration.",
    "notImp": false
  },
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Route[]",
    "enums": null,
    "comment": "The list of routes that will be matched, in order, against incoming requests. The first route that matches will be used.",
    "notImp": false
  }
] };

export const RouteConfiguration_SingleFields = [
  "name"
];

export const RouteMatch: OutType = { "RouteMatch": [
  {
    "name": "topic",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The name of the topic.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the route should match on. The router will check the request’s headers against all the specified headers in the route config. A match will happen if all the headers in the route are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  }
] };

export const RouteAction: OutType = { "RouteAction": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates the upstream cluster to which the request should be routed.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer.",
    "notImp": false
  }
] };

export const RouteAction_SingleFields = [
  "cluster"
];

export const Route: OutType = { "Route": [
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch",
    "enums": null,
    "comment": "Route matching parameters.",
    "notImp": false
  },
  {
    "name": "route",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction",
    "enums": null,
    "comment": "Route request to some upstream cluster.",
    "notImp": false
  }
] };