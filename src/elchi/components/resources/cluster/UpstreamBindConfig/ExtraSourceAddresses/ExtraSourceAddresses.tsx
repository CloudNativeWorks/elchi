import React from "react";
import { Tabs, Row, Divider, Col } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_extra_source_addresses, modtag_us_extra_source_addresses } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import ECard from "../../../../common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";
import { ConditionalComponent } from "../../../../common/ConditionalComponent";
import CommonComponentSocketAddress from "../../../common/Address/socket_address";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        reduxAction: any;
        id: string;
        title: string;
    }
};

const ComponentExtraSourceAddresses: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_extra_source_addresses);
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
            f: vTags.esa?.ExtraSourceAddress,
            sf: vTags.esa?.ExtraSourceAddress_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id} size="small">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => ({
                        key: index.toString(),
                        label: `Extra Source Address ${index}`,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.esa?.ExtraSourceAddress,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: modtag_us_extra_source_addresses.ExtraSourceAddress || [],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
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
                                    </Col>
                                </Row>
                                <ConditionalComponent
                                    shouldRender={matchesEndOrStartOf("address", selectedTags[index])}
                                    Component={CommonComponentSocketAddress}
                                    componentProps={{
                                        version: veri.version,
                                        reduxStore: data?.address,
                                        keyPrefix: `${veri.keyPrefix}.${index}.address`,
                                        unsupportedAddressTag: [],
                                        unsupportedSocketAddressTag: []
                                    }}
                                />
                            </>
                        ),
                    })) || []}
                />
        </ECard>
    );
};

export default ComponentExtraSourceAddresses;
