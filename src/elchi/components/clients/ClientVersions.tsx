import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Tag, Typography, Spin, Tooltip, Badge, Tabs, App as AntdApp } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, CloudDownloadOutlined, CalendarOutlined, CodeOutlined, FileZipOutlined, CopyOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';

const { Text } = Typography;

// Extend Window interface for APP_CONFIG
declare global {
    interface Window {
        APP_CONFIG: {
            API_URL: string;
            API_URL_LOCAL: string;
            ENABLE_DEMO: boolean;
            AVAILABLE_VERSIONS: string[];
            VERSION: string;
        };
    }
}

interface ClientVersionsProps {
    clientId: string;
    downstreamAddress?: string;
}

interface VersionRelease {
    version: string;
    date: string;
    binaries: {
        arch: string;
        download_url: string;
        sha256: string;
    }[];
}

interface VersionOperationResponse {
    success: boolean;
    error: string;
    envoy_version?: {
        status: number;
        operation: string;
        downloaded_versions?: string[];
        installed_version?: string;
        download_path?: string;
        requested_version?: string;
        force_download?: boolean;
        success_details?: string;
        error_message?: string;
        operation_summary?: {
            action: string;
            count?: number;
            path?: string;
            version?: string;
        };
    };
    waf_version?: {
        status: number;
        operation: string;
        downloaded_versions?: string[];
        installed_version?: string;
        download_path?: string;
        requested_version?: string;
        force_download?: boolean;
        success_details?: string;
        error_message?: string;
        operation_summary?: {
            action: string;
            count?: number;
            path?: string;
            version?: string;
        };
    };
}

const ClientVersions: React.FC<ClientVersionsProps> = ({ clientId, downstreamAddress }) => {
    const { project } = useProjectVariable();
    const { modal } = AntdApp.useApp();

    // Get available versions from API
    const { data: availableVersions, isLoading: loadingAvailable } = useCustomGetQuery({
        queryKey: 'available_versions',
        enabled: true,
        path: 'custom/available_versions',
        refetchOnWindowFocus: false
    });

    // State to store current downloaded versions
    const [currentVersions, setCurrentVersions] = useState<VersionOperationResponse | null>(null);
    const [loadingCurrent, setLoadingCurrent] = useState(false);

    // State for Coroza versions
    const [currentCorozaVersions, setCurrentCorozaVersions] = useState<VersionOperationResponse | null>(null);
    const [loadingCurrentCoroza, setLoadingCurrentCoroza] = useState(false);

    // Version operations mutations (separate for Envoy and Coroza)
    const envoyMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post(`/api/op/clients?project=${project}`, payload);
            return response.data;
        }
    });

    const corozaMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post(`/api/op/clients?project=${project}`, payload);
            return response.data;
        }
    });

    const handleGetVersions = useCallback(async () => {
        setLoadingCurrent(true);
        const payload = {
            type: "ENVOY_VERSION",
            clients: [
                {
                    client_id: clientId,
                    downstream_address: downstreamAddress || ""
                }
            ],
            envoy_version: {
                operation: "GET_VERSIONS"
            }
        };

        envoyMutation.mutate(payload, {
            onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                // Response comes as array, take first element
                const responseData = Array.isArray(data) ? data[0] : data;
                if (responseData.success) {
                    setCurrentVersions(responseData);
                }
                setLoadingCurrent(false);
            },
            onError: () => {
                setLoadingCurrent(false);
            }
        });
    }, [clientId, downstreamAddress]);

    const handleSetVersion = useCallback(async (version: string) => {
        // Check if version is supported by Elchi
        const supportedVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
        const isSupported = supportedVersions.includes(version);

        if (!isSupported) {
            modal.warning({
                title: 'Unsupported Version',
                icon: <ExclamationCircleOutlined />,
                content: (
                    <div>
                        <p>Elchi does not support version <strong>{version}</strong>.</p>
                        <p style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
                            Supported versions: {supportedVersions.join(', ')}
                        </p>
                    </div>
                ),
                okText: 'OK',
                okType: 'primary'
            });
            return;
        }

        modal.confirm({
            title: 'Install Version',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to install <strong>{version}</strong>?</p>
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="forceDownload"
                                style={{ margin: 0 }}
                            />
                            <span style={{ fontSize: 13 }}>Force download (re-download even if version exists)</span>
                        </label>
                    </div>
                </div>
            ),
            okText: 'Install',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                // Get force download checkbox value
                const forceDownloadCheckbox = document.getElementById('forceDownload') as HTMLInputElement;
                const forceDownload = forceDownloadCheckbox?.checked || false;

                const payload = {
                    type: "ENVOY_VERSION",
                    clients: [
                        {
                            client_id: clientId,
                            downstream_address: downstreamAddress || ""
                        }
                    ],
                    envoy_version: {
                        operation: "SET_VERSION",
                        version: version,
                        force_download: forceDownload
                    }
                };

                envoyMutation.mutate(payload, {
                    onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                        // Response might come as array, take first element
                        const responseData = Array.isArray(data) ? data[0] : data;
                        if (responseData.success) {
                            // Refresh downloaded versions after successful install
                            handleGetVersions();
                        }
                    },
                    onError: () => {
                        // Error handled by central notification system
                    }
                });
            }
        });
    }, [clientId, downstreamAddress, handleGetVersions]);

    // Coroza version handlers
    const handleGetCorozaVersions = useCallback(async () => {
        setLoadingCurrentCoroza(true);
        const payload = {
            type: "WAF_VERSION",
            clients: [
                {
                    client_id: clientId,
                    downstream_address: downstreamAddress || ""
                }
            ],
            waf_version: {
                operation: "GET_VERSIONS"
            }
        };

        corozaMutation.mutate(payload, {
            onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                const responseData = Array.isArray(data) ? data[0] : data;
                if (responseData.success) {
                    setCurrentCorozaVersions(responseData);
                }
                setLoadingCurrentCoroza(false);
            },
            onError: () => {
                setLoadingCurrentCoroza(false);
            }
        });
    }, [clientId, downstreamAddress]);

    const handleSetCorozaVersion = useCallback(async (version: string) => {
        modal.confirm({
            title: 'Install Coroza Version',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to install Coroza <strong>{version}</strong>?</p>
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                id="forceDownloadCoroza"
                                style={{ margin: 0 }}
                            />
                            <span style={{ fontSize: 13 }}>Force download (re-download even if version exists)</span>
                        </label>
                    </div>
                </div>
            ),
            okText: 'Install',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                const forceDownloadCheckbox = document.getElementById('forceDownloadCoroza') as HTMLInputElement;
                const forceDownload = forceDownloadCheckbox?.checked || false;

                const payload = {
                    type: "WAF_VERSION",
                    clients: [
                        {
                            client_id: clientId,
                            downstream_address: downstreamAddress || ""
                        }
                    ],
                    waf_version: {
                        operation: "SET_VERSION",
                        version: version,
                        force_download: forceDownload
                    }
                };

                corozaMutation.mutate(payload, {
                    onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                        const responseData = Array.isArray(data) ? data[0] : data;
                        if (responseData.success) {
                            handleGetCorozaVersions();
                        }
                    },
                    onError: () => {
                        // Error handled by central notification system
                    }
                });
            }
        });
    }, [clientId, downstreamAddress, handleGetCorozaVersions]);

    // Load downloaded versions on component mount (no success message)
    useEffect(() => {
        if (clientId) {
            handleGetVersions();
            handleGetCorozaVersions();
        }
    }, [clientId, handleGetVersions, handleGetCorozaVersions]);

    const columns = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CodeOutlined style={{ color: '#1890ff' }} />
                    <span>Version</span>
                </div>
            ),
            dataIndex: 'version',
            key: 'version',
            render: (version: string) => {
                const supportedVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
                const isSupported = supportedVersions.includes(version);
                const isDownloaded = currentVersions?.envoy_version?.downloaded_versions?.includes(version);

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 6 }}>
                            <Text
                                strong
                                style={{
                                    fontSize: 15,
                                    color: isSupported ? '#1890ff' : '#bfbfbf'
                                }}
                            >
                                {version}
                            </Text>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                {isDownloaded && (
                                    <Badge
                                        status="success"
                                        text={<Text style={{ fontSize: 11, color: '#52c41a' }}>Downloaded</Text>}
                                    />
                                )}
                                {!isSupported && (
                                    <Badge
                                        status="warning"
                                        text={<Text style={{ fontSize: 11, color: '#fa8c16' }}>Not Supported</Text>}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#722ed1' }} />
                    <span>Release Date</span>
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => {
                const releaseDate = new Date(date);
                const isRecent = (Date.now() - releaseDate.getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 days

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 13, fontWeight: 500 }}>
                            {releaseDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>
                        {isRecent && (
                            <Tag color="orange" style={{ width: 'fit-content', fontSize: 10 }}>
                                Recent
                            </Tag>
                        )}
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileZipOutlined style={{ color: '#fa8c16' }} />
                    <span>Architectures</span>
                </div>
            ),
            dataIndex: 'binaries',
            key: 'binaries',
            render: (binaries: VersionRelease['binaries']) => (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {binaries.map(binary => {
                        const archColors: { [key: string]: string } = {
                            'linux-amd64': '#1890ff',
                            'linux-arm64': '#52c41a',
                            'darwin-amd64': '#722ed1',
                            'darwin-arm64': '#fa8c16',
                            'windows-amd64': '#eb2f96'
                        };

                        return (
                            <Tooltip key={binary.arch} title={`SHA256: ${binary.sha256.substring(0, 16)}...`}>
                                <Tag
                                    color={archColors[binary.arch] || 'default'}
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        borderRadius: 12
                                    }}
                                >
                                    {binary.arch.replace('linux-', '').replace('darwin-', 'mac-')}
                                </Tag>
                            </Tooltip>
                        );
                    })}
                </div>
            )
        },
        {
            title: '',
            key: 'action',
            width: 140,
            render: (_: any, record: VersionRelease) => {
                const supportedVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
                const isSupported = supportedVersions.includes(record.version);
                const isDownloaded = currentVersions?.envoy_version?.downloaded_versions?.includes(record.version);

                return (
                    <Button
                        type={isDownloaded ? "default" : "primary"}
                        size="middle"
                        icon={<DownloadOutlined />}
                        onClick={() => handleSetVersion(record.version)}
                        loading={envoyMutation.isPending}
                        disabled={!isSupported}
                        style={{
                            borderRadius: 8,
                            fontWeight: 500,
                            height: 36,
                            boxShadow: isDownloaded ? 'none' : '0 2px 4px rgba(24,144,255,0.2)',
                            opacity: !isSupported ? 0.6 : 1
                        }}
                        title={!isSupported ? 'This version is not supported by Elchi' : ''}
                    >
                        {isDownloaded ? 'Reinstall' : 'Install'}
                    </Button>
                );
            }
        }
    ];

    // Coroza columns
    const corozaColumns = [
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CodeOutlined style={{ color: '#722ed1' }} />
                    <span>Version</span>
                </div>
            ),
            dataIndex: 'version',
            key: 'version',
            render: (version: string) => {
                const isDownloaded = currentCorozaVersions?.waf_version?.downloaded_versions?.includes(version);

                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 6 }}>
                            <Text
                                strong
                                style={{
                                    fontSize: 15,
                                    color: '#722ed1'
                                }}
                            >
                                {version}
                            </Text>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                {isDownloaded && (
                                    <Badge
                                        status="success"
                                        text={<Text style={{ fontSize: 11, color: '#52c41a' }}>Downloaded</Text>}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarOutlined style={{ color: '#722ed1' }} />
                    <span>Release Date</span>
                </div>
            ),
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => {
                const releaseDate = new Date(date);
                const isRecent = (Date.now() - releaseDate.getTime()) < (30 * 24 * 60 * 60 * 1000); // 30 days

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 13, fontWeight: 500 }}>
                            {releaseDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>
                        {isRecent && (
                            <Tag color="purple" style={{ width: 'fit-content', fontSize: 10 }}>
                                Recent
                            </Tag>
                        )}
                    </div>
                );
            }
        },
        {
            title: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileZipOutlined style={{ color: '#fa8c16' }} />
                    <span>Architectures</span>
                </div>
            ),
            dataIndex: 'binaries',
            key: 'binaries',
            render: (binaries: VersionRelease['binaries']) => (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {binaries.map(binary => {
                        const archColors: { [key: string]: string } = {
                            'wasm-amd64': '#722ed1',
                            'wasm-arm64': '#eb2f96'
                        };

                        return (
                            <Tooltip key={binary.arch} title={`SHA256: ${binary.sha256.substring(0, 16)}...`}>
                                <Tag
                                    color={archColors[binary.arch] || 'default'}
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        borderRadius: 12
                                    }}
                                >
                                    {binary.arch}
                                </Tag>
                            </Tooltip>
                        );
                    })}
                </div>
            )
        },
        {
            title: '',
            key: 'action',
            width: 140,
            render: (_: any, record: VersionRelease) => {
                const isDownloaded = currentCorozaVersions?.waf_version?.downloaded_versions?.includes(record.version);

                return (
                    <Button
                        type={isDownloaded ? "default" : "primary"}
                        size="middle"
                        icon={<DownloadOutlined />}
                        onClick={() => handleSetCorozaVersion(record.version)}
                        loading={corozaMutation.isPending}
                        style={{
                            borderRadius: 8,
                            fontWeight: 500,
                            height: 36,
                            boxShadow: isDownloaded ? 'none' : '0 2px 4px rgba(114,46,209,0.2)'
                        }}
                    >
                        {isDownloaded ? 'Reinstall' : 'Install'}
                    </Button>
                );
            }
        }
    ];

    if (loadingAvailable) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Spin size="large" />
            </div>
        );
    }

    const envoyTabContent = (
        <>
            {/* Envoy Downloaded Versions Section */}
            <div style={{ marginBottom: 24 }}>
                <div style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        background: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '6px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CloudDownloadOutlined style={{ fontSize: 18, color: '#6b7280' }} />
                            <div>
                                <Text strong style={{ fontSize: 16, color: '#111827' }}>Downloaded Versions</Text>
                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                    {loadingCurrent ? 'Loading...' : `${currentVersions?.envoy_version?.downloaded_versions?.length || 0} versions available in client`}
                                </div>
                            </div>
                        </div>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => handleGetVersions()}
                            loading={envoyMutation.isPending || loadingCurrent}
                            style={{
                                borderRadius: 6,
                                border: '1px solid #d1d5db',
                                color: '#374151'
                            }}
                        >
                            Refresh
                        </Button>
                    </div>
                    {/* Body */}
                    <div style={{ padding: '16px 20px' }}>
                        {currentVersions?.envoy_version?.downloaded_versions && currentVersions.envoy_version.downloaded_versions.length > 0 ? (
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {currentVersions.envoy_version.downloaded_versions.map(version => (
                                    <div key={version} style={{
                                        background: '#f3f4f6',
                                        borderRadius: 16,
                                        padding: '6px 12px',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <CheckCircleOutlined style={{ fontSize: 12, color: '#10b981' }} />
                                            <Text style={{ color: '#374151', fontSize: 13, fontWeight: 500 }}>
                                                {version}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Text style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                No versions downloaded yet
                            </Text>
                        )}
                    </div>
                </div>
            </div>

            <div style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DownloadOutlined style={{ fontSize: 18, color: '#6b7280' }} />
                        <div>
                            <Text strong style={{ fontSize: 16, color: '#111827' }}>Available Versions</Text>
                            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                Choose and install Envoy versions for this client
                            </div>
                        </div>
                    </div>
                    <Badge
                        count={availableVersions?.releases?.length || 0}
                        style={{ backgroundColor: '#6b7280' }}
                        showZero
                    />
                </div>
                {/* Body */}
                <div style={{ padding: '10px 14px' }}>
                    <Table
                        columns={columns}
                        dataSource={availableVersions?.releases || []}
                        rowKey="version"
                        size="middle"
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} versions`,
                            style: { margin: '16px 0 0 0' }
                        }}
                        scroll={{ x: true }}
                        rowClassName={(record) =>
                            currentVersions?.envoy_version?.downloaded_versions?.includes(record.version)
                                ? 'downloaded-version'
                                : ''
                        }
                        bordered={false}
                        showHeader={true}
                    />

                    <style dangerouslySetInnerHTML={{
                        __html: `
                            .downloaded-version {
                                background: linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%) !important;
                                border-left: 3px solid #10b981 !important;
                            }
                            .downloaded-version:hover {
                                background: linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 100%) !important;
                            }
                        `
                    }} />
                </div>
            </div>
        </>
    );

    const corozaTabContent = (
        <>
            {/* Coroza Downloaded Versions Section */}
            <div style={{ marginBottom: 24 }}>
                <div style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        background: '#faf5ff',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '6px 10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CloudDownloadOutlined style={{ fontSize: 18, color: '#722ed1' }} />
                            <div>
                                <Text strong style={{ fontSize: 16, color: '#111827' }}>Downloaded Waf Engine Versions</Text>
                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                    {loadingCurrentCoroza ? 'Loading...' : `${currentCorozaVersions?.waf_version?.downloaded_versions?.length || 0} Waf engine versions available in client`}
                                </div>
                            </div>
                        </div>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => handleGetCorozaVersions()}
                            loading={corozaMutation.isPending || loadingCurrentCoroza}
                            style={{
                                borderRadius: 6,
                                border: '1px solid #d1d5db',
                                color: '#374151'
                            }}
                        >
                            Refresh
                        </Button>
                    </div>
                    {/* Body */}
                    <div style={{ padding: '16px 20px' }}>
                        {currentCorozaVersions?.waf_version?.downloaded_versions && currentCorozaVersions.waf_version.downloaded_versions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {currentCorozaVersions.waf_version.downloaded_versions.map(version => {
                                    const wasmPath = `/var/lib/elchi/waf/${version}/coraza.wasm`;
                                    return (
                                        <div key={version} style={{
                                            background: '#faf5ff',
                                            borderRadius: 12,
                                            padding: '12px 16px',
                                            border: '1px solid #e9d5ff',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <CheckCircleOutlined style={{ fontSize: 14, color: '#722ed1' }} />
                                                    <Text strong style={{ color: '#722ed1', fontSize: 14 }}>
                                                        {version}
                                                    </Text>
                                                </div>
                                                <div style={{
                                                    background: '#f3f4f6',
                                                    padding: '4px 10px',
                                                    borderRadius: 6,
                                                    fontFamily: 'monospace',
                                                    fontSize: 12,
                                                    color: '#374151',
                                                    display: 'inline-block',
                                                    width: 'fit-content'
                                                }}>
                                                    {wasmPath}
                                                </div>
                                            </div>
                                            <Tooltip title="Copy path">
                                                <Button
                                                    size="small"
                                                    icon={<CopyOutlined />}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(wasmPath);
                                                    }}
                                                    style={{
                                                        borderRadius: 6,
                                                        color: '#722ed1',
                                                        borderColor: '#722ed1'
                                                    }}
                                                >
                                                    Copy
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Text style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                No Coroza versions downloaded yet
                            </Text>
                        )}
                    </div>
                </div>
            </div>

            {/* Available Coroza Versions Table */}
            <div style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    background: '#faf5ff',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DownloadOutlined style={{ fontSize: 18, color: '#722ed1' }} />
                        <div>
                            <Text strong style={{ fontSize: 16, color: '#111827' }}>Available Waf Engine Versions</Text>
                            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                Choose and install WAF engine versions for this client
                            </div>
                        </div>
                    </div>
                    <Badge
                        count={availableVersions?.coroza_releases?.length || 0}
                        style={{ backgroundColor: '#722ed1' }}
                        showZero
                    />
                </div>
                {/* Body */}
                <div style={{ padding: '10px 14px' }}>
                    <Table
                        columns={corozaColumns}
                        dataSource={availableVersions?.coroza_releases || []}
                        rowKey="version"
                        size="middle"
                        pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} versions`,
                            style: { margin: '16px 0 0 0' }
                        }}
                        scroll={{ x: true }}
                        rowClassName={(record) =>
                            currentCorozaVersions?.waf_version?.downloaded_versions?.includes(record.version)
                                ? 'downloaded-coroza-version'
                                : ''
                        }
                        bordered={false}
                        showHeader={true}
                    />

                    <style dangerouslySetInnerHTML={{
                        __html: `
                            .downloaded-coroza-version {
                                background: linear-gradient(90deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.02) 100%) !important;
                                border-left: 3px solid #722ed1 !important;
                            }
                            .downloaded-coroza-version:hover {
                                background: linear-gradient(90deg, rgba(114, 46, 209, 0.08) 0%, rgba(114, 46, 209, 0.04) 100%) !important;
                            }
                        `
                    }} />
                </div>
            </div>
        </>
    );

    return (
        <Tabs
            defaultActiveKey="envoy"
            items={[
                {
                    key: 'envoy',
                    label: (
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                            <CodeOutlined style={{ marginRight: 8 }} />
                            Envoy
                        </span>
                    ),
                    children: envoyTabContent
                },
                {
                    key: 'coroza',
                    label: (
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                            <FileZipOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                            WAF Engine
                        </span>
                    ),
                    children: corozaTabContent
                }
            ]}

        />
    );
};

export default ClientVersions;