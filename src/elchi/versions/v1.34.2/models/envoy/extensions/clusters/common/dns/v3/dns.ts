// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/clusters/common/dns/v3/dns.proto

/* eslint-disable */

export const protobufPackage = "envoy.extensions.clusters.common.dns.v3";

export enum DnsLookupFamily {
  UNSPECIFIED = "UNSPECIFIED",
  AUTO = "AUTO",
  V4_ONLY = "V4_ONLY",
  V6_ONLY = "V6_ONLY",
  V4_PREFERRED = "V4_PREFERRED",
  ALL = "ALL",
}

export function dnsLookupFamilyFromJSON(object: any): DnsLookupFamily {
  switch (object) {
    case 0:
    case "UNSPECIFIED":
      return DnsLookupFamily.UNSPECIFIED;
    case 1:
    case "AUTO":
      return DnsLookupFamily.AUTO;
    case 2:
    case "V4_ONLY":
      return DnsLookupFamily.V4_ONLY;
    case 3:
    case "V6_ONLY":
      return DnsLookupFamily.V6_ONLY;
    case 4:
    case "V4_PREFERRED":
      return DnsLookupFamily.V4_PREFERRED;
    case 5:
    case "ALL":
      return DnsLookupFamily.ALL;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum DnsLookupFamily");
  }
}

export function dnsLookupFamilyToJSON(object: DnsLookupFamily): string {
  switch (object) {
    case DnsLookupFamily.UNSPECIFIED:
      return "UNSPECIFIED";
    case DnsLookupFamily.AUTO:
      return "AUTO";
    case DnsLookupFamily.V4_ONLY:
      return "V4_ONLY";
    case DnsLookupFamily.V6_ONLY:
      return "V6_ONLY";
    case DnsLookupFamily.V4_PREFERRED:
      return "V4_PREFERRED";
    case DnsLookupFamily.ALL:
      return "ALL";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum DnsLookupFamily");
  }
}

export function dnsLookupFamilyToNumber(object: DnsLookupFamily): number {
  switch (object) {
    case DnsLookupFamily.UNSPECIFIED:
      return 0;
    case DnsLookupFamily.AUTO:
      return 1;
    case DnsLookupFamily.V4_ONLY:
      return 2;
    case DnsLookupFamily.V6_ONLY:
      return 3;
    case DnsLookupFamily.V4_PREFERRED:
      return 4;
    case DnsLookupFamily.ALL:
      return 5;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum DnsLookupFamily");
  }
}
