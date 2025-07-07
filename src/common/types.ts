/* eslint-disable no-unused-vars */
import { AxiosInstance, Method } from 'axios';
import * as DynamicModules from "@/VersionedComponent"
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export interface ConfigDiscoveryWithIndex extends ConfDiscovery {
    tableIndex: number;
}

export interface TypedConfigWithIndex {
    value: any;
    disabled?: boolean;
    tableIndex: number;
}

export type Components = Record<DynamicModules.ComponentName, React.ComponentType<any>>;


export interface AxiosInstanceExtended extends AxiosInstance {
    [key: string]: any;
}

export interface CustomQueryOptions {
    queryKey: string;
    enabled?: boolean;
    path: string;
    refetchOnWindowFocus?: boolean;
    directApi?: boolean;
    headers?: Record<string, string>;
}

export interface CustomMutationOptions {
    path: string;
    method: Method;
    name: string;
    envoyVersion: string;
    type: string;
    gtype: string;
    canonical_name: string;
    category: string | undefined;
    resource: any;
    version: string;
    permissions?: Permissions;
    config_discovery?: ConfigDiscovery[];
    metadata?: Record<string, any>;
    managed?: boolean;
    service?: string;
    collection: string;
    headers?: Record<string, string>;
}

export interface Permissions {
    users: string[];
    groups: string[];
}

export interface General {
    name: string;
    version: string;
    type: string;
    gtype: string;
    project: string;
    canonical_name: string;
    category: string | undefined;
    permissions?: Permissions;
    config_discovery: ConfigDiscovery[];
    metadata?: Record<string, any>;
    service?: string;
    managed?: boolean;
    collection: string;
}

export interface ConfigDiscovery {
    parent_name?: string;
    extensions?: Extensions[];
    main_resource?: string;
}

export interface ConfDiscovery {
    parent_name: string;
    gtype: string;
    canonical_name: string;
    category: string;
    name: string;
    priority: number;
}

export interface TypeConfig {
    parent_name: string;
    gtype: string;
    canonical_name: string;
    category: string;
    name: string;
    priority: number;
    collection: string;
}

export interface Extensions {
    gtype: string;
    canonical_name: string;
    category: string;
    name: string;
    priority: number;
    collection: string;
}

export interface AuthMutationOptions {
    username: string;
    password: string;
}

export interface ScenarioMutationOptions {
    [key: string]: any;
}

export interface DeleteMutationOptions {
    path: string;
}

export interface CustomApiMutationOptions {
    path: string;
    method: Method;
    data: any;
}

export interface OperationsApiMutationOptions {
    data: Operations;
}

export enum OperationsType {
    DEPLOY = "DEPLOY",
    SERVICE = "SERVICE",
    UPDATE_BOOTSTRAP = "UPDATE_BOOTSTRAP",
    UNDEPLOY = "UNDEPLOY",
    PROXY = "PROXY",
    CLIENT_LOGS = "CLIENT_LOGS",
    CLIENT_STATS = "CLIENT_STATS",
    NETWORK = "NETWORK",
    FRR = "FRR",
    FRR_LOGS = "FRR_LOGS",
}

export enum OperationsSubType {
    SUB_LOGS = "SUB_LOGS",
    SUB_RELOAD = "SUB_RELOAD",
    SUB_STATUS = "SUB_STATUS",
    SUB_START = "SUB_START",
    SUB_STOP = "SUB_STOP",
    SUB_RESTART = "SUB_RESTART",
    SUB_GET_IF_CONFIG = "SUB_GET_IF_CONFIG",
    SUB_SET_IF_CONFIG = "SUB_SET_IF_CONFIG",
    SUB_ADD_ROUTING_POLICY = "SUB_ADD_ROUTING_POLICY",
    SUB_REMOVE_ROUTING_POLICY = "SUB_REMOVE_ROUTING_POLICY",
    SUB_ADD_ROUTE = "SUB_ADD_ROUTE",
    SUB_REMOVE_ROUTE = "SUB_REMOVE_ROUTE",
    BGP_GET_CONFIG = 'BGP_GET_CONFIG',
    BGP_UPDATE_CONFIG = 'BGP_UPDATE_CONFIG',
    BGP_ADD_NEIGHBOR = 'BGP_ADD_NEIGHBOR',
    BGP_UPDATE_NEIGHBOR = 'BGP_UPDATE_NEIGHBOR',
    BGP_DELETE_NEIGHBOR = 'BGP_DELETE_NEIGHBOR',
    BGP_GET_NEIGHBOR = 'BGP_GET_NEIGHBOR',
    BGP_LIST_NEIGHBORS = 'BGP_LIST_NEIGHBORS',
    BGP_GET_SUMMARY = 'BGP_GET_SUMMARY',
    BGP_ENABLE = 'BGP_ENABLE',
    BGP_DISABLE = 'BGP_DISABLE',
    BGP_RESET = 'BGP_RESET',
    BGP_REMOVE_NEIGHBOR = 'BGP_REMOVE_NEIGHBOR',
    BGP_RESET_NEIGHBOR = 'BGP_RESET_NEIGHBOR',
    BGP_ADD_NETWORK = 'BGP_ADD_NETWORK',
    BGP_REMOVE_NETWORK = 'BGP_REMOVE_NETWORK',
    BGP_GET_NETWORKS = 'BGP_GET_NETWORKS',
    BGP_GET_ROUTES = 'BGP_GET_ROUTES',
    BGP_GET_ROUTE_TABLE = 'BGP_GET_ROUTE_TABLE',
    BGP_GET_STATISTICS = 'BGP_GET_STATISTICS',
    BGP_GET_HEALTH_STATUS = 'BGP_GET_HEALTH_STATUS',
    BGP_GET_STATE = 'BGP_GET_STATE',
    BGP_GET_STATUS = 'BGP_GET_STATUS',
    BGP_CHECK_NEIGHBOR_STATUS = 'BGP_CHECK_NEIGHBOR_STATUS',
    BGP_GET_NEIGHBOR_STATE = 'BGP_GET_NEIGHBOR_STATE',
    BGP_GET_NEIGHBOR_STATISTICS = 'BGP_GET_NEIGHBOR_STATISTICS',
    BGP_IS_NEIGHBOR_ESTABLISHED = 'BGP_IS_NEIGHBOR_ESTABLISHED',
    BGP_GET_NEIGHBOR_UPTIME = 'BGP_GET_NEIGHBOR_UPTIME',
    BGP_GET_NEIGHBOR_COUNT = 'BGP_GET_NEIGHBOR_COUNT',
    BGP_UPDATE_NETWORK = 'BGP_UPDATE_NETWORK',
    BGP_GET_NETWORK_COUNT = 'BGP_GET_NETWORK_COUNT',
    BGP_CLEAR_ROUTES = 'BGP_CLEAR_ROUTES',
    BGP_SHOW_ROUTES = 'BGP_SHOW_ROUTES',
    BGP_GET_ROUTES_RECEIVED_COUNT = 'BGP_GET_ROUTES_RECEIVED_COUNT',
    BGP_APPLY_ROUTE_MAP = 'BGP_APPLY_ROUTE_MAP',
    BGP_REMOVE_ROUTE_MAP = 'BGP_REMOVE_ROUTE_MAP',
    BGP_APPLY_COMMUNITY_LIST = 'BGP_APPLY_COMMUNITY_LIST',
    BGP_REMOVE_COMMUNITY_LIST = 'BGP_REMOVE_COMMUNITY_LIST',
    BGP_APPLY_PREFIX_LIST = 'BGP_APPLY_PREFIX_LIST',
    BGP_REMOVE_PREFIX_LIST = 'BGP_REMOVE_PREFIX_LIST',
    BGP_GET_POLICY_CONFIG = 'BGP_GET_POLICY_CONFIG',
    BGP_SET_POLICY_CONFIG = 'BGP_SET_POLICY_CONFIG',
    BGP_GET_PROTOCOL_STATUS = 'BGP_GET_PROTOCOL_STATUS',
    BGP_GET_REDISTRIBUTION_STATUS = 'BGP_GET_REDISTRIBUTION_STATUS',
    BGP_GET_PERFORMANCE_METRICS = 'BGP_GET_PERFORMANCE_METRICS',
    BGP_CLEAR_SESSION = 'BGP_CLEAR_SESSION',
    BGP_RESET_BGP_SESSION = 'BGP_RESET_BGP_SESSION',
    BGP_SOFT_RESET_BGP_SESSION = 'BGP_SOFT_RESET_BGP_SESSION',
    BGP_GET_CACHE_STATS = 'BGP_GET_CACHE_STATS',
    BGP_GET_CACHE_HIT_RATIO = 'BGP_GET_CACHE_HIT_RATIO',
    BGP_CLEAR_CACHE = 'BGP_CLEAR_CACHE',
    BGP_OPTIMIZE_CACHE = 'BGP_OPTIMIZE_CACHE',
    BGP_PERIODIC_CACHE_CLEANUP = 'BGP_PERIODIC_CACHE_CLEANUP',
    BGP_HANDLE_CACHE_STATS = 'BGP_HANDLE_CACHE_STATS',
    BGP_HANDLE_CACHE_CLEAR = 'BGP_HANDLE_CACHE_CLEAR',
    BGP_HANDLE_PERFORMANCE_METRICS = 'BGP_HANDLE_PERFORMANCE_METRICS',
    BGP_VALIDATE_CONFIG_CONSISTENCY = 'BGP_VALIDATE_CONFIG_CONSISTENCY',
    BGP_VALIDATE_NEIGHBOR_COMPATIBILITY = 'BGP_VALIDATE_NEIGHBOR_COMPATIBILITY',
    BGP_VALIDATE_AS_NUMBERS = 'BGP_VALIDATE_AS_NUMBERS',
    BGP_VALIDATE_ROUTE_MAP = 'BGP_VALIDATE_ROUTE_MAP',
    BGP_VALIDATE_COMMUNITY_LIST = 'BGP_VALIDATE_COMMUNITY_LIST',
    BGP_VALIDATE_PREFIX_LIST = 'BGP_VALIDATE_PREFIX_LIST',
    BGP_VALIDATE_IP_ADDRESSES = 'BGP_VALIDATE_IP_ADDRESSES',
    BGP_CHECK_RESERVED_AS = 'BGP_CHECK_RESERVED_AS',
    BGP_VALIDATE_STATE_DATA = 'BGP_VALIDATE_STATE_DATA',
    BGP_BEGIN_TRANSACTION = 'BGP_BEGIN_TRANSACTION',
    BGP_COMMIT_TRANSACTION = 'BGP_COMMIT_TRANSACTION',
    BGP_ROLLBACK_TRANSACTION = 'BGP_ROLLBACK_TRANSACTION',
    BGP_ADD_TRANSACTION_OPERATION = 'BGP_ADD_TRANSACTION_OPERATION',
    BGP_EXECUTE_TRANSACTION = 'BGP_EXECUTE_TRANSACTION',
    BGP_GET_TRANSACTION_STATUS = 'BGP_GET_TRANSACTION_STATUS',
    BGP_SET_COMMUNITY = 'BGP_SET_COMMUNITY',
    BGP_CLEAR_COMMUNITY = 'BGP_CLEAR_COMMUNITY'
}

export interface Operations {
    type: OperationsType,
    clients?: OperationsClient[],
    command?: OperationsCommand,
    sub_type?: OperationsSubType,
}

export interface OperationsClient {
    client_id?: string,
    downstream_address?: string,
}

export interface OperationsCommand {
    count?: number,
    name?: string,
    project?: string,
    method?: "GET" | "POST",
    path?: string,
    queries?: Record<string, string>,
    components?: string[],
    levels?: string[],
    search?: string,
    protocol?: string,
    bgp?: any,
    static?: any,
    interfaces?: any[],
    config?: {
        router_id?: string;
        autonomous_system?: number;
        keepalive_time?: number;
        hold_time?: number;
    };
    neighbor?: {
        peer_ip: string;
        remote_as: number;
        description?: string;
        next_hop_self?: boolean;
        password?: string;
        keepalive_time?: number;
        hold_time?: number;
    };
    peer_ip?: string;
    as_number?: number;
}

export interface UserDetail {
    email: any;
    user_id: any;
    username: any;
    groups: any;
    projects: any;
    base_project: any;
    base_group: any;
    exp: any;
    role: any;
}

/* eslint-disable no-unused-vars */
export interface MessageFns<T, V extends string> {
    readonly $type: V;
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
}

export interface MetricsApiMutationOptions {
    name: string;
    metric: string;
    start: number;
    end: number;
    step?: number;
    metricConfig?: {
        queryTemplate?: string;
        windowSecs?: {
            default: number;
            ranges: {
                threshold: number;
                value: number;
            }[];
        };
    };
}

export interface Identity {
    client_id: string;
    session_token: string;
    client_name: string;
}

export interface BaseResponse {
    identity: Identity;
    command_id: string;
    success: boolean;
    error?: string;
}