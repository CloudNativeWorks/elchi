import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@redux/store";
import VirtualHostComponent from "./VirtualHosts";
import { useGTypeFields } from "@/hooks/useGtypes";
import { GTypes } from "@/common/statics/gtypes";
import { modtag_virtual_host } from "./_modtag_";
import { useModels } from "@/hooks/useModels";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const VhdsComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.VirtualHost);
    const { vModels } = useModels(veri.version, modtag_virtual_host);
    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version]?.Resource, shallowEqual);
    const reduxStore = useMemo(() => {
        return memoReduxStore?.map((item: any) => vModels.vh?.VirtualHost.fromJSON(item));
    }, [memoReduxStore, vModels]);

    return (
        reduxStore && (
            <VirtualHostComponent veri={{
                version: veri.version,
                keyPrefix: '',
                queryResource: veri.queryResource,
                generalName: veri.generalName,
                changeGeneralName: veri.changeGeneralName,
                reduxStore: reduxStore,
                isMainComponent: true,
                GType: GType,
            }} />
        )
    );
}

export default VhdsComponent;