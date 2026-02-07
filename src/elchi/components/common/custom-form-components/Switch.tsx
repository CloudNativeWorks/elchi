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
        <div 
            style={{ display: 'inline-block' }}
            onMouseEnter={(e) => {
                if (!veri.disabled) {
                    const switchEl = e.currentTarget.querySelector('.ant-switch') as HTMLElement;
                    if (switchEl) {
                        switchEl.style.transform = 'translateY(-1px)';
                        switchEl.style.boxShadow = veri.value
                            ? '0 4px 12px var(--shadow-switch-on-hover)'
                            : '0 4px 12px var(--shadow-switch-off-hover)';
                    }
                }
            }}
            onMouseLeave={(e) => {
                if (!veri.disabled) {
                    const switchEl = e.currentTarget.querySelector('.ant-switch') as HTMLElement;
                    if (switchEl) {
                        switchEl.style.transform = 'translateY(0)';
                        switchEl.style.boxShadow = veri.value
                            ? '0 2px 6px var(--shadow-switch-on)'
                            : '0 2px 6px var(--shadow-switch-off)';
                    }
                }
            }}
        >
            <Switch size="default"
                checkedChildren={
                    <span style={{ 
                        fontSize: 11, 
                        fontWeight: 600,
                        letterSpacing: '0.3px'
                    }}>
                        True
                    </span>
                }
                unCheckedChildren={
                    <span style={{ 
                        fontSize: 11, 
                        fontWeight: 600,
                        letterSpacing: '0.3px'
                    }}>
                        False
                    </span>
                }
                checked={veri.value}
                disabled={veri.disabled}
                onChange={(val) => veri.handleChange(veri.localKeyPrefix, val)}
                style={{
                    minWidth: 60,
                    background: veri.value
                        ? 'var(--gradient-switch-on)'
                        : 'var(--gradient-switch-off)',
                    boxShadow: veri.value
                        ? '0 2px 6px var(--shadow-switch-on)'
                        : '0 2px 6px var(--shadow-switch-off)',
                    border: 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
        </div>
    );
};


export default memorizeComponent(SwitchComponent, compareVeri);