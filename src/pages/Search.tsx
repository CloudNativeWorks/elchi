import { useState, useEffect, ReactNode } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, Input, List, Tag, Typography, Empty, Spin, Space, Button, ConfigProvider } from "antd";
import { SearchOutlined, FileTextOutlined, DatabaseOutlined, GlobalOutlined, ShareAltOutlined, CloudOutlined, AimOutlined, FilterOutlined, SafetyOutlined, FolderOpenOutlined, CloudServerOutlined, AppstoreOutlined } from "@ant-design/icons";
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

// Collection gradient colors for icons - using semantic color names
// These colors work well in both light and dark mode as they're used on gradient backgrounds
const collectionGradients: Record<string, { start: string; end: string }> = {
    virtual_hosts: { start: "var(--chart-blue, #1890ff)", end: "var(--chart-blue-dark, #096dd9)" },
    routes: { start: "var(--chart-cyan, #13c2c2)", end: "var(--chart-cyan-dark, #08979c)" },
    filters: { start: "var(--chart-purple, #722ed1)", end: "var(--chart-purple-dark, #531dab)" },
    endpoints: { start: "var(--chart-orange, #fa8c16)", end: "var(--chart-orange-dark, #d46b08)" },
    discovery: { start: "var(--chart-green, #52c41a)", end: "var(--chart-green-dark, #389e0d)" },
    clusters: { start: "var(--chart-geekblue, #2f54eb)", end: "var(--chart-geekblue-dark, #1d39c4)" },
    listeners: { start: "var(--chart-magenta, #eb2f96)", end: "var(--chart-magenta-dark, #c41d7f)" },
    secrets: { start: "var(--chart-red, #f5222d)", end: "var(--chart-red-dark, #cf1322)" },
    services: { start: "var(--chart-volcano, #fa541c)", end: "var(--chart-volcano-dark, #d4380d)" },
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

// Compact, scannable filter pill used in place of the large summary cards.
// Lets the user narrow results to a single collection without consuming a
// full row of vertical space per collection.
const CollectionPill = ({ active, label, count, icon, gradient, onClick }: {
    active: boolean;
    label: string;
    count: number;
    icon: ReactNode;
    gradient?: { start: string; end: string };
    onClick: () => void;
}) => (
    <div
        onClick={onClick}
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.2s ease",
            background: active
                ? (gradient
                    ? `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`
                    : "var(--color-primary)")
                : "var(--bg-elevated)",
            border: `1px solid ${active ? "transparent" : "var(--border-default)"}`,
            color: active ? "white" : "var(--text-primary)",
            boxShadow: active ? "var(--shadow-sm)" : "none",
        }}
        onMouseEnter={(e) => {
            if (!active) {
                e.currentTarget.style.background = "var(--bg-hover)";
                e.currentTarget.style.borderColor = "var(--color-primary)";
            }
        }}
        onMouseLeave={(e) => {
            if (!active) {
                e.currentTarget.style.background = "var(--bg-elevated)";
                e.currentTarget.style.borderColor = "var(--border-default)";
            }
        }}
    >
        <span style={{ fontSize: 14, display: "inline-flex" }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
        <span style={{
            fontSize: 12,
            fontWeight: 700,
            minWidth: 20,
            textAlign: "center",
            padding: "0 6px",
            borderRadius: 999,
            background: active ? "rgba(255, 255, 255, 0.25)" : "var(--bg-surface)",
            color: active ? "white" : "var(--text-secondary)",
        }}>
            {count}
        </span>
    </div>
);

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
            contextItems.push(<Tag key="vh" color="blue" style={{ fontSize: 11, marginInlineEnd: 0 }}>VHost: {match.context.virtual_host_name}</Tag>);
        }
        if (match.context.route_name) {
            contextItems.push(<Tag key="route" color="cyan" style={{ fontSize: 11, marginInlineEnd: 0 }}>Route: {match.context.route_name}</Tag>);
        }
        if (match.context.filter_type) {
            contextItems.push(<Tag key="filter" color="purple" style={{ fontSize: 11, marginInlineEnd: 0 }}>Filter: {match.context.filter_type}</Tag>);
        }
        if (match.context.node_name) {
            contextItems.push(<Tag key="node" color="green" style={{ fontSize: 11, marginInlineEnd: 0 }}>Node: {match.context.node_name}</Tag>);
        }
        if (match.context.address_type) {
            contextItems.push(<Tag key="addr" color="orange" style={{ fontSize: 11, marginInlineEnd: 0 }}>{match.context.address_type}</Tag>);
        }
        if (match.context.locality) {
            contextItems.push(<Tag key="locality" color="geekblue" style={{ fontSize: 11, marginInlineEnd: 0 }}>Locality: {match.context.locality}</Tag>);
        }
        if (match.context.port) {
            contextItems.push(<Tag key="port" color="default" style={{ fontSize: 11, marginInlineEnd: 0 }}>Port: {match.context.port}</Tag>);
        }
        if (match.context.inline_route) {
            contextItems.push(<Tag key="inline" color="gold" style={{ fontSize: 11, marginInlineEnd: 0 }}>Inline Route</Tag>);
        }
        if (match.context.client_id) {
            contextItems.push(<Tag key="client" color="volcano" style={{ fontSize: 11, marginInlineEnd: 0 }}>Client: {match.context.client_id.substring(0, 8)}...</Tag>);
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
                    background: "var(--gradient-primary)",
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
                    <Text style={{ color: "var(--text-on-primary)", fontSize: 14 }}>
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
                                        background: "var(--search-btn-bg, rgba(255, 255, 255, 0.25))",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        border: "1px solid var(--search-btn-border, rgba(255, 255, 255, 0.4))",
                                        color: "var(--text-on-primary)",
                                        fontWeight: 600,
                                        boxShadow: "var(--shadow-md)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "var(--search-btn-hover, rgba(255, 255, 255, 0.4))";
                                        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "var(--search-btn-bg, rgba(255, 255, 255, 0.25))";
                                        e.currentTarget.style.boxShadow = "var(--shadow-md)";
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

                        {/* Collection filter pills — only when results span more than
                            one collection. With a single collection these would just
                            repeat the result count, so we hide them to reduce noise. */}
                        {!isLoading && !isFetching && collectionSummary.length > 1 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                                <CollectionPill
                                    active={!selectedCollection}
                                    label="All"
                                    count={totalResults}
                                    icon={<AppstoreOutlined />}
                                    onClick={() => setSelectedCollection(null)}
                                />
                                {collectionSummary.map((summary) => (
                                    <CollectionPill
                                        key={summary.collection}
                                        active={selectedCollection === summary.collection}
                                        label={summary.name}
                                        count={summary.count}
                                        icon={summary.icon}
                                        gradient={summary.gradient}
                                        onClick={() => setSelectedCollection(
                                            selectedCollection === summary.collection ? null : summary.collection
                                        )}
                                    />
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
                                            background: 'var(--color-primary-bg)',
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
                                        marginBottom: 10,
                                        padding: 14,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        border: "1px solid var(--border-default)"
                                    }}
                                    onClick={() => handleResourceClick(result)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "var(--bg-hover)";
                                        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                        e.currentTarget.style.borderColor = "var(--color-primary)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "var(--bg-elevated)";
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.borderColor = "var(--border-default)";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                        <div style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: collectionGradients[result.collection]
                                                ? `linear-gradient(135deg, ${collectionGradients[result.collection].start} 0%, ${collectionGradients[result.collection].end} 100%)`
                                                : "var(--gradient-primary)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontSize: 15,
                                            flexShrink: 0
                                        }}>
                                            {collectionIcons[result.collection] || <FileTextOutlined />}
                                        </div>

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            {/* Header line: name + collection tag, with gtype/version
                                                pushed to the right as muted metadata. */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                <Text strong style={{ fontSize: 15 }} ellipsis>
                                                    {result.resource_name}
                                                </Text>
                                                <Tag color={collectionColors[result.collection]} style={{ marginInlineEnd: 0 }}>
                                                    {collectionNames[result.collection] || result.collection}
                                                </Tag>
                                                <div style={{ flex: 1, minWidth: 16 }} />
                                                {result.collection !== 'discovery' && (result.gtype || result.version) && (
                                                    <Text type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                                                        {result.gtype && <><FolderOpenOutlined /> {result.gtype}</>}
                                                        {result.version && <span style={{ marginLeft: 10 }}>· {result.version}</span>}
                                                    </Text>
                                                )}
                                            </div>

                                            {/* Matches as compact inline chips: the matched value
                                                (mono, highlighted) followed by its context tags. */}
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                                                {result.matches.map((match, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: 6,
                                                            background: "var(--color-primary-bg)",
                                                            border: "1px solid var(--color-primary-border)",
                                                            borderRadius: 6,
                                                            padding: "3px 4px 3px 9px"
                                                        }}
                                                    >
                                                        <span style={{
                                                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            color: "var(--color-primary)"
                                                        }}>
                                                            {match.value}
                                                        </span>
                                                        {Object.keys(match.context).length > 0 && (
                                                            <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 4 }}>
                                                                {renderMatchContext(match)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
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
