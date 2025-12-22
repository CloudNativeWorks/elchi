import React, { useEffect, useState, useCallback } from "react";
import { Col, Form, Row, Select } from 'antd';
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@redux/dispatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "../../common/ECard";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { EForm } from "../../common/e-components/EForm";
import { debounce } from "lodash";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        id: string;
    }
};

const ClusterDiscoveryType: React.FC<GeneralProps> = ({ veri }) => {
    const { version, reduxStore, id } = veri;
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const [rState, setRState] = useState<any>();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_clusters_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&version=${version}&project=${project}&category=envoy.clusters&search=${searchQuery}`
    });



    useEffect(() => {
        if (reduxStore) {
            setRState(ByteToObj(reduxStore));
        }
    }, [reduxStore]);

    const handleChangeRedux = (key: string, val: string) => {
        const matched = queryData?.find((obj: any) => obj.name === val);

        if (matched) {
            const typedConfig = {
                name: matched.canonical_name,
                typed_config: {
                    type_url: matched.gtype,
                    value: matched
                }
            };

            handleChangeResources(
                {
                    version: version,
                    type: ActionType.Update,
                    keys: key,
                    val: ObjToBase64(typedConfig),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched cluster not found for the given value:", val);
        }
    };

    return (
        <ECard title="Cluster Discovery Type" id={id}>
            <Row>
                <Col md={24}>
                    <EForm>
                        <Form.Item
                            style={{ width: "35%", zIndex: 900 }}
                            label={
                                <div className="smoothAnimation" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {"Cluster Type"}
                                </div>
                            }
                        >
                            <Select
                                size="small"
                                showSearch
                                placeholder={"Select Cluster Type"}
                                value={rState?.typed_config?.value?.name}
                                onChange={(val) => handleChangeRedux("cluster_type", val)}
                                onSearch={debouncedSearch}
                                filterOption={false}
                                options={
                                    queryData?.map((item: { name: string }) => ({
                                        value: item.name,
                                        label: item.name,
                                    }))
                                }
                            />
                        </Form.Item>
                    </EForm>
                </Col>
            </Row>
        </ECard>
    );
};

export default ClusterDiscoveryType;
