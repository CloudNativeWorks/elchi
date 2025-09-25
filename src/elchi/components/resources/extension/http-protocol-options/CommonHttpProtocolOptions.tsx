import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { useModels } from "@/hooks/useModels";
import { modtag_chttp_protocol_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";
import { useDispatch } from "react-redux";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentCommonHttpProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_chttp_protocol_options);
    const { vTags } = useTags(veri.version, modtag_chttp_protocol_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: keys, val: data, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.chpo?.HttpProtocolOptions,
            sf: vTags.chpo?.HttpProtocolOptions_SingleFields,
        })
    ];

    return (
        <ECard 
            title="Common Http Protocol Options"
            reduxStore={veri.reduxStore}
            ctype="http_protocol_options"
            toJSON={vModels.chpo?.HttpProtocolOptions?.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.chpo?.HttpProtocolOptions,
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
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
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentCommonHttpProtocolOptions, compareVeri);