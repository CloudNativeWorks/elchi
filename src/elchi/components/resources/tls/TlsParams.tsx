import React from "react";
import { Col, Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import { HorizonTags } from "../../common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { modtag_tls_params } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        tagMatchPrefix: string;
        tagPrefix: string;
        unsupportedTags: string[];
    }
};

const ComponentTlsParams: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_tls_params);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tp?.TlsParameters,
            sf: vTags.tp?.TlsParameters_SingleFields,
        }),
    ]

    return (
        <ECard title={"TLS Params"}>
            <HorizonTags veri={{
                tags: vTags.tp?.TlsParameters,
                selectedTags: selectedTags,
                unsupportedTags: veri.unsupportedTags,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: veri.tagPrefix,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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
        </ECard>
    )
};

export default memorizeComponent(ComponentTlsParams, compareVeri);
