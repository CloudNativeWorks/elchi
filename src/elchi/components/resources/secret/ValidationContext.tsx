import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CommonComponentWatchedDirectory from "../common/WatchedDirectory/watched_directory";
import CommonComponentDataSource from "../common/DataSource/DataSource";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_certificate_validation_context, modtag_us_secret } from "./_modtag_";
import RenderLoading from "../../common/Loading";
import { generateFields } from "@/common/generate-fields";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ValidationContextComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.CertificateValidationContext);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_certificate_validation_context);
    const { vTags, loading } = useTags(veri.version, modtag_certificate_validation_context);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "cvc",
        vModels,
        vTags,
        modelName: "CertificateValidationContext",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.cvc?.CertificateValidationContext,
            sf: vTags.cvc?.CertificateValidationContext_SingleFields,
        })
    ]

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels || !vTags || loading} error={""} />;
    }
    return (
        reduxStore && (
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
                        voidToJSON: vModels.cvc?.CertificateValidationContext.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Certificate Validation Configuration</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.cvc?.CertificateValidationContext}
                            unsuportedTags={modtag_us_secret['validation_context']}
                            singleOptionKeys={vTags.cvc?.CertificateValidationContext_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"validation_context"}
                        />
                    </Col>
                    <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("trusted_ca", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                parentName: 'Trusted CA',
                                reduxStore: reduxStore?.trusted_ca,
                                keyPrefix: `trusted_ca`,
                                tagPrefix: ``,
                                fileName: 'CA file',
                                id: `trusted_ca_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("watched_directory", selectedTags)}
                            Component={CommonComponentWatchedDirectory}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.watched_directory,
                                keyPrefix: `watched_directory`,
                                id: `watched_directory_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.cvc?.CertificateValidationContext_SingleFields.includes(item))}
                            Component={CommonComponentSingleOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                fieldConfigs: fieldConfigs,
                                reduxStore: reduxStore,
                                id: `single_options_0`,
                            }}
                        />
                        {/* <ConditionalComponent
                            shouldRender={startsWithAny("match_typed_subject_alt_names", selectedTags)}
                            Component={ComponentMatchTypeSubjectAltNames}
                            componentProps={{
                                version: veri.version,
                                keyPrefix: 'match_typed_subject_alt_names',
                                reduxStore: reduxStore?.match_typed_subject_alt_names,
                                tagPrefix: 'match_typed_subject_alt_names',
                                tagMatchPrefix: 'match_typed_subject_alt_names',
                                unsupportedTags: [],
                                id: `match_typed_subject_alt_names_0`,
                            }}
                        /> */}
                        <ConditionalComponent
                            shouldRender={startsWithAny("crl", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                parentName: 'CRL',
                                reduxStore: reduxStore?.crl,
                                keyPrefix: `crl`,
                                tagPrefix: ``,
                                fileName: 'CRL file',
                                id: `crl_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ValidationContextComponent);
