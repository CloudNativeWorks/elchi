import React, { useEffect, useState } from "react";
import { Col, Row, Card } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType } from "@/utils/tools";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { ValueToBase64Per } from "@/utils/typed-config-op";
import { modtag_filter_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        isPerFilter: boolean;
    }
};

const ComponentHttpFilterChild: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { vTags } = useTags(veri.version, modtag_filter_config);
    useEffect(() => {
        setSelectedTags(extractNestedKeys(veri.reduxStore));
    }, [veri.reduxStore]);

    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        if (!veri.isPerFilter) {
            handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
        } else {
            const newReduxStore = { ...veri.reduxStore };
            newReduxStore.disabled = val as boolean;

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: `${veri.keyPrefix}.value`,
                    val: ValueToBase64Per(newReduxStore),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        }
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.fc?.FilterConfig,
            sf: vTags.fc?.FilterConfig_SingleFields,
        })
    ];

    return (
        <Card>
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
        </Card>
    )
};

export default memorizeComponent(ComponentHttpFilterChild, compareVeri);