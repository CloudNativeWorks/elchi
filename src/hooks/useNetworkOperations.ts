import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType, OperationsSubType } from '@/common/types';

export const useNetworkOperations = () => {
    const mutate = useOperationsApiMutation();

    const checkResponseForErrors = (response: any[]) => {
        if (Array.isArray(response) && response.length > 0) {
            const firstResponse = response[0];
            if (firstResponse.error && firstResponse.error.trim() !== '') {
                throw new Error(firstResponse.error);
            }
        }
        return response;
    };

    const addRoutingPolicy = async (clientId: string, interfaces: any[]) => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_ADD_ROUTING_POLICY,
            clients: [{ client_id: clientId }],
            command: { interfaces }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return checkResponseForErrors(response);
    };

    const removeRoutingPolicy = async (clientId: string, interfaces: any[]) => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_REMOVE_ROUTING_POLICY,
            clients: [{ client_id: clientId }],
            command: { interfaces }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return checkResponseForErrors(response);
    };

    const setInterfaceConfig = async (clientId: string, interfaces: any[]) => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_SET_IF_CONFIG,
            clients: [{ client_id: clientId }],
            command: { interfaces }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return checkResponseForErrors(response);
    };

    const addRoute = async (clientId: string, interfaces: any[]) => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_ADD_ROUTE,
            clients: [{ client_id: clientId }],
            command: { interfaces }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return checkResponseForErrors(response);
    };

    const removeRoute = async (clientId: string, interfaces: any[]) => {
        const requestData = {
            type: OperationsType.NETWORK,
            sub_type: OperationsSubType.SUB_REMOVE_ROUTE,
            clients: [{ client_id: clientId }],
            command: { interfaces }
        };
        const response = await mutate.mutateAsync({ data: requestData });
        return checkResponseForErrors(response);
    };

    return { addRoutingPolicy, removeRoutingPolicy, setInterfaceConfig, addRoute, removeRoute };
}; 