import React from "react";
import ComponentAllowListedRoutes from './AllowListedRoutes';
import ComponentPreviousRoutes from './PreviousRoutes';
import ComponentSafeCrossScheme from './SafeCrossScheme';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentInternalRedirectPredicates: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.internal_redirect.allow_listed_routes.v3.AllowListedRoutesConfig': ComponentAllowListedRoutes,
        'envoy.extensions.internal_redirect.previous_routes.v3.PreviousRoutesConfig': ComponentPreviousRoutes,
        'envoy.extensions.internal_redirect.safe_cross_scheme.v3.SafeCrossSchemeConfig': ComponentSafeCrossScheme,
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

export default React.memo(ComponentInternalRedirectPredicates);
