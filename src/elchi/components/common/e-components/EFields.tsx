import { Row } from "antd";
import { FieldComponent } from "../FormItems";
import { FieldConfigType, getCondition, getFieldValue, getRange } from "@/utils/tools";


export const EFields: React.FC<{
    fieldConfigs: FieldConfigType[];
    selectedTags: string[];
    handleChangeRedux: any;
    reduxStore: any;
    keyPrefix: string;
    version: string;
    tagPrefix?: string;
    alwaysShow?: boolean;
    drawerIndex?: number;
}> = ({ fieldConfigs, selectedTags, handleChangeRedux, reduxStore, keyPrefix, version, tagPrefix, alwaysShow, drawerIndex }) => {
    return (
        <Row gutter={[5, 1]}>
            {fieldConfigs.map((config) => (
                <FieldComponent key={config.tag}
                    veri={{
                        selectedTags,
                        handleChange: handleChangeRedux,
                        tag: config.tag,
                        value: getFieldValue(reduxStore, config, version),
                        type: config.type,
                        placeholder: config.placeHolder,
                        values: config.values,
                        tagPrefix: tagPrefix || config.tagPrefix,
                        keyPrefix: keyPrefix,
                        spanNum: config.spanNum,
                        required: config.required,
                        disabled: config.disabled,
                        additionalTags: config.additionalTags,
                        range: getRange(reduxStore, config),
                        condition: getCondition(reduxStore, config),
                        drawerShow: drawerIndex != null ? () => config.drawerShow(drawerIndex) : () => config.drawerShow(),
                        alwaysShow: alwaysShow,
                        hidden: config.hidden,
                        onSearch: config.onSearch
                    }}
                />
            ))}
        </Row>
    );
};