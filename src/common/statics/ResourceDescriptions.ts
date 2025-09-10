
export const D_LISTENER = `
A **Listener** in Proxy is a core networking component that defines how the proxy receives incoming connections. Each Listener is bound to a specific IP address and port combination and is responsible for accepting traffic from downstream clients.

Listeners operate at the **transport layer (Layer 4)** and serve as the entry point for requests into Proxy. Once a connection is accepted, the Listener passes the request through a chain of filters, such as TLS termination, connection limits, and protocol detection, before handing it off to higher-level components like the HTTP Connection Manager (HCM).

### 🔍 Key Responsibilities
- Bind to IP/port and listen for new connections.
- Apply **listener-level filters** (e.g., TLS, original destination, connection limits).
- Dispatch traffic to the appropriate **filter chain** based on criteria such as SNI, destination IP/port, or ALPN.
- Integrate with advanced features like **listener discovery (LDS)** and **dynamic filter chain matching**.

### 🧩 Common Use Cases
- Accepting HTTP/HTTPS traffic on ports like \`80\` or \`443\`.
- Terminating TLS with the \`tls_inspector\` filter and matching SNI.
- Multiplexing different protocols using ALPN or connection metadata.

### 🧠 Good to Know
- A single proxy instance can have multiple Listeners for different ports or interfaces.
- Listeners can be dynamically updated via the **Listener Discovery Service (LDS)** without restarting proxy.
- Filters within a Listener define how traffic is processed before it's routed to clusters.`

export const D_ROUTE = `
**Routes** in Proxy define how HTTP requests are processed and forwarded once they have been decoded by the HTTP Connection Manager (HCM). They are part of the **Route Discovery Service (RDS)**, which allows routes to be dynamically configured without restarting the proxy.

A route configuration consists of **virtual hosts**, each containing a set of **routing rules**. These rules match incoming request attributes—such as the path, headers, or query parameters—and determine how the request should be handled, including which upstream cluster it should be forwarded to.

### 🔍 Key Responsibilities
- Match incoming HTTP requests based on path, headers, or other metadata.
- Direct requests to appropriate **clusters**, possibly with weighted or mirrored routing.
- Apply **filters**, **timeouts**, **retry policies**, and **header transformations**.
- Support advanced routing features like **prefix rewrites**, **regex path matching**, and **per-filter configurations**.

### 🧩 Common Use Cases
- Routing \`/api/v1/\` requests to one cluster and \`/static/\` to another.
- Performing **canary deployments** by splitting traffic between clusters.
- Setting custom headers or request/response modifications per route.
- Enforcing retry logic or timeout values on specific endpoints.

### 🧠 Good to Know
- Routes are scoped under **Virtual Hosts**, which are selected based on the request's \`Host\` or \`:authority\` header.
- Dynamic updates to routes are handled via the **Route Discovery Service (RDS)**, part of the xDS API.
- Routing rules can be fine-tuned with **match conditions**, **header matchers**, and **runtime feature flags**.`

export const D_VIRTUAL_HOST = `
A **Virtual Host** in proxy is a logical grouping of routes that are selected based on the value of the \`Host\` or \`:authority\` header in an HTTP request. It allows proxy to serve multiple domains or subdomains from a single Listener and HTTP Connection Manager by isolating route configurations per hostname.

Each Virtual Host contains a set of **routing rules** that define how requests should be matched and forwarded based on paths, headers, or other criteria.

### 🔍 Key Responsibilities
- Match incoming HTTP requests by their \`Host\` or \`:authority\` header.
- Contain and isolate routing rules within a specific hostname context.
- Serve as the top-level container for route definitions in the **Route Configuration**.

### 🧩 Common Use Cases
- Serving multiple applications on different domains or subdomains (e.g., \`api.example.com\`, \`www.example.com\`) from a single proxy instance.
- Applying different routing logic for each domain, including different clusters, timeouts, or header transformations.
- Implementing domain-based traffic segmentation, redirection, or rewriting.

### 🧠 Good to Know
- If no Virtual Host matches a request’s host, the **default virtual host** (if defined) is used.
- Routes are evaluated in the order defined within the Virtual Host.
- Virtual Hosts can define global policies such as CORS settings, request/response header manipulation, and rate limits that apply to all their routes.`

export const D_CLUSTER = `
A **Cluster** in Proxy represents a logical grouping of upstream hosts that Proxy routes traffic to. It defines how Proxy connects to backends, performs load balancing, handles retries, and manages health checks.

Clusters are a fundamental part of Proxy's upstream routing logic and are used by route configurations to direct traffic. They can represent static IP addresses, DNS-based services, or dynamically discovered endpoints via the Endpoint Discovery Service (EDS).

### 🔍 Key Responsibilities
- Maintain a list of upstream endpoints (hosts).
- Perform **load balancing** across endpoints.
- Support **connection pooling**, **retries**, **timeouts**, and **circuit breakers**.
- Optionally use **active** or **passive health checks** to determine host availability.
- Integrate with **Endpoint Discovery Service (EDS)** for dynamic endpoint updates.

### 🧩 Common Use Cases
- Load balancing traffic across multiple instances of a microservice.
- Connecting to external services over DNS (e.g., \`api.external-service.com\`).
- Defining failover behavior between primary and backup clusters.
- Controlling connection limits, timeouts, and retry budgets for upstream services.

### ⚙️ Cluster Types
- **STATIC** – Manually configured fixed list of endpoints.
- **STRICT_DNS** – Resolves hostnames and refreshes endpoint list periodically.
- **LOGICAL_DNS** – Resolves DNS once and uses a single endpoint.
- **EDS (Endpoint Discovery Service)** – Dynamically managed endpoints via control plane.

### 🧠 Good to Know
- Each cluster can have its own load balancing policy (e.g., round robin, least request, random).
- Clusters are often referenced by name in **Route configurations**.
- Proxy supports advanced features like **outlier detection**, **original destination routing**, and **TLS settings per cluster**.`

export const D_ENDPOINT = `
**Endpoints** represent the actual network locations (IP and port) of the backend services that a **Cluster** can route traffic to. Endpoints are the lowest-level upstream units and are discovered dynamically through the **Endpoint Discovery Service (EDS)** or defined statically.

Each endpoint belongs to a specific cluster and may include metadata, health status, and load balancing weight. Proxy uses this data to make intelligent routing decisions.

### 🔍 Key Responsibilities
- Represent the concrete IP and port of upstream services.
- Provide metadata used for load balancing, locality-aware routing, and subset routing.
- Carry health status information for active/passive health checks.
- Dynamically update based on changes in service discovery systems (e.g., Kubernetes, Consul).

### 🧩 Common Use Cases
- Reflecting real-time changes in backend services (e.g., scaling events).
- Assigning weights to endpoints for canary or weighted routing.
- Leveraging locality information to route traffic to nearby endpoints.
- Using metadata (e.g., version, zone) for advanced routing strategies.

### 🧠 Good to Know
- EDS updates endpoints for each cluster without restarting proxy.
- Endpoints can be grouped into **localities** (region/zone/sub-zone) for **priority-based** and **locality-aware** load balancing.
- Endpoint health status is considered when selecting upstream hosts—only healthy endpoints are eligible for routing if health checks are configured.`

export const D_TLS = `
**TLS (Transport Layer Security)** is a cryptographic protocol used to secure communication between clients and servers by encrypting the data in transit. It ensures confidentiality, integrity, and authenticity of the data being exchanged.

In proxy configurations, TLS can be applied at both the inbound and outbound connection levels. This allows secure communication to and from the proxy while enforcing security policies like certificate validation and protocol restrictions.

### 🔍 Key Responsibilities
- Encrypt data transmitted over the network to prevent eavesdropping.
- Authenticate peers using X.509 certificates.
- Ensure data integrity through message authentication codes (MACs).
- Support modern cryptographic algorithms and secure ciphers.

### 🧩 Common Use Cases
- Terminating HTTPS traffic on inbound connections.
- Establishing secure TLS connections to upstream servers.
- Enforcing mutual TLS (mTLS) for secure service-to-service communication.
- Validating client certificates for authorization.

### 🧠 Good to Know
- TLS settings can be defined per connection context (e.g., server or client).
- Protocol versions (e.g., TLS 1.2, TLS 1.3) and cipher suites can be explicitly configured.
- Certificate validation includes checking expiration, trust chain, and subject/issuer fields.
- TLS settings often include options for ALPN negotiation, SNI matching, and session ticket handling.`

export const D_SECRET = `
**Secrets** refer to sensitive configuration data such as TLS certificates, private keys, and authentication credentials that are used to secure communication and enforce access control policies.

These values are typically stored and managed securely, separate from the main configuration, and are dynamically delivered or loaded at runtime to ensure security and flexibility.

### 🔍 Key Responsibilities
- Store **TLS certificates**, **private keys**, and **trusted CA bundles** for secure connections.
- Provide credentials used in **authentication mechanisms** such as mTLS or token-based systems.
- Enable dynamic rotation and revocation of security credentials without restarting the proxy.
- Serve as the foundation for secure communication between services.

### 🧩 Common Use Cases
- Loading server certificates for TLS termination.
- Configuring trusted Certificate Authorities (CAs) for client certificate validation.
- Managing secrets through integration with secure storage backends like HashiCorp Vault or Kubernetes Secrets.
- Dynamically updating certificates to prevent downtime during renewal.

### 🧠 Good to Know
- Secrets can be scoped to specific connections or listeners.
- They are often loaded via a dedicated discovery service or secret management system.
- Best practices include using short-lived certificates and rotating them automatically.
- Secrets must be handled with strict access controls to prevent unauthorized access.`

export const D_FILTER = `
**Filters** are modular processing units that inspect, modify, or control traffic as it passes through the proxy. They can operate at different layers of the network stack, such as the transport layer (Network Filters) or application layer (HTTP Filters), and are organized in chains to form a customizable request/response pipeline.

Each filter performs a specific function—such as TLS inspection, rate limiting, request modification, authentication, or logging—and passes control to the next filter in the chain. This design enables flexible and extensible traffic handling.

### 🔍 Key Responsibilities
- Inspect, transform, or block traffic at various stages.
- Enforce security policies such as authentication and authorization.
- Apply traffic management logic like rate limiting, retries, or redirects.
- Provide observability through access logging, tracing, and metrics.

### 🧠 Good to Know
- Filters are executed in order, top-to-bottom for requests and bottom-to-top for responses.
- Many filters are configurable and support advanced features like per-route overrides or dynamic behavior.
- Filters can be statically configured or discovered dynamically via control plane APIs.
- A minimal filter chain must always end with a terminal filter like \`router\` to route the request.`

export const D_EXTENSION = `
**Extensions** are pluggable modules that add custom functionality to the proxy's core behavior. They enable flexible and extensible architecture by allowing users to customize how traffic is handled, observed, or secured—without modifying the core proxy codebase.

Extensions can be applied to a wide range of components such as filters, access loggers, transport sockets, load balancers, resolvers, and more. Each extension implements a specific contract and is registered via a well-defined interface.

### 🔍 Key Responsibilities
- Extend core behavior with custom or optional logic.
- Allow fine-grained control over traffic handling, observability, and security.
- Support dynamic configuration and on-demand loading through typed extension configs.

### 🧠 Good to Know
- Extensions are identified by a unique name (type URL or factory name) and may support versioning.
- Many extensions are built-in, while others can be added via dynamic loading or WASM.
- Unused extensions can be disabled at build time or startup for security and performance.
- The system maintains a registry of available extensions, and unknown extensions are rejected at configuration load time.`

export const D_L_HTTP_INSPECTOR = `
**HTTP Inspector** is a listener filter that detects whether an incoming TCP connection is attempting to initiate an HTTP request. It inspects the initial bytes of the connection and determines whether the protocol being used is HTTP/1.x or HTTP/2.

This filter is useful when multiple filter chains are defined and selection is based on detected application protocols. It allows the system to properly route connections to the appropriate filter chain without relying on fixed ports or TLS ALPN negotiation.

### 🔍 Key Responsibilities
- Inspect the beginning of a TCP stream to detect HTTP protocols.
- Identify whether the protocol is HTTP/1.0, HTTP/1.1, or HTTP/2 (h2c).
- Enable **filter chain matching** based on application protocol without relying on TLS.
- Assist in transparent proxying of HTTP connections.

### 🧩 Common Use Cases
- Selecting between filter chains that handle different protocols (e.g., HTTP vs raw TCP).
- Supporting plaintext HTTP/2 (h2c) detection without ALPN.
- Handling mixed traffic on a single port where protocol detection is needed.
- Enabling dynamic routing or filtering logic based on detected HTTP version.

### 🧠 Good to Know
- This filter is used **before** any network or HTTP filter is invoked.
- It works independently of TLS and does **not** require the \`tls_inspector\`.
- Often used in combination with other listener filters like \`original_dst\` or \`proxy_protocol\`.
- Should only be enabled when necessary, as it introduces slight latency due to inspection.`

export const D_L_LOCAL_RATE_LIMIT = `
**Local Rate Limit** is a listener filter that enforces connection-level rate limiting on inbound traffic before it reaches any application-layer filters. It tracks connection attempts per source or per defined key and applies limits to prevent overload or abuse at the edge.

This filter operates early in the connection lifecycle, allowing you to drop or delay connections that exceed configured thresholds, protecting downstream resources from excessive load.

### 🔍 Key Responsibilities
- Count incoming connection attempts over a sliding window (e.g., per second or minute).
- Enforce limits based on source IP, listener port, or custom metadata key.
- Reject new connections (with a TCP reset) when rate thresholds are exceeded.
- Optionally delay or queue connections to smooth bursts of traffic.

### 🧩 Common Use Cases
- Protect backend services from traffic spikes or denial-of-service attacks.
- Limit per-client connection rates to enforce fair usage policies.
- Throttle connections from untrusted networks or specific CIDR blocks.
- Apply burst-control behavior by allowing a limited burst above the steady rate.

### 🧠 Good to Know
- Configuration includes a **stat prefix**, **unit**, **stage**, and **actions** to define limit behavior.
- Runs before any protocol detection or TLS termination, ensuring early enforcement.
- Works in conjunction with cluster- or route-level rate limits for multi-layered protection.
- Overly aggressive settings can lead to legitimate connections being dropped—tune thresholds carefully.`

export const D_L_ORIGINAL_DST = `
**Original DST** is a listener filter that retrieves the original destination IP and port of a connection that was redirected to the proxy (usually via \`iptables\` or other NAT rules). This allows the proxy to make routing or filter chain decisions based on the address the client originally intended to connect to.

It is typically used in transparent proxy scenarios where traffic is intercepted and redirected to the proxy without the client being aware.

### 🔍 Key Responsibilities
- Extract the original destination IP and port from the connection metadata.
- Make the original destination available for routing or cluster selection.
- Enable transparent proxying use cases where traffic is intercepted mid-path.
- Support dynamic filter chain selection based on original destination.

### 🧩 Common Use Cases
- **Transparent proxying** of outbound traffic from applications without proxy configuration.
- Using the original destination address to route traffic to the correct upstream or internal listener.
- Matching filter chains or listeners dynamically based on where the connection was originally going.
- Supporting policy-based routing or dynamic service mesh injection.

### 🧠 Good to Know
- This filter must be configured **before** any connection-level logic that depends on the destination address.
- It only works when the proxy receives redirected traffic using mechanisms like \`iptables\` (e.g., \`REDIRECT\`, \`TPROXY\`).
- Often used with \`original_dst\` clusters to forward traffic directly to the original destination.
- Does not modify the socket’s local address—it only exposes the original one via internal connection metadata.`

export const D_L_ORIGINAL_SRC = `
**Original SRC** is a listener filter that restores the original source address (IP and port) of a connection that was redirected to the proxy. It is primarily used in transparent proxy deployments where the proxy needs to forward traffic while preserving the original client's identity.

By recovering the original source address, the proxy can use it when initiating outbound connections, enforcing source-based policies, or for logging and auditing purposes.

### 🔍 Key Responsibilities
- Retrieve the original source IP and port from the connection metadata.
- Allow the proxy to **bind outbound connections to the original source address**.
- Enable advanced scenarios such as **source IP transparency** and **policy enforcement**.
- Support use cases where applications expect to see the real client IP at the upstream.

### 🧩 Common Use Cases
- Transparent proxying with **TPROXY**, where the client IP must be preserved when forwarding traffic.
- Enforcing access control or routing decisions based on the client's actual IP.
- Logging the real source of incoming traffic for compliance or audit trails.
- Creating connections to upstream servers that expect the original client IP.

### 🧠 Good to Know
- Works in conjunction with socket options like \`SO_BINDTODEVICE\` and \`IP_TRANSPARENT\`.
- Requires specific kernel capabilities and appropriate network configuration (e.g., \`CAP_NET_ADMIN\`, \`iptables TPROXY\`).
- Must be used with care to avoid security risks, as it bypasses NAT behavior.
- Commonly combined with the \`original_dst\` filter and \`original_src\` clusters for full transparency.`

export const D_L_PROXY_PROTOCOL = `
**Proxy Protocol** is a listener filter that enables the proxy to parse and extract connection metadata (such as the original source and destination IP addresses and ports) from the **PROXY protocol** header. This protocol is commonly used by load balancers (like HAProxy or AWS NLB) to pass client connection information to backend services over a TCP connection.

The filter supports both **PROXY protocol v1** (human-readable) and **v2** (binary), and ensures that the real client information is preserved even when traffic is proxied through intermediate systems.

### 🔍 Key Responsibilities
- Read and parse the **PROXY protocol header** at the beginning of the TCP stream.
- Extract original source and destination addresses and ports from the header.
- Populate internal metadata used for logging, routing, access control, etc.
- Enable downstream services to behave as if the connection came directly from the client.

### 🧩 Common Use Cases
- Working behind **load balancers** that use PROXY protocol to forward original client IPs.
- Preserving client identity when connections are terminated and re-established by intermediaries.
- Supporting audit trails, geo-based routing, or IP-based rate limiting using the real client IP.
- Allowing the use of **original destination logic** based on metadata from the PROXY header.

### 🧠 Good to Know
- This filter must be the **first filter in the listener filter chain**, as it consumes the beginning of the TCP stream.
- If the PROXY header is malformed or missing (when expected), the connection will be rejected.
- Should only be enabled on listeners where upstream devices are known to send valid PROXY headers.
- Works independently of TLS or HTTP protocol layers—purely at the TCP level.`

export const D_L_TLS_INSPECTOR = `
**TLS Inspector** is a listener filter that inspects the initial bytes of a TLS handshake to extract metadata such as the **Server Name Indication (SNI)** and **Application-Layer Protocol Negotiation (ALPN)** without terminating the TLS connection. This information is used to determine which filter chain should handle the connection.

It is especially useful when the proxy needs to differentiate incoming TLS traffic based on the requested domain or application protocol (e.g., HTTP/1.1 vs. HTTP/2), without having access to the decrypted content.

### 🔍 Key Responsibilities
- Inspect the ClientHello message in the TLS handshake.
- Extract **SNI** (e.g., \`api.example.com\`) to match filter chains.
- Extract **ALPN** protocols (e.g., \`h2\`, \`http/1.1\`) to determine the application protocol.
- Enable routing decisions and filter selection based on TLS metadata before decryption.

### 🧩 Common Use Cases
- Selecting between filter chains based on the domain requested by the client.
- Supporting **multi-tenant TLS** configurations with different certificates per domain.
- Detecting and separating TLS vs. non-TLS traffic on the same port.
- Enabling HTTP/2 vs. HTTP/1.1 protocol negotiation before the connection is fully established.

### 🧠 Good to Know
- The \`tls_inspector\` must be placed **before any filter that relies on SNI or ALPN** data.
- It **does not decrypt** the traffic—it only passively reads the TLS handshake.
- Commonly used with **filter chain matchers** that specify \`server_names\` or \`application_protocols\`.
- Safe to use for performance and security, as it doesn’t interfere with the actual TLS session.`

export const D_N_CONNECTION_LIMIT = `
**Connection Limit** is a network-level filter that limits the number of simultaneous downstream connections accepted by the proxy. It helps protect resources and prevent overloading by enforcing a hard cap on concurrent connections.

This filter operates at the TCP level—before any application-layer processing—making it suitable for use cases where early connection rejection is critical.

### 🔍 Key Responsibilities
- Track the number of active connections to the proxy or to specific filter chains.
- Reject new connections with a configurable response once the limit is exceeded.
- Enforce global or scoped limits to prevent resource exhaustion.

### 🧩 Common Use Cases
- Preventing abuse or denial-of-service (DoS) scenarios by limiting connection concurrency.
- Protecting backend systems that cannot handle excessive simultaneous clients.
- Enforcing fairness by restricting the number of allowed open connections.
- Acting as a safeguard for infrastructure capacity planning.

### 🧠 Good to Know
- The limit is enforced **per listener** or **per filter chain**, depending on configuration.
- Exceeded connections are **immediately closed**—they are not queued.
- Does not track per-client limits—it's a global counter by default.
- Should be placed **before application-level filters** such as \`http_connection_manager\`.`

export const D_N_HTTP_CONNECTION_MANAGER = `
**HTTP Connection Manager** is one of the most critical and complex network filters. It is responsible for handling all HTTP-level processing within the proxy. It manages the full lifecycle of HTTP connections—including parsing requests, applying filters, routing, and generating responses.

This filter transforms a raw TCP connection into structured HTTP communication and serves as the entry point for all HTTP filters defined in the configuration.

### 🔍 Key Responsibilities
- Decode incoming HTTP/1.1 or HTTP/2 requests and encode responses.
- Manage the lifecycle of HTTP streams, including connection reuse and keep-alive.
- Apply **HTTP filter chains** for routing, authentication, logging, etc.
- Route requests to upstream clusters based on route configurations.
- Generate responses locally (e.g., redirects, errors) when configured.

### 🧩 Common Use Cases
- Serving as the front-end for REST APIs, web apps, or microservices.
- Applying policies like JWT authentication, rate limiting, CORS, or header manipulation.
- Routing requests based on URL paths, headers, or hostnames.
- Integrating with tracing, metrics, and access logging systems.

### ⚙️ Core Features
- Supports **HTTP/1.1**, **HTTP/2**, and optionally **HTTP/3** (via QUIC).
- Pluggable **HTTP filter chain** (e.g., \`router\`, \`jwt_authn\`, \`ext_authz\`, etc.).
- Built-in support for **access logs**, **tracing**, and **request ID generation**.
- Handles **connection-level settings** like idle timeouts, stream limits, and overload control.

### 🧠 Good to Know
- Must be the **last filter** in a network filter chain that handles HTTP traffic.
- Internally integrates with the **Route Configuration** to determine how requests are routed.
- Often used with TLS for secure connections and ALPN to negotiate HTTP versions.
- Can be used with **dynamic configuration** via RDS (Route Discovery Service).`

export const D_N_LOCAL_RATE_LIMIT = `
**Local Rate Limit** is a network filter that enforces rate limiting on incoming TCP connections at the **connection level**, directly on the proxy instance (local enforcement). Unlike global rate limiting solutions that rely on an external service, this filter performs all rate checks and tracking internally, with minimal latency.

It is typically used to limit the number of new connections over time, helping to prevent abuse, resource exhaustion, or traffic bursts from overwhelming backend systems.

### 🔍 Key Responsibilities
- Limit the **rate of new TCP connections** based on configurable tokens or burst windows.
- Apply rate limits **locally** without contacting an external rate limit service.
- Reject or delay connections that exceed the configured limits.
- Track connection attempts using an internal token bucket algorithm.

### 🧩 Common Use Cases
- Protecting backend services from traffic spikes or malicious clients.
- Applying **per-listener** rate limits to enforce connection control policies.
- Adding local protection on top of global rate limiting mechanisms.
- Reducing the load on external rate limit services by handling frequent limits internally.

### 🧠 Good to Know
- Configuration includes:
  - **stat_prefix**: to scope stats.
  - **token_bucket**: to define the refill rate, burst size, and max tokens.
  - **filter_enabled**: to enable/disable the filter via runtime keys.
  - **filter_enforced**: to control whether the limit is enforced or just tracked.
- Rate limits apply to **new connections only**, not per-request limits.
- This filter is often used in combination with \`http_connection_manager\` or other higher-layer filters.
- Fine-grained control is possible through **runtime configuration**, allowing limits to be updated on the fly.`

export const D_N_NETWORK_RBAC = `
**RBAC** is a network filter that enforces **Role-Based Access Control** policies on incoming connections. It allows or denies TCP connections based on attributes such as source IP, destination port, authenticated identity, or metadata.

This filter enables fine-grained access control at the connection level, providing a critical layer of security in zero-trust environments or service meshes.

### 🔍 Key Responsibilities
- Evaluate **RBAC policies** to allow or deny new connections.
- Match rules based on connection-level properties: source IP, destination port, TLS SNI, authenticated identity, and metadata.
- Support **both allow and deny actions**, evaluated in priority order.
- Log access decisions for audit and observability purposes.

### 🧩 Common Use Cases
- Enforcing security policies for which services or clients can connect to which ports.
- Implementing **zero-trust network access** rules.
- Restricting access to specific workloads or zones based on identity or IP.
- Auditing and monitoring connection attempts using policy metadata.

### 🧠 Good to Know
- Policies are defined in two sections:
  - \`rules\`: List of allow/deny rules evaluated for each connection.
  - \`action\`: Specifies whether to ALLOW or DENY matching rules.
- Can be dynamically configured using the **RBAC filter with dynamic metadata**, useful in service meshes.
- Often combined with **TLS authentication** or **SDS/Secrets** to enforce mTLS-based identity matching.
- Use \`shadow rules\` for **dry-run** mode to simulate policies before enforcement.`

export const D_N_TCP_PROXY = `
**TCP Proxy** is a network filter that forwards raw TCP connections to upstream clusters without inspecting or modifying the payload. It is designed for use cases where the proxy acts as a transparent TCP tunnel, such as for databases, message queues, or custom TCP-based protocols.

This filter handles connection lifecycle events (open, close, idle), performs load balancing, and supports advanced features like per-connection metadata, access logging, and idle timeouts.

### 🔍 Key Responsibilities
- Forward raw TCP traffic between downstream and upstream connections.
- Perform **load balancing** across endpoints in the configured cluster.
- Handle connection events: open, close, timeouts, and failures.
- Integrate with **access logs**, **connection metadata**, and **idle timeouts**.

### 🧩 Common Use Cases
- Proxying traffic to **databases** (e.g., MySQL, PostgreSQL), **Redis**, or **message brokers**.
- Acting as a **generic TCP tunnel** in service mesh or edge proxy scenarios.
- Forwarding encrypted TLS streams without terminating TLS (pass-through mode).
- Using **SNI-based routing** for directing traffic to different upstream clusters.

### 🧠 Good to Know
- Requires a configured **cluster** to forward the traffic to.
- Supports **metadata-based routing** and **per-connection load balancing**.
- Can be combined with listener filters like \`tls_inspector\` or \`proxy_protocol\` to influence routing decisions.
- Offers options for **idle timeout**, **maximum connection duration**, and **connection-level access logging**.
- Does **not parse** the application protocol—traffic is forwarded byte-for-byte.`

export const D_UDP_DNS_FILTER = `
**DNS Filter** is a UDP listener filter that enables the proxy to act as a **DNS resolver or forwarder**. It processes DNS queries over UDP, matches them against a configured set of domains and records, and responds directly or forwards the request to an upstream DNS server.

This filter allows embedding DNS resolution capabilities directly into the proxy, which is useful in service meshes, container environments, or custom DNS-based routing setups.

### 🔍 Key Responsibilities
- Parse incoming **DNS queries** (typically over UDP port 53).
- Match queries against a set of **configured domain records** (A, AAAA, SRV, etc.).
- Respond to queries directly or **forward them** to upstream DNS servers.
- Support **static**, **dynamic**, or **recursive** DNS resolution behavior.
- Enforce DNS-specific policies such as TTLs, rate limiting, and filtering.

### 🧩 Common Use Cases
- Acting as an **internal DNS server** for service discovery in containerized environments.
- Forwarding queries to upstream DNS servers (e.g., \`/etc/resolv.conf\` nameservers).
- Embedding service mesh-level DNS logic for advanced routing and name resolution.
- Responding to specific domain names with synthetic or custom IPs (e.g., for testing or override scenarios).

### 🧠 Good to Know
- Configuration includes:
  - **Virtual DNS table** with static records (e.g., domain → IP).
  - **Upstream resolvers** for recursive resolution.
  - **Client subnet fallback** and **cache control**.
- Responses can be **synthesized** from static config or forwarded based on resolver rules.
- Commonly used in **sidecar** or **embedded DNS** setups where DNS control is required.`

export const D_HTTP_ADAPTIVE_CONCURRENCY = `
**Adaptive Concurrency** is an HTTP filter that dynamically adjusts the concurrency limit for upstream requests based on observed latency. Its goal is to **prevent overload** by reducing the number of in-flight requests when upstream latency increases, and increasing concurrency when conditions improve.

This filter is built around a feedback control loop that uses real-time request latency measurements to determine a safe concurrency level that maximizes throughput without degrading upstream service performance.

### 🔍 Key Responsibilities
- Monitor **request latency** for upstream traffic.
- Automatically adjust the allowed **concurrent number of in-flight requests**.
- Reject excess requests with a **503 response** when concurrency exceeds the adaptive limit.
- Protect upstream services from overload by reacting to backpressure signals.

### 🧩 Common Use Cases
- Automatically rate limiting requests to **fragile or latency-sensitive upstream services**.
- Preventing cascading failures in **microservice architectures**.
- Protecting upstreams from traffic spikes without manual tuning.
- Replacing static circuit breakers with dynamic, latency-based controls.

### ⚙️ Core Behavior
- Uses **sample windowing** to track round-trip times (RTTs).
- Updates the concurrency limit using a **gradient controller** algorithm.
- Optionally configured with a **minimum RTT threshold**, **jitter**, and **burst handling**.
- Supports per-route or global configuration via filter settings.

### 🧠 Good to Know
- Requests exceeding the adaptive limit are **immediately rejected**, not queued.
- Can be used alongside other filters like \`rate_limit\`, \`router\`, or \`ext_authz\`.
- Does not guarantee fairness between clients—its goal is system-wide stability.
- Particularly effective in **high-load or bursty traffic** environments.`

export const D_HTTP_ADMISSION_CONTROL = `
**Admission Control** is an HTTP filter that provides a lightweight, probabilistic mechanism to shed load **before** requests are sent to upstream clusters. It is designed to protect services under stress by **dropping a portion of requests** when error rates rise, helping stabilize the system without full saturation.

Unlike fixed rate limiters or circuit breakers, this filter makes dynamic, per-request decisions based on recent success and failure rates, using a probability model to admit or reject incoming traffic.

### 🔍 Key Responsibilities
- Monitor recent **upstream success/failure rates** (e.g., 5xx responses).
- Probabilistically **reject requests** based on configured thresholds.
- Prevent upstream overload by reducing request volume during failure spikes.
- Complement other resilience mechanisms like retries, timeouts, and adaptive concurrency.

### 🧩 Common Use Cases
- Gracefully handling **traffic spikes** or **partial upstream outages**.
- Improving system stability by reducing retry storms and overload amplification.
- Acting as a lightweight, **automatic circuit breaker** without static thresholds.
- Deploying in **zero-trust** or **multi-tenant environments** to prevent noisy neighbor effects.

### ⚙️ Core Behavior
- Maintains a **rolling success rate window** per upstream cluster.
- Applies an **admission probability** (between 0 and 1) based on recent error ratios.
- Uses a **success rate threshold** to determine when to start shedding load.
- Supports **runtime overrides** and per-route configuration.

### 🧠 Good to Know
- Requests that are rejected return an immediate **503 Service Unavailable** response.
- Unlike \`rate_limit\`, this filter does not track quotas or tokens—it is **fully stateless per request**.
- Works well in combination with \`adaptive_concurrency\` for full-stack load protection.
- Filtering behavior is **probabilistic**, meaning even during stress, some traffic is still allowed through for recovery.`

export const D_HTTP_BANDWIDTH_LIMIT = `
**Bandwidth Limit** is an HTTP filter that enforces **per-connection bandwidth throttling** for both request and response bodies. It is designed to **control data transfer rates** to or from clients, helping to manage resource usage, protect backends, or simulate network conditions.

The filter works by **delaying read/write operations** on HTTP streams to ensure that the data transfer rate does not exceed the configured limits. It can be applied globally or scoped per route.

### 🔍 Key Responsibilities
- Throttle **downstream request body uploads** (ingress) and **response body downloads** (egress).
- Enforce a **maximum bytes-per-second (BPS)** rate on HTTP streams.
- Smooth out bursty traffic and reduce pressure on upstream systems or network interfaces.
- Help simulate **low-bandwidth** or **constrained environments** for testing.

### 🧩 Common Use Cases
- Limiting client download or upload speeds to prevent abuse.
- Protecting upstream services from large or rapid payloads.
- Simulating network throttling for **performance or failure testing**.
- Ensuring fair bandwidth usage among multiple clients.

### 🧠 Good to Know
- This filter affects **streaming HTTP traffic**—it does **not** control connection-level bandwidth.
- Throttling is enforced using a **token bucket algorithm** with periodic timers.
- Works for both HTTP/1.1 and HTTP/2 streams.
- Should be placed **before the \`router\` filter** to ensure end-to-end control of stream timing.`

export const D_HTTP_BASIC_AUTH = `
**Basic Auth** is an HTTP filter that enforces HTTP Basic Authentication by validating the \`Authorization\` header of incoming requests. It is typically used to require a **username and password** before allowing access to protected routes or services.

The filter parses credentials from the \`Authorization: Basic <base64>\` header, decodes them, and compares them against a configured list of valid users and passwords.

### 🔍 Key Responsibilities
- Intercept HTTP requests and extract the \`Authorization\` header.
- Decode base64-encoded credentials and split them into username and password.
- Validate the credentials against a **static or dynamically loaded user/password list**.
- Reject unauthorized requests with a **401 Unauthorized** response and a \`WWW-Authenticate\` challenge.

### 🧩 Common Use Cases
- Securing **internal APIs**, admin dashboards, or developer endpoints.
- Adding lightweight authentication for **testing or prototyping environments**.
- Protecting routes in edge deployments where stronger authentication (e.g., OAuth2) is not required.
- Implementing a fallback or layered authentication mechanism.

### 🧠 Good to Know
- This filter provides only **basic security** and should **not** be used over plaintext connections (HTTP) — always use with TLS.
- Best suited for **low-security environments** or internal tools, not public-facing authentication.
- Can be combined with other filters (e.g., \`ext_authz\`, \`rate_limit\`, \`router\`) for layered control.
- Implementations may vary—this filter is commonly provided via **external extensions** or custom builds, as it is not part of Proxy's core filters by default.`

export const D_HTTP_BUFFER = `
**Buffer** is an HTTP filter that temporarily buffers the entire request body before forwarding it to the upstream service. It is useful when upstream services expect to receive the complete request payload at once or when performing operations that require access to the full body (e.g., signing, validation, or WAF inspection).

This filter is particularly important in situations where **streaming** is not supported by upstreams or intermediate filters.

### 🔍 Key Responsibilities
- Accumulate the entire HTTP **request body** in memory before proceeding.
- Block downstream processing until the full payload is available.
- Protect upstream services that cannot handle chunked or streamed payloads.
- Optionally **limit the maximum size** of buffered data to avoid excessive memory usage.

### 🧩 Common Use Cases
- Ensuring compatibility with upstreams that require full-body requests (e.g., some legacy services).
- Supporting filters like **WAF**, **external authorization**, or **body transformation**, which may need the entire request body.
- Preventing partial or incomplete payloads from reaching upstream services.
- Enabling retry strategies that require the full request body to be replayable.

### 🧠 Good to Know
- Buffers only the **request body**, not the response.
- Introduces **latency**, especially with large payloads, since upstream processing starts only after full buffering.
- Should be used **before** filters that require full-body access, such as \`ext_authz\`, \`jwt_authn\`, or custom WASM filters.
- May increase **memory usage** significantly under high load or with large request bodies—use with appropriate limits.`

export const D_HTTP_COMPRESSOR = `
**Compressor** is an HTTP filter that **compresses HTTP response bodies** using algorithms like Gzip or Brotli. It helps reduce the size of payloads sent to clients, improving bandwidth efficiency and reducing page or data load times—especially useful in web applications and APIs that return large JSON, HTML, or text content.

The filter inspects the client’s \`Accept-Encoding\` header and applies compression if a supported encoding is negotiated and the response meets configured criteria.

### 🔍 Key Responsibilities
- Compress outbound **HTTP responses** using a selected algorithm (e.g., \`gzip\`, \`brotli\`, \`zstd\`).
- Respect the \`Accept-Encoding\` header to negotiate content encoding with the client.
- Skip compression for content types or paths that don’t benefit from it (e.g., already compressed assets).
- Improve performance for clients on limited or high-latency networks.

### 🧩 Common Use Cases
- Reducing size of **JSON API responses**, HTML pages, and plain text responses.
- Enabling **Brotli or Gzip** compression for modern web applications.
- Reducing bandwidth costs in high-volume deployments.
- Enhancing performance for mobile and low-bandwidth users.

### 🧠 Good to Know
- Applies only to **HTTP responses**, not requests.
- Can be selectively applied using **per-route configurations** or by matching headers/status codes.
- Compression is skipped for clients that don’t include a compatible \`Accept-Encoding\` header.
- Overhead introduced by compression is negligible for large responses but should be benchmarked under load.`

export const D_HTTP_CORS = `
**CORS** is an HTTP filter that automatically handles **Cross-Origin Resource Sharing (CORS)** logic for responses.  
It inspects incoming requests for CORS‐related headers (e.g., \`Origin\`, \`Access-Control-Request-Method\`, \`Access-Control-Request-Headers\`) and adds the appropriate **\`Access-Control-*\`** headers to responses, according to a configurable policy.  
By off-loading CORS processing to the proxy, backend services remain agnostic of browser cross-origin rules.

### 🔍 Key Responsibilities
- Detect **simple** and **pre-flight (OPTIONS)** CORS requests.
- Match the request’s \`Origin\` against an **allow/deny list**.
- Apply configurable CORS response headers:
  - \`Access-Control-Allow-Origin\`
  - \`Access-Control-Allow-Methods\`
  - \`Access-Control-Allow-Headers\`
  - \`Access-Control-Expose-Headers\`
  - \`Access-Control-Max-Age\`
  - \`Access-Control-Allow-Credentials\`
- Short-circuit valid **pre-flight** requests with a \`200 OK\`, without forwarding them upstream (optional).

### 🧩 Common Use Cases
- Enabling browser-based clients hosted on **different domains** to call your APIs.
- Centralising CORS policy enforcement across **multiple backend services**.
- Protecting services by **restricting allowed origins**, methods, or custom headers.
- Reducing application code complexity—backend handlers no longer need to inject CORS headers.

### 🧠 Good to Know
- CORS headers are **added only when the request contains an \`Origin\` header** and the policy matches.  
- If the origin is not allowed, the filter **omits CORS headers**, causing the browser to block the response.  
- Pre-flight handling can be disabled if you prefer the upstream service to process \`OPTIONS\` requests.  
- Combine with the **\`rbac\`** or **\`jwt_authn\`** filters for layered security: CORS controls **where** requests come from, while RBAC/JWT verify **who** is calling.  
- Misconfigured wildcards (e.g., \`*\`) may unintentionally expose sensitive endpoints—define explicit origins whenever possible.`

export const D_HTTP_CSRF_POLICY = `
**CSRF Policy** is an HTTP filter that protects web applications against **Cross-Site Request Forgery (CSRF)** attacks.  
It inspects incoming **state-changing** requests (e.g., \`POST\`, \`PUT\`, \`DELETE\`, \`PATCH\`) and verifies that they include a valid **\`Origin\`** or **\`Referer\`** header that matches the configured trusted domains.  
If the check fails, the request is rejected with **403 Forbidden**, preventing malicious sites from tricking browsers into issuing authenticated requests.

### 🔍 Key Responsibilities
- Identify requests that may alter server state and therefore require CSRF validation.
- Validate the \`Origin\` and/or \`Referer\` header against an **allowlist** of trusted domains.
- Reject or allow the request based on policy, returning configurable error responses.
- Emit statistics and access-log metadata to aid in monitoring CSRF violations.

### 🧩 Common Use Cases
- Protecting **browser-based sessions** that rely on cookies or implicit credentials (e.g., traditional web apps, admin portals).
- Adding CSRF defenses in **single-page applications** without modifying backend code.
- Enforcing domain restrictions on APIs that are accessed via browsers but accept non-idempotent HTTP methods.
- Layering defense-in-depth together with authentication filters (\`jwt_authn\`, \`basic_auth\`) and CORS.

### 🧠 Good to Know
- Only **state-changing** methods are checked by default; \`GET\` and \`HEAD\` are always allowed.
- If **both** \`Origin\` and \`Referer\` are present, *either* may satisfy the policy (configurable).
- In **shadow mode** you can measure violations safely before enforcement—ideal for gradual roll-outs.
- The filter relies on browsers sending correct \`Origin\` / \`Referer\` headers; non-browser clients may need explicit exemptions.
- Combine with **CORS**: CORS governs which domains may *read* responses, while CSRF governs which domains may *send* state-changing requests.`

export const D_HTTP_LOCAL_RATE_LIMIT = `
**Local Rate Limit** is an HTTP filter that enforces **request-level rate limiting** _inside_ the proxy, without relying on an external rate-limit service.  
It uses an in-memory **token-bucket** algorithm to decide—on a per-listener, per-route, or per-virtual-host basis—whether to **allow** or **immediately reject** an incoming request when the configured rate is exceeded.

### 🔍 Key Responsibilities
- Track the number of requests over a sliding window and compare it to a configured limit.
- Decide in real time to **accept** or **reject** requests, returning **429 Too Many Requests** on rejection.
- Provide granular control: limits can be scoped _globally_, per-route, or even overridden per-header.
- Emit detailed statistics (\`rq_allowed\`, \`rq_blocked\`, latency histograms) for observability.

### 🧩 Common Use Cases
- Protecting backend services from sudden **traffic spikes** or abusive clients.
- Applying burst-friendly limits (token bucket) to smooth traffic while still honoring steady-state quotas.
- Enforcing per-tenant or per-API rate limits directly in the data plane when an external service is unnecessary or unavailable.
- Adding an extra layer of DoS resistance to endpoints that already use global rate limiting.

### 🧠 Good to Know
- **Local** means no round-trip latency—decisions are made synchronously with the request.
- Rejected requests are **not** queued; the client must retry after the specified back-off period.
- Can run in **shadow mode** (only counting blocks) to verify limits before enforcing.
- Complements the \`rate_limit\` filter (global, gRPC-based) and \`adaptive_concurrency\` (latency-based) for multi-layer protection.
- Memory usage is minimal, but each unique descriptor key creates its own token bucket—plan accordingly.`

export const D_HTTP_LUA = `
**LUA** is an HTTP filter that embeds a lightweight **Lua 5.4 runtime** into the proxy, allowing users to run custom Lua scripts at key points in the request/response pipeline.  
It provides a flexible, high-level scripting interface for **on-the-fly header manipulation, dynamic routing, metrics, logging, authentication logic**, and more—without recompiling or redeploying the proxy.

### 🔍 Key Responsibilities
- Execute user-supplied Lua code during the **request‐headers**, **request‐body**, **response‐headers**, and **response-body** phases.
- Expose a rich API to inspect and mutate headers, body data, metadata, dynamic metadata, and upstream clusters.
- Support **asynchronous HTTP/gRPC calls** from Lua to external services (e.g., auth back-ends, feature flags).
- Provide sandboxing to protect the proxy from untrusted scripts (memory & CPU guards).

### 🧩 Common Use Cases
- **Custom auth / token validation** when a full external authorization service is overkill.
- Dynamic header enrichment, request/response **rewrites**, or **A/B testing** logic.
- Real-time feature flags or canary routing decisions via async calls to config servers.
- Lightweight **body transformation** (e.g., JSON patch) or request sanitization.
- Emitting custom **business metrics** or tracing spans from within the data plane.

### 🧠 Good to Know
- The Lua environment is **per-worker**, not per-request—use caution with globals.
- Scripts run **in the main event loop**; heavy computation blocks I/O—keep code minimal.
- Async HTTP/gRPC calls made from Lua yield control back to proxy until the response arrives (non-blocking).
- Errors in the script by default return **503 Service Unavailable** unless \`fail_open\` is enabled.
- For complex or performance-sensitive logic, consider **WASM filters** or native C++ extensions instead.`

export const D_HTTP_OAUTH2 = `
**OAuth2** is an HTTP filter that implements the **OAuth 2.0 / OpenID Connect (OIDC) Authorization-Code flow** directly inside the proxy.  
It intercepts unauthenticated requests, redirects the user to an **Identity Provider (IdP)** for login, exchanges the authorization code for an access (and optional refresh) token, then stores the tokens in secure cookies and **injects a Bearer token** (or ID token) into upstream requests.

### 🔍 Key Responsibilities
- Detect whether the incoming request already carries a **valid session cookie or Bearer token**.  
- For unauthenticated requests:
  1. Generate a **state + nonce**, set an HMAC-signed **state cookie**.  
  2. Redirect the user’s browser to the configured **authorization endpoint**.  
- Handle the IdP’s redirect back to the **\`redirect_uri\`**:
  1. Validate \`state\` / \`nonce\` to prevent CSRF.  
  2. Exchange the **authorization code** for tokens via the **token endpoint** (over HTTPS).  
  3. Store the **access-token** (and optionally refresh-token / ID token) inside **HttpOnly, Secure cookies**.  
- Inject the token into outbound headers (default \`Authorization: Bearer <access-token>\`).  
- Optionally **refresh** the access token transparently when it is close to expiry.  
- Expose a configurable **sign-out path** to clear cookies and start a new login flow.

### 🧩 Common Use Cases
- Adding **single-sign-on (SSO)** to internal dashboards or APIs without modifying application code.  
- Fronting legacy services with modern OAuth 2.0 / OIDC authentication.  
- Implementing **zero-trust** ingress where the data plane itself enforces auth.  
- Simplifying microservice security by handling token retrieval/refresh centrally.

### 🧠 Good to Know
- **HTTPS is mandatory** on both the external listener and the IdP cluster; cookies are always \`Secure\` & \`HttpOnly\`.  
- Tokens live in cookies, **not** local-storage—mitigates XSS token theft.  
- Refresh tokens (if enabled) are rotated and re-encrypted on every refresh cycle.  
- The filter supports **PKCE** when \`code_challenge_method\` is configured.  
- Combine with \`cors\`, \`csrf\`, or \`rbac\` for layered security (auth **who**, CORS **where**, CSRF **how**).  
- Large ID tokens may exceed header limits—consider \`forward_bearer_token: false\` and let the app extract from cookie if needed.`

export const D_HTTP_RBAC = `
**RBAC** is an HTTP filter that permits or denies requests according to **Role-Based Access Control (RBAC) policies**.  
It evaluates each request against a set of allow/deny rules that reference attributes such as source IP, authenticated principal, requested path, headers, or metadata. When a rule matches with an \`ALLOW\` action, the request proceeds; if no allow rule matches—or an explicit \`DENY\` rule matches—the proxy responds with **403 Forbidden**.

### 🔍 Key Responsibilities
- Inspect request metadata (TLS identity, headers, IP, dynamic metadata) in real time.
- Apply ordered **allow / deny** policies to every HTTP stream.
- Emit decision logs and metrics for auditing and observability.

### 🧩 Common Use Cases
- Enforcing **zero-trust** policies—only specific workloads or users may call sensitive endpoints.
- Segregating multi-tenant APIs by tenant ID or JWT claim.
- Replacing in-app ACLs with centrally managed, declarative rules.

### 🧠 Good to Know
- Policies can be attached **globally**, per-virtual-host, or per-route for fine-grained control.
- A **shadow mode** allows testing policies without blocking traffic.
- Frequently paired with filters such as **jwt_authn** (to supply identities) and **cors** (to govern browser origins).`

export const D_HTTP_ROUTER = `
**Router** is the **terminal HTTP filter** that actually forwards requests to upstream clusters.  
All preceding filters (authentication, rate limiting, header manipulation, etc.) eventually hand off the request to \`router\`, which performs the final routing decision, establishes or re-uses an upstream connection, and streams the response back to the client.

### 🔍 Key Responsibilities
- Select the target **cluster** (and optional subset/endpoint) based on the active **route**.
- Apply the configured **load-balancing policy** and manage connection pooling.
- Handle retries, hedging, shadowing, redirects, and timeouts defined in the route.
- Stream request and response bodies, handling flow-control and back-pressure.
- Collect upstream timing metrics and propagate **response flags** for observability.

### 🧩 Common Use Cases
- Forwarding REST or gRPC traffic to microservice clusters.
- Performing **automatic retries** on idempotent requests when upstreams return failures or time out.
- **Shadowing** a fraction of traffic to a canary or experimental service.
- Enforcing **per-route timeouts** and **retry budgets** without application changes.
- Translating upstream errors and response codes into standardized downstream responses.

### 🧠 Good to Know
- \`router\` **must be the last filter** in an HTTP filter chain; there can be only one per chain.
- It respects all route-level policies (headers to add/remove, rewrite rules, retry configs, etc.).
- Streams can be **buffered** or **sent fully duplex** depending on protocol (HTTP/1.1 vs. HTTP/2).
- Upstream connections can be encrypted (TLS), plain, or use ALPN-negotiated HTTP/2/3.
- When upstream responds before the request body is fully sent, \`router\` seamlessly terminates the downstream transmit to avoid wasting bandwidth.`

export const D_HTTP_STATEFUL_SESSION = `
**Stateful Session** is an HTTP filter that provides **session affinity (sticky sessions)** by binding each client to a specific upstream host for the lifetime of a session.  
It typically relies on a lightweight cookie (or other token) that records the upstream endpoint choice; subsequent requests carrying the token are routed to the same host, ensuring consistency for stateful workloads.

### 🔍 Key Responsibilities
- Generate and attach a **session cookie** on the first request when no affinity token is present.
- Decode incoming tokens and **pin** the request to the previously selected upstream host.
- Work seamlessly with the load-balancer, bypassing normal LB choice when a valid session token is found.
- Respect upstream health—if the pinned host becomes unhealthy, a new host is chosen and the token is refreshed.

### 🧩 Common Use Cases
- Web applications that store user data in **in-memory sessions** (shopping carts, chat, dashboards).
- Legacy back-ends that cannot share session state across replicas.
- Maintaining connection context for **WebSocket-like bidirectional protocols** over HTTP/2.
- Reducing cache misses or warming issues by consistently routing a user to the same replica.

### 🧠 Good to Know
- The cookie is **HTTP-only** and optionally \`Secure\`; path and domain can be customized when configuring the filter.
- Session affinity is **best-effort**: if all replicas are healthy, load is still distributed evenly across new sessions.
- For stateless services, keeping this filter disabled avoids unnecessary stickiness and promotes better load distribution.
- Combine with **adaptive concurrency** or **local ratelimit** filters to safeguard individual replicas from overload despite stickiness.`

export const D_E_ACCESS_LOG = `
**Access Loggers** emit structured records for every request / response (or connection) that traverses the proxy, delivering crucial data for **observability, auditing, and troubleshooting**.  
Rather than being a single filter, an access logger is a *sink* configured on listeners, filter chains, or routes; it receives rich metadata from the data-plane and writes it to a destination in the desired format.

### Key Responsibilities
- Capture detailed request/response or connection metadata (timestamps, method, path, status, bytes, latency, peer IPs, dynamic metadata, etc.).
- Serialize each log entry to a chosen sink in a configured format (text, JSON, protobuf) and transport (file, gRPC, OpenTelemetry, custom WASM).
- Support per-scope configuration (listener, filter-chain, route) with optional sampling and filtering to minimize overhead.

### Common Use Cases
- Centralized observability: exporting structured logs to gRPC or OTLP collectors for real-time analytics, dashboards, and alerting.
- Compliance and security auditing: retaining immutable records of inbound and outbound traffic for forensics or regulatory reporting.
- Debugging and performance tuning: correlating latency outliers, error spikes, or anomalies with rich request context without instrumenting application code.

### Good to Know
- Format strings use powerful operators (e.g., \`%REQ(:path)%\`, \`%RESPONSE_CODE%\`, \`%DYNAMIC_METADATA()%\`) and can emit pure JSON objects.
- Asynchronous emission minimizes request latency, but remote sinks can back-pressure—tune buffering limits and timeouts.
- Sensitive information (cookies, tokens) should be masked or omitted to meet privacy and security requirements.

Used wisely, access loggers deliver the ground truth needed for capacity planning, SLA enforcement, security forensics, and day-to-day debugging—all without burdening application code.`

export const D_E_COMPRESSOR_LIBRARY = `
Compressor Library is the **core compression extension interface** used by filters such as \`compressor\` (responses) and \`decompressor\` (requests).  
It provides a pluggable, algorithm-agnostic wrapper—Gzip, Brotli, Zstd, or custom codecs—so that any proxy component can compress or decompress payloads through a unified API.

### Key Responsibilities
- Expose a standard **encode / decode** contract to transform data buffers using the selected compression algorithm.
- Manage codec parameters (compression level, window size, dictionary, chunk size) and maintain streaming state across data frames.
- Register concrete compressor libraries (Gzip, Brotli, Zstd, Lz4, etc.) so filters and other extensions can invoke them without hard-coding algorithms.

### Common Use Cases
- Serving compressed HTTP responses via \`compressor\`, improving bandwidth efficiency and load times for web/mobile clients.
- Automatically decompressing inbound request bodies (e.g., IoT devices posting Gzip’d JSON) with \`decompressor\` before they reach upstream applications.
- Enabling **binary protocol tunneling** with on-the-fly compression in custom WASM filters or gRPC transcoding scenarios.

### Good to Know
- Each compressor implementation is configured through the **typed extension config** mechanism (\`typed_config\`), allowing per-filter or per-route overrides.
- Compression can be CPU-intensive; tune levels and enable **adaptive concurrency** or **local rate limit** filters when protecting latency-sensitive services.
- If a client advertises multiple \`Accept-Encoding\` values, the HTTP compressor chooses the first algorithm in its configured list that the client supports—order matters.`

export const D_E_HEALTH_CHECK_EVENT_FILE_SINK = `
HealthCheck Event File Sink defines the **event-sink interface** for proxy's active health-checking subsystem.  
Whenever a health-check probe transitions state (e.g., from \`HEALTHY → UNHEALTHY\`, connection failure, timeout, or active check success), the event sink receives a structured notification that can be exported to observability back-ends such as gRPC services, logs, or custom extensions.

### Key Responsibilities
- Subscribe to health-check state transitions (pass, fail, timeout, connection refused, stream reset) from all configured clusters and endpoints.
- Serialize and forward each event in real time to an external sink (e.g., \`EventService\` over gRPC, protobuf-encoded file, or custom WASM handler).
- Provide decoupled observability so operators can track endpoint health history without polling admin APIs.

### Common Use Cases
- Streaming health-check events to a **central monitoring system** for alerting and dashboards.
- Feeding **auto-scaling logic** or traffic-shift controllers that react to endpoint health in near real time.
- Persisting a **forensic audit trail** of when and why endpoints flapped between healthy and unhealthy states.
- Integrating with **service-mesh control planes** that reconcile endpoint health across multiple proxy instances.

### Good to Know
- Event sinks are **non-blocking**; if the remote collector is down, events are dropped after buffer limits to avoid impacting data-plane latency.
- Multiple sinks can be configured simultaneously (e.g., gRPC plus file) to ensure redundancy.
- Unlike standard access logs, health-check events are emitted **only on state change**, not on every probe—reducing noise while preserving critical transitions.
- The protobuf schema includes rich context: cluster name, endpoint address, timestamp, failure type, and optional metadata for custom classifiers.`

export const D_E_HTTP_PROTOCOL_OPTIONS = `
Http Protocol Options is the configuration block that controls **how proxy speaks HTTP to upstream hosts**.  
Applied at the cluster or endpoint level, it selects the preferred HTTP versions (HTTP/1.1, HTTP/2, HTTP/3), tunes protocol-specific settings (header limits, flow-control windows, ALPN hints), and governs fallback behavior when negotiating with upstream servers.

### Key Responsibilities
- Specify the **set and order of supported HTTP versions**, enabling ALPN negotiation or hard-pinning a single protocol.
- Fine-tune protocol parameters such as connection timeouts, max header sizes, initial flow-control windows, and connection reuse strategies.
- Provide graceful **fallback** rules—e.g., attempt HTTP/3 first, then downgrade to HTTP/2 or HTTP/1.1 if the upstream does not support QUIC.

### Common Use Cases
- Enforcing **HTTP/2 or HTTP/3** for gRPC services to leverage multiplexing and lower latency.
- Restricting legacy back-ends to **HTTP/1.1 only** when newer protocols cause compatibility issues.
- Reducing handshake overhead by advertising **only the protocols actually supported** by the upstream fleet.
- Customizing flow-control windows and header limits to optimize throughput for **high-bandwidth, long-lived connections**.

### Good to Know
- If multiple versions are enabled, proxy orders ALPN strings according to the list, attempting negotiation **left-to-right**.
- Missing or misconfigured options fall back to cluster-wide defaults; explicit settings override bootstrap defaults.
- HTTP/3 (QUIC) requires a compatible **transport socket** plus UDP listener setup—merely enabling it in protocol options is not enough.
- Protocol options can be **overridden per-endpoint** via Endpoint Discovery Service (EDS) metadata for granular tuning without duplicating clusters.`

export const D_E_URI_TEMPLATE_MATCH = `
Uri Template Match is a **route-path matcher extension** that uses **URI-Template patterns** (e.g., \`/users/{user_id}/orders/{order_id}\`) to decide whether an incoming request path matches a route and to capture path parameters as dynamic metadata.  
It offers a readable alternative to long regexes, supports typed segment predicates (int, enum, wildcard, etc.), and can expose captured variables to filters or upstream headers.

### Key Responsibilities
- Evaluate request paths against one or more **URI-Template expressions**, returning a match when all segments align.
- Extract and type-convert **template variables** (e.g., \`{user_id}\` → \`"123"\`), storing them in route or filter dynamic metadata.
- Provide predicate options (wildcard \`*\`, integer \`{id:int}\`, enum sets \`{status:oneof("paid","unpaid")}\`, etc.) for precise matching without regex complexity.

### Common Use Cases
- Defining clean, self-documenting API routes such as \`/v1/accounts/{account_id}/transactions/{tx_id}\`.
- Passing captured variables to **ext_authz**, **rbac**, or logging filters for fine-grained policy decisions or observability.
- Replacing brittle regex path matchers with maintainable URI templates in large microservice gateway configurations.

### Good to Know
- Matching is **case sensitive** and does **not** percent-decode the path—ensure templates reflect the raw incoming URL.
- Captured variables are exposed under \`router\` dynamic metadata by default; headers can be auto-inserted via route configuration for upstream use.
- Unsupported or malformed template syntax fails the configuration load—validate templates with proxy's \`--reject-unknown-extensions\` enabled.
- Because parsing is deterministic and segment-based, URI-Template matching is generally faster and safer than equivalent regex routes.`

export const D_E_STATEFUL_SESSION_STATE = `
Proxy offers two built-in **stateful-session providers** that pin each client to a specific upstream host by persisting a small piece of routing information:

1. **Header Provider** – stores the chosen host identifier in a custom HTTP header that the client must echo on subsequent requests.  
2. **Cookie Provider** – stores the identifier in an \`HttpOnly\` cookie automatically set and read by proxy.

Both providers plug into the \`stateful_session\` filter and share the same control logic; they differ only in how the affinity token is transported.

### Key Responsibilities
- Generate a unique **upstream host token** when a new session starts and embed it in the selected carrier (header or cookie).
- Parse incoming requests, extract the token, and **route to the pinned host** if it is still healthy; otherwise pick a new host and refresh the token.
- Work transparently with upstream load balancing so that stickiness does not break health-based host eviction.

### Common Use Cases
- Maintaining session affinity for stateful web apps that keep user data in memory.
- Providing **sticky WebSocket** or long-poll connections when either browsers (cookie) or API clients (custom header) are in play.
- Mixing providers within the same deployment—for example, public APIs use the header variant, while browser-based dashboards rely on the cookie variant.

### Good to Know
- **Header Provider**  
  • Requires clients to echo the header—ideal for API consumers that can control request headers.  
  • Token is invisible to browsers, avoiding cookie policies but exposing the header over CORS if not filtered.

- **Cookie Provider**  
  • Sets an \`HttpOnly\`, optionally \`Secure\`, cookie; effortless for browsers, no client code changes.  
  • Cookie scope (path, domain, TTL) is configurable; oversized domains may leak affinity across sub-apps.

- When the pinned host goes unhealthy, proxy silently re-assigns a new host and updates the carrier—no user disruption.  
- Using stateful sessions reduces load-balancer randomness; ensure individual hosts can tolerate uneven traffic or combine with **adaptive concurrency** and **local rate limit** for protection.`

export const D_E_STAT_SINKS = `
Stat Sinks define the **output plugins** that export proxy's runtime statistics—counters, gauges, histograms, and text readouts—to external monitoring systems.  
While proxy maintains all stats in shared memory, a stats-sink streams selected metrics to destinations such as Prometheus, gRPC collectors, DogStatsD, or custom endpoints, enabling real-time dashboards, alerting, and long-term retention.

### Key Responsibilities
- Serialize in-process statistics at configurable intervals or in response to flush events.
- Transport metrics to remote back-ends over protocols like HTTP-pull (Prometheus text), UDP (StatsD/DogStatsD), or gRPC (OpenTelemetry / stats service).
- Apply filtering, tagging, and name translation rules so only relevant metrics reach the sink and follow back-end naming conventions.

### Common Use Cases
- Exposing a **/stats/prometheus** endpoint via \`prometheus\` for Prometheus-based scraping.
- Sending real-time metrics to a **Datadog Agent** with \`dog_statsd\` for unified infrastructure dashboards.
- Streaming high-cardinality histogram data to an **OpenTelemetry Collector** with \`open_telemetry\` to power advanced latency analysis.
- Forwarding proxy metrics to a **central gRPC stats service** in large multi-cluster deployments, decoupling data-plane collection from control-plane storage.

### Good to Know
- Multiple sinks can be configured simultaneously; each receives the same flushed snapshot.
- Per-sink **metric filters** (inclusion/exclusion) prevent noisy or sensitive stats from leaving the node.
- Flush interval defaults to **5 s**, but overly aggressive intervals can increase CPU and network usage.
- For pull-based sinks (Prometheus), remember to expose the admin interface securely—stats may reveal internal service names and paths.`