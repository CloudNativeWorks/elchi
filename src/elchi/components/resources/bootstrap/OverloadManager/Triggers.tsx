import React from "react";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import TabComponent from "../../../common/TabComponent";
import ComponentTrigger from './Trigger';


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

const ComponentTriggers: React.FC<GeneralProps> = ({ veri }) => {
    return (
        <TabComponent veri={{
            version: veri.version,
            title: veri.title,
            reduxStore: veri.reduxStore,
            keyPrefix: `${veri.keyPrefix}`,
            label: 'Trigger',
            component: ComponentTrigger,
            veri: {
                version: veri.version,
                reduxStore: veri.reduxStore,
                reduxAction: ResourceAction,
                keyPrefix: veri.keyPrefix,
                tagMatchPrefix: veri.tagMatchPrefix,
            }
        }} />
    )
};

export default memorizeComponent(ComponentTriggers, compareVeri);
