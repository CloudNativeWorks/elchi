import React, { useEffect, useRef } from "react";
import { Switch } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";


type ComponentProps = {
    veri: {
        veri_tags: string[];
        tagPrefix: string | undefined;
        tag: string;
        value: boolean;
        handleChange: any;
        localKeyPrefix?: string;
        disabled?: boolean;
    }
};

function isKeyInReduxAndNotChanged(value: any) {
    return value !== undefined
}

const SwitchComponent: React.FC<ComponentProps> = ({ veri }) => {
    const prevVeriTags = useRef<string[]>([]);
    const isFirstRender = useRef<{ [key: string]: boolean }>({});
    const finalTag = veri.tagPrefix ? `${veri.tagPrefix}.${veri.tag}` : veri.tag

    useEffect(() => {
        if (!prevVeriTags.current.includes(finalTag) && veri.veri_tags?.includes(finalTag)) {
            isFirstRender.current[finalTag] = false;
        }

        if (!isFirstRender.current[finalTag] && veri.veri_tags?.includes(finalTag)) {
            if (!isKeyInReduxAndNotChanged(veri.value)) {
                veri.handleChange(veri.localKeyPrefix, veri.value || false);
            }
            isFirstRender.current[finalTag] = true;
        }

        prevVeriTags.current = veri.veri_tags || [];
    }, [veri.veri_tags]);


    return (
        <Switch
            checkedChildren="True"
            unCheckedChildren="False"
            checked={veri.value}
            disabled={veri.disabled}
            onChange={(val) => veri.handleChange(veri.localKeyPrefix, val)}
        />
    );
};


export default memorizeComponent(SwitchComponent, compareVeri);