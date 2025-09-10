import React from "react";
import { Col } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";



type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[] | undefined;
        tagMatchPrefix: string;
        tagPrefix: string;
        unsupportedTags: string[];
    }
};

const ComponentMatchTypeSubjectAltNames: React.FC<GeneralProps> = ({ veri }) => {
    const { selectedTags, handleChangeRedux } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "alpn_protocols", type: FieldTypes.Tags, fieldPath: 'alpn_protocols', placeHolder: 'eg: http/1.1,h2', values: ["h2", "http/1.1"], tagPrefix: veri.tagPrefix },
    ]

    return (
        <ECard title={"Match Typed Subject Alt Names"}>
            <Col md={24}>
                <EForm>
                    <EFields
                        alwaysShow={true}
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentMatchTypeSubjectAltNames, compareVeri);
