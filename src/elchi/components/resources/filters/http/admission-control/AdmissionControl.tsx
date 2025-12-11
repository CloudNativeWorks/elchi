import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_admission_control } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import { generateFields } from "@/common/generate-fields";
import { FieldConfigType, startsWithAll, startsWithAny } from "@/utils/tools";
import CommonComponentRuntimeFeatureFlag from "@/elchi/components/resources/common/RuntimeFeatureFlag/RuntimeFeatureFlag";
import CommonComponentRuntimeDouble from "@/elchi/components/resources/common/RuntimeDouble/RuntimeDouble";
import CommonComponentPercent from "@/elchi/components/resources/common/RuntimePercent/RuntimePercent";
import CommonComponentRuntimeUInt32 from "@/elchi/components/resources/common/RuntimeUInt32/RuntimeUInt32";
import ComponentAdmissionSuccessCriteria from "./GradientControllerConfig";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentAdmissionControl: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.AdmissionControl);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_admission_control);
    const { vTags, loading } = useTags(veri.version, modtag_admission_control);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ac",
        vModels,
        vTags,
        modelName: "AdmissionControl",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ac?.AdmissionControl,
            sf: vTags.ac?.AdmissionControl_SingleFields,
        })
    ];


    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        reduxStore && (
            <>
                <HeadOfResource
                    generalName={veri.generalName}
                    version={veri.version}
                    changeGeneralName={veri.changeGeneralName}
                    locationCheck={location.pathname === GType.createPath}
                    createUpdate={{
                        location_path: location.pathname,
                        GType: GType,
                        offset: 0,
                        name: veri.generalName,
                        reduxStore: reduxStore,
                        voidToJSON: vModels.ac?.AdmissionControl.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Admission Control</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.ac?.AdmissionControl}
                            unsuportedTags={["inline_code"]}
                            singleOptionKeys={vTags.ac?.AdmissionControl_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            required={["evaluation_criteria"]}
                            specificTagPrefix={{ 'success_criteria': 'evaluation_criteria' }}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("enabled", selectedTags)}
                            Component={CommonComponentRuntimeFeatureFlag}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.enabled,
                                keyPrefix: `enabled`,
                                title: "Enabled",
                                id: `enabled_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAll("evaluation_criteria.success_criteria", selectedTags)}
                            Component={ComponentAdmissionSuccessCriteria}
                            componentProps={{
                                version: veri.version,
                                reduxStore: navigateCases(reduxStore, "evaluation_criteria.success_criteria"),
                                keyPrefix: `success_criteria`,
                                tagPrefix: "evaluation_criteria",
                                title: "Evaluation Criteria -> Success Criteria",
                                id: `success_criteria_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.ac?.AdmissionControl_SingleFields?.includes(item))}
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
                            shouldRender={startsWithAny("aggression", selectedTags)}
                            Component={CommonComponentRuntimeDouble}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.aggression,
                                keyPrefix: `aggression`,
                                title: "Aggression",
                                id: `aggression_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("sr_threshold", selectedTags)}
                            Component={CommonComponentPercent}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.sr_threshold,
                                keyPrefix: `sr_threshold`,
                                title: "Sr Threshold",
                                id: `sr_threshold_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("rps_threshold", selectedTags)}
                            Component={CommonComponentRuntimeUInt32}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.rps_threshold,
                                keyPrefix: `rps_threshold`,
                                title: "Rps Threshold",
                                id: `rps_threshold_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={startsWithAny("max_rejection_probability", selectedTags)}
                            Component={CommonComponentPercent}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.max_rejection_probability,
                                keyPrefix: `max_rejection_probability`,
                                title: "Max Rejection Probability",
                                id: `max_rejection_probability_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentAdmissionControl);