import React, { useState } from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_grpc_health_check, modtag_us_cluster } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import CommonComponentHeaderAddD from "@components/resources/common/HeaderOptions/HeaderToAdd/WithDrawer";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentGrpcHealthCheck: React.FC<GeneralProps> = ({ veri }) => {
    const [showInitialMetadata, setShowInitialMetadata] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_grpc_health_check);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hg?.HealthCheck_GrpcHealthCheck,
            sf: vTags.hg?.HealthCheck_GrpcHealthCheck_SingleFields,
            r: ['authority']
        }),
        { tag: "initial_metadata", type: FieldTypes.ArrayIcon, placeHolder: "(number)", fieldPath: 'initial_metadata', spanNum: 8, drawerShow: () => { setShowInitialMetadata(true); }, },
    ]

    return (
        <ECard title="GRPC Health Check">
            <HorizonTags veri={{
                tags: vTags.hg?.HealthCheck_GrpcHealthCheck,
                unsupportedTags: modtag_us_cluster["HttpHealthCheck"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: ``,
                required: ["authority"]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Row>
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
            <ConditionalComponent
                shouldRender={startsWithAny("initial_metadata", selectedTags)}
                Component={CommonComponentHeaderAddD}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.initial_metadata`,
                    drawerOpen: showInitialMetadata,
                    reduxStore: veri.reduxStore?.initial_metadata,
                    reduxAction: ResourceAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.initial_metadata`,
                    drawerClose: () => { setShowInitialMetadata(false); },
                    id: "initial_metadata_0"
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(ComponentGrpcHealthCheck, compareVeri);
