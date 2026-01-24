import React, { useEffect, useState, useCallback } from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";
import ECard from "@/elchi/components/common/ECard";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction?: any;
    }
};

const CommonComponentTypedDnsResolverConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>();
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_dns_resolver_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&category=envoy.network.dns_resolver&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore));
        }
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matchedResolver = queryData?.find((obj: any) => obj.name === val);

        if (matchedResolver) {
            const typedDnsResolver = {
                name: matchedResolver.canonical_name || matchedResolver.category,
                typed_config: {
                    type_url: matchedResolver.gtype,
                    value: matchedResolver
                }
            };

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: veri.keyPrefix,
                    val: ObjToBase64(typedDnsResolver),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                veri.reduxAction || ResourceAction
            );
        } else {
            console.error("Matched DNS resolver not found for the given value:", val);
        }
    };

    return (
        <ECard title="Typed DNS Resolver Config">
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: `dns_resolver_type`,
                            value: rState?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: "(Select DNS Resolver)",
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 24,
                            required: true,
                            displayName: "DNS Resolver",
                            onSearch: debouncedSearch,
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    );
};

export default memorizeComponent(CommonComponentTypedDnsResolverConfig, compareVeri);
