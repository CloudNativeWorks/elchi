export const modtag_jwt_authn = [
    {
        alias: 'ja',
        relativePath: 'envoy/extensions/filters/http/jwt_authn/v3/config',
        names: ['JwtAuthentication', 'JwtAuthentication_SingleFields'],
    },
];

// Complex fields that still need implementation
export const modtag_excluded_jwt_authn: string[] = [
    'rules',              // RequirementRule[] - complex array with route matching (TODO)
    'filter_state_rules', // FilterStateRule - dynamic filter state requirements (TODO)
];
