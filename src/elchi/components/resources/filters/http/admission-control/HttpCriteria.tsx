import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_admission_success_criteria_http } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentArrayRange from "@/elchi/components/resources/common/ArrayRange/ArrayRange";
import { FieldTypes } from "@/common/statics/general";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentHttpCriteria: React.FC<GeneralProps> = ({ veri }) => {
    const [showHttpSuccessStatus, setShowHttpSuccessStatus] = useState<boolean>(false);
    const { vTags } = useTags(veri.version, modtag_admission_success_criteria_http);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "http_success_status", type: FieldTypes.ArrayIcon, fieldPath: 'http_success_status', spanNum: 8, drawerShow: () => { setShowHttpSuccessStatus(true); }, },
    ]

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.acsh?.AdmissionControl_SuccessCriteria_HttpCriteria,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ['http_success_status']
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("http_success_status", selectedTags)}
                    Component={CommonComponentArrayRange}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.http_success_status`,
                        drawerOpen: showHttpSuccessStatus,
                        reduxStore: veri.reduxStore?.http_success_status,
                        drawerClose: () => { setShowHttpSuccessStatus(false); },
                        id: `http_success_status_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentHttpCriteria, compareVeri);
