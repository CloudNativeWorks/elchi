import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_memory_allocator_manager } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentMemoryAllocatorManager: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_memory_allocator_manager);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.mam?.MemoryAllocatorManager,
            sf: vTags.mam?.MemoryAllocatorManager_SingleFields,
        }),
    ]

    return (
        <ECard title="Memory Allocator Manager">
            <HorizonTags veri={{
                tags: vTags.mam?.MemoryAllocatorManager,
                unsupportedTags: [],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
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
        </ECard>
    )
};


export default memorizeComponent(ComponentMemoryAllocatorManager, compareVeri);
