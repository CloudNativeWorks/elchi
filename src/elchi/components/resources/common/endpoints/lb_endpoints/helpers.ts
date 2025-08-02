const CaseProperties = {
    host_identifier: { prop: "host_identifier", case: "endpoint" },
    endpoint: { prop: "endpoint", case: "address" },
    address: { prop: "address", case: "socket_address" },
    socket_address: { prop: "socket_address", case: "port_specifier" },
    port_value: { prop: "port_specifier", case: "port_value" }
}
export const extractCase = <T>(item: any, caseType: keyof typeof CaseProperties): T | undefined => {
    const detail = CaseProperties[caseType];
    return item && item[detail.prop]?.$case === detail.case ? item[detail.prop][detail.case] : undefined;
};

export const checkIfExists = (lbendpoints: any[] | undefined, address: string, port_value: number) => {
    return lbendpoints?.some((item: any) => {
        const endpoint = extractCase<any>(item, "endpoint");
        const socketAddress = endpoint ? extractCase<any>(endpoint.address, "socket_address") : undefined;
        const port = socketAddress ? extractCase<number>(socketAddress, "port_value") : undefined;

        return socketAddress?.address === address && port === port_value;
    });
};

export const makeInitialEndpoints = (values: any) => {
    return {
        endpoint: {
            address: {
                socket_address: {
                    address: values.address,
                    port_value: values.port_value,
                    protocol: values.protocol
                }
            }
        }
    }
};
