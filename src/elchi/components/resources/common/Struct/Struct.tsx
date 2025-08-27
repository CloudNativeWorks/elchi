import React from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { ToJson } from "@/utils/tools";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagPrefix: string;
        tagMatchPrefix: string;
        parentName: string;
        tag: string;
    }
};

const CommonComponentStruct: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const handleChangeRedux = (keys: string, val: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <CCard size="small" title={veri.parentName} keys={veri.tag} reduxStore={veri.reduxStore} toJSON={ToJson} Paste={handleChangeRedux} ctype={"struct"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent key={veri.tag}
                        veri={{
                            selectedTags: [veri.tag],
                            handleChange: handleChangeRedux,
                            tag: veri.tag,
                            value: veri.reduxStore,
                            type: FieldTypes.JSON,
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 24,
                            required: true
                        }}
                    />
                </EForm>
            </Col>
        </CCard>
    )
};

export default memorizeComponent(CommonComponentStruct, compareVeri);
