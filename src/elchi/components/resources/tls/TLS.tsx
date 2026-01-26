import React from "react";
import UpstreamTLSContextComponent from './UpstreamTlsContext';
import DownstreamTLSContextComponent from './DownstreamTlsContext';
import QuicDownstreamTransportComponent from './QuicDownstreamTransport';
import QuicUpstreamTransportComponent from './QuicUpstreamTransport';
import ProxyProtocolUpstreamTransportComponent from './ProxyProtocolUpstreamTransport';
import RawBufferTransportComponent from './RawBufferTransport';


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
        'envoy.extensions.transport_sockets.quic.v3.QuicDownstreamTransport': QuicDownstreamTransportComponent,
        'envoy.extensions.transport_sockets.quic.v3.QuicUpstreamTransport': QuicUpstreamTransportComponent,
        'envoy.extensions.transport_sockets.proxy_protocol.v3.ProxyProtocolUpstreamTransport': ProxyProtocolUpstreamTransportComponent,
        'envoy.extensions.transport_sockets.raw_buffer.v3.RawBuffer': RawBufferTransportComponent,
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