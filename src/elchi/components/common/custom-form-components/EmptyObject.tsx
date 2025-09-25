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
        <Button 
            type="text"
            disabled
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 8,
                border: '1px solid rgba(156, 163, 175, 0.2)',
                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.05) 0%, rgba(156, 163, 175, 0.08) 100%)',
                position: 'relative',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.6,
                cursor: 'not-allowed',
                padding: 0,
            }}
        >
            <IconBracet 
                className=""
                width="14"
                height="14"
                fill="#9ca3af"
            />
            <div 
                style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #9ca3af, #d1d5db)',
                    boxShadow: '0 1px 2px rgba(156, 163, 175, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.8)'
                }}
            />
        </Button>
    );
};

export default memorizeComponent(EmptyObjectComponent, compareVeri);
