import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import CommonComponentSingleOptions from "@elchi/components/resources/common/SingleOptions/SingleOptions";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_cares_dns_resolver } from "./_modtag_";
import RenderLoading from "@/elchi/components/common/Loading";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentAddresses from "@/elchi/components/resources/common/Address/Addresses";
import ComponentDnsResolverOptions from "./DnsResolverOptions";
import { FieldTypes } from "@/common/statics/general";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentCaresDnsResolver: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.CaresDnsResolver);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_cares_dns_resolver);
    const { vTags, loading } = useTags(veri.version, modtag_cares_dns_resolver);
    const { loadingCount } = useLoading();
    const [resolversOpen, setResolversOpen] = useState<boolean>(false);
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cdr",
        vModels,
        vTags,
        modelName: "CaresDnsResolverConfig",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cdr?.CaresDnsResolverConfig,
            sf: vTags.cdr?.CaresDnsResolverConfig_SingleFields,
        }),
    ];

    const resolversFieldConfigs: FieldConfigType[] = [
        { tag: "resolvers", type: FieldTypes.ArrayIcon, fieldPath: 'resolvers', spanNum: 8, drawerShow: () => { setResolversOpen(true); }, },
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                changeGeneralName={veri.changeGeneralName}
                version={veri.version}
                locationCheck={GType.createPath === location.pathname}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.cdr?.CaresDnsResolverConfig.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">C-Ares DNS Resolver</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.cdr?.CaresDnsResolverConfig}
                        singleOptionKeys={vTags.cdr?.CaresDnsResolverConfig_SingleFields}
                        selectedTags={selectedTags}
                        index={0}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={"CaresDnsResolverConfig"}
                        required={[]}
                    />
                </Col>
                <Col md={20}>


                    {startsWithAny("resolvers", selectedTags) && (
                        <>
                            <ECard title="Resolvers">
                                <EForm>
                                    <EFields
                                        fieldConfigs={resolversFieldConfigs}
                                        selectedTags={selectedTags}
                                        handleChangeRedux={() => { }}
                                        reduxStore={reduxStore}
                                        keyPrefix=""
                                        version={veri.version}
                                    />
                                </EForm>
                            </ECard>
                            <CommonComponentAddresses veri={{
                                version: veri.version,
                                keyPrefix: "resolvers",
                                drawerOpen: resolversOpen,
                                reduxStore: reduxStore?.resolvers,
                                drawerClose: () => { setResolversOpen(false); },
                                title: "Resolvers",
                            }} />
                        </>
                    )}

                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.cdr?.CaresDnsResolverConfig_SingleFields?.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />

                    <ConditionalComponent
                        shouldRender={startsWithAny("dns_resolver_options", selectedTags)}
                        Component={ComponentDnsResolverOptions}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.dns_resolver_options,
                            keyPrefix: "dns_resolver_options",
                            title: "DNS Resolver Options",
                            id: `dns_resolver_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    )
}

export default React.memo(ComponentCaresDnsResolver);
