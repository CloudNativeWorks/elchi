import React from "react";
import { Tabs } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import useTabManager from "@/hooks/useTabManager";
import ECard from "./ECard";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        title: string;
        label: string;
        component: React.ComponentType<any>;
        veri: any;
        isCluster?: boolean;
    }
};

const TabComponent: React.FC<GeneralProps> = ({ veri }) => {
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    return (
        <ECard title={veri.title}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "100%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    const DynamicComponent = veri.component;
                    return {
                        key: index.toString(),
                        label: `${veri.label}: ${index.toString()}`,
                        forceRender: true,
                        children: (
                            <DynamicComponent veri={{
                                ...veri.veri,
                                reduxStore: veri.isCluster ? data?.name : data,
                                keyPrefix: `${veri.keyPrefix}.${index}`
                            }}
                            />
                        ),
                    };
                })}
            />
        </ECard>
    )
};

export default memorizeComponent(TabComponent, compareVeri);
