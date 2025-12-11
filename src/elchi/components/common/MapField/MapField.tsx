import React from "react";
import MapFieldTable from "./MapFieldTable";

export interface ValueComponentProps {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
    }
}

export interface MapFieldProps<T = any> {
    version: string;
    reduxStore: Map<string, T> | Record<string, T> | undefined;
    keyPrefix: string;
    reduxAction: any;
    title: string;
    valueType?: 'string' | 'number' | 'boolean' | 'component';
    ValueComponent?: React.ComponentType<ValueComponentProps>;
    displayMode?: 'table' | 'drawer' | 'tabs';
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    gtype?: string;
    id?: string;
}

const MapField: React.FC<MapFieldProps> = (props) => {
    const { displayMode = 'table' } = props;

    // For now, only table mode is implemented
    // drawer and tabs modes can be added later
    if (displayMode === 'table') {
        return <MapFieldTable {...props} />;
    }

    // TODO: Implement drawer and tabs modes
    return <MapFieldTable {...props} />;
};

// Don't use React.memo for MapField since reduxStore is a mutable object
// and we need to re-render whenever the parent component re-renders to pick up changes
export default MapField;
