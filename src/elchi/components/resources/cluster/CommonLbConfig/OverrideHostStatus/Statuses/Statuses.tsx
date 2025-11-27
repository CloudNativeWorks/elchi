import React from "react";
import { Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { healthStatusEnumValues } from "./_modtag_";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "../../../../../common/e-components/EForm";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentStatuses: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { state, onChangeTabs } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    const handleChangeRedux = (keys: string, val: any) => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys,
            val,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    const addTab = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove'
    ) => {
        if (action === 'add') {
            handleChangeResources({
                version: veri.version,
                type: ActionType.Append,
                keys: veri.keyPrefix,
                val: "UNKNOWN",
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
            const objLength = (veri.reduxStore?.length) ?? 0;
            onChangeTabs((objLength).toString());
        } else if (action === 'remove' && targetKey !== undefined) {
            const targetIndex = parseInt(targetKey as string, 10);
            const newActiveKey = (targetIndex - 1) < 0 ? "0" : (targetIndex - 1).toString();
            onChangeTabs(newActiveKey);
            handleChangeResources({
                version: veri.version,
                type: ActionType.Delete,
                keys: `${veri.keyPrefix}.${targetIndex}`,
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
        }
    };

    return (
        <ECard title="Statuses" id={veri.id}>
            <Tabs
                type="editable-card"
                onChange={onChangeTabs}
                activeKey={state.activeTab}
                onEdit={addTab}
                items={veri.reduxStore?.map((data: string, index: number) => ({
                    key: index.toString(),
                    label: `Status ${index}`,
                    forceRender: true,
                    children: (
                        <EForm key={index}>
                            <FieldComponent
                                veri={{
                                    selectedTags: [],
                                    handleChange: handleChangeRedux,
                                    tag: "",
                                    value: data || "",
                                    type: FieldTypes.Select,
                                    placeholder: "(HealthStatus)",
                                    values: healthStatusEnumValues,
                                    tagPrefix: "",
                                    keyPrefix: `${veri.keyPrefix}.${index}`,
                                    spanNum: 24,
                                    required: false,
                                    disabled: false,
                                    additionalTags: [],
                                    range: undefined,
                                    condition: undefined,
                                    drawerShow: () => {},
                                    alwaysShow: true,
                                    hidden: false,
                                }}
                            />
                        </EForm>
                    ),
                    closable: (veri.reduxStore?.length || 0) > 1,
                }))}
            />
        </ECard>
    );
};

export default ComponentStatuses;
