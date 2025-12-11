import React from "react";
import ComponentHttpDynamicForwardProxy from './DynamicForwardProxy';
import ComponentDynamicForwardProxyPerRoute from './DynamicForwardProxyPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentDynamicForwardProxies: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.dynamic_forward_proxy.v3.FilterConfig': ComponentHttpDynamicForwardProxy,
        'envoy.extensions.filters.http.dynamic_forward_proxy.v3.PerRouteConfig': ComponentDynamicForwardProxyPerRoute,
    };

    const SelectedComponent = componentMap[veri.gtype];

    return (
        <SelectedComponent veri={{
            version: veri.version,
            gtype: veri.gtype,
            queryResource: veri.queryResource,
            generalName: veri.generalName,
            changeGeneralName: veri.changeGeneralName
        }} />
    )
}

export default React.memo(ComponentDynamicForwardProxies);
