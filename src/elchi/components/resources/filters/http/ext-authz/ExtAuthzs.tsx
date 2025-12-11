import React from "react";
import ComponentHttpExtAuthz from './ExtAuthz';
import ComponentExtAuthzPerRoute from './ExtAuthzPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentExtAuthzs: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.ext_authz.v3.ExtAuthz': ComponentHttpExtAuthz,
        'envoy.extensions.filters.http.ext_authz.v3.ExtAuthzPerRoute': ComponentExtAuthzPerRoute,
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

export default React.memo(ComponentExtAuthzs);
