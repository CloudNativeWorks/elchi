import { useQuery } from "@tanstack/react-query";
import { api } from "@/common/api";
import { useProjectVariable } from "./useProjectVariable";

export interface SearchMatch {
    field_path: string;
    value: string;
    context: {
        virtual_host_name?: string;
        route_name?: string;
        inline_route?: boolean;
        filter_type?: string;
        locality?: string;
        port?: number;
        node_name?: string;
        address_type?: string;
        client_id?: string;
    };
}

export interface SearchResult {
    collection: string;
    resource_id: string;
    resource_name: string;
    project: string;
    version: string;
    gtype?: string;
    url: string;
    matches: SearchMatch[];
}

export interface SearchResponse {
    message: string;
    data: {
        query: string;
        total_results: number;
        results: SearchResult[];
    };
}

interface UseSearchOptions {
    query: string;
    enabled?: boolean;
}

export const useSearch = ({ query, enabled = true }: UseSearchOptions) => {
    const { project } = useProjectVariable();

    return useQuery({
        queryKey: ['search', query, project],
        enabled: enabled && !!query && !!project && query.trim().length > 0,
        retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await api.get<SearchResponse>('/api/v3/search', {
                params: {
                    query: query.trim(),
                    project
                }
            });
            return response.data;
        }
    });
};
