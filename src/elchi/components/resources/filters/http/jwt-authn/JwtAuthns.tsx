import React from "react";
import ComponentHttpJwtAuthn from './JwtAuthn';
import ComponentJwtAuthnPerRoute from './JwtAuthnPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentJwtAuthns: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication': ComponentHttpJwtAuthn,
        'envoy.extensions.filters.http.jwt_authn.v3.PerRouteConfig': ComponentJwtAuthnPerRoute,
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

export default React.memo(ComponentJwtAuthns);
