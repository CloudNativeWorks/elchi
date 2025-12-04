import React from "react";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import ECard from "../../../common/ECard";
import { ResourceAction } from "@/redux/reducers/slice";
import TabComponent from "../../../common/TabComponent";
import ComponentOverloadAction from './OverloadAction';
import { EForm } from "../../../common/e-components/EForm";


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

const ComponentOverloadActions: React.FC<GeneralProps> = ({ veri }) => {
    return (

        <EForm>
            <TabComponent veri={{
                version: veri.version,
                title: 'Overload Actions',
                reduxStore: veri.reduxStore,
                keyPrefix: `${veri.keyPrefix}`,
                label: 'Action',
                component: ComponentOverloadAction,
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

export default memorizeComponent(ComponentOverloadActions, compareVeri);
