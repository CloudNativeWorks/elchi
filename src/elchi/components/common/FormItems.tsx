import React from "react";
import { Button, Col, Form, Input, InputNumber, Select, Space } from 'antd';
import { IconBracet } from "@/common/icons";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import SwitchComponent from "./custom-form-components/Switch";
import EmptyObjectComponent from './custom-form-components/EmptyObject';
import { prettyTag } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import ComponentJson from "./custom-form-components/ComponentJson";
import ComponentLua from "./custom-form-components/ComponentLua";
import 'react18-json-view/src/style.css'

const { TextArea } = Input;

type RenderFormItemProps = {
    veri: {
        selectedTags: string[];
        tag: string;
        type: FieldTypes;
        placeholder?: string;
        values?: string[];
        value?: any;
        handleChange: any;
        spanNum?: number;
        keyPrefix?: string;
        condition?: any;
        drawerShow?: any;
        tagPrefix?: string;
        alwaysShow?: boolean;
        disabled?: boolean;
        additionalTags?: string[];
        range?: { start: number, end: number };
        required?: boolean;
        displayName?: string;
        hidden?: boolean;
    }
}

const safe_regex = {
    google_re2: {},
    regex: ""
}

const FormItem = ({ veri }: RenderFormItemProps) => {
    let component: JSX.Element | null
    const localKeyprefix = veri.keyPrefix ? `${veri.keyPrefix}.${veri.tag}` : veri.tag

    const changeSafeRegex = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSafeRegex = { ...safe_regex };
        newSafeRegex.regex = e.target.value
        veri.handleChange(localKeyprefix, newSafeRegex)
    }

    const handleJsonChange = (edit) => {
        veri.handleChange(localKeyprefix, edit)
    }

    switch (veri.type) {
        case FieldTypes.String:
            component =
                veri.hidden ?
                    <Input
                        value={"Managed by Service"}
                        placeholder={veri.placeholder}
                        disabled={true}
                    />
                    :
                    <Input
                        value={veri.value as string}
                        placeholder={veri.placeholder}
                        disabled={veri.disabled}
                        onChange={(e) => veri.handleChange(localKeyprefix, e.target.value)}
                    />
            break;
        case FieldTypes.InputArea:
            component =
                <TextArea
                    rows={10}
                    value={veri.value as string}
                    placeholder={veri.placeholder}
                    onChange={(e) => veri.handleChange(localKeyprefix, e.target.value)}
                />
            break;
        case FieldTypes.Number:
            component =
                <InputNumber
                    min={0}
                    max={4294967295}
                    style={{ width: "100%" }}
                    type="number"
                    value={veri.value as number}
                    placeholder={veri.placeholder}
                    disabled={veri.disabled}
                    onChange={(val) => veri.handleChange(localKeyprefix, val)}
                />
            break;
        case FieldTypes.Boolean:
            component =
                <SwitchComponent veri={{
                    veri_tags: veri.selectedTags,
                    tagPrefix: veri.tagPrefix,
                    tag: veri.tag,
                    value: veri.value as boolean,
                    handleChange: veri.handleChange,
                    localKeyPrefix: localKeyprefix,
                    disabled: veri.disabled,
                }}
                />;
            break;
        case FieldTypes.Select:
            component =
                <Select
                    size="small"
                    showSearch
                    placeholder={veri.placeholder}
                    value={veri.value as string}
                    disabled={veri.disabled}
                    onChange={(val) => veri.handleChange(localKeyprefix, val)}
                    options={
                        (veri.values)?.map((option) => ({
                            value: option,
                            label: option,
                        }))
                    }
                />
            break;
        case FieldTypes.SelectWithGtype:
            component =
                <Select
                    size="small"
                    showSearch
                    style={{ width: '100%' }}
                    disabled={veri.disabled}
                    onChange={(val) => veri.handleChange(localKeyprefix, val)}
                    placeholder={veri.placeholder}
                    optionLabelProp="label"
                    value={veri.value as string}
                >
                    {veri.values?.map((filter: any) => (
                        <Select.Option key={filter.name} value={filter.name} label={filter.name}>
                            <div>
                                <span>{filter.name}</span>
                                <br />
                                <small style={{ color: '#888' }}>{filter.gtype}</small>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            break;
        case FieldTypes.Tags:
            component =
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder={veri.placeholder}
                    value={veri.value}
                    onChange={(val) => veri.handleChange(localKeyprefix, val)}
                    options={
                        (veri.values)?.map((option) => ({
                            value: option,
                            label: option,
                        }))
                    }
                />
            break;
        case FieldTypes.Duration:
            component =
                <InputNumber
                    min={0}
                    max={4294967295}
                    style={{ width: "100%" }}
                    type="number"
                    suffix="second"
                    value={veri.value as number}
                    placeholder={veri.placeholder}
                    disabled={veri.disabled}
                    onChange={(val) => veri.handleChange(localKeyprefix, `${val?.toString()}s`)}
                />
            break;
        case FieldTypes.Regex:
            component =
                <Input
                    value={veri.value as string}
                    placeholder={veri.placeholder}
                    onChange={(e) => changeSafeRegex(e)}
                />
            break;
        case FieldTypes.Range:
            component =
                <Space>
                    <InputNumber
                        addonBefore="Start"
                        min={0}
                        max={4294967295}
                        style={{ width: "100%" }}
                        type="number"
                        value={veri.range?.start}
                        placeholder="number"
                        onChange={(val) => veri.handleChange(`${localKeyprefix}.start`, val)}
                    />
                    <InputNumber
                        addonBefore="End"
                        min={0}
                        max={4294967295}
                        style={{ width: "100%" }}
                        type="number"
                        value={veri.range?.end}
                        placeholder="number"
                        onChange={(val) => veri.handleChange(`${localKeyprefix}.end`, val)}
                    />
                </Space>
            break;
        case FieldTypes.ArrayIcon:
            component =
                <Button className="infos-button" onClick={veri.drawerShow}>
                    <IconBracet className="bang_Icon" />
                    {veri.condition && <div className="bang_badge" />}
                </Button>
            break;
        case FieldTypes.TagsNum:
            component =
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder={veri.placeholder}
                    value={veri.value}
                    onChange={(val) => veri.handleChange(localKeyprefix, (val as string[]).map(Number))}
                    options={
                        (veri.values).map((option) => ({
                            value: option,
                            label: option,
                        }))
                    }
                />
            break;
        case FieldTypes.EmptyObject:
            component =
                <EmptyObjectComponent veri={{
                    veri_tags: veri.selectedTags,
                    tagPrefix: veri.tagPrefix,
                    tag: veri.tag,
                    handleChange: veri.handleChange,
                    localKeyPrefix: localKeyprefix,
                }}
                />;
            break;
        case FieldTypes.JSON:
            component = <ComponentJson
                value={veri.value || {}}
                onChange={handleJsonChange}
            />
            break
        case FieldTypes.Lua:
            component = <ComponentLua
                value={veri.value || ""}
                onChange={handleJsonChange}
            />
            break
        default:
            component = null;
    }

    if (veri.selectedTags?.some(item => item === veri.tag) ||
        veri.selectedTags?.some(item => item === `${veri.tagPrefix}.${veri.tag}`) ||
        (veri.selectedTags?.some(item => item.startsWith(`${veri.tagPrefix}.${veri.tag}`)) && veri.type === FieldTypes.ArrayIcon) ||
        veri.selectedTags?.some(item => veri.additionalTags?.some(addTag => item.includes(addTag))) || veri.alwaysShow) {
        return (
            <Col span={veri.spanNum || 6}>
                <Form.Item
                    required={veri.required}
                    style={{ display: "inline-block", width: "100%", zIndex: 900 }}
                    label={
                        <div className="smoothAnimation" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                        }>
                            {veri.displayName ? veri.displayName : prettyTag(veri.tag)}
                        </div>
                    }
                >
                    {component}
                </Form.Item >
            </Col>
        );
    }
    return null;
};

export const FieldComponent = memorizeComponent(FormItem, compareVeri);
