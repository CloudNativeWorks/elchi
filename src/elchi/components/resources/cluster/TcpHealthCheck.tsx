import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentPayloadSlice from "../common/Payload/WithArray";
import CommonComponentPayload from "../common/Payload/Payload";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_tcp_health_check, modtag_us_cluster } from "./_modtag_";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import ElchiButton from "../../common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentTCPHealthCheck: React.FC<GeneralProps> = ({ veri }) => {
    const [showReceive, setShowReceive] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_tcp_health_check);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "receive", type: FieldTypes.ArrayIcon, fieldPath: 'receive', spanNum: 8, drawerShow: () => { setShowReceive(true); }, },
    ]

    const SetEmptyObj = () => {
        handleChangeRedux(veri.keyPrefix, {});
    }

    return (
        <ECard title="TCP Health Check">
            {!veri.reduxStore &&
                <>
                    <ElchiButton onlyText onClick={SetEmptyObj}>Set Empty Object</ElchiButton>
                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                </>
            }
            <HorizonTags veri={{
                tags: vTags.ht?.HealthCheck_TcpHealthCheck,
                unsupportedTags: modtag_us_cluster["TCPHealthCheck"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: ``,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />

            
                <Col md={24}>
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                    </EForm>
                </Col>
                <ConditionalComponent
                    shouldRender={startsWithAny("send", selectedTags)}
                    Component={CommonComponentPayload}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.send`,
                        reduxStore: veri.reduxStore?.send,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.send`,
                        title: "Send",
                        id: `send_0`
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("receive", selectedTags)}
                    Component={CommonComponentPayloadSlice}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.receive`,
                        drawerOpen: showReceive,
                        reduxStore: veri.reduxStore?.receive,
                        reduxAction: ResourceAction,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.receive`,
                        drawerClose: () => { setShowReceive(false); },
                        title: "Receive",
                        id: `receive_0`
                    }}
                />
        </ECard>
    )
};


export default memorizeComponent(ComponentTCPHealthCheck, compareVeri);