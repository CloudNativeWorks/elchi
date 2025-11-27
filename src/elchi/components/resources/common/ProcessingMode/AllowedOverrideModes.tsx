import React from "react";
import { Tabs } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import ECard from "@/elchi/components/common/ECard";
import useTabManager from "@/hooks/useTabManager";
import CommonComponentProcessingMode from "./ProcessingMode";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        title?: string;
    }
};


const CommonComponentAllowedOverrideModes: React.FC<GeneralProps> = ({ veri }) => {
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    return (
        <ECard title={veri.title || "Allowed Override Modes"}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                items={Array.isArray(veri.reduxStore) ? veri.reduxStore?.map((data: any, index: number) => ({
                    key: index.toString(),
                    label: `Mode ${index}`,
                    forceRender: true,
                    children: (
                        <CommonComponentProcessingMode
                            veri={{
                                version: veri.version,
                                reduxStore: data,
                                reduxAction: veri.reduxAction,
                                keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`,
                                title: `Processing Mode ${index}`
                            }}
                        />
                    )
                })) : []}
            />
        </ECard>
    );
};

export default memorizeComponent(CommonComponentAllowedOverrideModes, compareVeriReduxStoreAndSelectedTags);
