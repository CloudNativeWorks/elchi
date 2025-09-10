export const modtag_stateful_session_cookie = [
    {
        alias: 'ssc',
        relativePath: 'envoy/extensions/http/stateful_session/cookie/v3/cookie',
        names: ['CookieBasedSessionState'],
    },
];

export const modtag_stateful_session_header = [
    {
        alias: 'ssh',
        relativePath: 'envoy/extensions/http/stateful_session/header/v3/header',
        names: ['HeaderBasedSessionState', 'HeaderBasedSessionState_SingleFields'],
    },
];
