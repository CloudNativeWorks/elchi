import axios from 'axios';
import { useQuery, useMutation } from "@tanstack/react-query";
import Config from '../conf';
import Cookies from 'js-cookie';
import { AuthMutationOptions, AxiosInstanceExtended, CustomMutationOptions, CustomQueryOptions, DeleteMutationOptions, General, ScenarioMutationOptions } from './types';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { showErrorNotification, isAuthError, handleApiResponse } from './notificationHandler';

export const api: AxiosInstanceExtended = axios.create({
    baseURL: window.APP_CONFIG?.API_URL,
    headers: {
        'Content-Type': 'application/json',
        'from-elchi': 'yes'
    },
    timeout: 115000
});

api.interceptors.request.use(
    async (config: any): Promise<any> => {
        const token = Cookies.get('bb_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

// Refresh token function
const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('bb_refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post(`${window.APP_CONFIG?.API_URL}/refresh`, {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
                'from-elchi': 'yes'
            }
        });

        const newAccessToken = response.data.token;
        const newRefreshToken = response.data.refresh_token;

        Cookies.set('bb_token', newAccessToken);

        // Update refresh token if provided (token rotation)
        if (newRefreshToken) {
            Cookies.set('bb_refresh_token', newRefreshToken);
        }

        return newAccessToken;
    } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        Cookies.remove('bb_token');
        Cookies.remove('bb_refresh_token');
        window.location.hash = '#/403';
        throw error;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh for 401 TOKEN_EXPIRED errors
        if (error.response?.status === 401 &&
            error.response?.data?.error_type === 'TOKEN_EXPIRED' &&
            !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();

                // Retry original request with new token
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed, redirect to login
                console.error('Refresh token failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        // Handle auth errors based on status code and error type
        // Don't redirect for profile/OTP/login endpoints - let components handle these errors
        const url = error.config?.url || '';
        const isProfileEndpoint = url.includes('/profile') || url.includes('/otp');
        const isLoginEndpoint = url.includes('/auth/login');
        const isSpecialEndpoint = isProfileEndpoint || isLoginEndpoint;

        if ((error.response?.status === 401 || error.response?.status === 403) && !isSpecialEndpoint) {
            // 401 without TOKEN_EXPIRED or 403 = redirect to login
            window.location.hash = '#/403';
        } else if (error.response?.status === 422 && error.response?.data?.error_type?.startsWith('TOKEN_') && !isSpecialEndpoint) {
            // 422 TOKEN_INVALID or TOKEN_ERROR = redirect to login (don't refresh)
            window.location.hash = '#/403';
        } else if (!isAuthError(error) || isProfileEndpoint) {
            // Show error notifications for:
            // 1. Non-auth errors (all endpoints)
            // 2. Auth errors for profile/OTP endpoints (so users see "wrong password" etc.)
            // 3. BUT NOT for login endpoint (login page handles OTP logic itself)
            const isTemplateCheck = error.config?.url?.includes('/templates/check/');
            if (!isTemplateCheck && !isLoginEndpoint) {
                showErrorNotification(error);

                // Trigger error summary refresh on API errors (but not too frequently)
                if (error.response?.status >= 500 ||
                    (error.response?.status >= 400 && error.response?.status < 500 &&
                        error.response?.status !== 404)) {
                    // Dynamic import to avoid circular dependency
                    import('../hooks/useErrorSummary').then(({ triggerErrorSummaryRefresh }) => {
                        triggerErrorSummaryRefresh();
                    }).catch(console.warn);
                }
            }
        }
        return Promise.reject(error);
    }
);

export const useCustomGetQuery = ({ queryKey, enabled, path, refetchOnWindowFocus, directApi }: CustomQueryOptions) => {
    const { isLoading, error, data, isFetching, refetch } = useQuery({
        queryKey: [queryKey],
        refetchOnWindowFocus: refetchOnWindowFocus ?? false,
        enabled: enabled,
        retry: (failureCount, error: any) => {
            // Don't retry on auth errors or client errors (4xx)
            if (isAuthError(error) || (error?.response?.status >= 400 && error?.response?.status < 500)) {
                return false;
            }
            return failureCount < 1;
        },
        retryDelay: 1000,
        queryFn: () =>
            api.get(directApi ? '/' + path : Config.baseApi + path)
                .then((res) => res.data)
    });

    return { isLoading, error, data, isFetching, refetch };
};

export const useCustomMutation = () => {
    const { project } = useProjectVariable();
    const mutationFn = async (options: CustomMutationOptions) => {
        const {
            name, envoyVersion, type: type, gtype, canonical_name, metadata, category,
            resource, version, method, path, config_discovery, managed, service, collection,
            elchi_discovery, waf, showAutoSuccess, customSuccessMessage, successTitle, validate
        } = options;

        const general: General = {
            name,
            version: envoyVersion,
            type: type,
            gtype,
            project,
            canonical_name,
            metadata,
            category,
            permissions: {
                users: [],
                groups: [],
            },
            config_discovery: config_discovery || [],
            service,
            managed,
            collection,
            elchi_discovery: elchi_discovery || [],
            waf: waf || "", // Always include waf field (empty string if not set)
        };

        const data = {
            general,
            resource: {
                resource,
                version
            }
        };

        // Add validate query param if provided
        let finalPath = Config.baseApi + path;
        if (validate !== undefined) {
            const separator = finalPath.includes('?') ? '&' : '?';
            finalPath += `${separator}validate=${validate}`;
        }

        const response = await api[method](finalPath, data, {
            headers: {
                'envoy-version': envoyVersion,
            }
        });

        // Handle success notification
        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess,
            customSuccessMessage,
            successTitle
        });

        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};

export const useDeleteMutation = () => {
    const mutationFn = async (options: DeleteMutationOptions) => {
        const { path, showAutoSuccess, customSuccessMessage, successTitle } = options;
        const response = await api.delete(Config.baseApi + path);

        // Handle success notification
        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess,
            customSuccessMessage,
            successTitle
        });

        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};

export const useAuthMutation = (path: string) => {
    const mutationFn = async (options: AuthMutationOptions) => {
        const { username, password, otp_code, backup_code } = options;
        const data: any = {
            username,
            password
        };

        // Add OTP fields if provided
        if (otp_code) data.otp_code = otp_code;
        if (backup_code) data.backup_code = backup_code;

        const response = await api.post(path, data);
        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};

export const useDemoMutation = (path: string) => {
    const mutationFn = async (email: string) => {
        const response = await api.post(`${path}/${email}`, null);
        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};
