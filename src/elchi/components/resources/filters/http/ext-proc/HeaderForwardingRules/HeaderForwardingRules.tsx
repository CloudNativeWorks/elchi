import React, { useEffect } from "react";
import { Divider } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_header_forwarding_rules } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentListStringMatcher from "@/elchi/components/resources/common/ListStringMatcher/ListStringMatcher";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix?: string;
        tagPrefix?: string;
        title?: string;
    }
};


const ComponentHeaderForwardingRules: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags, loading } = useTags(veri.version, modtag_header_forwarding_rules);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // Initialize empty object in Redux when component mounts
    useEffect(() => {
        if (!veri.reduxStore && veri.keyPrefix) {
            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: veri.keyPrefix,
                    val: {},
                    resourceType: ResourceType.Resource
                },
                dispatch,
                veri.reduxAction
            );
        }
    }, []);

    if (loading || !vTags.hfr) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hfr?.HeaderForwardingRules,
            sf: vTags.hfr?.HeaderForwardingRules_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Header Forwarding Rules"}>
            <HorizonTags veri={{
                tags: vTags.hfr?.HeaderForwardingRules,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={veri.reduxStore}
                    keyPrefix={veri.keyPrefix}
                    version={veri.version}
                />

                <ConditionalComponent
                    shouldRender={startsWithAny("allowed_headers", selectedTags)}
                    Component={CommonComponentListStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.allowed_headers,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.allowed_headers` : "allowed_headers",
                        reduxAction: veri.reduxAction,
                        title: "Allowed Headers"
                    }}
                />

                <ConditionalComponent
                    shouldRender={startsWithAny("disallowed_headers", selectedTags)}
                    Component={CommonComponentListStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.disallowed_headers,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.disallowed_headers` : "disallowed_headers",
                        reduxAction: veri.reduxAction,
                        title: "Disallowed Headers"
                    }}
                />
            </EForm>
        </ECard>
    )
};

export default memorizeComponent(ComponentHeaderForwardingRules, compareVeriReduxStoreAndSelectedTags);
