import React, { useState } from "react";
import { Col, Drawer, Row } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import VirtualHostComponent from "../vhds/VirtualHosts";
import { GTypeFieldsBase } from "@/common/statics/gtypes";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import ElchiButton from "../../common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        reduxAction: any;
        selectedTags: string[];
        keyPrefix: string;
        GType: GTypeFieldsBase;
    }
};

const VirtualHosts: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<boolean>(false);

    const handleChange = (value: string) => {
        dispatch(ResourceAction({
            version: veri.version,
            type: ActionType.Update,
            keys: ["0"],
            val: { main_resource: value },
            resourceType: ResourceType.ConfigDiscovery
        }));
    };

    return (
        <>
            <ECard title={"Virtual Hosts"}>
                <Row>
                    <Col md={24}>
                        <EForm>
                            <FieldComponent veri={{
                                required: true,
                                selectedTags: veri.selectedTags,
                                keyPrefix: `${veri.keyPrefix}`,
                                handleChange: handleChange,
                                tag: `virtual_hosts`,
                                value: veri.reduxStore,
                                type: FieldTypes.ArrayIcon,
                                spanNum: 12,
                                condition: veri.reduxStore?.[0],
                                drawerShow: () => {
                                    setState(true);
                                }
                            }} />
                        </EForm>
                    </Col>
                </Row>
            </ECard>
            <Drawer
                key={`draver_${veri.keyPrefix}`}
                title={`HTTP Route Components`}
                placement="right"
                closable={false}
                open={state}
                onClose={() => setState(false)}
                size='large'
                width={1400}
                zIndex={900}
            >
                <VirtualHostComponent veri={{
                    version: veri.version,
                    keyPrefix: veri.keyPrefix,
                    queryResource: null,
                    generalName: "",
                    changeGeneralName: null,
                    reduxStore: veri.reduxStore,
                    isMainComponent: false,
                    GType: veri.GType,
                }} />
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => setState(false)}>Close</ElchiButton>
            </Drawer>
        </>
    )
};

export default memorizeComponent(VirtualHosts, compareVeri);


