import React, { useEffect } from "react";
import { Divider } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_google_re2 } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";


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


const CommonComponentGoogleRE2: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags, loading } = useTags(veri.version, modtag_google_re2);
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

    if (loading || !vTags.gre2) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.gre2?.RegexMatcher_GoogleRE2,
            sf: ["max_program_size"],
        }),
    ];

    return (
        <ECard title={veri.title || "Google RE2"}>
            <HorizonTags veri={{
                tags: vTags.gre2?.RegexMatcher_GoogleRE2,
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
            </EForm>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentGoogleRE2, compareVeriReduxStoreAndSelectedTags);
