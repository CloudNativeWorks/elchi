import React from "react";
import { MenuOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ByteToObjPer } from "@/utils/typed-config-op";

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
                                    style={{ touchAction: 'none', cursor: 'move', color: 'var(--text-tertiary)' }}
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

export function moveArrayItemToNewPosition(arr: any[], oldIndex: number, newIndex: number) {
    const updatedArray = [...arr];
    const [item] = updatedArray.splice(oldIndex, 1);
    updatedArray.splice(newIndex, 0, item);
    return updatedArray;
}

export const actionCheck = (route: any): string => {
    const strAction = route?.action?.$case
    return strAction;
}

export const matchCheck = (route: any) => {
    const match = route?.match;

    if (!match || !match.path_specifier) {
        return <div>No Match Specified</div>;
    }

    const pathSpecifier = match.path_specifier;
    let caseLabel = '';
    let value = '';

    switch (pathSpecifier.$case) {
        case 'prefix':
            caseLabel = 'prefix';
            value = pathSpecifier.prefix || 'N/A';
            break;
        case 'path':
            caseLabel = 'path';
            value = pathSpecifier.path || 'N/A';
            break;
        case 'safe_regex':
            caseLabel = 'safe_regex';
            value = pathSpecifier.safe_regex?.regex || 'N/A';
            break;
        case 'path_separated_prefix':
            caseLabel = 'path_separated_prefix';
            value = pathSpecifier.path_separated_prefix || 'N/A';
            break;
        case 'path_match_policy':
            caseLabel = 'path_match_policy';
            value = ByteToObjPer(pathSpecifier.path_match_policy?.typed_config)?.value?.name || 'N/A';
            break;
        default:
            return <div>Unknown Case</div>;
    }

    return (
        <div>
            <div className="route-match">{caseLabel}</div>
            <div >{value}</div>
        </div>
    );
};
