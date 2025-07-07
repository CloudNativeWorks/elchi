import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { ObjToBase64, ObjToBase64Per } from "@/utils/typed-config-op";
import { generateUniqueId } from "@/utils/tools";

export interface TypedConfigChangeOptions {
    version: string;
    keyPrefix: string;
    selectedItem: any;
    customName?: string;
    customKeys?: string;
    isPerConfig?: boolean; // ObjToBase64Per kullanımı için
    dispatch: any;
}

export interface FilterAddOptions {
    version: string;
    keyPrefix: string;
    selectedItem: any;
    fcName: string;
    dispatch: any;
}

/**
 * Typed config değişikliği için ortak handler
 */
export const handleTypedConfigChange = (options: TypedConfigChangeOptions) => {
    const { version, keyPrefix, selectedItem, customName, customKeys, isPerConfig = false, dispatch } = options;

    if (!selectedItem) {
        console.error("Seçilen item bulunamadı");
        return;
    }

    const keys = customKeys || keyPrefix;
    let processedValue;

    if (isPerConfig) {
        // Per-config yapısı (örn: TypedExtensionProtocolOptions)
        const perConfig = {
            type_url: selectedItem.gtype,
            value: selectedItem
        };
        processedValue = { [selectedItem.gtype]: ObjToBase64Per(perConfig) };
    } else {
        // Normal typed_config yapısı
        const typedConfig = {
            name: customName || selectedItem.category,
            typed_config: {
                type_url: selectedItem.gtype,
                value: selectedItem
            }
        };
        processedValue = ObjToBase64(typedConfig);
    }

    handleChangeResources({
        version,
        type: ActionType.Update,
        keys,
        val: processedValue,
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};

/**
 * Transport Socket için özel handler
 */
export const handleTransportSocketChange = (options: TypedConfigChangeOptions) => {
    const { version, keyPrefix, selectedItem, dispatch } = options;

    if (!selectedItem) {
        console.error("Seçilen TLS bulunamadı");
        return;
    }

    const transportSocket = {
        name: selectedItem.category,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    handleChangeResources({
        version,
        type: ActionType.Update,
        keys: keyPrefix,
        val: ObjToBase64(transportSocket),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};

/**
 * Filter ekleme için ortak handler
 */
export const handleFilterAdd = (options: FilterAddOptions) => {
    const { version, keyPrefix, selectedItem, fcName, dispatch } = options;

    if (!selectedItem) {
        console.error("Filter not found");
        return;
    }

    const fullFilterName = `${fcName}-filter${generateUniqueId(6)}`;
    // Typed config yapısı
    const typedConfig = {
        name: fullFilterName,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    // Önce filter'ı ekle
    handleChangeResources({
        version,
        type: ActionType.Append,
        keys: keyPrefix,
        val: ObjToBase64(typedConfig),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};

/**
 * Access Log ekleme için ortak handler  
 */
export const handleAccessLogChange = (options: TypedConfigChangeOptions) => {
    const { version, keyPrefix, selectedItem, dispatch } = options;

    if (!selectedItem) {
        console.error("Seçilen access log bulunamadı");
        return;
    }

    const accesslog = {
        name: selectedItem.category,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    handleChangeResources({
        version,
        type: ActionType.Update,
        keys: keyPrefix,
        val: ObjToBase64(accesslog),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
};

/**
 * Stats Sink ekleme için ortak handler
 */
export const handleStatsSinkChange = (options: TypedConfigChangeOptions) => {
    const { version, keyPrefix, selectedItem, dispatch } = options;

    if (!selectedItem) {
        console.error("Seçilen stats sink bulunamadı");
        return;
    }

    const stats_sink = {
        name: selectedItem.category,
        typed_config: {
            type_url: selectedItem.gtype,
            value: selectedItem
        }
    };

    handleChangeResources({
        version,
        type: ActionType.Update,
        keys: keyPrefix,
        val: ObjToBase64(stats_sink),
        resourceType: ResourceType.Resource
    }, dispatch, ResourceAction);
}; 