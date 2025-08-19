import React, { useState } from 'react';
import { Input, Select, Card, Space } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;

interface SearchFilterProps {
    onSearch: (searchTerm: string) => void;
    onFilter: (filterType: string) => void;
    onClear: () => void;
    nodeTypes: string[];
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
    onSearch, 
    onFilter, 
    onClear, 
    nodeTypes 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilter = (value: string) => {
        setFilterType(value);
        onFilter(value);
    };

    const handleClear = () => {
        setSearchTerm('');
        setFilterType('all');
        onClear();
    };

    return (
        <Card
            size="small"
            title="Search & Filter"
            style={{
                width: 320,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
            }}
            styles={{
                body: {
                    padding: '12px'
                }
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <Input
                    placeholder="Search nodes..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    allowClear
                    style={{
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                />
                
                <Select
                    value={filterType}
                    onChange={handleFilter}
                    style={{ 
                        width: '100%',
                        borderRadius: '8px'
                    }}
                    placeholder="Filter by type"
                    suffixIcon={<FilterOutlined />}
                >
                    <Option value="all">All Types</Option>
                    {nodeTypes.map(type => (
                        <Option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Option>
                    ))}
                </Select>

                {(searchTerm || filterType !== 'all') && (
                    <div
                        onClick={handleClear}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: '500',
                            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                    >
                        <ClearOutlined style={{ marginRight: '4px' }} />
                        Clear Filters
                    </div>
                )}
            </Space>
        </Card>
    );
};

export default SearchFilter;