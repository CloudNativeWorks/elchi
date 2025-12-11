import React, { useState } from 'react';
import { Input, Select, Space, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { SearchFilterProps } from './types';

const { Option } = Select;

/**
 * Search Filter Component
 * Single responsibility: Provide search and filter controls
 */
const SearchFilter: React.FC<SearchFilterProps> = ({
    onSearch,
    onFilter,
    onClear,
    nodeTypes,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState('all');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    const handleFilterChange = (value: string) => {
        setFilterValue(value);
        onFilter(value);
    };

    const handleClear = () => {
        setSearchValue('');
        setFilterValue('all');
        onClear();
    };

    return (
        <Space direction="vertical" size="small" style={{ width: '280px' }}>
            {/* Search Input */}
            <Input
                placeholder="Search nodes..."
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={searchValue}
                onChange={handleSearchChange}
                allowClear
                size="small"
                style={{
                    borderRadius: '8px',
                }}
            />

            {/* Category Filter */}
            <Select
                value={filterValue}
                onChange={handleFilterChange}
                size="small"
                style={{
                    width: '100%',
                    borderRadius: '8px',
                }}
                suffixIcon={<FilterOutlined style={{ color: '#94a3b8' }} />}
            >
                <Option value="all">All Categories</Option>
                {nodeTypes.map((type) => (
                    <Option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Option>
                ))}
            </Select>

            {/* Clear Button */}
            {(searchValue || filterValue !== 'all') && (
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleClear}
                    size="small"
                    block
                    style={{
                        borderRadius: '8px',
                    }}
                >
                    Clear Filters
                </Button>
            )}
        </Space>
    );
};

export default SearchFilter;
