import React from "react";
import { Col, Row } from 'antd';
import { useDispatch } from "react-redux";
import { FieldComponent } from "@/elchi/components/common/FormItems"
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { matchesEndOrStartOf } from "@/utils/tools";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import HeaderToAdd from "./HeaderToAdd/HeaderToAdd";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        selectedTags: string[];
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        toJSON: any;
    }
};


const CommonComponentHeaderOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    return (
        <ECard title="Header Options">
            <Row>
                <Col md={24}>
                    {
                        (veri.selectedTags.includes("request_headers_to_remove") || matchesEndOrStartOf("request_headers_to_add", veri.selectedTags)) &&
                        <ECard title={"Request"}>
                            <div style={{ maxWidth: '100%', flex: 1 }}>
                                <EForm>
                                    <FieldComponent veri={{
                                        selectedTags: veri.selectedTags,
                                        handleChange: handleChangeRedux,
                                        tag: "request_headers_to_remove",
                                        keyPrefix: veri.keyPrefix,
                                        value: veri.reduxStore?.request_headers_to_remove,
                                        spanNum: 24,
                                        type: FieldTypes.Tags,
                                        values: [],
                                        placeholder: "(repeated string)"
                                    }}
                                    />
                                </EForm>
                                {veri.selectedTags.includes("request_headers_to_add") &&
                                    <>
                                        <HeaderToAdd veri={{
                                            version: veri.version,
                                            reduxStore: veri.reduxStore?.request_headers_to_add,
                                            keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.request_headers_to_add` : "request_headers_to_add",
                                            reduxAction: veri.reduxAction,
                                            title: "Request Headers To Add"
                                        }} />
                                    </>
                                }
                            </div>
                        </ECard>
                    }

                    {
                        (veri.selectedTags.includes("response_headers_to_remove") || matchesEndOrStartOf("response_headers_to_add", veri.selectedTags)) &&
                        <ECard title={"Response"}>
                            <div style={{ maxWidth: '100%', flex: 1 }}>
                                <EForm>
                                    <FieldComponent veri={{
                                        selectedTags: veri.selectedTags,
                                        handleChange: handleChangeRedux,
                                        tag: "response_headers_to_remove",
                                        keyPrefix: veri.keyPrefix,
                                        value: veri.reduxStore?.response_headers_to_remove,
                                        spanNum: 24,
                                        type: FieldTypes.Tags,
                                        values: [],
                                        placeholder: "(repeated string)"
                                    }}
                                    />
                                </EForm>

                                {matchesEndOrStartOf("response_headers_to_add", veri.selectedTags) &&
                                    <HeaderToAdd veri={{
                                        version: veri.version,
                                        reduxStore: veri.reduxStore?.response_headers_to_add,
                                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.response_headers_to_add` : "response_headers_to_add",
                                        reduxAction: veri.reduxAction,
                                        title: "Response Headers To Add"
                                    }} />
                                }
                            </div>
                        </ECard>
                    }
                </Col>
            </Row>
        </ECard >
    )
};

export default memorizeComponent(CommonComponentHeaderOptions, compareVeriReduxStoreAndSelectedTags);