import React from "react";
import ComponentHttpRBAC from './RBAC';
import ComponentRBACPerRoute from './RbacPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentRbacs: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.rbac.v3.RBAC': ComponentHttpRBAC,
        'envoy.extensions.filters.http.rbac.v3.RBACPerRoute': ComponentRBACPerRoute,
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

export default React.memo(ComponentRbacs);
