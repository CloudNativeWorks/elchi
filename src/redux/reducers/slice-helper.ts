import { ActionType, ResourceType } from '@/redux/reducer-helpers/common'


export interface ResourceTypes {
    Resource: any;
    CustomResource: any;
    ConfigDiscovery: any;
    Scenario: any;
}

export interface InitVersions {
    [key: string]: ResourceTypes;
}

export type BasePayload = {
    version: keyof InitVersions;
    type: ActionType;
    resourceType: ResourceType;
};

export type SetPayload = BasePayload & {
    val: any;
};

export type AppendUpdatePayload = BasePayload & {
    keys: string[];
    val: any;
};

export type DeletePayload = BasePayload & {
    keys: string[];
};

export type DeleteConfigDiscoveryPayload = BasePayload & {
    keys: string[];
    parent_name: string;
};

export type AppendWithExtension = BasePayload & {
    keys: string[];
    val: any;
    extension: any;
};

export type CombinedPayload = SetPayload | AppendUpdatePayload | DeletePayload | AppendWithExtension | DeleteConfigDiscoveryPayload;
