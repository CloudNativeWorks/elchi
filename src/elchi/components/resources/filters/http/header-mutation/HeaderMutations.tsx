import React from "react";
import ComponentHeaderMutation from './HeaderMutation';
import ComponentHeaderMutationPerRoute from './HeaderMutationPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentHeaderMutations: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.header_mutation.v3.HeaderMutation': ComponentHeaderMutation,
        'envoy.extensions.filters.http.header_mutation.v3.HeaderMutationPerRoute': ComponentHeaderMutationPerRoute,
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

export default React.memo(ComponentHeaderMutations);
