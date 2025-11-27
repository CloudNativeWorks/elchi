import React from "react";
import ComponentHttpExternalProcessor from './ExternalProcessor';
import ComponentExtProcPerRoute from './ExtProcPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentExtProcs: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor': ComponentHttpExternalProcessor,
        'envoy.extensions.filters.http.ext_proc.v3.ExtProcPerRoute': ComponentExtProcPerRoute,
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

export default React.memo(ComponentExtProcs);
