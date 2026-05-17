import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { api, useCustomGetQuery } from '@/common/api';
import Config from '@/conf';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type {
    PaginatedResponse,
    SingleResponse,
    ListenerSummary,
    InventoryDoc,
    RawEvent,
    RollupBucket,
    GeoSummary,
    DiscoveriesResponse,
    AuthCoverageResponse,
    BotScannerResponse,
    PiiInventoryResponse,
    ZombiesResponse,
    InventoryListenersParams,
    InventoryListParams,
    InventoryEventsParams,
    InventoryStatsParams,
    InventoryGeoParams,
    InventoryDiscoveriesParams,
    InventoryAuthCoverageParams,
    InventoryBotScannerParams,
    InventoryPiiParams,
    InventoryZombiesParams,
    RiskSummaryResponse,
    InventoryRiskSummaryParams,
    SecurityScoreResponse,
    InventorySecurityScoreParams,
    TransportResponse,
    InventoryTransportParams,
    ErrorsResponse,
    InventoryErrorsParams,
} from '@/pages/api-discovery/types';

const INVENTORY_PATH = 'inventory'; // Config.baseApi already adds /api/v3/

// Stringify params for a stable, URLSearchParams-style query — arrays are
// CSV per backend contract; undefined/null/empty strings are skipped.
const buildQuery = (project: string, params: Record<string, any> = {}): string => {
    const sp = new URLSearchParams();
    sp.set('project', project);
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v)) {
            if (v.length === 0) continue;
            sp.set(k, v.join(','));
        } else if (typeof v === 'boolean') {
            sp.set(k, v ? 'true' : 'false');
        } else {
            sp.set(k, String(v));
        }
    }
    return sp.toString();
};

// Stable JSON key for queryKey arrays — arrays are sorted so the same set
// of values in different orders dedups to one cache entry.
const stableKey = (obj: Record<string, any> | undefined): string =>
    JSON.stringify(obj ?? {}, (_, v) =>
        Array.isArray(v) ? [...v].sort() : v
    );

// ---------- /inventory/listeners — Page 1 ----------

export const useApiInventoryListeners = (
    params: InventoryListenersParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_listeners_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/listeners?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: PaginatedResponse<ListenerSummary>;
    };
};

// ---------- /inventory — Page 2 ----------

export const useApiInventory = (
    params: InventoryListParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_list_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: PaginatedResponse<InventoryDoc>;
    };
};

// ---------- /inventory/:id — Page 3 Overview ----------

export const useApiInventoryDetail = (id: string | undefined, enabled = true) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_detail_${project}_${id}`,
        enabled: enabled && !!project && !!id,
        path: `${INVENTORY_PATH}/${id}?project=${encodeURIComponent(project)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: SingleResponse<InventoryDoc>;
    };
};

// ---------- /inventory/:id/events — Page 3 Events tab ----------
// Uses useQuery directly so we can pass the
// `_skipGlobalErrorNotification` axios config flag — 503 means
// "ClickHouse not configured" which is an expected steady state and
// must render inline, not as a global toast.

type ClickhouseQueryResult<T> = {
    isLoading: boolean;
    isFetching: boolean;
    error: any;
    data?: T;
    refetch: () => void;
    /** 503 — ClickHouse is not configured on the controller. */
    isClickhouseUnavailable: boolean;
    /** Any non-503 failure — 502 query error, 500, timeout, or a network
     *  drop. Grouped so the UI shows a single "retry" affordance instead
     *  of silently falling through to an empty state (which would look
     *  like "no data" when the request actually failed). */
    isClickhouseQueryFailed: boolean;
};

const useClickhouseQuery = <T>(
    queryKey: string,
    path: string,
    enabled: boolean,
    options: Partial<UseQueryOptions<T>> = {},
): ClickhouseQueryResult<T> => {
    const q = useQuery<T>({
        queryKey: [queryKey],
        enabled,
        refetchOnWindowFocus: false,
        retry: false, // 503 is steady state; no retries
        queryFn: () =>
            api
                .get(Config.baseApi + path, {
                    // Tell the global error interceptor to ignore this response;
                    // the component renders its own inline alert.
                    _skipGlobalErrorNotification: true,
                } as any)
                .then((res) => res.data as T),
        ...options,
    });

    const status = (q.error as any)?.response?.status;
    const isClickhouseUnavailable = status === 503;
    // Everything that isn't 503 (502, 500, timeout, network drop) — surface
    // it as a retryable failure rather than letting `data` stay undefined
    // and the dashboard render a misleading "no data" state.
    const isClickhouseQueryFailed = !!q.error && status !== 503;

    return {
        isLoading: q.isLoading,
        isFetching: q.isFetching,
        error: q.error,
        data: q.data,
        refetch: q.refetch,
        isClickhouseUnavailable,
        isClickhouseQueryFailed,
    };
};

export const useApiInventoryEvents = (
    id: string | undefined,
    params: InventoryEventsParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/${id}/events?${buildQuery(project, params)}`;
    return useClickhouseQuery<PaginatedResponse<RawEvent>>(
        `inventory_events_${project}_${id}_${stableKey(params)}`,
        path,
        enabled && !!project && !!id,
    );
};

// ---------- /inventory/:id/stats — Page 3 Analytics tab ----------

export const useApiInventoryStats = (
    id: string | undefined,
    params: InventoryStatsParams,
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/${id}/stats?${buildQuery(project, params)}`;
    return useClickhouseQuery<{ data: RollupBucket[]; count: number }>(
        `inventory_stats_${project}_${id}_${stableKey(params)}`,
        path,
        enabled && !!project && !!id && !!params?.granularity,
    );
};

// ---------- /inventory/geo — Geo & threats summary ----------
// Scope is controlled by params:
//   - project alone        → project-wide
//   - + listener_name      → listener-scoped
//   - + inventory_id       → endpoint-scoped (handler unwraps to listener+path)
// include_series=true adds country / ua_kind / ti_hits time series.
// 503 → ClickHouse offline (handled by useClickhouseQuery).

export const useApiInventoryGeo = (
    params: InventoryGeoParams,
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/geo?${buildQuery(project, params)}`;
    return useClickhouseQuery<SingleResponse<GeoSummary>>(
        `inventory_geo_${project}_${stableKey(params)}`,
        path,
        enabled && !!project && !!params?.from && !!params?.to,
    );
};

// ---------- /inventory/discoveries — newly discovered endpoints ----------
// Mongo-backed (first_seen filter), no ClickHouse dependency.

export const useApiInventoryDiscoveries = (
    params: InventoryDiscoveriesParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_discoveries_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/discoveries?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: DiscoveriesResponse;
    };
};

// ---------- /inventory/auth-coverage — unauthenticated endpoints ----------

export const useApiInventoryAuthCoverage = (
    params: InventoryAuthCoverageParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_auth_coverage_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/auth-coverage?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: AuthCoverageResponse;
    };
};

// ---------- /inventory/bot-scanner — heatmap (ClickHouse-backed) ----------

export const useApiInventoryBotScanner = (
    params: InventoryBotScannerParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/bot-scanner?${buildQuery(project, params)}`;
    return useClickhouseQuery<BotScannerResponse>(
        `inventory_bot_scanner_${project}_${stableKey(params)}`,
        path,
        enabled && !!project,
    );
};

// ---------- /inventory/pii — PII envelope ----------

export const useApiInventoryPii = (
    params: InventoryPiiParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_pii_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/pii?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: PiiInventoryResponse;
    };
};

// ---------- /inventory/zombies — deprecation candidates ----------

export const useApiInventoryZombies = (
    params: InventoryZombiesParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_zombies_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/zombies?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: ZombiesResponse;
    };
};

// ---------- /inventory/risk-summary — risk posture ----------
// Mongo-backed aggregation over risk_flags; no ClickHouse dependency.

export const useApiInventoryRiskSummary = (
    params: InventoryRiskSummaryParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    return useCustomGetQuery({
        queryKey: `inventory_risk_summary_${project}_${stableKey(params)}`,
        enabled: enabled && !!project,
        path: `${INVENTORY_PATH}/risk-summary?${buildQuery(project, params)}`,
    }) as ReturnType<typeof useCustomGetQuery> & {
        data?: RiskSummaryResponse;
    };
};

// Note: the collector runtime config moved out of /inventory — it is now
// edited via Settings → API Discovery (GET/PUT /api/v3/setting/api_discovery,
// see src/pages/settings/ApiDiscoveryConfig.tsx).

// ---------- /inventory/security-score — A–F security grade ----------
// ClickHouse-backed (event scan) — 503 when CH is not configured.

export const useApiInventorySecurityScore = (
    params: InventorySecurityScoreParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/security-score?${buildQuery(project, params)}`;
    return useClickhouseQuery<SecurityScoreResponse>(
        `inventory_security_score_${project}_${stableKey(params)}`,
        path,
        enabled && !!project,
    );
};

// ---------- /inventory/transport — TLS / transport posture ----------

export const useApiInventoryTransport = (
    params: InventoryTransportParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/transport?${buildQuery(project, params)}`;
    return useClickhouseQuery<TransportResponse>(
        `inventory_transport_${project}_${stableKey(params)}`,
        path,
        enabled && !!project,
    );
};

// ---------- /inventory/errors — 4xx / 5xx analysis ----------

export const useApiInventoryErrors = (
    params: InventoryErrorsParams = {},
    enabled = true,
) => {
    const { project } = useProjectVariable();
    const path = `${INVENTORY_PATH}/errors?${buildQuery(project, params)}`;
    return useClickhouseQuery<ErrorsResponse>(
        `inventory_errors_${project}_${stableKey(params)}`,
        path,
        enabled && !!project,
    );
};
