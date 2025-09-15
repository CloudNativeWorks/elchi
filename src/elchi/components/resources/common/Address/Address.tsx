import React from "react";
import { Divider } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_address } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import CommonComponentSocketAddress from "./socket_address"
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any
        keyPrefix: string;
        tagPrefix: string;
        unsupportedAddressTag: string[];
        unsupportedSocketAddressTag: string[];
        managed?: boolean;
        bootstrap?: boolean;
    }
};

const CommonComponentAddress: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_address);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.a?.Address,
                selectedTags: selectedTags,
                unsupportedTags: veri.unsupportedAddressTag,
                handleChangeTag: handleChangeTag,
                keyPrefix: `${veri.keyPrefix}`,
                tagPrefix: `address`,
                required: ['socket_address'],
                doNotChange: veri.managed ? ["address.socket_address"] : []
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <ConditionalComponent
                shouldRender={startsWithAny("address.socket_address", selectedTags)}
                Component={CommonComponentSocketAddress}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.address?.socket_address,
                    keyPrefix: `${veri.keyPrefix}.socket_address`,
                    unsupportedAddressTag: veri.unsupportedAddressTag,
                    unsupportedSocketAddressTag: veri.unsupportedSocketAddressTag,
                    id: `address.socket_address_0`,
                    managed: veri.managed,
                    bootstrap: veri.bootstrap
                }}
            />
        </>
    )
};

export default memorizeComponent(CommonComponentAddress, compareVeri);
