import React from "react";
import ComponentFixedHeap from './FixedHeap';
import ComponentCgroupMemory from './CgroupMemory';
import ComponentCpuUtilization from './CpuUtilization';
import ComponentDownstreamConnections from './DownstreamConnections';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentResourceMonitor: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.resource_monitors.fixed_heap.v3.FixedHeapConfig': ComponentFixedHeap,
        'envoy.extensions.resource_monitors.cgroup_memory.v3.CgroupMemoryConfig': ComponentCgroupMemory,
        'envoy.extensions.resource_monitors.cpu_utilization.v3.CpuUtilizationConfig': ComponentCpuUtilization,
        'envoy.extensions.resource_monitors.downstream_connections.v3.DownstreamConnectionsConfig': ComponentDownstreamConnections,
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

export default React.memo(ComponentResourceMonitor);
