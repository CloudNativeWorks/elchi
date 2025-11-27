import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_udp_listener_config, modtag_us_udp_listener_config } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import ComponentDownstreamSocketConfig from "./DownstreamSocketConfig/DownstreamSocketConfig";
import ComponentQuicOptions from "./QuicOptions/QuicOptions";
import { ResourceAction } from '@/redux/reducers/slice';

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
        title: string;
        reduxAction: typeof ResourceAction;
    }
};

const ComponentUdpListenerConfig: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_udp_listener_config);

    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <ECard title={veri.title} id={veri.id}>
            <HorizonTags veri={{
                tags: vTags.ulc?.UdpListenerConfig,
                selectedTags: selectedTags || [],
                unsupportedTags: modtag_us_udp_listener_config.UdpListenerConfig || [],
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("downstream_socket_config", selectedTags || [])}
                    Component={ComponentDownstreamSocketConfig}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.downstream_socket_config,
                        keyPrefix: `${veri.keyPrefix}.downstream_socket_config`,
                        id: `${veri.id}_downstream_socket_config`,
                        title: "Downstream Socket Config"
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("quic_options", selectedTags || [])}
                    Component={ComponentQuicOptions}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.quic_options,
                        keyPrefix: `${veri.keyPrefix}.quic_options`,
                        id: `${veri.id}_quic_options`,
                        title: "QUIC Options",
                        reduxAction: veri.reduxAction
                    }}
                />
            </Col>
        </ECard>
    );
};

export default ComponentUdpListenerConfig;
