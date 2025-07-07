import React from 'react';
import TlsCertificateComponent from './TlsCertificate';
import ValidationContextComponent from './ValidationContext';
import ComponentGenericSecret from './GenericSecret';
import ComponentTlsSessionTicketKeys from './TlsSessionTicketKeys';


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
        'envoy.extensions.transport_sockets.tls.v3.TlsCertificate': TlsCertificateComponent,
        'envoy.extensions.transport_sockets.tls.v3.CertificateValidationContext': ValidationContextComponent,
        'envoy.extensions.transport_sockets.tls.v3.GenericSecret': ComponentGenericSecret,
        'envoy.extensions.transport_sockets.tls.v3.TlsSessionTicketKeys': ComponentTlsSessionTicketKeys,
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