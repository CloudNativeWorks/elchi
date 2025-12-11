import { DOWNSTREAM_CONNECTION_METRICS, DOWNSTREAM_REQUEST_METRICS } from "./MainMetrics/Downstream";
import { UPSTREAM_CONNECTION_METRICS, UPSTREAM_MEMBER_METRICS, UPSTREAM_REQUEST_METRICS } from "./MainMetrics/Upstream";
import { OTHERS_METRICS } from "./MainMetrics/Other";
import { LISTENER_METRICS } from "./MainMetrics/Listener";
import { BASIC_AUTH_METRICS } from "./FilterMetrics/HTTP/BasicAuth";
import { HTTP_INSPECTOR_METRICS } from "./FilterMetrics/Listener/HttpInspector";
import { LOCAL_RATELIMIT_METRICS } from "./FilterMetrics/Listener/LocalRatelimit";
import { CONNECTION_LIMIT_METRICS } from "./FilterMetrics/Network/ConnectionLimit";
import { LOCAL_RATE_LIMIT_METRICS } from "./FilterMetrics/Network/LocalRatelimit";
import { NETWORK_RBAC_METRICS } from "./FilterMetrics/Network/RBAC";
import { TCP_PROXY_METRICS } from "./FilterMetrics/Network/TcpProxy";
import { ADAPTIVE_CONCURRENCY_METRICS } from "./FilterMetrics/HTTP/AdaptiveConcurrency";
import { ADMISSION_CONTROL_METRICS } from "./FilterMetrics/HTTP/AdmissionControl";
import { BANDWIDTH_LIMIT_METRICS } from "./FilterMetrics/HTTP/BandwidthLimit";
import { COMPRESSOR_METRICS } from "./FilterMetrics/HTTP/Compressor";
import { DNS_FILTER_METRICS } from "./FilterMetrics/Listener/DnsFilter";
import { CORS_METRICS } from "./FilterMetrics/HTTP/CORS";
import { CSRF_METRICS } from "./FilterMetrics/HTTP/CSRF";
import { HTTP_LOCAL_RATE_LIMIT_METRICS } from "./FilterMetrics/HTTP/LocalRatelimit";
import { LUA_METRICS } from "./FilterMetrics/HTTP/Lua";
import { HTTP_RBAC_METRICS } from "./FilterMetrics/HTTP/RBAC";
import { HTTP_ROUTER_METRICS } from "./FilterMetrics/HTTP/Router";

export interface MetricConfig {
    section: string;
    title: string;
    metric: string;
    span: number;
    description?: string;
    groups: string[];
    legendMapping: {
        template: string;
        labelKeys: string[];
        extraLabels?: { [key: string]: string };
    }[];
    formatType: 'bytes' | 'number' | 'duration';
    formatConfig?: {
        inputUnit?: string;
        units?: string[];
    };
    queryTemplate: string;
    windowSecs?: {
        default: number;
        ranges: {
            threshold: number;
            value: number;
        }[];
    };
}

export const METRICS: MetricConfig[] = [
    // Upstream
    ...UPSTREAM_MEMBER_METRICS,
    ...DOWNSTREAM_REQUEST_METRICS,
    ...DOWNSTREAM_CONNECTION_METRICS,
    ...UPSTREAM_REQUEST_METRICS,
    ...UPSTREAM_CONNECTION_METRICS,
    ...LISTENER_METRICS,
    ...OTHERS_METRICS,

    // Listener Filter
    ...HTTP_INSPECTOR_METRICS,
    ...LOCAL_RATELIMIT_METRICS,
    ...DNS_FILTER_METRICS,

    // Network Filter
    ...CONNECTION_LIMIT_METRICS,
    ...LOCAL_RATE_LIMIT_METRICS,
    ...NETWORK_RBAC_METRICS,
    ...TCP_PROXY_METRICS,

    // HTTP Filter
    ...ADAPTIVE_CONCURRENCY_METRICS,
    ...ADMISSION_CONTROL_METRICS,
    ...BANDWIDTH_LIMIT_METRICS,
    ...BASIC_AUTH_METRICS,
    ...COMPRESSOR_METRICS,
    ...CORS_METRICS,
    ...CSRF_METRICS,
    ...HTTP_LOCAL_RATE_LIMIT_METRICS,
    ...LUA_METRICS,
    ...HTTP_RBAC_METRICS,
    ...HTTP_ROUTER_METRICS,
];
