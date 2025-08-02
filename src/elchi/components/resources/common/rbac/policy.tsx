import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import { modtag_rbac_policy } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import ComponentPermissions from "./permissions";
import ComponentPrincipals from "./principals";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac_policy);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.rp?.Policy,
                selectedTags: selectedTags,
                unsupportedTags: ["condition"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ["permissions", "principals"],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("permissions", selectedTags)}
                    Component={ComponentPermissions}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.permissions`,
                        reduxStore: veri.reduxStore?.permissions,
                        id: `permissions_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("principals", selectedTags)}
                    Component={ComponentPrincipals}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.principals`,
                        reduxStore: veri.reduxStore?.principals,
                        id: `principals_0`,
                    }}
                />
            </Col>
        </>
    )
};

export default memorizeComponent(ComponentPolicy, compareVeri);
