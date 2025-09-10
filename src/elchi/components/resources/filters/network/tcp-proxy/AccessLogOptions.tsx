import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import CCard from "@/elchi/components/common/CopyPasteCard";
import useResourceForm from "@/hooks/useResourceForm";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_access_log_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
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

const ComponentAccessLogOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_access_log_options);
    const { vTags } = useTags(veri.version, modtag_access_log_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.alo?.TcpProxy_TcpAccessLogOptions,
            sf: vTags.alo?.TcpProxy_TcpAccessLogOptions_SingleFields,
        })
    ];

    return (
        <CCard reduxStore={veri.reduxStore} keys={veri.keyPrefix} toJSON={vModels.alo?.TcpProxy_TcpAccessLogOptions.toJSON} Paste={handleChangeRedux} ctype="tcp_access_log_options" title="Access Log Options">
            <Row>
                <HorizonTags veri={{
                    tags: vTags.alo?.TcpProxy_TcpAccessLogOptions,
                    selectedTags: selectedTags,
                    keyPrefix: veri.keyPrefix,
                    handleChangeTag: handleChangeTag,
                    tagPrefix: ``,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.access_log_options`,
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
                </Col>
            </Row>
        </CCard>
    )
};

export default memorizeComponent(ComponentAccessLogOptions, compareVeri);
