import React from "react";
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export const getRouteSpecifier = (hcm: any): any => {
    if (hcm?.route_specifier?.['$case'] === 'rds') {
        return hcm?.route_specifier?.rds
    } else if (hcm?.route_specifier?.['$case'] === 'route_config') {
        return hcm?.route_specifier?.route_config
    }
    return undefined
};


interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

export const SortableRow = ({ children, ...props }: RowProps) => {
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
