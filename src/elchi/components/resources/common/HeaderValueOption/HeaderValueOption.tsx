import React from "react";
import { Divider } from 'antd';
import { compareVeriReduxStoreAndSelectedTags, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { useTags } from "@/hooks/useTags";
import { modtag_header_value_option } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentHeaderValue from "../HeaderValue/HeaderValue";
import useResourceForm from "@/hooks/useResourceForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix?: string;
        tagMatchPrefix?: string;
        title?: string;
    }
};


const CommonComponentHeaderValueOption: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_header_value_option);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.hvo) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hvo?.HeaderValueOption,
            sf: vTags.hvo?.HeaderValueOption_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title || "Header Value Options"}>
            <HorizonTags veri={{
                tags: vTags.hvo?.HeaderValueOption,
                selectedTags: selectedTags,
                unsupportedTags: ["append"],
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
                    shouldRender={startsWithAny("header", selectedTags)}
                    Component={CommonComponentHeaderValue}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.header,
                        keyPrefix: veri.keyPrefix ? `${veri.keyPrefix}.header` : "header",
                        title: "Header"
                    }}
                />
            </EForm>
        </ECard>
    );
};

export default memorizeComponent(CommonComponentHeaderValueOption, compareVeriReduxStoreAndSelectedTags);
