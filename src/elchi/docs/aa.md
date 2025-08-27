# Role Based Access Control (RBAC) Network Filter

The RBAC network filter authorizes actions from identified downstream clients. It's used to manage and protect applications from unauthorized agents. The filter can be configured with policies that act as either an ALLOW or DENY list or use matchers for conditional actions based on properties such as IPs, ports, or SSL subjects. Additionally, it supports both enforcement and shadow modes, where shadow mode allows testing of new policies without affecting real users.

When a request is denied, the `CONNECTION_TERMINATION_DETAILS` includes the matched policy name in the format `rbac_access_denied_matched_policy[policy_name]`. If no policy is matched, `policy_name` is set to `none`.


## Statistics

RBAC filter statistics are emitted under the `<stat_prefix>.rbac.` namespace. Shadow rules have their statistics prefixed additionally by `shadow_rules_stat_prefix`.

| Name             | Type    | Description                                                         |
| ---------------- | ------- | ------------------------------------------------------------------- |
| `allowed`        | Counter | Total requests allowed                                              |
| `denied`         | Counter | Total requests denied                                               |
| `shadow_allowed` | Counter | Requests that would be allowed by shadow rules                      |
| `shadow_denied`  | Counter | Requests that would be denied by shadow rules                       |
| `logged`         | Counter | Total requests that should be logged                                |
| `not_logged`     | Counter | Total requests that should not be logged                            |

## Dynamic Metadata

The filter provides the following dynamic metadata, especially useful for logging and tracking shadow rules results:

| Name                         | Type    | Description                                                                 |
| ---------------------------- | ------- | --------------------------------------------------------------------------- |
| `shadow_effective_policy_id` | String  | The ID of the matching shadow policy (if any)                               |
| `shadow_engine_result`       | String  | Result of shadow rule processing (`allowed` or `denied`)                    |
| `access_log_hint`            | Boolean | Indicates if the request should be logged, shared under `envoy.common` key  |

The `shadow_rules_stat_prefix` can be applied to both statistics and metadata for better tracking and organization.