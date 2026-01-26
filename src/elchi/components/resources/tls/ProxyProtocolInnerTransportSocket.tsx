import React, { useEffect, useState, useCallback } from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj } from "@/utils/typed-config-op";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { handleTransportSocketChange } from "@/utils/typed-config-helpers";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

/**
 * Inner Transport Socket component for ProxyProtocolUpstreamTransport
 * Allows RawBuffer and UpstreamTlsContext as the inner transport socket
 */
const ProxyProtocolInnerTransportSocket: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    // Fetch RawBuffer transport sockets
    const { data: rawBufferData } = useCustomGetQuery({
        queryKey: `custom_raw_buffer_inner_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.raw_buffer.v3.RawBuffer&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    // Fetch UpstreamTlsContext transport sockets
    const { data: upstreamTlsData } = useCustomGetQuery({
        queryKey: `custom_upstream_tls_inner_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    // Combine both transport socket types
    const queryData = [...(rawBufferData || []), ...(upstreamTlsData || [])];

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matchedItem = queryData.find((obj: any) => obj.name === val);

        if (matchedItem) {
            handleTransportSocketChange({
                version: veri.version,
                keyPrefix: veri.keyPrefix,
                selectedItem: matchedItem,
                dispatch
            });
        }
    };

    return (
        <ECard title={"Transport Socket"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: "Transport Socket",
                            value: state?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: "Select Transport Socket",
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 12,
                            required: true,
                            onSearch: debouncedSearch,
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ProxyProtocolInnerTransportSocket, compareVeri);
