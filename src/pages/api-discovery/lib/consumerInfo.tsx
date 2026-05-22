import React from 'react';

// Shared explanation of what a "consumer" is — used by every InfoLabel that
// surfaces consumer data (the Consumers dashboard, the leaderboard column,
// the consumer drawer, and the endpoint-detail "Consumers" card).
export const CONSUMER_INFO: React.ReactNode = (
    <div style={{ maxWidth: 340, fontSize: 12, lineHeight: 1.5 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>What is a consumer?</div>
        <div style={{ marginBottom: 6 }}>
            The <strong>caller / client</strong> that invokes the API — not the server. The
            collector fingerprints each request’s identity into a salted, irreversible hash (the
            raw token / key / subject is never stored).
        </div>
        <div style={{ marginBottom: 4 }}>Identity is resolved in priority order:</div>
        <ol style={{ margin: '0 0 6px', paddingLeft: 18 }}>
            <li><strong>JWT</strong> — the <code>sub</code> claim of the Bearer token</li>
            <li><strong>mTLS</strong> — the client certificate subject</li>
            <li><strong>API key</strong> — the <code>X-Api-Key</code> header</li>
            <li><strong>none</strong> — no identity → counted as anonymous</li>
        </ol>
        <div style={{ opacity: 0.85 }}>
            A consumer is an <em>identity</em>, not an IP — one identity can connect from many IPs
            (see distinct IPs / top source IPs). Anonymous requests have no stable identity, so they
            are counted separately and kept out of the leaderboard. It’s the “who” behind a BOLA /
            brute-force / scraping pattern.
        </div>
    </div>
);
