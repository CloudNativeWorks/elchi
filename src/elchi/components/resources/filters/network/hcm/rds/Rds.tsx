import React, { useState, useCallback } from "react";
import { Col, Row } from 'antd';
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { RdsConfigSource } from "@/common/statics/config-source-ads";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const ComponentRds: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);
    
    const { data: queryData } = useCustomGetQuery({
        queryKey: `listRoutes_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=routes&type=routes&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const handleUpdateRedux = (_: string, val: string | boolean | number) => {
        const rds = { ...RdsConfigSource };
        rds.route_config_name = val as string;
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: rds, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title="RDS">
            <Row>
                <Col md={24}>
                    <EForm>
                        <FieldComponent veri={{
                            selectedTags: [],
                            keyPrefix: `${veri.keyPrefix}`,
                            handleChange: handleUpdateRedux,
                            tag: "route_config_name",
                            value: veri.reduxStore?.route_config_name,
                            values: queryData ? queryData.map((item: { name: string }) => item.name) : [],
                            type: FieldTypes.Select,
                            placeholder: "(routes)",
                            spanNum: 8,
                            alwaysShow: true,
                            required: true,
                            onSearch: debouncedSearch,
                        }}
                        />
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(ComponentRds, compareVeri);