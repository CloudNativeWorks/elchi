import React, { useState, useCallback } from "react";
import { Col, Row } from 'antd';
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@redux/dispatcher";
import { EdsConfigSource } from "@/common/statics/config-source-ads";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType } from "@/utils/tools";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import { debounce } from "lodash";

type GeneralProps = {
    veri: {
        version: string;
        selectedTags: string[];
        reduxStore: any;
    }
};

const EdsClusterConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_endpoints_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=endpoints&type=endpoints&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const handleChangeRedux = (_: string, val: string | boolean | number) => {
        const newEdsConfig = { ...EdsConfigSource };
        newEdsConfig.service_name = val as string;
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: "eds_cluster_config", val: newEdsConfig, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const fieldConfigs: FieldConfigType[] = [
        { tag: "service_name", type: FieldTypes.Select, placeHolder: "(string)", fieldPath: 'service_name', spanNum: 12, values: queryData ? queryData.map((item: { name: string }) => item.name) : [], required: true, onSearch: debouncedSearch },
    ]

    return (
        <ECard title="EDS Cluster Config">
            <Row>
                <Col md={24}>
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={["service_name"]}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={""}
                            version={veri.version}
                        />
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default EdsClusterConfig;
