import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import CCard from "@/elchi/components/common/CopyPasteCard";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_outlier_detection } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
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

const ComponentOutlierDetection: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_outlier_detection);
    const { vTags } = useTags(veri.version, modtag_outlier_detection);

    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.o?.OutlierDetection,
            sf: vTags.o?.OutlierDetection_SingleFields,
        }),
    ]

    return (
        <CCard 
            reduxStore={veri.reduxStore} 
            toJSON={vModels.o?.OutlierDetection.toJSON} 
            keys={veri.keyPrefix} 
            Paste={handleChangeRedux} 
            ctype="outlier_detection" 
            title="Outlier Detection"
            version={veri.version}
        >
            <HorizonTags veri={{
                tags: vTags.o?.OutlierDetection,
                unsupportedTags: ["monitors"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: `outlier_detection`,
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
        </CCard>
    )
};


export default memorizeComponent(ComponentOutlierDetection, compareVeri);