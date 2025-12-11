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
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        tagMatchPrefix: string;
        tagPrefix: string;
        unsupportedTags: string[];
    }
};

const ComponentSessionTicketKeysSdsConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);
    
    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_secrets_session_ticket_keys_sds_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=secrets&gtype=envoy.extensions.transport_sockets.tls.v3.TlsSessionTicketKeys&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const handleChangeRedux = (_: string, val: string | boolean | number) => {
        const sds_config = { name: val, sds_config: { ads: {}, initial_fetch_timeout: "15s", resource_api_version: "V3" } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: sds_config, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={"Session Ticket Keys Sds Secret Config"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: 'Name',
                            value: navigateCases(veri.reduxStore, 'session_ticket_keys_sds_secret_config.name'),
                            type: FieldTypes.Select,
                            placeholder: "(Session Ticket Keys)",
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 8,
                            onSearch: debouncedSearch,
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentSessionTicketKeysSdsConfig, compareVeri);
