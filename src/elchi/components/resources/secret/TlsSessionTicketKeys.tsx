import React from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { startsWithAny } from "@/utils/tools";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import TabComponent from "../../common/TabComponent";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceMain from "@/hooks/useResourceMain";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import { modtag_tls_session_ticket_keys } from "./_modtag_";
import RenderLoading from "../../common/Loading";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import CommonComponentDataSource from "@/elchi/components/resources/common/DataSource/DataSource";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentTlsSessionTicketKeys: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.TLSSessionTicketKeys);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_tls_session_ticket_keys);
    const { vTags, loading } = useTags(veri.version, modtag_tls_session_ticket_keys);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "tstk",
        vModels,
        vTags,
        modelName: "TlsSessionTicketKeys",
    });

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
                        voidToJSON: vModels.tstk?.TlsSessionTicketKeys.toJSON,
                        queryResource: veri.queryResource,
                        envoyVersion: veri.version,
                        gtype: reduxStore?.$type,
                    }}
                />
                <Divider type="horizontal" orientation="left" orientationMargin="0">TLS Session Ticket Keys</Divider>
                <Row>
                    <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                        <CustomAnchor
                            resourceConfKeys={vTags.tstk?.TlsSessionTicketKeys}
                            singleOptionKeys={[]}
                            selectedTags={selectedTags}
                            index={0}
                            handleChangeTag={handleChangeTag}
                            required={[]}
                        />
                    </Col>
                    <Col md={20}>
                        <div id="keys_0">
                            {startsWithAny("keys", selectedTags) &&
                                <TabComponent veri={{
                                    version: veri.version,
                                    title: 'Keys',
                                    reduxStore: reduxStore?.keys,
                                    keyPrefix: `keys`,
                                    label: 'key',
                                    component: CommonComponentDataSource,
                                    veri: {
                                        parentName: 'Keys',
                                        version: veri.version,
                                        tagPrefix: ``,
                                        fileName: 'key file',
                                    }
                                }} />}
                        </div>
                    </Col>
                </Row>
            </>
        )
    )
}

export default React.memo(ComponentTlsSessionTicketKeys);
