import React from "react";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { ResourceAction } from "@/redux/reducers/slice";
import TabComponent from "@/elchi/components/common/TabComponent";
import ComponentLoadShedPoint from "./LoadShedPoint";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        id?: string;
        title: string;
    }
};

const ComponentLoadShedPoints: React.FC<GeneralProps> = ({ veri }) => {
    return (

        <EForm>
            <TabComponent veri={{
                version: veri.version,
                title: 'LoadShed Points',
                reduxStore: veri.reduxStore,
                keyPrefix: `${veri.keyPrefix}`,
                label: 'LoadShed Point',
                component: ComponentLoadShedPoint,
                veri: {
                    version: veri.version,
                    reduxStore: veri.reduxStore,
                    reduxAction: ResourceAction,
                    keyPrefix: veri.keyPrefix,
                    tagMatchPrefix: veri.tagMatchPrefix,
                }
            }} />
        </EForm>

    )
};

export default memorizeComponent(ComponentLoadShedPoints, compareVeri);
