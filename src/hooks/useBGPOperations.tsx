/* eslint-disable */

import { useState, useMemo } from 'react';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { showErrorNotification } from '@/common/notificationHandler';

export enum BGPOperationType {
    UNKNOWN = "BGP_UNKNOWN",
    GET_CONFIG = "BGP_GET_CONFIG",
    SET_CONFIG = "BGP_SET_CONFIG",
    GET_STATE = "BGP_GET_STATE",
    ADD_NEIGHBOR = "BGP_ADD_NEIGHBOR",
    REMOVE_NEIGHBOR = "BGP_REMOVE_NEIGHBOR",
    UPDATE_NEIGHBOR = "BGP_UPDATE_NEIGHBOR",
    RESET_NEIGHBOR = "BGP_RESET_NEIGHBOR",
    LIST_NEIGHBORS = "BGP_LIST_NEIGHBORS",
    ADD_NETWORK = "BGP_ADD_NETWORK",
    REMOVE_NETWORK = "BGP_REMOVE_NETWORK",
    GET_ROUTES = "BGP_GET_ROUTES",
    GET_STATISTICS = "BGP_GET_STATISTICS",
    CLEAR_ROUTES = "BGP_CLEAR_ROUTES",
    ENABLE = "BGP_ENABLE",
    DISABLE = "BGP_DISABLE",
    APPLY_ROUTE_MAP = "BGP_APPLY_ROUTE_MAP",
    REMOVE_ROUTE_MAP = "BGP_REMOVE_ROUTE_MAP",
    SET_COMMUNITY = "BGP_SET_COMMUNITY",
    CLEAR_COMMUNITY = "BGP_CLEAR_COMMUNITY",
    GET_SUMMARY = "BGP_GET_SUMMARY",
    CLEAR_SESSION = "BGP_CLEAR_SESSION",
    RESET = "BGP_RESET",
    SHOW_NEIGHBORS = "BGP_SHOW_NEIGHBORS",
    SHOW_ROUTES = "BGP_SHOW_ROUTES",
    GET_STATUS = "BGP_GET_STATUS",
    CLEAR_CACHE = "BGP_CLEAR_CACHE",
    OPTIMIZE_CACHE = "BGP_OPTIMIZE_CACHE",
    // Advanced BGP Policy Operations
    APPLY_COMMUNITY_LIST = "BGP_APPLY_COMMUNITY_LIST",
    REMOVE_COMMUNITY_LIST = "BGP_REMOVE_COMMUNITY_LIST",
    APPLY_PREFIX_LIST = "BGP_APPLY_PREFIX_LIST",
    REMOVE_PREFIX_LIST = "BGP_REMOVE_PREFIX_LIST",
    VALIDATE_ROUTE_MAP = "BGP_VALIDATE_ROUTE_MAP",
    VALIDATE_COMMUNITY_LIST = "BGP_VALIDATE_COMMUNITY_LIST",
    VALIDATE_PREFIX_LIST = "BGP_VALIDATE_PREFIX_LIST",
    GET_POLICY_CONFIG = "BGP_GET_POLICY_CONFIG",
    // Advanced BGP Neighbor Operations
    GET_NEIGHBOR = "BGP_GET_NEIGHBOR",
    CHECK_NEIGHBOR_STATUS = "BGP_CHECK_NEIGHBOR_STATUS",
    GET_NEIGHBOR_STATE = "BGP_GET_NEIGHBOR_STATE",
    // BGP Health & Monitoring Operations
    GET_HEALTH_STATUS = "BGP_GET_HEALTH_STATUS",
    GET_PROTOCOL_STATUS = "BGP_GET_PROTOCOL_STATUS",
    GET_NEIGHBOR_STATISTICS = "BGP_GET_NEIGHBOR_STATISTICS",
    GET_PERFORMANCE_METRICS = "BGP_GET_PERFORMANCE_METRICS",
    VALIDATE_STATE_DATA = "BGP_VALIDATE_STATE_DATA",
    IS_NEIGHBOR_ESTABLISHED = "BGP_IS_NEIGHBOR_ESTABLISHED",
    GET_NEIGHBOR_UPTIME = "BGP_GET_NEIGHBOR_UPTIME",
    GET_ROUTES_RECEIVED_COUNT = "BGP_GET_ROUTES_RECEIVED_COUNT",
    // BGP Transaction Operations
    BEGIN_TRANSACTION = "BGP_BEGIN_TRANSACTION",
    COMMIT_TRANSACTION = "BGP_COMMIT_TRANSACTION",
    ROLLBACK_TRANSACTION = "BGP_ROLLBACK_TRANSACTION",
    ADD_TRANSACTION_OPERATION = "BGP_ADD_TRANSACTION_OPERATION",
    EXECUTE_TRANSACTION = "BGP_EXECUTE_TRANSACTION",
    GET_TRANSACTION_STATUS = "BGP_GET_TRANSACTION_STATUS",
    // BGP Advanced Validation Operations
    VALIDATE_CONFIG_CONSISTENCY = "BGP_VALIDATE_CONFIG_CONSISTENCY",
    VALIDATE_NEIGHBOR_COMPATIBILITY = "BGP_VALIDATE_NEIGHBOR_COMPATIBILITY",
    VALIDATE_AS_NUMBERS = "BGP_VALIDATE_AS_NUMBERS",
    VALIDATE_IP_ADDRESSES = "BGP_VALIDATE_IP_ADDRESSES",
    CHECK_RESERVED_AS = "BGP_CHECK_RESERVED_AS",
    // BGP Cache & Performance Operations
    GET_CACHE_STATS = "BGP_GET_CACHE_STATS",
    GET_CACHE_HIT_RATIO = "BGP_GET_CACHE_HIT_RATIO",
    PERIODIC_CACHE_CLEANUP = "BGP_PERIODIC_CACHE_CLEANUP",
    HANDLE_CACHE_STATS = "BGP_HANDLE_CACHE_STATS",
    HANDLE_CACHE_CLEAR = "BGP_HANDLE_CACHE_CLEAR",
    HANDLE_PERFORMANCE_METRICS = "BGP_HANDLE_PERFORMANCE_METRICS",
    // BGP State Management Operations
    RESET_BGP_SESSION = "BGP_RESET_BGP_SESSION",
    SOFT_RESET_BGP_SESSION = "BGP_SOFT_RESET_BGP_SESSION",
    // BGP Network Operations
    UPDATE_NETWORK = "BGP_UPDATE_NETWORK",
    GET_NETWORK_COUNT = "BGP_GET_NETWORK_COUNT",
    GET_REDISTRIBUTION_STATUS = "BGP_GET_REDISTRIBUTION_STATUS",
    GET_NETWORK_LIST = "BGP_GET_NETWORK_LIST"
}

export interface BGPConfig {
    autonomous_system?: number;
    router_id?: string;
    keepalive_time?: number;
    hold_time?: number;
    redistribute_connected?: boolean;
    redistribute_static?: boolean;
    redistribute_kernel?: boolean;
    redistribute_local?: boolean;
    enabled?: boolean;
    maximum_paths?: number;
    administrative_distance?: string;
    deterministic_med?: boolean;
    always_compare_med?: boolean;
    log_neighbor_changes?: boolean;
    // Graceful Restart Fields
    graceful_restart_enabled?: boolean;
    graceful_restart_time?: number;
    graceful_stale_path_time?: number;
    preserve_forwarding_state?: boolean;
    graceful_restart_disable?: boolean;
    select_defer_time?: number;
    rib_stale_time?: number;
}

export interface BGPNeighborTimers {
    keepalive?: number;
    holdtime?: number;
    connect_retry?: number;
}

export interface BGPNeighborRouteMaps {
    route_map_in?: string;
    route_map_out?: string;
}

export interface BGPNeighborPrefixLists {
    prefix_list_in?: string;
    prefix_list_out?: string;
}

export interface BGPNetwork {
    network: string;
    route_map?: string;
    backdoor?: boolean;
}

export interface BGPRouteMapMatch {
    match_type: string;    // "as-path", "community", "prefix-list", etc.
    match_value: string;
    exact_match?: boolean;
}

export interface BGPRouteMapSet {
    set_type: string;      // "local-preference", "metric", "community", etc.
    set_value: string;
    additive?: boolean;    // For community, as-path-prepend
}

export interface BGPRouteMap {
    name: string;
    sequence: number;
    action: 'permit' | 'deny';
    match_conditions?: BGPRouteMapMatch[];
    set_actions?: BGPRouteMapSet[];
    description?: string;
}

export interface BGPCommunityList {
    name: string;
    sequence: number;
    action: 'permit' | 'deny';
    community_values: string;  // Space-separated community values
}

export interface BGPPrefixList {
    name: string;
    sequence: number;
    action: 'permit' | 'deny';
    prefix: string;
    le?: number;  // less-equal prefix length
    ge?: number;  // greater-equal prefix length
}

export interface BGPNeighborRequest {
    peer_ip: string;
    remote_as: number;
    description?: string;
    password?: string;
    timers?: BGPNeighborTimers;
    route_maps?: BGPNeighborRouteMaps;
    prefix_lists?: BGPNeighborPrefixLists;
    next_hop_self?: boolean;
    soft_reconfiguration?: boolean;
    shutdown?: boolean;
    update_source?: string;
    maximum_prefix?: number;
    maximum_prefix_out?: number;
    allowas_in?: number;
    weight?: number;
    ebgp_multihop?: boolean;
    ebgp_multihop_ttl?: number;
    disable_connected_check?: boolean;
    // Per-Neighbor Graceful Restart Fields
    graceful_restart?: boolean;
    graceful_restart_helper?: boolean;
    graceful_restart_disable?: boolean;
}

export const useBGPOperations = () => {
    const { project } = useProjectVariable();
    const mutate = useOperationsApiMutation();
    const [loading, setLoading] = useState(false);

    const operations = useMemo(() => {
        const sendBGPRequest = async (clientId: string, operation: BGPOperationType, additionalData?: any) => {
            if (!clientId) {
                showErrorNotification('Client ID is required');
                return { success: false, error: 'Client ID is required' };
            }

            setLoading(true);
            try {
                const requestData = {
                    type: OperationsType.FRR,
                    clients: [{ client_id: clientId }],
                    command: {
                        protocol: "FRR_PROTOCOL_BGP",
                        bgp: {
                            operation,
                            ...additionalData
                        }
                    }
                };

                const response = await mutate.mutateAsync({ data: requestData, project });

                if (Array.isArray(response) && response.length > 0) {
                    const firstResponse = response[0];

                    if (firstResponse.error && firstResponse.error.trim() !== '') {
                        console.error('BGP operation error:', firstResponse.error);
                        showErrorNotification(firstResponse.error);
                        return { success: false, error: firstResponse.error };
                    }

                    // Let components handle their own success/error messages
                    // Hook just returns the response data

                    return { success: true, data: response };
                }

                showErrorNotification('Invalid response format');
                return { success: false, error: 'Invalid response format' };
            } catch (error: any) {
                console.error(`BGP ${operation} error:`, error);
                const errorMessage = `BGP ${operation} operation failed`;
                showErrorNotification(error, errorMessage);
                return { success: false, error: errorMessage };
            } finally {
                setLoading(false);
            }
        };

        return {
            loading,
            getBGPNeighbor: (clientId: string, asNumber: number, peerIp: string) => sendBGPRequest(clientId, BGPOperationType.GET_NEIGHBOR, {
                as_number: asNumber,
                peer_ip: peerIp
            }),
            getBGPConfig: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.GET_CONFIG),
            updateBGPConfig: (clientId: string, config: BGPConfig, localAs?: number, remoteAs?: number) => sendBGPRequest(clientId, BGPOperationType.SET_CONFIG, {
                config,
                ...(localAs && { local_as: localAs }),
                ...(remoteAs && { remote_as: remoteAs })
            }),
            getBGPNeighbors: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.LIST_NEIGHBORS),
            addBGPNeighbor: (clientId: string, neighbor: BGPNeighborRequest, asNumber: number) => sendBGPRequest(clientId, BGPOperationType.ADD_NEIGHBOR, {
                neighbor,
                as_number: asNumber
            }),
            removeBGPNeighbor: (clientId: string, peerIp: string, asNumber: number) => sendBGPRequest(clientId, BGPOperationType.REMOVE_NEIGHBOR, {
                neighbor: { peer_ip: peerIp },
                as_number: asNumber
            }),
            updateBGPNeighbor: (clientId: string, neighbor: BGPNeighborRequest, asNumber: number) => sendBGPRequest(clientId, BGPOperationType.UPDATE_NEIGHBOR, {
                neighbor,
                as_number: asNumber
            }),
            resetBGPNeighbor: (clientId: string, peerIp: string) => sendBGPRequest(clientId, BGPOperationType.RESET_NEIGHBOR, { peer_ip: peerIp }),
            getBGPStatus: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.GET_STATUS),
            getBGPState: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.GET_STATE),
            getBGPPolicyConfig: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.GET_POLICY_CONFIG),
            getBGPRoutes: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.SHOW_ROUTES),
            getBGPSummary: (clientId: string) => sendBGPRequest(clientId, BGPOperationType.GET_SUMMARY),
            clearBGPRoutes: (clientId: string, neighbor: string, soft: boolean = false, direction: 'in' | 'out' | 'all' = 'all') => sendBGPRequest(clientId, BGPOperationType.CLEAR_ROUTES, {
                clear: {
                    soft,
                    direction,
                    neighbor
                }
            }),

            // BGP Policy Operations - Route Maps
            applyBGPRouteMap: (clientId: string, routeMap: BGPRouteMap) => sendBGPRequest(clientId, BGPOperationType.APPLY_ROUTE_MAP, {
                route_map: routeMap
            }),
            removeBGPRouteMap: (clientId: string, name: string, sequence?: number) => sendBGPRequest(clientId, BGPOperationType.REMOVE_ROUTE_MAP, {
                route_map: { name, sequence }
            }),

            // BGP Policy Operations - Prefix Lists
            applyBGPPrefixList: (clientId: string, prefixList: BGPPrefixList) => sendBGPRequest(clientId, BGPOperationType.APPLY_PREFIX_LIST, {
                prefix_list: prefixList
            }),
            removeBGPPrefixList: (clientId: string, name: string, sequence?: number) => sendBGPRequest(clientId, BGPOperationType.REMOVE_PREFIX_LIST, {
                prefix_list: { name, sequence }
            }),

            // BGP Policy Operations - Community Lists
            applyBGPCommunityList: (clientId: string, communityList: BGPCommunityList) => sendBGPRequest(clientId, BGPOperationType.APPLY_COMMUNITY_LIST, {
                community_list: communityList
            }),
            removeBGPCommunityList: (clientId: string, name: string, sequence?: number) => sendBGPRequest(clientId, BGPOperationType.REMOVE_COMMUNITY_LIST, {
                community_list: { name, sequence }
            }),
        };
    }, [mutate, loading]);

    return operations;
}; 