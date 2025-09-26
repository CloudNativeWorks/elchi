import React from "react";
import ComponenStatefulSessionCookie from './StatefulSessionCookie';
import ComponenStatefulSessionHeader from './StatefulSessionHeader';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentCompressorLibrary: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.http.stateful_session.cookie.v3.CookieBasedSessionState': ComponenStatefulSessionCookie,
        'envoy.extensions.http.stateful_session.header.v3.HeaderBasedSessionState': ComponenStatefulSessionHeader,
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

export default React.memo(ComponentCompressorLibrary);
