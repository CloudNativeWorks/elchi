import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
        description?: string;
        withForm?: boolean;
    }
};

/**
 * Empty component for Protobuf Empty type fields.
 * These fields don't have any content, they just indicate presence (boolean-like).
 * Displays as a disabled input field with an info icon.
 * Automatically adds empty object {} to Redux when mounted.
 */
const CommonComponentEmpty: React.FC<GeneralProps> = ({ veri }) => {
    const { version, keyPrefix, reduxAction, title, description, withForm = false } = veri;
    const dispatch = useDispatch();

    // Initialize empty object in Redux when component mounts
    useEffect(() => {
        handleChangeResources(
            {
                version,
                type: ActionType.Update,
                keys: keyPrefix,
                val: {},
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );
    }, []);

    const inputElement = (
        <Input
            disabled
            value="(Empty field - no configuration needed)"
            addonAfter={
                <Tooltip title={description || "This field is an empty marker with no configurable properties. Its presence indicates the option is enabled."}>
                    <InfoCircleOutlined style={{ cursor: 'help' }} />
                </Tooltip>
            }
            style={{ marginBottom: withForm ? 0 : 16 }}
        />
    );

    if (withForm) {
        return inputElement;
    }

    return (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
            {title && <div style={{ marginBottom: 4, fontWeight: 500, fontSize: 14 }}>{title}</div>}
            {inputElement}
        </div>
    );
};

export default memorizeComponent(CommonComponentEmpty, compareVeri);
