import React from "react";
import { Col, Row } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const CommonComponentWatchedDirectory: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const handleUpdateRedux = (key: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: key, val: val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title="Watched Directory">
            <Row>
                <Col md={24}>
                    <EForm>
                        <FieldComponent veri={{
                            selectedTags: [],
                            keyPrefix: `${veri.keyPrefix}`,
                            handleChange: handleUpdateRedux,
                            tag: "path",
                            value: veri.reduxStore?.path,
                            type: FieldTypes.String,
                            placeholder: "(string)",
                            spanNum: 24,
                            alwaysShow: true,
                            required: true,
                        }} />
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentWatchedDirectory, compareVeri);
