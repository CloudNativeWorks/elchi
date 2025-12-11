import React from "react";
import { Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf, } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_lb_endpoints } from "../_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ComponentEndpoint from "./endpoint";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any
        keyPrefix: string;
    }
};

const ComponentLBEndpoint: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_lb_endpoints);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.lb?.LbEndpoint,
            sf: vTags.lb?.LbEndpoint_SingleFields,
        }),
    ]

    return (
        <>
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" orientationMargin="0" orientation="left">LB Endpoint</Divider>
            <HorizonTags veri={{
                tags: vTags.lb?.LbEndpoint,
                selectedTags: selectedTags,
                unsupportedTags: ["metadata"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                onlyOneTag: [["host_identifier.endpoint", "host_identifier.endpoint_name"]],
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
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("endpoint", selectedTags)}
                Component={ComponentEndpoint}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.host_identifier?.endpoint,
                    keyPrefix: `${veri.keyPrefix}.endpoint`,
                    id: `host_identifier.endpoint_0`,
                }}
            />
        </>
    )
};

export default memorizeComponent(ComponentLBEndpoint, compareVeri);
