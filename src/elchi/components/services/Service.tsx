import React from 'react';
import { DeployLineIcon } from "@/assets/svg/icons";
import { OperationsSubType } from "@/common/types";
import { InfoCircleOutlined, PlayCircleOutlined, RedoOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Descriptions, Tag, Tooltip, Typography } from "antd";
import { ServiceStatus } from "./ServiceStatus";

const { Text } = Typography;

interface ServiceDetailsProps {
    service: any;
    statusData: any[] | null;
    statusLoading: boolean;
    statusError: any;
    onServiceAction: (type: string) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    onDeployClick: () => void;
    actionLoading: boolean;
    serviceActionsDisabled: boolean;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    service,
    statusData,
    statusLoading,
    statusError,
    onServiceAction,
    onRefreshStatus,
    onDeployClick,
    actionLoading,
    serviceActionsDisabled
}) => (
    <>
        <ServiceActions
            onDeployClick={onDeployClick}
            onServiceAction={onServiceAction}
            onRefreshStatus={onRefreshStatus}
            actionLoading={actionLoading}
            serviceActionsDisabled={serviceActionsDisabled}
        />
        <Descriptions column={1} bordered size="middle" styles={{ label: { width: 180, minWidth: 180, maxWidth: 180 } }}>
            <Descriptions.Item label="Service ID">
                <Text copyable>{service?.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Admin Port">
                <span style={{ fontWeight: 600, fontSize: 12 }}>{service?.admin_port}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Service Address(es)">
                {Array.isArray(service?.clients) && service?.clients.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
                        {service?.clients.map((c: any, idx: number) => (
                            <Tag className='auto-width-tag' key={c.client_id + idx} style={{ fontSize: 12 }}>
                                <span style={{ fontWeight: 600 }}>{c.downstream_address}</span>
                            </Tag>
                        ))}
                    </div>
                ) : (
                    <span style={{ color: '#bfbfbf' }}>Service not deployed</span>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Service Status">
                <ServiceStatus
                    statusData={statusData}
                    loading={statusLoading}
                    error={statusError}
                />
            </Descriptions.Item>
        </Descriptions>
    </>
);

export const ServiceActions: React.FC<{
    onDeployClick: () => void;
    onServiceAction: (subType: OperationsSubType) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    actionLoading: boolean;
    serviceActionsDisabled: boolean;
}> = ({
    onDeployClick,
    onServiceAction,
    onRefreshStatus,
    actionLoading,
    serviceActionsDisabled
}) => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, marginTop: 4 }}>
            <DeploymentButton onClick={onDeployClick} />
            <div style={{ flex: 1 }} />
            <ServiceActionButtons
                onAction={onServiceAction}
                onRefreshStatus={onRefreshStatus}
                loading={actionLoading}
                disabled={serviceActionsDisabled}
            />
        </div>
    );

const DeploymentButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Tooltip title="Manage Service">
        <button
            onClick={onClick}
            style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                color: '#056ccd',
                border: '1.5px solid #e6f7ff',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 900,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px 0 rgba(1, 10, 17, 0.10)'
            }}
            onMouseOver={e => {
                e.currentTarget.style.background = '#e6f7ff';
                e.currentTarget.style.color = '#1890ff';
                e.currentTarget.style.border = '1.5px solid #1890ff';
            }}
            onMouseOut={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#056ccd';
                e.currentTarget.style.border = '1.5px solid #e6f7ff';
            }}
        >
            <DeployLineIcon />
        </button>
    </Tooltip>
);

const ServiceActionButtons: React.FC<{
    onAction: (subType: OperationsSubType) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    loading: boolean;
    disabled: boolean;
}> = ({ onAction, onRefreshStatus, loading, disabled }) => (
    <div style={{
        display: 'inline-flex',
        minWidth: 0,
        padding: '6px 12px',
        gap: 8,
        borderRadius: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        background: '#fff',
        alignItems: 'center'
    }}>
        <span style={{ fontWeight: 600, fontSize: 12 }}>Service Actions:</span>
        <Tooltip title="Start">
            <Button
                shape="default"
                icon={<PlayCircleOutlined />}
                style={{ color: '#52c41a', borderColor: '#52c41a', borderWidth: 1, fontWeight: 600 }}
                onClick={() => onAction(OperationsSubType.SUB_START)}
                loading={loading}
                disabled={disabled}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#e6f7ff';
                    e.currentTarget.style.color = '#52c41a';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '2px solid #52c41a';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(30, 181, 13, 0.29)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = '#52c41a';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '1px solid #52c41a';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </Tooltip>
        <Tooltip title="Stop">
            <Button
                shape="default"
                icon={<StopOutlined />}
                style={{ color: '#ff4d4f', borderColor: '#ff4d4f', borderWidth: 1, fontWeight: 600 }}
                onClick={() => onAction(OperationsSubType.SUB_STOP)}
                loading={loading}
                disabled={disabled}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#fff1f0';
                    e.currentTarget.style.color = '#ff4d4f';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '2px solid #ff4d4f';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(255, 77, 79, 0.29)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = '#ff4d4f';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '1px solid #ff4d4f';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </Tooltip>
        <Tooltip title="Restart">
            <Button
                shape="default"
                icon={<RedoOutlined />}
                style={{ color: '#faad14', borderColor: '#faad14', borderWidth: 1, fontWeight: 600 }}
                onClick={() => onAction(OperationsSubType.SUB_RESTART)}
                loading={loading}
                disabled={disabled}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#fff7e6';
                    e.currentTarget.style.color = '#faad14';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '2px solid #faad14';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(250, 173, 20, 0.29)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = '#faad14';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '1px solid #faad14';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </Tooltip>
        <Tooltip title="Reload">
            <Button
                shape="default"
                icon={<ReloadOutlined />}
                style={{ color: '#13c2c2', borderColor: '#13c2c2', borderWidth: 1, fontWeight: 600 }}
                onClick={() => onAction(OperationsSubType.SUB_RELOAD)}
                loading={loading}
                disabled={disabled}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#e6fffb';
                    e.currentTarget.style.color = '#13c2c2';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '2px solid #13c2c2';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(19, 194, 194, 0.29)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = '#13c2c2';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '1px solid #13c2c2';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </Tooltip>
        <Tooltip title="Status">
            <Button
                shape="default"
                icon={<InfoCircleOutlined />}
                style={{ color: '#595959', borderColor: '#d9d9d9', borderWidth: 1, fontWeight: 600 }}
                onClick={onRefreshStatus}
                disabled={disabled}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.color = '#595959';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '2px solid #595959';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(89, 89, 89, 0.29)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.color = '#595959';
                    e.currentTarget.style.fontWeight = '600';
                    e.currentTarget.style.border = '1px solid #d9d9d9';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            />
        </Tooltip>
    </div>
);

 