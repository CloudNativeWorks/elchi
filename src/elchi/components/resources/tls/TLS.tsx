import React from "react";
import UpstreamTLSContextComponent from './UpstreamTlsContext';
import DownstreamTLSContextComponent from './DownstreamTlsContext';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const SecretComponent: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext': DownstreamTLSContextComponent,
        'envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext': UpstreamTLSContextComponent,
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

export default React.memo(SecretComponent);