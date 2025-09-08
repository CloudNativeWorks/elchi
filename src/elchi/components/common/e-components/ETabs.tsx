import React from "react";
import { Tabs } from "antd";

interface ETabsProps {
    onChange: any;
    onEdit: any;
    activeKey: string;
    items: {
        key: string;
        label: string;
        forceRender?: boolean;
        children: React.ReactNode;
    }[];
    style?: React.CSSProperties;
    type?: "line" | "card" | "editable-card";
}

export const ETabs: React.FC<ETabsProps> = ({ onChange, onEdit, activeKey, items, style, type = "line" }) => {
    return (
        <Tabs
            onChange={onChange}
            activeKey={activeKey}
            onEdit={type === "editable-card" ? onEdit : undefined}
            type={type}
            style={style}
            items={items}
        />
    );
};