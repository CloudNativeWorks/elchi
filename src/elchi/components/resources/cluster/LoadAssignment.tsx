import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { modtag_load_assignment, modtag_us_cluster } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import ComponentPolicy from '@elchi/components/resources/common/Policy/policy';
import Endpoints from '@elchi/components/resources/common/endpoints/endpoints';
import useResourceForm from "@/hooks/useResourceForm";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { useModels } from "@/hooks/useModels";
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

const ComponentLoadAssignment: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_load_assignment);
    const { vTags } = useTags(veri.version, modtag_load_assignment);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.c?.ClusterLoadAssignment,
            sf: vTags.c?.ClusterLoadAssignment_SingleFields,
            r: ["cluster_name"]
        })
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.c?.ClusterLoadAssignment?.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} version={veri.version} ctype="load_assignment" title="Load Assignment">
            <HorizonTags veri={{
                tags: vTags.c?.ClusterLoadAssignment,
                unsupportedTags: modtag_us_cluster["load_assignment"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                required: ["cluster_name"],
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
                shouldRender={matchesEndOrStartOf("endpoints", selectedTags)}
                Component={Endpoints}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.endpoints,
                    keyPrefix: `${veri.keyPrefix}.endpoints`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.endpoints`,
                    id: `endpoints_0`
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("policy", selectedTags)}
                Component={ComponentPolicy}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.policy,
                    keyPrefix: `${veri.keyPrefix}.policy`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.policy`,
                    id: `policy_0`
                }}
            />
        </CCard>
    )
};


export default memorizeComponent(ComponentLoadAssignment, compareVeri);