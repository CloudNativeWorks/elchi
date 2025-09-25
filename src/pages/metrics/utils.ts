import { TimeRangeState } from "./types";


// TimeRange helper functions
export const createTimeRange = (startTime: number, endTime: number): TimeRangeState => ({
    startTime,
    endTime,
    id: `tr_${startTime}_${endTime}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
});

export const calculateDefaultTimeRange = (): TimeRangeState => {
    const currentUnixTime = getCurrentUnixTime();
    const thirtyMinutesAgo = currentUnixTime - (30 * 60);
    return createTimeRange(thirtyMinutesAgo, currentUnixTime);
};

const getCurrentUnixTime = () => Math.floor(Date.now() / 1000);


export const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const isNegative = bytes < 0;
    const absoluteBytes = Math.abs(bytes);

    if (absoluteBytes < 1) {
        return `${(isNegative ? '-' : '')}${(absoluteBytes * 1000).toFixed(2)} mB`;
    }

    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
    const i = Math.floor(Math.log(absoluteBytes) / Math.log(k));

    const value = absoluteBytes / Math.pow(k, i);
    const formattedValue = parseFloat(value.toFixed(2));

    return `${(isNegative ? '-' : '')}${formattedValue} ${sizes[i]}`;
};

export const formatDuration = (value: number, inputUnit: string = 'ms', units: string[] = ['ms', 's', 'm']): string => {
    if (value === 0) return '0 ' + units[0];

    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);

    let valueInMs = absoluteValue;
    if (inputUnit === 's') {
        valueInMs = absoluteValue * 1000;
    } else if (inputUnit === 'm') {
        valueInMs = absoluteValue * 60 * 1000;
    }

    if (valueInMs < 1000 || units.length === 1) {
        return `${(isNegative ? '-' : '')}${valueInMs.toFixed(2)} ms`;
    } else if (valueInMs < 60000 || units.length === 2) {
        return `${(isNegative ? '-' : '')}${(valueInMs / 1000).toFixed(2)} s`;
    } else {
        return `${(isNegative ? '-' : '')}${(valueInMs / (60 * 1000)).toFixed(2)} m`;
    }
};