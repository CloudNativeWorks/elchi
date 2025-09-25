import { useState } from 'react';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { DragEndEvent } from '@dnd-kit/core';
import { handleChangeResources } from '@/redux/dispatcher';
import { ObjToBase64Per } from '@/utils/typed-config-op';


export const useDragAndDropWithKeys = (initialIds: string[], reduxAction: any) => {
    const dispatch = useDispatch();
    const [ids, setIds] = useState(initialIds);

    const handleDragDrop = (event: DragEndEvent, version: string, resourceKey: string | number, filters: any[]) => {
        const { over, active } = event;
        if (over && typeof active.id === "string" && typeof over.id === "string") {
            const oldIndex = parseInt(active.id.replace(/^\D+/g, ''), 10);
            const newIndex = parseInt(over.id.replace(/^\D+/g, ''), 10);

            if (oldIndex !== newIndex) {
                const updatedItems = moveArrayItemToNewPosition([...filters], oldIndex, newIndex);
                const transformedItems = updatedItems.reduce((acc, item) => {
                    acc[item.value.parent_name] = ObjToBase64Per(item);
                    return acc;
                }, {});

                handleChangeResources({
                    version: version,
                    type: ActionType.Update,
                    keys: resourceKey as string,
                    val: transformedItems,
                    resourceType: ResourceType.Resource,
                }, dispatch, reduxAction);

                setIds(updatedItems.map((val) => `${val.value.name}-${val.value.priority}`));
            }
        }
    };

    return { ids, setIds, handleDragDrop };
};

export function moveArrayItemToNewPosition(arr: any[], oldIndex: number, newIndex: number) {
    const updatedArray = [...arr];
    const [item] = updatedArray.splice(oldIndex, 1);
    updatedArray.splice(newIndex, 0, item);

    const updatedResources = updatedArray.map((resource, index) => ({
        ...resource,
        value: {
            ...resource.value,
            priority: index
        }
    }));

    return updatedResources;
}

export function removeItemAndReorder(arr: any[], removeIndex: number) {
    const updatedArray = [...arr];
    updatedArray.splice(removeIndex, 1);

    const reorderedArray = updatedArray.map((resource, index) => ({
        ...resource,
        value: {
            ...resource.value,
            priority: index
        }
    }));

    return reorderedArray;
}