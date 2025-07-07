import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_tunneling_config } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import HeaderToAdd from "../../../common/HeaderOptions/HeaderToAdd/HeaderToAdd";
import CCard from "@/elchi/components/common/CopyPasteCard";
import useResourceForm from "@/hooks/useResourceForm";
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

const ComponentTunnelingConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_tunneling_config);
    const { vTags } = useTags(veri.version, modtag_tunneling_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ttc?.TcpProxy_TunnelingConfig,
            sf: vTags.ttc?.TcpProxy_TunnelingConfig_SingleFields,
            r: ['hostname', 'post_path']
        })
    ];

    return (
        <CCard reduxStore={veri.reduxStore} keys={veri.keyPrefix} toJSON={vModels.ttc?.TcpProxy_TunnelingConfig.toJSON} Paste={handleChangeRedux} ctype="tcp_tunneling_config" title="Tunneling Config">
            <Row>
                <HorizonTags veri={{
                    tags: vTags.ttc?.TcpProxy_TunnelingConfig,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    tagPrefix: ``,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.tunneling_config`,
                    required: ['hostname']
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <Col md={24}>
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
                    {
                        matchesEndOrStartOf("headers_to_add", selectedTags) &&
                        <>
                            <HeaderToAdd veri={{
                                version: veri.version,
                                reduxStore: veri.reduxStore?.headers_to_add,
                                keyPrefix: `${veri.keyPrefix}.headers_to_add`,
                                reduxAction: veri.reduxAction,
                                title: "Headers To Add"
                            }} />
                        </>
                    }
                </Col>
            </Row>
        </CCard>
    )
};

export default memorizeComponent(ComponentTunnelingConfig, compareVeri);
