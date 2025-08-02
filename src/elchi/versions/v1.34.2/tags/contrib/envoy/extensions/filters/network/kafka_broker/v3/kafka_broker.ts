import {OutType} from '@elchi/tags/tagsType';


export const KafkaBroker: OutType = { "KafkaBroker": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "force_response_rewrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set to true if broker filter should attempt to serialize the received responses from the upstream broker instead of passing received bytes as is. Disabled by default.",
    "notImp": false
  },
  {
    "name": "broker_address_rewrite_spec.id_based_broker_address_rewrite_spec",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "IdBasedBrokerRewriteSpec",
    "enums": null,
    "comment": "Broker address rewrite rules that match by broker ID.",
    "notImp": false
  },
  {
    "name": "api_keys_allowed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Optional list of allowed Kafka API keys. Only requests with provided API keys will be routed, otherwise the connection will be closed. No effect if empty.",
    "notImp": false
  },
  {
    "name": "api_keys_denied",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Optional list of denied Kafka API keys. Requests with API keys matching this list will have the connection closed. No effect if empty.",
    "notImp": false
  }
] };

export const KafkaBroker_SingleFields = [
  "stat_prefix",
  "force_response_rewrite",
  "api_keys_allowed",
  "api_keys_denied"
];

export const IdBasedBrokerRewriteSpec: OutType = { "IdBasedBrokerRewriteSpec": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IdBasedBrokerRewriteRule[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const IdBasedBrokerRewriteRule: OutType = { "IdBasedBrokerRewriteRule": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Broker ID to match.",
    "notImp": false
  },
  {
    "name": "host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The host value to use (resembling the host part of Kafka's advertised.listeners). The value should point to the Envoy (not Kafka) listener, so that all client traffic goes through Envoy.",
    "notImp": false
  },
  {
    "name": "port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The port value to use (resembling the port part of Kafka's advertised.listeners). The value should point to the Envoy (not Kafka) listener, so that all client traffic goes through Envoy.",
    "notImp": false
  }
] };

export const IdBasedBrokerRewriteRule_SingleFields = [
  "id",
  "host",
  "port"
];