import React, { useEffect } from "react";
import { Divider } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_metadata_options } from "./_modtag_";
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


const ComponentMetadataOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags, loading } = useTags(veri.version, modtag_metadata_options);
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

    if (loading || !vTags.mo) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.mo?.MetadataOptions,
            sf: vTags.mo?.MetadataOptions_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Metadata Options"}>
            <HorizonTags veri={{
                tags: vTags.mo?.MetadataOptions,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EFields
                fieldConfigs={fieldConfigs}
                selectedTags={selectedTags}
                handleChangeRedux={handleChangeRedux}
                reduxStore={veri.reduxStore}
                keyPrefix={veri.keyPrefix}
                version={veri.version}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentMetadataOptions, compareVeriReduxStoreAndSelectedTags);
