import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Input, List, Tag, Typography, Empty, Spin, Space, Button, ConfigProvider } from "antd";
import { SearchOutlined, FileTextOutlined, DatabaseOutlined, GlobalOutlined, ClusterOutlined, ShareAltOutlined, CloudOutlined, AimOutlined, FilterOutlined, SafetyOutlined, FolderOpenOutlined, CloudServerOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useSearch, SearchResult } from "@/hooks/useSearch";

const { Title, Text } = Typography;
const { Search: AntSearch } = Input;

// Collection icon mapping
const collectionIcons: Record<string, any> = {
    virtual_hosts: <CloudOutlined />,
    routes: <ShareAltOutlined />,
    filters: <FilterOutlined />,
    endpoints: <AimOutlined />,
    discovery: <DatabaseOutlined />,
    clusters: <AppstoreOutlined />,
    listeners: <GlobalOutlined />,
    secrets: <SafetyOutlined />,
    services: <CloudServerOutlined />,
};

// Collection color mapping for tags
const collectionColors: Record<string, string> = {
    virtual_hosts: "blue",
    routes: "cyan",
    filters: "purple",
    endpoints: "orange",
    discovery: "green",
    clusters: "geekblue",
    listeners: "magenta",
    secrets: "red",
    services: "volcano",
};

// Collection gradient colors for icons
const collectionGradients: Record<string, { start: string; end: string }> = {
    virtual_hosts: { start: "#1890ff", end: "#096dd9" },
    routes: { start: "#13c2c2", end: "#08979c" },
    filters: { start: "#722ed1", end: "#531dab" },
    endpoints: { start: "#fa8c16", end: "#d46b08" },
    discovery: { start: "#52c41a", end: "#389e0d" },
    clusters: { start: "#2f54eb", end: "#1d39c4" },
    listeners: { start: "#eb2f96", end: "#c41d7f" },
    secrets: { start: "#f5222d", end: "#cf1322" },
    services: { start: "#fa541c", end: "#d4380d" },
};

// Collection name mapping
const collectionNames: Record<string, string> = {
    virtual_hosts: "Virtual Hosts",
    routes: "Routes",
    filters: "Filters",
    endpoints: "Endpoints",
    discovery: "Discovery",
    clusters: "Clusters",
    listeners: "Listeners",
    secrets: "Secrets",
    services: "Services",
};

// Build resource URL from backend response
const buildResourceUrl = (result: SearchResult): string => {
    // Use URL from backend response
    let url = result.url;

    // For discovery, URL is already complete
    if (result.collection === 'discovery') {
        return url;
    }

    // For services, format: /services/{resource_id}?version={version}
    if (result.collection === 'services') {
        url += `/${result.resource_id}`;
        if (result.version) {
            return `${url}?version=${result.version}`;
        }
        return url;
    }

    // For other resources, append resource_name and query params
    url += result.resource_name;

    // Add query parameters
    const params = new URLSearchParams();
    params.set('resource_id', result.resource_id);
    if (result.version) {
        params.set('version', result.version);
    }

    return `${url}?${params.toString()}`;
};

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryParam = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    const { data: searchResponse, isLoading, isFetching } = useSearch({
        query: queryParam,
        enabled: !!queryParam
    });

    useEffect(() => {
        setSearchQuery(queryParam);
        setSelectedCollection(null);
    }, [queryParam]);

    const handleSearch = (value: string) => {
        if (value.trim()) {
            setSearchParams({ q: value.trim() });
        }
    };

    const handleResourceClick = (result: SearchResult) => {
        const url = buildResourceUrl(result);
        navigate(url);
    };

    const renderMatchContext = (match: any) => {
        const contextItems = [];

        if (match.context.virtual_host_name) {
            contextItems.push(<Tag key="vh" color="blue" style={{ fontSize: 11 }}>VHost: {match.context.virtual_host_name}</Tag>);
        }
        if (match.context.route_name) {
            contextItems.push(<Tag key="route" color="cyan" style={{ fontSize: 11 }}>Route: {match.context.route_name}</Tag>);
        }
        if (match.context.filter_type) {
            contextItems.push(<Tag key="filter" color="purple" style={{ fontSize: 11 }}>Filter: {match.context.filter_type}</Tag>);
        }
        if (match.context.node_name) {
            contextItems.push(<Tag key="node" color="green" style={{ fontSize: 11 }}>Node: {match.context.node_name}</Tag>);
        }
        if (match.context.address_type) {
            contextItems.push(<Tag key="addr" color="orange" style={{ fontSize: 11 }}>{match.context.address_type}</Tag>);
        }
        if (match.context.locality) {
            contextItems.push(<Tag key="locality" color="geekblue" style={{ fontSize: 11 }}>Locality: {match.context.locality}</Tag>);
        }
        if (match.context.port) {
            contextItems.push(<Tag key="port" color="default" style={{ fontSize: 11 }}>Port: {match.context.port}</Tag>);
        }
        if (match.context.inline_route) {
            contextItems.push(<Tag key="inline" color="gold" style={{ fontSize: 11 }}>Inline Route</Tag>);
        }
        if (match.context.client_id) {
            contextItems.push(<Tag key="client" color="volcano" style={{ fontSize: 11 }}>Client: {match.context.client_id.substring(0, 8)}...</Tag>);
        }

        return contextItems;
    };

    const results = searchResponse?.data?.results || [];
    const totalResults = searchResponse?.data?.total_results || 0;

    // Group results by collection
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.collection]) {
            acc[result.collection] = [];
        }
        acc[result.collection].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    // Get collection summary
    const collectionSummary = Object.entries(groupedResults).map(([collection, items]) => ({
        collection,
        count: items.length,
        color: collectionColors[collection] || 'default',
        icon: collectionIcons[collection] || <FileTextOutlined />,
        gradient: collectionGradients[collection] || { start: '#1890ff', end: '#096dd9' },
        name: collectionNames[collection] || collection
    })).sort((a, b) => b.count - a.count);

    // Filter results based on selected collection
    const filteredResults = selectedCollection
        ? results.filter(r => r.collection === selectedCollection)
        : results;

    return (
        <div style={{ padding: "0 0px 8px" }}>
            <Card
                variant="borderless"
                style={{
                    marginBottom: 16,
                    background: "linear-gradient(90deg, rgba(5, 108, 205, 0.95) 0%, rgba(0, 198, 251, 0.85) 100%)",
                    borderRadius: 16
                }}
            >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <SearchOutlined style={{ fontSize: 32, color: "white" }} />
                        <Title level={2} style={{ margin: 0, color: "white" }}>
                            Search Domain and IP Addresses
                        </Title>
                    </div>
                    <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 14 }}>
                        Search for domains or IP addresses across your Elchi configuration resources
                    </Text>
                    <ConfigProvider
                        wave={{ disabled: false }}
                    >
                        <AntSearch
                            placeholder="Search for domain or IP address..."
                            size="large"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onSearch={handleSearch}
                            enterButton={
                                <Button
                                    icon={<SearchOutlined />}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        border: "1px solid rgba(255, 255, 255, 0.4)",
                                        color: "white",
                                        fontWeight: 600,
                                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
                                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(255, 255, 255, 0.3)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                                        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.1)";
                                    }}
                                    onMouseDown={(e) => {
                                        e.currentTarget.style.transform = "scale(0.98)";
                                    }}
                                    onMouseUp={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    Search
                                </Button>
                            }
                            loading={isLoading || isFetching}
                            style={{ maxWidth: 800 }}
                            allowClear
                        />
                    </ConfigProvider>
                </Space>
            </Card>

            {queryParam && (
                <Card variant="borderless">
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <Title level={4} style={{ margin: 0 }}>
                                Search Results
                                {totalResults > 0 && (
                                    <Tag className="auto-width-tag" color="blue" style={{ marginLeft: 12, fontSize: 12 }}>
                                        {totalResults} {totalResults === 1 ? "result" : "results"}
                                    </Tag>
                                )}
                            </Title>
                            {queryParam && (
                                <Text type="secondary">
                                    Searching for: <Text strong>{queryParam}</Text>
                                </Text>
                            )}
                        </div>

                        {/* Collection Summary Cards */}
                        {!isLoading && !isFetching && collectionSummary.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 12,
                                marginBottom: 24
                            }}>
                                {collectionSummary.map((summary) => (
                                    <div
                                        key={summary.collection}
                                        onClick={() => setSelectedCollection(
                                            selectedCollection === summary.collection ? null : summary.collection
                                        )}
                                        style={{
                                            background: selectedCollection === summary.collection
                                                ? `linear-gradient(135deg, ${summary.gradient.start} 0%, ${summary.gradient.end} 100%)`
                                                : 'var(--bg-elevated)',
                                            borderRadius: 12,
                                            padding: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: selectedCollection === summary.collection
                                                ? `2px solid ${summary.gradient.end}`
                                                : '2px solid transparent',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedCollection !== summary.collection) {
                                                e.currentTarget.style.background = 'var(--bg-hover)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCollection !== summary.collection) {
                                                e.currentTarget.style.background = 'var(--bg-elevated)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                background: selectedCollection === summary.collection
                                                    ? 'rgba(255, 255, 255, 0.3)'
                                                    : `linear-gradient(135deg, ${summary.gradient.start} 0%, ${summary.gradient.end} 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: 20,
                                                flexShrink: 0
                                            }}>
                                                {summary.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    fontWeight: 600,
                                                    fontSize: 14,
                                                    color: selectedCollection === summary.collection ? 'white' : 'var(--text-primary)',
                                                    marginBottom: 4
                                                }}>
                                                    {summary.name}
                                                </div>
                                                <div style={{
                                                    fontSize: 24,
                                                    fontWeight: 700,
                                                    color: selectedCollection === summary.collection ? 'white' : summary.gradient.start
                                                }}>
                                                    {summary.count}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedCollection === summary.collection && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                width: 24,
                                                height: 24,
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {(isLoading || isFetching) && (
                        <div style={{ textAlign: "center", padding: 40 }}>
                            <Spin size="large">
                                <div style={{ paddingTop: 50 }}>
                                    <Text type="secondary">Searching...</Text>
                                </div>
                            </Spin>
                        </div>
                    )}

                    {!isLoading && !isFetching && results.length === 0 && queryParam && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical">
                                    <Text>No results found for "{queryParam}"</Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Try searching with a different domain or IP address
                                    </Text>
                                </Space>
                            }
                        />
                    )}

                    {!isLoading && !isFetching && results.length > 0 && (
                        <>
                            {selectedCollection && (
                                <div style={{ marginBottom: 16 }}>
                                    <Button
                                        size="small"
                                        onClick={() => setSelectedCollection(null)}
                                        style={{
                                            background: 'rgba(24, 144, 255, 0.1)',
                                            border: '1px solid var(--color-primary)',
                                            color: 'var(--color-primary)'
                                        }}
                                    >
                                        ← Show All Results
                                    </Button>
                                    <Text type="secondary" style={{ marginLeft: 12 }}>
                                        Showing {filteredResults.length} results from {collectionNames[selectedCollection]}
                                    </Text>
                                </div>
                            )}
                            <List
                                itemLayout="vertical"
                                dataSource={filteredResults}
                            renderItem={(result: SearchResult) => (
                                <List.Item
                                    key={result.resource_id}
                                    style={{
                                        background: "var(--bg-elevated)",
                                        borderRadius: 8,
                                        marginBottom: 12,
                                        padding: 16,
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                        border: "1px solid var(--border-default)"
                                    }}
                                    onClick={() => handleResourceClick(result)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "var(--bg-hover)";
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "var(--bg-elevated)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            background: collectionGradients[result.collection]
                                                ? `linear-gradient(135deg, ${collectionGradients[result.collection].start} 0%, ${collectionGradients[result.collection].end} 100%)`
                                                : "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: 18,
                                            flexShrink: 0
                                        }}>
                                            {collectionIcons[result.collection] || <FileTextOutlined />}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                <Title level={5} style={{ margin: 0 }}>
                                                    {result.resource_name}
                                                </Title>
                                                <Tag color={collectionColors[result.collection]}>
                                                    {collectionNames[result.collection] || result.collection}
                                                </Tag>
                                            </div>

                                            {result.collection !== 'discovery' && (
                                                <div style={{ marginBottom: 8 }}>
                                                    {result.gtype && (
                                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                                            <FolderOpenOutlined /> {result.gtype}
                                                        </Text>
                                                    )}
                                                    {result.version && (
                                                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 16 }}>
                                                            Version: {result.version}
                                                        </Text>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ marginTop: 12 }}>
                                                <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                                                    Matches ({result.matches.length}):
                                                </Text>
                                                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                                    {result.matches.map((match, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                background: "var(--bg-surface)",
                                                                padding: "8px 12px",
                                                                borderRadius: 6,
                                                                border: "1px solid var(--border-default)"
                                                            }}
                                                        >
                                                            <div style={{ marginBottom: 6 }}>
                                                                <Text strong style={{ fontSize: 13, color: "var(--color-primary)" }}>
                                                                    {match.value}
                                                                </Text>
                                                            </div>
                                                            {Object.keys(match.context).length > 0 && (
                                                                <div style={{ marginTop: 6 }}>
                                                                    <Space size={4} wrap>
                                                                        {renderMatchContext(match)}
                                                                    </Space>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </Space>
                                            </div>
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                            />
                        </>
                    )}
                </Card>
            )}

            {!queryParam && (
                <Card variant="borderless">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Space direction="vertical">
                                <Text>Enter a search query to find domains or IP addresses</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Search across Virtual Hosts, Routes, Filters, Endpoints, Discovery etc. resources
                                </Text>
                            </Space>
                        }
                    />
                </Card>
            )}
        </div>
    );
}

export default Search;
