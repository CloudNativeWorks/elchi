import React from "react";
import { Tabs, Row, Divider, Col } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_socket_options, modtag_us_socket_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import ECard from "../../../../common/ECard";
import { EForm } from "../../../../common/e-components/EForm";
import { EFields } from "../../../../common/e-components/EFields";

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

const ComponentSocketOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_socket_options);
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
            f: vTags.so?.SocketOption,
            sf: vTags.so?.SocketOption_SingleFields,
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
                        label: `Socket Option ${index}`,
                        forceRender: true,
                        children: (
                            <>
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.so?.SocketOption,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: modtag_us_socket_options.SocketOption || [],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        tagPrefix: ``,
                                        specificTagPrefix: {
                                            "int_value": "value",
                                            "buf_value": "value"
                                        },
                                        onlyOneTag: [["value.int_value", "value.buf_value"]]
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
                            </>
                        ),
                    })) || []}
                />
        </ECard>
    );
};

export default ComponentSocketOptions;
