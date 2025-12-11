import React, { useEffect } from "react";
import { Typography } from 'antd';
import { useDispatch } from "react-redux";
import ECard from "@/elchi/components/common/ECard";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";

const { Text } = Typography;

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        id: string;
    }
};

const ComponentLocalityWeightedLbConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!veri.reduxStore || Object.keys(veri.reduxStore).length === 0) {
            handleChangeResources({
                version: veri.version,
                type: ActionType.Update,
                keys: veri.keyPrefix,
                val: {},
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
        }
    }, []);

    return (
        <ECard title="Locality Weighted LB Config" id={veri.id}>
            <Text type="secondary">
                This configuration enables locality weighted load balancing. No additional fields are required.
            </Text>
        </ECard>
    );
};

export default ComponentLocalityWeightedLbConfig;
