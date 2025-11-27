import React from "react";
import { Col, Divider, Tabs } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_save_cmsg_config, modtag_us_save_cmsg_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ResourceAction } from '@/redux/reducers/slice';

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
        reduxAction: typeof ResourceAction;
    }
};

const ComponentSaveCmsgConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_save_cmsg_config);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction,
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction,
        version: veri.version,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.scmc?.SocketCmsgHeaders,
            sf: vTags.scmc?.SocketCmsgHeaders_SingleFields,
        }),
    ];

    return (
        <ECard title={veri.title} id={veri.id} size="small">
            <Tabs
                type="editable-card"
                onChange={onChangeTabs}
                activeKey={state.activeTab}
                onEdit={addTab}
                items={veri.reduxStore?.map((_: any, idx: number) => ({
                    key: idx.toString(),
                    label: `Socket Cmsg Headers ${idx}`,
                    forceRender: true,
                    children: (
                        <>
                            <HorizonTags veri={{
                                tags: vTags.scmc?.SocketCmsgHeaders,
                                selectedTags: selectedTags[idx] || [],
                                unsupportedTags: modtag_us_save_cmsg_config.SocketCmsgHeaders || [],
                                keyPrefix: ``,
                                handleChangeTag: handleChangeTag,
                                tagPrefix: "",
                                tagMatchPrefix: `${veri.keyPrefix}`,
                                index: idx,
                            }} />
                            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                            <Col md={24}>
                                <EForm>
                                    <EFields
                                        fieldConfigs={fieldConfigs}
                                        selectedTags={selectedTags[idx] || []}
                                        handleChangeRedux={handleChangeRedux}
                                        reduxStore={veri.reduxStore?.[idx]}
                                        keyPrefix={`${veri.keyPrefix}.${idx}`}
                                        version={veri.version}
                                    />
                                </EForm>
                            </Col>
                        </>
                    ),
                }))}
            />
        </ECard>
    );
};

export default ComponentSaveCmsgConfig;
