import React from "react";
import ComponentCustomHeader from './CustomHeader';
import ComponentXff from './Xff';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentOriginalIPDetection: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.http.original_ip_detection.custom_header.v3.CustomHeaderConfig': ComponentCustomHeader,
        'envoy.extensions.http.original_ip_detection.xff.v3.XffConfig': ComponentXff,
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

export default React.memo(ComponentOriginalIPDetection);
