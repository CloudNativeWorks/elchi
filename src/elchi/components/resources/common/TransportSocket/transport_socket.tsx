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
        tagMatchPrefix: string;
        gtype: string;
        prettyName: string;
        direction: 'upstream' | 'downstream'; // Controls which transport sockets to show
    }
};

const CommonComponentTransportSocket: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()
    const { project } = useProjectVariable();
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    // Determine direction-based gtypes
    const isDownstream = veri.direction === 'downstream';

    // Main TLS context query
    const { data: tlsData } = useCustomGetQuery({
        queryKey: `custom_tls_${veri.gtype}_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=tls&gtype=${veri.gtype}&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    // QUIC transport (downstream only for now)
    const { data: quicDownstreamData } = useCustomGetQuery({
        queryKey: `custom_quic_downstream_${searchQuery}`,
        enabled: isDownstream,
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.quic.v3.QuicDownstreamTransport&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    // Additional upstream transport sockets
    const { data: quicUpstreamData } = useCustomGetQuery({
        queryKey: `custom_quic_upstream_${searchQuery}`,
        enabled: !isDownstream,
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.quic.v3.QuicUpstreamTransport&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const { data: proxyProtocolData } = useCustomGetQuery({
        queryKey: `custom_proxy_protocol_${searchQuery}`,
        enabled: !isDownstream,
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.proxy_protocol.v3.ProxyProtocolUpstreamTransport&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const { data: rawBufferData } = useCustomGetQuery({
        queryKey: `custom_raw_buffer_${searchQuery}`,
        enabled: true, // Raw buffer can be used for both directions
        path: `custom/resource_list_search?collection=tls&gtype=envoy.extensions.transport_sockets.raw_buffer.v3.RawBuffer&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    // Combine data based on direction
    const queryData = [
        ...(tlsData || []),
        ...(isDownstream ? (quicDownstreamData || []) : []),
        ...(!isDownstream ? (quicUpstreamData || []) : []),
        ...(!isDownstream ? (proxyProtocolData || []) : []),
        ...(rawBufferData || []),
    ];

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matchedTLS = queryData.find((obj: any) => obj.name === val);
        
        if (matchedTLS) {
            handleTransportSocketChange({
                version: veri.version,
                keyPrefix: veri.keyPrefix,
                selectedItem: matchedTLS,
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
                            tag: `${veri.prettyName} TLS`,
                            value: state?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: `(${veri.prettyName}TLS)`,
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

export default memorizeComponent(CommonComponentTransportSocket, compareVeri);
