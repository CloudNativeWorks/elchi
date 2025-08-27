import React from 'react';
import { notification, Modal } from 'antd';
import { 
    SafetyCertificateOutlined, 
    WarningOutlined, 
    DisconnectOutlined, 
    RollbackOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { NetworkResponse } from '@/hooks/useNetworkOperations';

export class NetworkSafetyHandler {
    static handleNetworkResponse(response: NetworkResponse, operation: string = 'Network operation'): void {
        if (response.success) {
            this.handleSuccessResponse(response, operation);
        } else {
            this.handleErrorResponse(response, operation);
        }
    }

    private static handleSuccessResponse(response: NetworkResponse, operation: string): void {
        let description = response.message || `${operation} completed successfully.`;
        let additionalInfo: string[] = [];

        if (response.safely_applied) {
            additionalInfo.push('Applied with safety mechanisms enabled');
        }

        if (response.connection_preserved) {
            additionalInfo.push('Controller connection maintained throughout the operation');
        }

        if (response.backup_created) {
            additionalInfo.push('Configuration backup created before changes');
        }

        if (response.test_mode_applied) {
            additionalInfo.push('Changes were tested before being made permanent');
        }

        if (additionalInfo.length > 0) {
            description += `\n\n${additionalInfo.map(info => `• ${info}`).join('\n')}`;
        }

        notification.success({
            message: `${operation} Successful`,
            description,
            icon: response.safely_applied 
                ? <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                : <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            duration: response.safely_applied ? 6 : 4,
            placement: 'topRight',
        });
    }

    private static handleErrorResponse(response: NetworkResponse, operation: string): void {
        if (response.rollback_triggered) {
            this.showRollbackNotification(response, operation);
        } else if (response.connection_lost) {
            this.showConnectionLossNotification(response, operation);
        } else if (response.test_failed) {
            this.showTestFailureNotification(response, operation);
        } else {
            this.showGenericErrorNotification(response, operation);
        }
    }

    private static showRollbackNotification(response: NetworkResponse, operation: string): void {
        const title = `${operation} Failed - Rollback Performed`;
        const description = response.rollback_reason || 
            'The network configuration failed and was automatically rolled back to prevent connectivity issues.';

        Modal.warning({
            title,
            content: (
                <div>
                    <p>{description}</p>
                    <div style={{ 
                        marginTop: 16, 
                        padding: 12, 
                        backgroundColor: '#fff7e6', 
                        borderRadius: 6,
                        border: '1px solid #ffd666'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <RollbackOutlined style={{ color: '#fa8c16' }} />
                            <strong>Rollback Information</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>Your previous network configuration has been restored</li>
                            <li>Network connectivity should be maintained</li>
                            <li>You can try the operation again with different settings</li>
                        </ul>
                    </div>
                </div>
            ),
            width: 500,
            okText: 'Understood',
            icon: <RollbackOutlined style={{ color: '#fa8c16' }} />,
        });

        notification.warning({
            message: title,
            description: 'Automatic rollback completed successfully',
            icon: <RollbackOutlined style={{ color: '#fa8c16' }} />,
            duration: 8,
            placement: 'topRight',
        });
    }

    private static showConnectionLossNotification(response: NetworkResponse, operation: string): void {
        const title = `${operation} Failed - Connection Lost`;
        const description = response.error || 
            'Network connection was lost during the operation. Rollback may have been triggered automatically.';

        Modal.error({
            title,
            content: (
                <div>
                    <p>{description}</p>
                    <div style={{ 
                        marginTop: 16, 
                        padding: 12, 
                        backgroundColor: '#fff2f0', 
                        borderRadius: 6,
                        border: '1px solid #ffccc7'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <DisconnectOutlined style={{ color: '#f5222d' }} />
                            <strong>Connection Status</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>Network connectivity was interrupted during the operation</li>
                            <li>The system should have automatically rolled back changes</li>
                            <li>Please verify your network connectivity and try again</li>
                            <li>Consider using test mode for safer configuration changes</li>
                        </ul>
                    </div>
                </div>
            ),
            width: 500,
            okText: 'Understood',
        });
    }

    private static showTestFailureNotification(response: NetworkResponse, operation: string): void {
        const title = `${operation} Test Failed`;
        const description = response.error || 
            'The network configuration test failed. No changes were applied to preserve connectivity.';

        notification.error({
            message: title,
            description: (
                <div>
                    <p>{description}</p>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                        <InfoCircleOutlined /> Test mode prevented potentially harmful changes
                    </div>
                </div>
            ),
            icon: <WarningOutlined style={{ color: '#faad14' }} />,
            duration: 8,
            placement: 'topRight',
        });
    }

    private static showGenericErrorNotification(response: NetworkResponse, operation: string): void {
        const errorMessage = response.error || `${operation} failed`;
        
        notification.error({
            message: `${operation} Failed`,
            description: errorMessage,
            duration: 8,
            placement: 'topRight',
        });
    }

    static showSafetyModeRecommendation(): void {
        Modal.info({
            title: 'Safety Mode Recommended',
            content: (
                <div>
                    <p>We strongly recommend using safety mode for network operations:</p>
                    <div style={{ 
                        marginTop: 16, 
                        padding: 12, 
                        backgroundColor: '#f6ffed', 
                        borderRadius: 6,
                        border: '1px solid #b7eb8f'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
                            <strong>Safety Mode Benefits</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>Changes are tested before being applied permanently</li>
                            <li>Automatic rollback if connectivity is lost</li>
                            <li>Controller connection is continuously monitored</li>
                            <li>Configuration backups are created automatically</li>
                            <li>Reduces risk of network lockouts</li>
                        </ul>
                    </div>
                    <p style={{ marginTop: 16, color: '#666', fontSize: 14 }}>
                        Only disable safety mode if you are certain about your configuration and have alternative access methods.
                    </p>
                </div>
            ),
            width: 500,
            okText: 'Got it',
            icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />,
        });
    }

    static confirmDangerousOperation(
        operation: string,
        onConfirm: () => void,
        onCancel?: () => void
    ): void {
        Modal.confirm({
            title: 'Dangerous Network Operation',
            content: (
                <div>
                    <p>You are about to perform: <strong>{operation}</strong></p>
                    <div style={{ 
                        marginTop: 16, 
                        padding: 12, 
                        backgroundColor: '#fff2f0', 
                        borderRadius: 6,
                        border: '1px solid #ffccc7'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <WarningOutlined style={{ color: '#f5222d' }} />
                            <strong>Warning</strong>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li>This operation bypasses safety mechanisms</li>
                            <li>Network connectivity could be lost</li>
                            <li>No automatic rollback will occur</li>
                            <li>Manual intervention may be required</li>
                        </ul>
                    </div>
                    <p style={{ marginTop: 16, fontWeight: 600 }}>
                        Are you sure you want to proceed?
                    </p>
                </div>
            ),
            width: 500,
            okText: 'Yes, Proceed',
            okType: 'danger',
            cancelText: 'Cancel',
            icon: <WarningOutlined style={{ color: '#f5222d' }} />,
            onOk: onConfirm,
            onCancel: onCancel,
        });
    }

    static showNetworkStateInfo(networkState: any): void {
        if (!networkState) return;

        const { interfaces = [], routes = [], policies = [] } = networkState;

        Modal.info({
            title: 'Current Network State',
            content: (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Interfaces ({interfaces.length})</strong>
                        {interfaces.length > 0 ? (
                            <ul style={{ marginTop: 8 }}>
                                {interfaces.slice(0, 5).map((iface: any, idx: number) => (
                                    <li key={idx}>
                                        {iface.name} - {iface.state} 
                                        {iface.addresses && iface.addresses.length > 0 && 
                                            ` (${iface.addresses[0]})`
                                        }
                                    </li>
                                ))}
                                {interfaces.length > 5 && <li>... and {interfaces.length - 5} more</li>}
                            </ul>
                        ) : (
                            <div style={{ color: '#999', marginTop: 4 }}>No interfaces found</div>
                        )}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Routes ({routes.length})</strong>
                        {routes.length > 0 ? (
                            <ul style={{ marginTop: 8 }}>
                                {routes.slice(0, 5).map((route: any, idx: number) => (
                                    <li key={idx}>
                                        {route.to} via {route.via || 'direct'} 
                                        {route.interface && ` (${route.interface})`}
                                    </li>
                                ))}
                                {routes.length > 5 && <li>... and {routes.length - 5} more</li>}
                            </ul>
                        ) : (
                            <div style={{ color: '#999', marginTop: 4 }}>No routes found</div>
                        )}
                    </div>

                    <div>
                        <strong>Policies ({policies.length})</strong>
                        {policies.length > 0 ? (
                            <ul style={{ marginTop: 8 }}>
                                {policies.slice(0, 5).map((policy: any, idx: number) => (
                                    <li key={idx}>
                                        {policy.from || 'any'} → table {policy.table} 
                                        (priority: {policy.priority})
                                    </li>
                                ))}
                                {policies.length > 5 && <li>... and {policies.length - 5} more</li>}
                            </ul>
                        ) : (
                            <div style={{ color: '#999', marginTop: 4 }}>No policies found</div>
                        )}
                    </div>
                </div>
            ),
            width: 600,
            okText: 'Close',
        });
    }
}

export default NetworkSafetyHandler;