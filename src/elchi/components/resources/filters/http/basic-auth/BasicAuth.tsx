import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import CommonComponentSingleOptions from "@/elchi/components/resources/common/SingleOptions/SingleOptions";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentDataSource from "@resources/common/DataSource/DataSource";
import useResourceMain from "@/hooks/useResourceMain";
import { generateFields } from "@/common/generate-fields";
import RenderLoading from "@/elchi/components/common/Loading";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_basic_auth } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { UnlockTwoTone } from "@ant-design/icons";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentHttpBasicAuth: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.BasicAuth);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_basic_auth);
    const { vTags, loading } = useTags(veri.version, modtag_basic_auth);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "ba",
        vModels,
        vTags,
        modelName: "BasicAuth",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ba?.BasicAuth,
            sf: vTags.ba?.BasicAuth_SingleFields,
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
                        voidToJSON: vModels.ba?.BasicAuth.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">Basic Auth</Divider>
                <Row>
                    <Col md={4}>
                        <CustomAnchor
                            resourceConfKeys={vTags.ba?.BasicAuth}
                            singleOptionKeys={vTags.ba?.BasicAuth_SingleFields}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            tagMatchPrefix={"BasicAuth"}
                            infoBar={[{
                                title: "User Hash Generator",
                                icon: <UnlockTwoTone />,
                                info_type: "uhg",
                            }]}
                        />
                    </Col>
                    <Col md={20}>
                        <ConditionalComponent
                            shouldRender={startsWithAny("users", selectedTags)}
                            Component={CommonComponentDataSource}
                            componentProps={{
                                version: veri.version,
                                reduxStore: reduxStore?.users,
                                keyPrefix: 'users',
                                tagPrefix: 'BasicAuth.users',
                                parentName: 'Users',
                                fileName: 'User file',
                                id: `users_0`,
                            }}
                        />
                        <ConditionalComponent
                            shouldRender={selectedTags?.some(item => vTags.ba?.BasicAuth_SingleFields?.includes(item))}
                            Component={CommonComponentSingleOptions}
                            componentProps={{
                                version: veri.version,
                                selectedTags: selectedTags,
                                fieldConfigs: fieldConfigs,
                                reduxStore: reduxStore,
                                id: `single_options_0`,
                            }}
                        />
                    </Col>
                </Row>
            </>
        )
    );
}

export default React.memo(ComponentHttpBasicAuth);