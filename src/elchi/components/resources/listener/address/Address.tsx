import React from "react";
import { useDispatch } from "react-redux";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentAddress from '@resources/common/Address/Address'
import { useModels } from "@/hooks/useModels";
import { modtag_address } from "./_modtag_";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { modtag_us_listener } from "../_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any,
        keyPrefix: string,
        tagMatchPrefix: string,
        managed?: boolean,
    }
};

const AddressComponent: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_address);

    const handleChangeRedux = (keys: string, val: any) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <CCard reduxStore={veri.reduxStore} keys={veri.keyPrefix} Paste={handleChangeRedux} toJSON={vModels.adr?.Address.toJSON} ctype="address" title="Address">
            <ConditionalComponent
                shouldRender={true}
                Component={CommonComponentAddress}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore,
                    keyPrefix: `${veri.keyPrefix}`,
                    tagPrefix: `address`,
                    unsupportedAddressTag: modtag_us_listener["address"],
                    unsupportedSocketAddressTag: modtag_us_listener["socket_address"],
                    id: `address_0`,
                    managed: veri.managed
                }}
            />
        </CCard>
    )
};

export default AddressComponent;
