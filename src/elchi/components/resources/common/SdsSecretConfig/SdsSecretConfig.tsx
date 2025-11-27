import React, { useState, useCallback } from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        title: string;
    }
};

const CommonComponentSdsSecretConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_secrets_generic_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=secrets&gtype=envoy.extensions.transport_sockets.tls.v3.GenericSecret&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const handleChangeRedux = (_: string, val: string | boolean | number) => {
        const sds_config = {
            name: val,
            sds_config: {
                ads: {},
                initial_fetch_timeout: "15s",
                resource_api_version: "V3"
            }
        };
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: veri.keyPrefix,
            val: sds_config,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    return (
        <ECard title={veri.title}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: 'name',
                            value: navigateCases(veri.reduxStore, 'name'),
                            type: FieldTypes.Select,
                            placeholder: "(Secret)",
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 12,
                            onSearch: debouncedSearch,
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentSdsSecretConfig, compareVeri);
