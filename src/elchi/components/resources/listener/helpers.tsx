import { ConfigDiscovery } from "@/common/types";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";

export const deleteMatchedConfigDiscovery = (name: string, configDiscovery: ConfigDiscovery[], version: string, dispatch: any) => {
    configDiscovery?.forEach((value: ConfigDiscovery, index: number) => {
        if (value.parent_name?.startsWith(name)) {
            handleChangeResources({
                version: version,
                type: ActionType.DeleteConfigDiscovery,
                keys: `${index}`,
                resourceType: ResourceType.ConfigDiscovery
            }, dispatch, ResourceAction);
        }
    })
}