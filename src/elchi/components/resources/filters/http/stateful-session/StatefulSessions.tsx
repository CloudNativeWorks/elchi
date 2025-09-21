import React from "react";
import ComponentStatefulSession from './StatefulSession';
import ComponentStatefulSessionPerRoute from './StatefulSessionPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentStatefulSessions: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.stateful_session.v3.StatefulSession': ComponentStatefulSession,
        'envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute': ComponentStatefulSessionPerRoute,
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

export default React.memo(ComponentStatefulSessions);
