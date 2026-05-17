// Shared helpers for server-side sorted tables in the API Discovery
// dashboards. The backend `/inventory/*` endpoints accept `sort_by` +
// `sort_order` (asc|desc) with a per-endpoint field whitelist; antd's
// Table speaks `ascend|descend`, so we translate at the boundary.

import type { SorterResult } from 'antd/es/table/interface';

export type SortOrder = 'asc' | 'desc';

export interface SortState<F extends string = string> {
    sort_by: F;
    sort_order: SortOrder;
}

// antd's onChange sorter (single or multi) → our {sort_by, sort_order}.
// When the user clears the sort (order undefined) we fall back to the
// endpoint's default so the table never ends up unsorted.
export const antdToSort = <F extends string>(
    sorter: SorterResult<any> | SorterResult<any>[],
    fallback: SortState<F>,
): SortState<F> => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = String(s?.columnKey ?? s?.field ?? '');
    if (!s?.order || !field) return fallback;
    return {
        sort_by: field as F,
        sort_order: s.order === 'ascend' ? 'asc' : 'desc',
    };
};

// Our sort state → the `sortOrder` prop value for one column.
export const columnSortOrder = (
    state: SortState,
    columnKey: string,
): 'ascend' | 'descend' | undefined =>
    state.sort_by === columnKey
        ? state.sort_order === 'asc'
            ? 'ascend'
            : 'descend'
        : undefined;
