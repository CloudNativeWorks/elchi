import React from "react";
import FileAccessLogComponent from '@/elchi/components/resources/extension/access-log/FileAccessLog';
import FluentdAccessLogConfigComponent from '@/elchi/components/resources/extension/access-log/FluentdAccessLogConfig';
import HttpGrpcAccessLogConfigComponent from '@/elchi/components/resources/extension/access-log/HttpGrpcAccessLogConfig';
import TcpGrpcAccessLogConfigComponent from '@/elchi/components/resources/extension/access-log/TcpGrpcAccessLogConfig';
import StdoutAccessLogComponent from '@/elchi/components/resources/extension/access-log/StdoutAccessLog';
import StderrAccessLogComponent from '@/elchi/components/resources/extension/access-log/StderrAccessLog';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentAccessLog: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.access_loggers.file.v3.FileAccessLog': FileAccessLogComponent,
        'envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig': FluentdAccessLogConfigComponent,
        'envoy.extensions.access_loggers.grpc.v3.HttpGrpcAccessLogConfig': HttpGrpcAccessLogConfigComponent,
        'envoy.extensions.access_loggers.grpc.v3.TcpGrpcAccessLogConfig': TcpGrpcAccessLogConfigComponent,
        'envoy.extensions.access_loggers.stream.v3.StdoutAccessLog': StdoutAccessLogComponent,
        'envoy.extensions.access_loggers.stream.v3.StderrAccessLog': StderrAccessLogComponent,
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

export default React.memo(ComponentAccessLog);