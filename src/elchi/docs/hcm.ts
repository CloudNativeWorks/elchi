
export const hcm =`
# HTTP connection management

HTTP is such a critical component of modern service-oriented architectures that Envoy implements a large amount of HTTP-specific functionality. Envoy has a built-in network level filter called the HTTP connection manager.

This filter translates raw bytes into HTTP level messages and events (e.g., headers received, body data received, trailers received, etc.).

It also handles functionality common to all HTTP connections and requests such as access logging, request ID generation and tracing, request/response header manipulation, route table management, and statistics.

:::note 
See the HTTP connection manager configuration and protobuf sections for reference documentation.
:::
---

## HTTP protocols

Envoy's HTTP connection manager has native support for **HTTP/1.1**, **HTTP/2**, and **HTTP/3**, including **WebSockets**.

Envoy's HTTP support was designed to first and foremost be an HTTP/2 multiplexing proxy. Internally, HTTP/2 terminology is used to describe system components. For example, an HTTP request and response take place on a "stream".

A codec API is used to translate from different wire protocols into a protocol-agnostic form for streams, requests, responses, etc.

In the case of HTTP/1.1, the codec translates the serial/pipelining capabilities of the protocol into something that looks like HTTP/2 to higher layers. This means that the majority of the code does not need to understand whether a stream originated on an HTTP/1.1, HTTP/2, or HTTP/3 connection.

---

## HTTP lifecycle

Proxying of the request begins when the downstream HTTP codec has successfully decoded the request header map.

The point at which the proxying completes and the stream is destroyed depends on the upstream protocol and whether independent half-close is enabled.

If independent half-close is enabled and the upstream protocol is either HTTP/2 or HTTP/3, the stream is destroyed after both request and response are complete, i.e., they reach their respective end-of-stream by receiving trailers or the header/body with end-stream set in both directions, and the response has a success (2xx) status code.

For the HTTP/1 upstream protocol or if independent half-close is disabled, the stream is destroyed when the response is complete and reaches its end-of-stream, even if the request has not yet completed. If the request was incomplete at response completion, the stream is reset.

Note that proxying can stop early when an error or timeout occurs or when a peer resets the HTTP/2 or HTTP/3 stream.

---

## HTTP header sanitizing

The HTTP connection manager performs various header sanitizing actions for security reasons.

---

## Route table configuration

Each HTTP connection manager filter has an associated route table, which can be specified in one of two ways:

- Statically.
- Dynamically via the RDS API.

---

## Retry plugin configuration

Normally during retries, host selection follows the same process as the original request. Retry plugins can be used to modify this behavior, and they fall into two categories:

### Host Predicates

These predicates can be used to "reject" a host, causing host selection to be reattempted. Any number of these predicates can be specified, and **the host will be rejected if any of the predicates reject the host**.

Envoy supports the following built-in host predicates:

- **PreviousHostsPredicate**: Keeps track of previously attempted hosts and rejects hosts that have already been attempted.
- **OmitCanaryHostsPredicate**: Rejects any host marked as a canary host. Hosts are marked by setting \`canary: true\` for the \`envoy.lb\` filter in the endpoint's filter metadata. See LbEndpoint for more details.
- **OmitHostMetadataConfig**: Rejects hosts based on predefined metadata match criteria.

### Priority Predicates

These predicates can be used to adjust the priority load when selecting a priority for a retry attempt. **Only one priority predicate may be specified**.

- **PreviousPrioritiesConfig**: Keeps track of previously attempted priorities and adjusts the priority load so that other priorities are targeted in subsequent retry attempts.

Host selection will continue until either the configured predicates accept the host or a configurable max attempts is reached.

These plugins can be combined to affect both host selection and priority load. Envoy can also be extended with custom retry plugins similar to how custom filters can be added.

---

### Retry configuration examples

\`PreviousHostsPredicate\`

For example, to configure retries to prefer hosts that haven’t been attempted already, the built-in PreviousHostsPredicate can be used:

\`\`\`yaml
routes:
- match:
    prefix: "/"
route:
    cluster: cluster_0
    retry_policy:
    retry_host_predicate:
    - name: envoy.retry_host_predicates.previous_hosts
        typed_config:
        "@type": type.googleapis.com/envoy.extensions.retry.host.previous_hosts.v3.PreviousHostsPredicate
    host_selection_retry_max_attempts: 3
\`\`\`

This will reject hosts previously attempted, retrying host selection a maximum of 3 times. The bound on attempts is necessary in order to deal with scenarios in which finding an acceptable host is either impossible (no hosts satisfy the predicate) or very unlikely (the only suitable host has a very low relative weight).

\`OmitHostMetadataConfig\`

To reject a host based on its metadata, OmitHostMetadataConfig can be used:

\`\`\`yaml
routes:
- match:
    prefix: "/"
route:
    cluster: cluster_0
    retry_policy:
    retry_host_predicate:
    - name: envoy.retry_host_predicates.omit_host_metadata
        typed_config:
        "@type": type.googleapis.com/envoy.extensions.retry.host.omit_host_metadata.v3.OmitHostMetadataConfig
        metadata_match:
            filter_metadata:
            envoy.lb:
                key: value
\`\`\`
This will reject any host with matching (key, value) in its metadata.

\`PreviousPrioritiesConfig\`

To configure retries to attempt other priorities during retries, the built-in PreviousPrioritiesConfig can be used.

\`\`\`yaml
routes:
- match:
    prefix: "/"
route:
    cluster: cluster_0
    retry_policy:
    retry_priority:
        name: envoy.retry_priorities.previous_priorities
        typed_config:
        "@type": type.googleapis.com/envoy.extensions.retry.priority.previous_priorities.v3.PreviousPrioritiesConfig
        update_frequency: 2
\`\`\`
This will target priorities in subsequent retry attempts that haven’t been already used. The update_frequency parameter decides how often the priority load should be recalculated.

### Combined retry policy

These plugins can be combined, which will exclude both previously attempted hosts as well as previously attempted priorities.

\`\`\`yaml
routes:
- match:
    prefix: "/"
route:
    cluster: cluster_0
    retry_policy:
    retry_host_predicate:
    - name: envoy.retry_host_predicates.previous_hosts
        typed_config:
        "@type": type.googleapis.com/envoy.extensions.retry.host.previous_hosts.v3.PreviousHostsPredicate
    host_selection_retry_max_attempts: 3
    retry_priority:
        name: envoy.retry_priorities.previous_priorities
        typed_config:
        "@type": type.googleapis.com/envoy.extensions.retry.priority.previous_priorities.v3.PreviousPrioritiesConfig
        update_frequency: 2
\`\`\`

### Internal redirects
Envoy supports handling 3xx redirects internally, that is capturing a configurable 3xx redirect response, synthesizing a new request, sending it to the upstream specified by the new route match, and returning the redirected response as the response to the original request. The headers and body of the original request will be sent in the redirect to the new location. Trailers are not yet supported.

Internal redirects are configured via the internal_redirect_policy field in route configuration. When redirect handling is on, any 3xx response from upstream, that matches redirect_response_codes is subject to the redirect being handled by Envoy.

If Envoy is configured to internally redirect HTTP \`303\` and receives an HTTP \`303\` response, it will dispatch the redirect with a bodiless HTTP \`GET\` if the original request was not a \`GET\` or \`HEAD\` request. Otherwise, Envoy will preserve the original HTTP method. For more information, see [RFC 7231 Section 6.4.4](https://tools.ietf.org/html/rfc7231#section-6.4.4).

For a redirect to be handled successfully it must pass the following checks:

1. Have a response code matching one of redirect_response_codes, which is either \`302\` (by default), or a set of 3xx codes (\`301\`, \`302\`, \`303\`, \`307\`, \`308\`).

2. Have a \`location\` header with a valid, fully qualified URL.

3. The request must have been fully processed by Envoy.

4. The request must be smaller than the per_request_buffer_limit_bytes limit.

5. allow_cross_scheme_redirect is \`true\` (default to \`false\`), or the scheme of the downstream request and the \`location\` header are the same.

6. The number of previously handled internal redirect within a given downstream request does not exceed max_internal_redirects of the route that the request or redirected request is hitting.

7. All predicates accept the target route.

Any failure will result in the redirect being passed downstream instead.

Since a redirected request may be bounced between different routes, any route in the chain of redirects that …

- does not have internal redirect enabled

- or, has a max_internal_redirects smaller or equal to the redirect chain length when the redirect chain hits it

- or, is disallowed by any of the predicates

... will cause the redirect to be passed downstream.


Two predicates can be used to create a DAG that defines the redirect chain, the previous_routes predicate, and the allow_listed_routes. Specifically, the allow_listed_routes predicate defines edges of individual node in the DAG and the previous_routes predicate defines “visited” state of the edges, so that loop can be avoided if so desired.

A third predicate safe_cross_scheme can be used to prevent HTTP -> HTTPS redirect.

Once the redirect has passed these checks, the request headers which were shipped to the original upstream will be modified by:

1. Putting the fully qualified original request URL in the \`x-envoy-original-url\` header.

2. Replacing the \`Authority\`/\`Host\`, \`Scheme\`, and Path headers with the values from the \`Location\` header.

3. Copying any headers listed in response_headers_to_copy from the redirect response into the headers that will be used in the subsequent request.

The altered request headers will then have a new route selected, be sent through a new filter chain, and then shipped upstream with all of the normal Envoy request sanitization taking place.

:::warning
Note that HTTP connection manager sanitization such as clearing untrusted headers will only be applied once. Per-route header modifications will be applied on both the original route and the second route, even if they are the same, so be careful configuring header modification rules to avoid duplicating undesired header values.
:::

:::warning
Note that no downstream filters will see the response that triggers the internal redirect. If there is a need to pass data between the redirect response and the followup request, see response_headers_to_copy.
:::

A sample redirect flow might look like this:

1. Client sends a \`GET\` request for http://foo.com/bar.

2. Upstream 1 sends a \`302\` with \`location: http://baz.com/eep\`.

3. Envoy is configured to allow redirects on the original route, and sends a new \`GET\` request to Upstream 2, to fetch http://baz.com/eep with the additional request header \`x-envoy-original-url: http://foo.com/bar\`.

4. Envoy proxies the response data for http://baz.com/eep to the client as the response to the original request.

### Timeouts
Various configurable timeouts apply to an HTTP connection and its constituent streams. Please see this FAQ entry for an overview of important timeout configuration.

### HTTP header map settings
Envoy maintains the insertion order of headers (and pseudo headers that begin with \`:\`) in the HTTP header map using a linked list data-structure, which is very fast when the number of headers is small.

`