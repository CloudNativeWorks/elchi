import React, { useState, useCallback, useEffect } from 'react';
import { Table, Button, Tag, message, Modal, Typography, Spin, Tooltip, Badge } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ReloadOutlined, CloudDownloadOutlined, CalendarOutlined, CodeOutlined, FileZipOutlined } from '@ant-design/icons';
import { useCustomGetQuery } from '@/common/api';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/common/api';

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
    envoy_version: {
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
    const [messageApi, contextHolder] = message.useMessage();

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

    // Version operations mutation
    const versionMutation = useMutation({
        mutationFn: async (payload: any) => {
            const response = await api.post('/api/op/clients', payload);
            return response.data;
        }
    });

    const handleGetVersions = useCallback(async (showMessage: boolean = false) => {
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

        versionMutation.mutate(payload, {
            onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                // Response comes as array, take first element
                const responseData = Array.isArray(data) ? data[0] : data;
                if (responseData.success) {
                    if (showMessage) {
                        messageApi.success('Downloaded versions retrieved successfully');
                    }
                    setCurrentVersions(responseData);
                } else {
                    messageApi.error(responseData.error || responseData.envoy_version?.error_message || 'Failed to get versions');
                }
                setLoadingCurrent(false);
            },
            onError: (error: any) => {
                messageApi.error(`Failed to get versions: ${error.message || 'Unknown error'}`);
                setLoadingCurrent(false);
            }
        });
    }, [clientId, downstreamAddress, messageApi]);

    const handleSetVersion = useCallback(async (version: string) => {
        // Check if version is supported by Elchi
        const supportedVersions = window.APP_CONFIG?.AVAILABLE_VERSIONS || [];
        const isSupported = supportedVersions.includes(version);
        
        if (!isSupported) {
            Modal.warning({
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

        Modal.confirm({
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

                versionMutation.mutate(payload, {
                    onSuccess: (data: VersionOperationResponse[] | VersionOperationResponse) => {
                        // Response might come as array, take first element
                        const responseData = Array.isArray(data) ? data[0] : data;
                        if (responseData.success) {
                            const installedVersion = responseData.envoy_version?.installed_version || version;
                            const downloadPath = responseData.envoy_version?.download_path;

                            if (downloadPath) {
                                messageApi.success(`Version ${installedVersion} installed successfully at ${downloadPath}`);
                            } else {
                                messageApi.success(`Version ${installedVersion} installed successfully`);
                            }
                            // Refresh downloaded versions after successful install (show message)
                            handleGetVersions(true);
                        } else {
                            messageApi.error(responseData.error || responseData.envoy_version?.error_message || 'Failed to install version');
                        }
                    },
                    onError: (error: any) => {
                        messageApi.error(`Failed to install version: ${error.message || 'Unknown error'}`);
                    }
                });
            }
        });
    }, [clientId, downstreamAddress, messageApi, handleGetVersions]);

    // Load downloaded versions on component mount (no success message)
    useEffect(() => {
        if (clientId) {
            handleGetVersions(false);
        }
    }, [clientId, handleGetVersions]);

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
                        loading={versionMutation.isPending}
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

    if (loadingAvailable) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            {contextHolder}

            {/* Header Section */}
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
                            onClick={() => handleGetVersions(true)}
                            loading={versionMutation.isPending || loadingCurrent}
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
};

export default ClientVersions;