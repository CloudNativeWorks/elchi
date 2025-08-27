import React from "react";
import ClusterNonEDS from "./scenarios/ClusterNonEDS";
import BasicHCM from "./scenarios/BasicHCM";
import SingleListenerHTTP from "./scenarios/SingleListenerHTTP";
import ClusterEDS from "./scenarios/ClusterEDS";
import Endpoint from "./scenarios/Endpoint";
import RouteWithVirtualHost from "./scenarios/RouteWithVirtualHost";
import RDSHcm from "./scenarios/RDSHCM";
import VirtualHost from "./scenarios/VirtualHost";
import RouteWithVHDS from "./scenarios/RouteWithVHDS";
import SingleListenerTCP from "./scenarios/SingleListenerTCP";
import TcpProxy from "./scenarios/TcpProxy";


const ComponentMap: Record<
    string,
    React.FC<{
        reduxStore: any;
        handleChangeRedux: any;
        handleDeleteRedux: any;
        registerForm: any;
        unregisterForm: any;
    }>
> = {
    non_eds_cluster: ClusterNonEDS,
    basic_hcm: BasicHCM,
    single_listener_http: SingleListenerHTTP,
    eds_cluster: ClusterEDS,
    endpoint: Endpoint,
    route_with_direct_virtualhost: RouteWithVirtualHost,
    rds_hcm: RDSHcm,
    virtual_host: VirtualHost,
    route_with_vhds: RouteWithVHDS,
    single_listener_tcp: SingleListenerTCP,
    tcp_proxy: TcpProxy,
};

export default ComponentMap;
