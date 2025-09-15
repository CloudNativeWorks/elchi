import React from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import CCard from "@/elchi/components/common/CopyPasteCard";
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import CommonComponentAddress from '@resources/common/Address/Address';
import CommonComponentAccessLog from '@resources/common/AccessLog/AccessLog';
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_admin, modtag_us_bootstrap } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        managed: boolean;
    }
};

const ComponentAdmin: React.FC<GeneralProps> = ({ veri }) => {
    const { vModels } = useModels(veri.version, modtag_admin);
    const { vTags } = useTags(veri.version, modtag_admin);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.a?.Admin,
            sf: vTags.a?.Admin_SingleFields,
        }),
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.a?.Admin.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="admin" title="Admin">
            <HorizonTags veri={{
                tags: vTags.a?.Admin,
                unsupportedTags: modtag_us_bootstrap["admin"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                doNotChange: veri.managed ? ["address"] : [],
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
                shouldRender={matchesEndOrStartOf("access_log", selectedTags)}
                Component={CommonComponentAccessLog}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.access_log`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.access_log`,
                    reduxStore: veri.reduxStore?.access_log,
                    reduxAction: ResourceAction,
                    id: `access_log_0`,
                }}
            />

            {startsWithAny("address", selectedTags) &&
                <ECard title="Address">
                    <CommonComponentAddress veri={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.address,
                        keyPrefix: `${veri.keyPrefix}.address`,
                        tagPrefix: `address`,
                        unsupportedAddressTag: ['address.pipe', 'address.envoy_internal_address'],
                        unsupportedSocketAddressTag: [],
                        managed: veri.managed,
                        bootstrap: true
                    }} />
                </ECard>}
        </CCard>
    )
};


export default memorizeComponent(ComponentAdmin, compareVeri);
