import { useState } from 'react';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { DragEndEvent } from '@dnd-kit/core';
import { handleChangeResources } from '@/redux/dispatcher';


export const useDragAndDrop = (initialIds: string[], reduxAction: any) => {
    const dispatch = useDispatch();
    const [ids, setIds] = useState(initialIds);

    const handleDragDrop = (event: DragEndEvent, version: string, resourceKey: string | number, configDiscovery: any[], filters: any[]) => {
        const { over, active } = event;
        if (over && typeof active.id === "string" && typeof over.id === "string") {
            const oldIndex = parseInt(active.id.replace('item-', ''), 10);
            const newIndex = parseInt(over.id.replace('item-', ''), 10);

            if (oldIndex !== newIndex) {
                const updatedItems = moveArrayItemToNewPosition([...configDiscovery], oldIndex, newIndex);

                const updatedFilters = updatedItems.map((updatedItem: any) => {
                    return filters.find((filter: any) => filter.name === updatedItem.parent_name);
                }).filter(Boolean);

                handleChangeResources({
                    version: version,
                    type: ActionType.UpdatePriority,
                    keys: '',
                    val: updatedItems,
                    resourceType: ResourceType.ConfigDiscovery,
                }, dispatch, reduxAction);

                handleChangeResources({
                    version: version,
                    type: ActionType.Update,
                    keys: resourceKey as string,
                    val: updatedFilters,
                    resourceType: ResourceType.Resource,
                }, dispatch, reduxAction);

                setIds(updatedItems.map((_, index) => `item-${index}`));
            }
        }
    };

    return { ids, setIds, handleDragDrop };
};

export function moveArrayItemToNewPosition(arr: any[], oldIndex: number, newIndex: number) {
    const updatedArray = [...arr];
    const [item] = updatedArray.splice(oldIndex, 1);
    updatedArray.splice(newIndex, 0, item);
    
    const routerIndex = updatedArray.findIndex(filter => 
        filter.gtype === "envoy.extensions.filters.http.router.v3.Router"
    );
    
    if (routerIndex !== -1 && routerIndex !== updatedArray.length - 1) {
        const routerFilter = updatedArray.splice(routerIndex, 1)[0];
        updatedArray.push(routerFilter);
    }
    
    const updatedResources = updatedArray.map((resource, index) => ({
        ...resource,
        priority: index
    }));
    return updatedResources;
}


