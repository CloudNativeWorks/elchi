import React from "react";
import ComponentHttpBasicAuth from './BasicAuth';
import ComponentHttpBasicAuthPerRoute from './BasicAuthPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentBasicAuths: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.basic_auth.v3.BasicAuth': ComponentHttpBasicAuth,
        'envoy.extensions.filters.http.basic_auth.v3.BasicAuthPerRoute': ComponentHttpBasicAuthPerRoute,
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

export default React.memo(ComponentBasicAuths);
