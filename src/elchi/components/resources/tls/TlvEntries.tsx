import React from "react";
import { Col, Tabs, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_proxy_protocol_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import ECard from "@/elchi/components/common/ECard";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import CommonComponentSubstitutionFormatString from "../common/SubstitutionFormatString/SubstitutionFormatString";

type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        id: string;
    }
};

/**
 * TlvEntries component for managing array of TlvEntry
 * Each TlvEntry has:
 * - type: number (0-255)
 * - value: Uint8Array (static value)
 * - format_string: SubstitutionFormatString (dynamic value)
 */
const ComponentTlvEntries: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_proxy_protocol_config);

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ppc?.TlvEntry,
            sf: vTags.ppc?.TlvEntry_SingleFields,
            r: ['type']
        }),
    ];

    // value is Uint8Array - not supported for now
    const unsupportedTags = ['value'];

    return (
        <ECard title="Added TLVs" id={veri.id} size="small">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: `TLV: ${data?.type ?? index}`,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.ppc?.TlvEntry,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: unsupportedTags,
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        required: ['type'],
                                    }} />
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <EFields
                                                fieldConfigs={fieldConfigs}
                                                selectedTags={selectedTags[index]}
                                                handleChangeRedux={handleChangeRedux}
                                                reduxStore={data}
                                                keyPrefix={`${veri.keyPrefix}.${index}`}
                                                version={veri.version}
                                            />
                                        </EForm>

                                        {/* Format String (SubstitutionFormatString) */}
                                        <ConditionalComponent
                                            shouldRender={matchesEndOrStartOf("format_string", selectedTags[index] || [])}
                                            Component={CommonComponentSubstitutionFormatString}
                                            componentProps={{
                                                version: veri.version,
                                                reduxStore: data?.format_string,
                                                keyPrefix: `${veri.keyPrefix}.${index}.format_string`,
                                                id: `format_string_${index}`,
                                                title: 'Format String',
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </>
                        ),
                    };
                })
                }
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentTlvEntries, compareVeri);
