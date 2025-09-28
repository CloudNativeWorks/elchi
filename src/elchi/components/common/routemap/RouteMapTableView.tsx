import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Tag, Typography, Space, Card, Button, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { RouteMapData, RouteMapNode, RouteMapEdge } from './types';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface RouteMapTableViewProps {
    data: RouteMapData;
}

interface TableRow {
    key: string;
    id: string;
    label: string;
    type: string;
    category: string;
    description?: string;
    level: number;
    hasChildren: boolean;
    isExpanded?: boolean;
    children?: TableRow[];
    nodeType: 'node' | 'edge';
    source?: string;
    target?: string;
    edgeType?: string;
    edgeLabel?: string;
}

const RouteMapTableView: React.FC<RouteMapTableViewProps> = ({ data }) => {
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    // Build hierarchical data structure
    const hierarchicalData = useMemo(() => {
        if (!data.graph) return [];

        const nodes = data.graph.nodes || [];
        const edges = data.graph.edges || [];
        
        // Create a map of nodes for quick lookup
        const nodeMap = new Map<string, RouteMapNode>();
        nodes.forEach(node => {
            nodeMap.set(node.data.id, node);
        });

        // Create a map of edges by source node
        const edgesBySource = new Map<string, RouteMapEdge[]>();
        edges.forEach(edge => {
            const sourceId = edge.data.source;
            if (!edgesBySource.has(sourceId)) {
                edgesBySource.set(sourceId, []);
            }
            edgesBySource.get(sourceId)!.push(edge);
        });

        // Build simplified tree structure - less nesting
        const visited = new Set<string>();

        const allRows: TableRow[] = [];
        
        const buildRows = (nodeId: string, level: number = 0, parentPath: string = '') => {
            if (visited.has(nodeId)) return;
            
            const node = nodeMap.get(nodeId);
            if (!node) return;

            visited.add(nodeId);
            
            const currentPath = parentPath ? `${parentPath}-${nodeId}` : nodeId;
            
            // Add current node to results
            allRows.push({
                key: currentPath,
                id: node.data.id,
                label: node.data.label,
                type: node.data.type,
                category: node.data.category || node.data.type,
                description: node.data.properties?.description,
                level,
                hasChildren: false,
                nodeType: 'node'
            });
            
            // Add child nodes with increased level
            const nodeEdges = edgesBySource.get(nodeId) || [];
            nodeEdges.forEach(edge => {
                buildRows(edge.data.target, level + 1, `${currentPath}-${edge.data.id}`);
            });
        };

        // Find root nodes (nodes that are not targets of any edge)
        const targetIds = new Set(edges.map(edge => edge.data.target));
        const rootNodes = nodes.filter(node => !targetIds.has(node.data.id));

        // Build rows from each root
        rootNodes.forEach(rootNode => {
            buildRows(rootNode.data.id);
        });

        // Add any remaining isolated nodes
        nodes.forEach(node => {
            if (!visited.has(node.data.id)) {
                buildRows(node.data.id);
            }
        });

        return allRows;
    }, [data]);

    // Data is already flattened with levels for indentation
    const flattenedData = hierarchicalData;

    // Get unique types for filter dropdown
    const uniqueTypes = useMemo(() => {
        const types = new Set<string>();
        flattenedData.forEach(row => {
            types.add(row.type);
        });
        return Array.from(types).sort();
    }, [flattenedData]);

    // Filter data based on search and type filter
    const filteredData = useMemo(() => {
        if (!searchText && filterType === 'all') {
            return flattenedData;
        }

        const matchingRows = new Set<string>();
        const rootKeysToInclude = new Set<string>();
        
        // First pass: find all matching rows and their root keys
        flattenedData.forEach(row => {
            const matchesSearch = !searchText || 
                row.label.toLowerCase().includes(searchText.toLowerCase()) ||
                row.type.toLowerCase().includes(searchText.toLowerCase()) ||
                row.category.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = filterType === 'all' || row.type === filterType;

            if (matchesSearch && matchesType) {
                // Find the root key (first part before any dash)
                const rootKey = row.key.split('-')[0];
                rootKeysToInclude.add(rootKey);
            }
        });

        // Second pass: include all rows that belong to matching root keys
        flattenedData.forEach(row => {
            const rootKey = row.key.split('-')[0];
            if (rootKeysToInclude.has(rootKey)) {
                matchingRows.add(row.key);
            }
        });

        return flattenedData.filter(row => matchingRows.has(row.key));
    }, [flattenedData, searchText, filterType]);


    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            render: (text: string, record: TableRow) => (
                <Tag className='auto-width-tag' color={record.level === 0 ? 'blue' : 'green'} style={{ fontSize: '11px' }}>
                    {text}
                </Tag>
            )
        },
        {
            title: 'Name',
            dataIndex: 'label',
            key: 'label',
            width: '80%',
            render: (text: string, record: TableRow) => {
                const indent = record.level * 12; // Reduced from 20 to 12
                const hasNumberPrefix = /\(\d+\)/.test(text); // Check if contains (number) anywhere
                
                return (
                    <div style={{ paddingLeft: `${indent}px`, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <NodeIndexOutlined style={{ 
                                color: record.level === 0 ? '#1890ff' : '#52c41a',
                                fontSize: '14px'
                            }} />
                            <Text strong={record.level === 0 || hasNumberPrefix} style={{ 
                                fontSize: '13px',
                                color: record.level === 0 ? '#262626' : '#595959',
                                fontWeight: hasNumberPrefix ? 'bold' : (record.level === 0 ? 'bold' : 'normal')
                            }}>
                                {text}
                            </Text>
                        </div>
                    </div>
                );
            }
        }
    ];

    return (
        <div style={{ padding: 16 }}>
            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Space wrap>
                        <Search
                            placeholder="Search nodes and edges..."
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            prefix={<SearchOutlined />}
                        />
                        <Select
                            value={filterType}
                            onChange={setFilterType}
                            style={{ width: 150 }}
                            suffixIcon={<FilterOutlined />}
                            placeholder="Filter by type"
                        >
                            <Option value="all">All Types</Option>
                            {uniqueTypes.map(type => (
                                <Option key={type} value={type}>{type}</Option>
                            ))}
                        </Select>
                        <Button 
                            onClick={() => { setSearchText(''); setFilterType('all'); }}
                            icon={<ClearOutlined />}
                            size="small"
                        >
                            Clear Filters
                        </Button>
                    </Space>
                </div>

                <div style={{ marginBottom: 12 }}>
                    <Space>
                        <Tag color="blue">
                            <NodeIndexOutlined /> Total Items: {flattenedData.length}
                        </Tag>
                        <Tag color="purple">
                            Showing: {filteredData.length}
                        </Tag>
                        <Tag color="green">
                            Types: {uniqueTypes.length}
                        </Tag>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={false}
                    size="small"
                    rowKey="key"
                    scroll={{ y: 650 }}
                    locale={{
                        emptyText: 'No route map data found'
                    }}
                />
            </Card>
        </div>
    );
};

export default RouteMapTableView;