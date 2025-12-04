import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Col, Row, Divider } from "antd";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import { dummyToJSON } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentGrpcWeb: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.GrpcWeb);
    const location = useLocation();
    const reduxStore = useMemo(() => {
        return { $type: GTypes.GrpcWeb };
    }, []);

    return (
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
                    voidToJSON: dummyToJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">gRPC Web</Divider>
            <Row>
                <Col md={20}>
                    There are no fields in this resource. Just create and use it.
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentGrpcWeb);
