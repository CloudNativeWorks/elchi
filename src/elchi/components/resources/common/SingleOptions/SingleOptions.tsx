import React from "react";
import { Col, Row } from 'antd';
import { useDispatch } from "react-redux";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, getFieldValue } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        selectedTags: string[];
        reduxStore: any;
        fieldConfigs: FieldConfigType[];
        keyPrefix?: string;
        tagPrefix?: string;
    }
};

const CommonComponentSingleOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title="Single Options">
            <Row>
                <Col md={24}>
                    <EForm>
                        <Row gutter={[5, 1]}>
                            {veri.fieldConfigs.map((config) => (
                                <FieldComponent key={config.tag}
                                    veri={{
                                        selectedTags: veri.selectedTags,
                                        handleChange: handleChangeRedux,
                                        tag: config.tag,
                                        value: getFieldValue(veri.reduxStore, config, veri.version),
                                        type: config.type,
                                        placeholder: config.placeHolder,
                                        values: config.values,
                                        tagPrefix: config.tagPrefix || veri.tagPrefix,
                                        spanNum: config.spanNum,
                                        required: config.required,
                                        keyPrefix: veri.keyPrefix,
                                    }}
                                />
                            ))}
                        </Row>
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentSingleOptions, compareVeri);
