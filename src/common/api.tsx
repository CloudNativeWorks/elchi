import axios from 'axios';
import { useQuery, useMutation } from "@tanstack/react-query";
import Config from '../conf';
import Cookies from 'js-cookie';
import { AuthMutationOptions, AxiosInstanceExtended, CustomMutationOptions, CustomQueryOptions, DeleteMutationOptions, General, ScenarioMutationOptions } from './types';
import { useProjectVariable } from '@/hooks/useProjectVariable';

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
        const refresh_token = Cookies.get('bb_refresh_token');
        if (token) {
            config.headers['token'] = token;
            config.headers['refresh-token'] = refresh_token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [403, 401].includes(error.response.status)) {
            window.location.hash = '#/403';
        }
        return Promise.reject(error);
    }
);

export const useCustomGetQuery = ({ queryKey, enabled, path, refetchOnWindowFocus, directApi }: CustomQueryOptions) => {
    const { isLoading, error, data, isFetching, refetch } = useQuery({
        queryKey: [queryKey],
        refetchOnWindowFocus: refetchOnWindowFocus ?? false,
        enabled: enabled,
        retry: 1,
        queryFn: () =>
            api.get(directApi ? '/' + path : Config.baseApi + path)
                .then((res) => res.data),
    });

    return { isLoading, error, data, isFetching, refetch };
};

export const useCustomMutation = () => {
    const { project } = useProjectVariable();
    const mutationFn = async (options: CustomMutationOptions) => {
        const { name, envoyVersion, type: type, gtype, canonical_name, metadata, category, resource, version, method, path, config_discovery, managed, service, collection } = options;
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
        };

        const data = {
            general,
            resource: {
                resource,
                version
            }
        };

        const response = await api[method](Config.baseApi + path, data, {
            headers: {
                'envoy-version': envoyVersion,
            }
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
        const response = await api.delete(Config.baseApi + options.path);
        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};

export const useAuthMutation = (path: string) => {
    const mutationFn = async (options: AuthMutationOptions) => {
        const { username, password } = options;
        const data = {
            username,
            password
        };
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


export const useScenarioMutation = (path: string) => {
    const mutationFn = async (options: ScenarioMutationOptions) => {
        const response = await api.post(path, options);
        return response;
    }

    const mutation = useMutation({
        mutationFn,
    });

    return mutation;
};