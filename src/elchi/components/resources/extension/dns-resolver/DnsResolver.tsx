import React from "react";
import ComponentAppleDnsResolver from './AppleDnsResolver';
import ComponentCaresDnsResolver from './CaresDnsResolver';
import ComponentGetAddrInfoDnsResolver from './GetAddrInfoDnsResolver';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentDnsResolver: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.network.dns_resolver.apple.v3.AppleDnsResolverConfig': ComponentAppleDnsResolver,
        'envoy.extensions.network.dns_resolver.cares.v3.CaresDnsResolverConfig': ComponentCaresDnsResolver,
        'envoy.extensions.network.dns_resolver.getaddrinfo.v3.GetAddrInfoDnsResolverConfig': ComponentGetAddrInfoDnsResolver,
    };

    const SelectedComponent = componentMap[veri.gtype];

    if (!SelectedComponent) {
        return <div>Unknown DNS Resolver type: {veri.gtype}</div>;
    }

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

export default React.memo(ComponentDnsResolver);
