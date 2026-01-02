export interface VictoriaMetricPoint {
    [0]: number;
    [1]: string;
}

export interface VictoriaMetricSeries {
    metric: {
        __name__: string;
        [label: string]: string;
    };
    values: VictoriaMetricPoint[];
}

export interface VictoriaQueryData {
    resultType: "matrix";
    result: VictoriaMetricSeries[];
}

export interface VictoriaQueryStats {
    seriesFetched: string;
    executionTimeMsec: number;
}

export interface VictoriaQueryRangeResponse {
    status: "success" | "error";
    data: VictoriaQueryData;
    stats?: VictoriaQueryStats;
    windowSec?: number;
}
