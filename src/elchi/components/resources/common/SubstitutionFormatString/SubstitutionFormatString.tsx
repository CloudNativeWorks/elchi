import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { useTags } from "@/hooks/useTags";
import { modtag_substitution_format_string } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentDataSource from "../DataSource/DataSource";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title?: string;
    }
};

/**
 * SubstitutionFormatString component
 * Fields:
 * - format.text_format (string, deprecated)
 * - format.json_format (object)
 * - format.text_format_source (DataSource)
 * - omit_empty_values (boolean)
 * - content_type (string)
 * - formatters (TypedExtensionConfig[])
 * - json_format_options (JsonFormatOptions)
 */
const CommonComponentSubstitutionFormatString: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_substitution_format_string);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sfs?.SubstitutionFormatString,
            sf: vTags.sfs?.SubstitutionFormatString_SingleFields,
        }),
    ];

    // Unsupported for now (complex nested types)
    const unsupportedTags = ['formatters', 'json_format_options', 'format.json_format'];

    return (
        <ECard title={veri.title || "Format String"} id={veri.id} size="small">
            <HorizonTags veri={{
                tags: vTags.sfs?.SubstitutionFormatString,
                selectedTags: selectedTags || [],
                unsupportedTags: unsupportedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                specificTagPrefix: { 'text_format': 'format', 'json_format': 'format', 'text_format_source': 'format' },
                onlyOneTag: [['format.text_format', 'format.json_format', 'format.text_format_source']],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                {/* Single fields (text_format, omit_empty_values, content_type) */}
                {selectedTags?.some(item => vTags.sfs?.SubstitutionFormatString_SingleFields?.includes(item)) &&
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags || []}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                    </EForm>
                }

                {/* text_format_source (DataSource) */}
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("format.text_format_source", selectedTags || [])}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "format.text_format_source"),
                        keyPrefix: `${veri.keyPrefix}.text_format_source`,
                        tagPrefix: 'format.text_format_source',
                        parentName: 'Text Format Source',
                        fileName: 'format_template',
                    }}
                />
            </Col>
        </ECard>
    );
};

export default memorizeComponent(CommonComponentSubstitutionFormatString, compareVeri);
