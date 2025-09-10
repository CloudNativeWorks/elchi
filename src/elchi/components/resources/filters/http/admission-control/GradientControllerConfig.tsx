import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_admission_success_criteria } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import ComponentHttpCriteria from "./HttpCriteria";
import ComponentGrpcCriteria from "./GrpcCriteria";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentAdmissionSuccessCriteria: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_admission_success_criteria);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.acs?.AdmissionControl_SuccessCriteria,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("http_criteria", selectedTags)}
                    Component={ComponentHttpCriteria}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.http_criteria,
                        keyPrefix: `${veri.keyPrefix}.http_criteria`,
                        title: "Http Criteria",
                        id: `http_criteria_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("grpc_criteria", selectedTags)}
                    Component={ComponentGrpcCriteria}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.grpc_criteria,
                        keyPrefix: `${veri.keyPrefix}.grpc_criteria`,
                        title: "Grpc Criteria",
                        id: `grpc_criteria_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentAdmissionSuccessCriteria, compareVeri);
