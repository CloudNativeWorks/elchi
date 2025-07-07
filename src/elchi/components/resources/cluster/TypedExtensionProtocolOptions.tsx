import React, { useEffect, useState } from "react";
import { Col, Form, Row, Select } from 'antd';
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@redux/dispatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "../../common/ECard";
import { ByteToObjPer, ObjToBase64Per } from "@/utils/typed-config-op";
import { EForm } from "../../common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
    }
};

const ComponentTypedExtensionProtocolOptions: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const [rState, setRState] = useState<any>()
    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_http_protocol_options",
        enabled: true,
        path: `custom/resource_list?collection=extensions&version=${veri.version}&project=${project}&category=envoy.upstreams.http.http_protocol_options&canonical_name=envoy.upstreams.http.http_protocol_options`
    });

    useEffect(() => {
        if (veri.reduxStore) {
            const [, value] = [...veri.reduxStore.entries()][0];

            setRState(ByteToObjPer(value))
        }
    }, [veri.reduxStore]);

    const handleChangeRedux = (key: string, val: string) => {
        const matched = queryData.find((obj: any) => obj.name === val);

        if (matched) {
            const protocolOptions = {
                type_url: matched.gtype,
                value: matched
            };

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: key,
                    val: { [matched.gtype as string]: ObjToBase64Per(protocolOptions) },
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched access log not found for the given value:", val);
        }
    };

    return (
        <ECard title="Typed Extension Protocol Options">
            <Row>
                <Col md={24}>
                    <EForm>
                        <Form.Item
                            style={{ width: "35%", zIndex: 900 }}
                            label={
                                <div className="smoothAnimation" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {"Http Protocol Options"}
                                </div>
                            }
                        >
                            <Select
                                size="small"
                                showSearch
                                placeholder={"Protocol Options"}
                                value={rState?.value?.name}
                                onChange={(val) => handleChangeRedux("typed_extension_protocol_options", val)}
                                options={
                                    queryData?.map((item: { name: string }) => ({
                                        value: item.name,
                                        label: item.name,
                                    }))
                                }
                            />
                        </Form.Item >
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default ComponentTypedExtensionProtocolOptions;
