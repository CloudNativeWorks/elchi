import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { api } from '@/common/api';

export interface LicenseInfo {
    valid: boolean;
    plan: 'free' | 'advance' | 'enterprise' | string;
    plan_name?: string;
    client_limit: number;
    current_clients?: number;
    expires_at?: string;
    activated_at?: string;
    last_checked_at?: string;
    license_key?: string;
    api_key?: string; // server-side masked, e.g. "****ce7"
    fingerprint?: string;
    activation_id?: string;
    api_key_configured?: boolean;
    api_version?: string;
    reason?: string;
    last_error?: string;
}

export interface LicenseResponse {
    license: LicenseInfo;
}

export const LICENSE_QUERY_KEY = 'license_status';

const LICENSE_PATH = '/api/v3/setting/license';

export interface UseLicenseStatusOptions {
    polling?: boolean;
    pollingIntervalMs?: number;
    enabled?: boolean;
}

export const useLicenseStatus = (options?: UseLicenseStatusOptions) => {
    const polling = options?.polling ?? false;
    const pollingIntervalMs = options?.pollingIntervalMs ?? 60_000;
    const enabled = options?.enabled ?? true;
    const hasToken = !!Cookies.get('bb_token');

    const query = useQuery({
        queryKey: [LICENSE_QUERY_KEY],
        enabled: enabled && hasToken,
        refetchOnWindowFocus: false,
        refetchInterval: polling ? pollingIntervalMs : false,
        refetchIntervalInBackground: false,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 1;
        },
        queryFn: async (): Promise<LicenseResponse> => {
            const response = await api.get(LICENSE_PATH);
            return response.data as LicenseResponse;
        },
    });

    return {
        ...query,
        license: query.data?.license,
    };
};

export const useActivateLicense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { license_key: string; api_key: string }) => {
            const body = {
                license_key: payload.license_key.trim(),
                api_key: payload.api_key.trim(),
            };
            const response = await api.post(`${LICENSE_PATH}/activate`, body);
            return response.data as { message?: string; license?: LicenseInfo };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LICENSE_QUERY_KEY] });
        },
    });
};

export const useForceLicenseCheck = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await api.post(`${LICENSE_PATH}/check`);
            return response.data as { ok?: boolean; license?: LicenseInfo; error?: string };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LICENSE_QUERY_KEY] });
        },
    });
};

export const useDeleteLicense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await api.delete(LICENSE_PATH);
            return response.data as { message?: string; license?: LicenseInfo };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LICENSE_QUERY_KEY] });
        },
    });
};

export interface PlanColorTheme {
    fg: string;
    bg: string;
    border: string;
}

export const PLAN_COLORS: Record<string, PlanColorTheme> = {
    free: {
        fg: '#6b7280',
        bg: 'rgba(107, 114, 128, 0.12)',
        border: 'rgba(107, 114, 128, 0.4)',
    },
    advance: {
        fg: 'var(--color-primary)',
        bg: 'rgba(22, 119, 255, 0.12)',
        border: 'rgba(22, 119, 255, 0.4)',
    },
    enterprise: {
        fg: '#722ed1',
        bg: 'rgba(114, 46, 209, 0.12)',
        border: 'rgba(114, 46, 209, 0.4)',
    },
    invalid: {
        fg: 'var(--color-danger)',
        bg: 'rgba(255, 77, 79, 0.12)',
        border: 'rgba(255, 77, 79, 0.4)',
    },
};

export const getPlanColors = (license?: LicenseInfo): PlanColorTheme => {
    if (!license || license.valid === false) return PLAN_COLORS.invalid;
    const plan = (license.plan || 'free').toLowerCase();
    return PLAN_COLORS[plan] || PLAN_COLORS.free;
};

export const getPlanDisplayName = (license?: LicenseInfo): string => {
    if (!license) return 'Unknown';
    if (license.plan_name) return license.plan_name;
    const p = (license.plan || 'free').toLowerCase();
    return p.charAt(0).toUpperCase() + p.slice(1);
};

export const getPlanLimitLabel = (license?: LicenseInfo): string => {
    if (!license) return '';
    if (license.client_limit === 0) return '∞';
    return String(license.client_limit);
};

export const getDaysUntilExpiry = (license?: LicenseInfo): number | null => {
    if (!license?.expires_at) return null;
    const expiry = new Date(license.expires_at).getTime();
    if (Number.isNaN(expiry)) return null;
    const diffMs = expiry - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};
