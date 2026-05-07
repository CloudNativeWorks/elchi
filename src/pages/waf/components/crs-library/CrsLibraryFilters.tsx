import React from 'react';
import { Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CrsLibraryData, CrsLibraryState } from './useCrsLibrary';

interface CrsLibraryFiltersProps {
    state: CrsLibraryState;
    data: CrsLibraryData;
}

/**
 * Sticky compact filter bar. One line on desktop, wraps on narrow screens.
 */
const CrsLibraryFilters: React.FC<CrsLibraryFiltersProps> = ({ state, data }) => (
    <div
        style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: 'var(--card-bg)',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
        }}
    >
        <Input
            value={state.search}
            onChange={(e) => state.setSearch(e.target.value)}
            placeholder="Search by ID, title, description, file…"
            prefix={<SearchOutlined />}
            allowClear
            size="middle"
            style={{ flex: '1 1 260px', minWidth: 220 }}
        />

        <Select
            value={state.crsVersion}
            onChange={state.setCrsVersion}
            options={data.versions.map((v) => ({ label: `CRS ${v.crs_version}`, value: v.crs_version }))}
            style={{ width: 130 }}
            size="middle"
        />

        <Select
            value={state.severity}
            onChange={state.setSeverity}
            placeholder="Severity"
            allowClear
            options={data.availableSeverities}
            style={{ width: 140 }}
            size="middle"
        />

        <Select
            value={state.phase}
            onChange={state.setPhase}
            placeholder="Phase"
            allowClear
            options={data.availablePhases}
            style={{ width: 200 }}
            size="middle"
        />

        <Select
            value={state.paranoia}
            onChange={state.setParanoia}
            placeholder="Paranoia"
            allowClear
            options={data.availableParanoiaLevels}
            style={{ width: 130 }}
            size="middle"
        />

        <Select
            mode="multiple"
            value={state.tags}
            onChange={state.setTags}
            placeholder="Tags"
            options={data.availableTags}
            maxTagCount="responsive"
            style={{ flex: '1 1 220px', minWidth: 180 }}
            size="middle"
        />
    </div>
);

export default CrsLibraryFilters;
