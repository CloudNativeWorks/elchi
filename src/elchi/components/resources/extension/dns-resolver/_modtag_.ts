export const modtag_apple_dns_resolver = [
    {
        alias: 'adr',
        relativePath: 'envoy/extensions/network/dns_resolver/apple/v3/apple_dns_resolver',
        names: ['AppleDnsResolverConfig', 'AppleDnsResolverConfig_SingleFields'],
    },
];

export const modtag_cares_dns_resolver = [
    {
        alias: 'cdr',
        relativePath: 'envoy/extensions/network/dns_resolver/cares/v3/cares_dns_resolver',
        names: ['CaresDnsResolverConfig', 'CaresDnsResolverConfig_SingleFields'],
    },
    {
        alias: 'dro',
        relativePath: 'envoy/config/core/v3/resolver',
        names: ['DnsResolverOptions', 'DnsResolverOptions_SingleFields'],
    },
];

export const modtag_getaddrinfo_dns_resolver = [
    {
        alias: 'gdr',
        relativePath: 'envoy/extensions/network/dns_resolver/getaddrinfo/v3/getaddrinfo_dns_resolver',
        names: ['GetAddrInfoDnsResolverConfig', 'GetAddrInfoDnsResolverConfig_SingleFields'],
    },
];
