import React from "react";
import OpenTelemetryComponent from '@/elchi/components/resources/extension/stat-sinks/OpenTelemetry';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentStatSinks: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.stat_sinks.open_telemetry.v3.SinkConfig': OpenTelemetryComponent,
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

export default React.memo(ComponentStatSinks);