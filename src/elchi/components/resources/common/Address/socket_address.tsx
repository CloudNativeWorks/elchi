import React from "react";
import { Col, Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { FieldConfigType } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_socket_address } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any
        keyPrefix: string;
        unsupportedAddressTag: string[];
        unsupportedSocketAddressTag: string[];
        managed?: boolean;
        bootstrap?: boolean;
    }
};

const CommonComponentSocketAddress: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_socket_address);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.sa?.SocketAddress,
            sf: vTags.sa?.SocketAddress_SingleFields,
            r: ["address", "protocol", "port_specifier.port_value", "port_specifier.named_port"],
            h: veri.managed && ["address"],
            d: veri.managed ? veri.bootstrap ? ["address", "port_specifier.port_value"] : ["address"] : []
        }),
    ]

    return (
        <ECard title="Socket Address">
            <HorizonTags veri={{
                tags: vTags.sa?.SocketAddress,
                selectedTags: selectedTags,
                unsupportedTags: veri.unsupportedSocketAddressTag,
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                specificTagPrefix: { "port_value": "port_specifier", "named_port": "port_specifier" },
                required: ['address', 'port_value', 'named_port'],
                onlyOneTag: [['port_specifier.port_value', 'port_specifier.named_port']],
                doNotChange: veri.managed
                    ? veri.bootstrap
                        ? ["address", "port_specifier.port_value"]
                        : ["address"]
                    : []
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentSocketAddress, compareVeri);
