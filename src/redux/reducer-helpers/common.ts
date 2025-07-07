/* eslint-disable */
export enum ActionType {
    Set = 'set',
    Append = 'append',
    AppendFilter = 'appendfilter',
    Update = 'update',
    Delete = 'delete',
    DeleteConfigDiscovery = 'deleteconfigdiscovery',
    UpdatePriority = 'updatepriority',
    // DeleteNested = 'deletenested',
    DeleteFromList = 'deletefromlist',
    UpdateMain = 'updatemain'
}

export enum ResourceType {
    ConfigDiscovery = 'ConfigDiscovery',
    Resource = 'Resource',
    CustomResource = 'CustomResource',
    Scenario = 'Scenario'
}



// VERSIONS nesnesini dinamik olarak oluşturun
export const VERSIONS = window.APP_CONFIG.AVAILABLE_VERSIONS.reduce((versions, version) => {
    versions[version] = {};
    return versions;
}, {} as Record<string, {}>);
