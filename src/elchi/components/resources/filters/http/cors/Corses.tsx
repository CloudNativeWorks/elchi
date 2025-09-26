import React from "react";
import ComponentCors from './Cors';
import ComponentCorsPolicy from './CorsPolicy';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentCorses: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.cors.v3.Cors': ComponentCors,
        'envoy.extensions.filters.http.cors.v3.CorsPolicy': ComponentCorsPolicy,
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

export default React.memo(ComponentCorses);
