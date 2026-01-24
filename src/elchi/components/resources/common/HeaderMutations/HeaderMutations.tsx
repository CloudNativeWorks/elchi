import React, { useEffect, useState } from "react";
import { Col, Tabs } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ByteToObj } from "@/utils/typed-config-op";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import CommonComponentHeaderMutation from "./HeaderMutation";


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
                                <CommonComponentHeaderMutation
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
