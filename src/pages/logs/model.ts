export interface OperationsResponse<ResultType = Record<string, any>> {
    identity: {
        client_id: string;
        session_token: string;
        client_name?: string;
    };
    command_id: string;
    success: boolean;
    Result: ResultType;
}

export interface ServiceLogsApiResult {
    Service: {
        name: string;
        logs: ServiceLogItem[];
    }
}

export interface ServiceLogItem {
    message: string;
    level: string;
    component?: string;
    timestamp: string;
    client_name?: string;
}