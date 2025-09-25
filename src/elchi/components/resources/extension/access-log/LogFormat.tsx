import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentDataSource from "@/elchi/components/resources/common/DataSource/DataSource";
import CommonComponentStruct from "@/elchi/components/resources/common/Struct/Struct";
import useResourceForm from "@/hooks/useResourceForm";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_substitution_format_string } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentLogFormat: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_substitution_format_string);
    const { vTags } = useTags(veri.version, modtag_substitution_format_string);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sfs?.SubstitutionFormatString,
            sf: vTags.sfs?.SubstitutionFormatString_SingleFields,
            e: ["format.text_format"]
        }),
        { tag: "json_format_options.sort_properties", type: FieldTypes.Boolean, tagPrefix: 'format', fieldPath: 'json_format_options.sort_properties', additionalTags: ["json_format_options"], keyPrefix: `${veri.keyPrefix}`, navigate: true },
    ];

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.sfs?.SubstitutionFormatString.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="substitutionformatstring" version={veri.version} title='Log Format'>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.sfs?.SubstitutionFormatString,
                    unsupportedTags: ["formatters", "format.text_format"],
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    tagPrefix: `format`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                    onlyOneTag: [["format.text_format_source", "format.json_format"]],
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <Col md={24}>
                    <ConditionalComponent
                        shouldRender={startsWithAny("format.text_format_source", selectedTags)}
                        Component={CommonComponentDataSource}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.format?.text_format_source,
                            keyPrefix: `${veri.keyPrefix}.text_format_source`,
                            tagPrefix: `format.text_format_source`,
                            parentName: 'Text Format Source',
                            fileName: 'Format file',
                            id: `${veri.keyPrefix}.text_format_source`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={startsWithAny("format.json_format", selectedTags)}
                        Component={CommonComponentStruct}
                        componentProps={{
                            version: veri.version,
                            reduxStore: veri.reduxStore?.format?.json_format,
                            keyPrefix: `${veri.keyPrefix}`,
                            tagPrefix: `format`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.format`,
                            parentName: 'JSON Format',
                            tag: 'json_format',
                            id: `${veri.keyPrefix}.format.json_format`,
                        }}
                    />
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
        </CCard>
    )
};

export default memorizeComponent(ComponentLogFormat, compareVeri);
