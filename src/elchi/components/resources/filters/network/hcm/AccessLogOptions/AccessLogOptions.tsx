import React from "react";
import { Divider, Col } from 'antd';
import { memorizeComponent, compareVeriReduxStoreAndSelectedTags } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { useTags } from "@/hooks/useTags";
import { modtag_access_log_options } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix?: string;
        id: string;
    }
};

const ComponentAccessLogOptions: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags, loading } = useTags(veri.version, modtag_access_log_options);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    if (loading || !vTags.alo) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.alo?.HttpConnectionManager_HcmAccessLogOptions,
            sf: vTags.alo?.HttpConnectionManager_HcmAccessLogOptions_SingleFields,
        }),
    ];

    return (
        <ECard title="Access Log Options" id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.alo?.HttpConnectionManager_HcmAccessLogOptions,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: '',
                required: [],
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
        </ECard>
    )
};

export default memorizeComponent(ComponentAccessLogOptions, compareVeriReduxStoreAndSelectedTags);
