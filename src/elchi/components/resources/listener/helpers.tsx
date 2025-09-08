import React from "react";
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ConfDiscovery, ConfigDiscovery } from "@/common/types";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";


interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

export const Row = ({ children, ...props }: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        ...(isDragging ? { position: 'relative', zIndex: 900 } : {}),
    };

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {
                React.Children.map(children, (child) => {
                    if ((child as React.ReactElement).key === 'sort') {
                        return React.cloneElement(child as React.ReactElement, {
                            children: (
                                <MenuOutlined
                                    ref={setActivatorNodeRef}
                                    style={{ touchAction: 'none', cursor: 'move' }}
                                    {...listeners}
                                />
                            ),
                        });
                    }
                    return child;
                })}
        </tr>
    );
};

export function findResourceByParentName(resources: ConfDiscovery[], parentNameFC: string | undefined): ConfDiscovery[] {
    return resources.filter(resource => resource.parent_name.startsWith(parentNameFC || ""));
}

export const deleteMatchedConfigDiscovery = (name: string, configDiscovery: ConfigDiscovery[], version: string, dispatch: any) => {
    configDiscovery?.forEach((value: ConfigDiscovery, index: number) => {
        if (value.parent_name?.startsWith(name)) {
            handleChangeResources({
                version: version,
                type: ActionType.DeleteConfigDiscovery,
                keys: `${index}`,
                resourceType: ResourceType.ConfigDiscovery
            }, dispatch, ResourceAction);
        }
    })
}