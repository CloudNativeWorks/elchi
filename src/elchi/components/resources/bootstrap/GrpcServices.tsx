import React from "react";
import { Col, Divider, Card } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { modtag_grpc_service } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        index: number;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        controllerIndex: string;
    }
};

const ComponentGrpcServices: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_grpc_service);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "cluster_name", type: FieldTypes.String, placeHolder: "(string)", fieldPath: 'cluster_name', disabled: true },
        { tag: "authority", type: FieldTypes.String, placeHolder: "(string)", fieldPath: 'authority', disabled: true },
    ];

    return (
        <Card size="small" title={`Grpc Services (NodeID: ${veri.controllerIndex})`} styles={{ header: { background: 'var(--bg-surface)', color: 'var(--text-primary)' } }} style={{ marginBottom: 8, width: "100%" }}>
            <HorizonTags veri={{
                tags: vTags.ge?.GrpcService_EnvoyGrpc,
                selectedTags: selectedTags,
                unsupportedTags: ["retry_policy", "max_receive_message_length", "skip_envoy_headers"],
                index: veri.index,
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                doNotChange: ["cluster_name", "authority"]
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
        </Card>
    )
};

export default memorizeComponent(ComponentGrpcServices, compareVeri);
