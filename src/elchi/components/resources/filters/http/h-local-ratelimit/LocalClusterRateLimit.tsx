import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import ECard from "@/elchi/components/common/ECard";
import { ResourceAction } from "@/redux/reducers/slice";


type GeneralProps = {
    veri: {
        version: string;
        title: string;
        keyPrefix: string;
    }
};

const ComponentLocalClusterRateLimit: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: {}, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    }, []);


    return (
        <ECard title={veri.title}>
            There are no fields in this option. Just activated.
        </ECard>
    )
};

export default ComponentLocalClusterRateLimit;
