import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType, OperationsSubType } from '@/common/types';

// Proto-based type definitions
export interface NetplanConfig {
    yaml_content: string;
    test_mode?: boolean;
    test_timeout_seconds?: number;
    preserve_controller_connection?: boolean;
}

export interface InterfaceState {
    name: string;
    addresses: string[];
    state: string; // "up" or "down"
    has_carrier: boolean;
    mac_address?: string;
    mtu: number;
}

export interface RoutingTableDefinition {
    id: number; // Table ID (1-252, 253-255 are reserved)
    name: string; // Table name
}

export interface NetworkState {
    interfaces: InterfaceState[];
    routes: Route[];
    policies: RoutingPolicy[];
    routing_tables: RoutingTableDefinition[];
    current_netplan_yaml?: string;
}

export interface Route {
    to: string;
    via?: string;
    interface?: string;
    table?: number;
    metric?: number;
    source?: string;
    scope?: string;
    is_default?: boolean;
}

export interface RoutingPolicy {
    from?: string;
    to?: string;
    table: number;
    priority: number;
    interface?: string; // Updated to match new proto structure
}

export interface RouteOperation {
    action: 'ADD' | 'DELETE' | 'REPLACE';
    route: Route;
}

export interface PolicyOperation {
    action: 'ADD' | 'DELETE' | 'REPLACE';
    policy: RoutingPolicy;
}

export interface TableOperation {
    action: 'ADD' | 'DELETE' | 'REPLACE';
    table: RoutingTableDefinition;
}

export interface NetworkResponse {
    success: boolean;
    message?: string;
    error?: string;
    safely_applied?: boolean;
    connection_preserved?: boolean;
    backup_created?: boolean;
    test_mode_applied?: boolean;
    rollback_triggered?: boolean;
    rollback_reason?: string;
    connection_lost?: boolean;
    test_failed?: boolean;
    operation_type?: string;
    safety_info?: {
        test_mode: boolean;
        preserve_controller_connection: boolean;
        test_timeout_seconds: number;
    };
    network_state?: NetworkState;
}

export const useNetworkOperations = () => {
    const mutate = useOperationsApiMutation();

    const handleNetworkResponse = (response: any[]): NetworkResponse => {
        if (Array.isArray(response) && response.length > 0) {
            const firstResponse = response[0] as NetworkResponse;
            
            // Check for errors first
            if (firstResponse.error && firstResponse.error.trim() !== '') {
                throw new Error(firstResponse.error);
            }
            
            return firstResponse;
        }
        throw new Error('Invalid response format');
    };

    const applyNetplanConfig = async (clientId: string, netplanConfig: NetplanConfig): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_NETPLAN_APPLY,
            clients: [{ client_id: clientId }],
            netplan_config: {
                ...netplanConfig,
                test_mode: netplanConfig.test_mode ?? true, // Always default to safe mode
                preserve_controller_connection: netplanConfig.preserve_controller_connection ?? true,
                test_timeout_seconds: netplanConfig.test_timeout_seconds ?? 10
            }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const manageRoutes = async (clientId: string, operations: RouteOperation[]): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_ROUTE_MANAGE,
            clients: [{ client_id: clientId }],
            route_operations: operations
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const managePolicies = async (clientId: string, operations: PolicyOperation[]): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_POLICY_MANAGE,
            clients: [{ client_id: clientId }],
            policy_operations: operations
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const getNetworkState = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_GET_NETWORK_STATE,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const getNetplanConfig = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_NETPLAN_GET,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const rollbackNetplan = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_NETPLAN_ROLLBACK,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const listRoutes = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_ROUTE_LIST,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const listPolicies = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_POLICY_LIST,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const manageTables = async (clientId: string, operations: TableOperation[]): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_TABLE_MANAGE,
            clients: [{ client_id: clientId }],
            table_operations: operations
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };

    const listTables = async (clientId: string): Promise<NetworkResponse> => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_TABLE_LIST,
            clients: [{ client_id: clientId }]
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return handleNetworkResponse(response);
    };


    // Temporary legacy method for EditInterfaceCard compatibility
    const setInterfaceConfig = async (clientId: string, interfaces: any[]): Promise<NetworkResponse> => {
        console.warn('setInterfaceConfig is deprecated and temporarily available for EditInterfaceCard. Please use applyNetplanConfig instead.');
        // Convert to basic netplan YAML for single interface
        const iface = interfaces[0];
        if (!iface) throw new Error('No interface data provided');
        
        const yaml = `
network:
  version: 2
  ethernets:
    ${iface.ifname}:
      dhcp4: ${iface.interface?.dhcp4 || false}${iface.interface?.addresses ? `
      addresses:
        - "${iface.interface.addresses[0]}"` : ''}${iface.interface?.mtu ? `
      mtu: ${iface.interface.mtu}` : ''}
`;
        
        return applyNetplanConfig(clientId, {
            yaml_content: yaml.trim(),
            test_mode: true,
            preserve_controller_connection: true,
            test_timeout_seconds: 10
        });
    };

    return {
        applyNetplanConfig,
        getNetplanConfig,
        rollbackNetplan,
        manageRoutes,
        listRoutes,
        managePolicies,
        listPolicies,
        getNetworkState,
        manageTables,
        listTables,
        // Temporary legacy method
        setInterfaceConfig
    };
}; 