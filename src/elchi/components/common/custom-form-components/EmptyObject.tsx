import React, { useEffect, useRef } from "react";
import { IconBracet } from "@/common/icons";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { Button } from "antd";


type ComponentProps = {
    veri: {
        veri_tags: string[];
        tagPrefix: string | undefined;
        tag: string;
        handleChange: any;
        localKeyPrefix?: string;
    }
};


const EmptyObjectComponent: React.FC<ComponentProps> = ({ veri }) => {
    const prevVeriTags = useRef<string[]>([]);
    const isFirstRender = useRef<{ [key: string]: boolean }>({});
    const finalTag = veri.tagPrefix ? `${veri.tagPrefix}.${veri.tag}` : veri.tag

    useEffect(() => {
        if (!prevVeriTags.current.includes(finalTag) && veri.veri_tags?.includes(finalTag)) {
            isFirstRender.current[finalTag] = false;
        }

        if (!isFirstRender.current[finalTag] && veri.veri_tags?.includes(finalTag)) {
            veri.handleChange(veri.localKeyPrefix, {});
            isFirstRender.current[finalTag] = true;
        }

        prevVeriTags.current = veri.veri_tags || [];
    }, [veri.veri_tags]);


    return (
        <Button className="infos-button" disabled>
            <IconBracet className="" />
            <div className="bang_badge_disable" />
        </Button>
    );
};

export default memorizeComponent(EmptyObjectComponent, compareVeri);
