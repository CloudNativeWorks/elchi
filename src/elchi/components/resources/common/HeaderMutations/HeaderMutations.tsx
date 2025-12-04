import React, { useEffect, useState } from "react";
import { Col, Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ByteToObj } from "@/utils/typed-config-op";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import CommonComponentHeaderMutationRules from "../HeaderMutationRules/HeaderMutationRules";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        reduxAction: any;
        id?: string;
        title: string;
    }
};

const CommonComponentHeaderMutations: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>()
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore))
        }
    }, [veri.reduxStore]);

    return (
        <ECard title={veri.title} id={veri.id}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={rState?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: `Mutation ${index}`,
                        forceRender: true,
                        children: (
                            <Col md={24}>
                                <CommonComponentHeaderMutationRules
                                    veri={{
                                        version: veri.version,
                                        reduxStore: data,
                                        keyPrefix: `${veri.keyPrefix}.${index}`,
                                        reduxAction: veri.reduxAction,
                                        title: ""
                                    }}
                                />
                            </Col>
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};

export default memorizeComponent(CommonComponentHeaderMutations, compareVeri);
