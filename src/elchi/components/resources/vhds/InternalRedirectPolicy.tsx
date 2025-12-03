import React from "react";
import { Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "../../common/ECard";
import { modtag_internal_redirect_policy } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ComponentInternalRedirectPredicates from "./InternalRedirectPredicates/InternalRedirectPredicates";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentInternalRedirectPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_internal_redirect_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.irp?.InternalRedirectPolicy,
            sf: vTags.irp?.InternalRedirectPolicy_SingleFields,
        }),
    ]

    return (
        <ECard title={'Internal Redirect Policy'}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.irp?.InternalRedirectPolicy,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    tagPrefix: `internal_redirect_policy`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                    keyPrefix: veri.keyPrefix,
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
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf("predicates", selectedTags)}
                        Component={ComponentInternalRedirectPredicates}
                        componentProps={{
                            version: veri.version,
                            keyPrefix: `${veri.keyPrefix}.predicates`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.predicates`,
                            reduxStore: veri.reduxStore?.predicates,
                            reduxAction: ResourceAction,
                            id: `${veri.keyPrefix}_predicates_0`,
                            title: "Internal Redirect Predicates",
                        }}
                    />
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentInternalRedirectPolicy, compareVeri);
