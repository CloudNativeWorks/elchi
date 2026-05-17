import React from 'react';
import { Tag, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    WarningOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';

interface Props {
    authObserved: boolean | undefined;
    noauthObserved: boolean | undefined;
    size?: 'sm' | 'md';
}

const AuthPostureBadge: React.FC<Props> = ({ authObserved, noauthObserved, size = 'md' }) => {
    const auth = !!authObserved;
    const noauth = !!noauthObserved;

    let label = 'Unknown';
    let color = 'default';
    let icon: React.ReactNode = <QuestionCircleOutlined />;
    let tooltip = 'No auth signal observed';

    if (auth && !noauth) {
        label = 'Always Authed';
        color = 'success';
        icon = <CheckCircleOutlined />;
        tooltip = 'Every observed request carried an auth header (Authorization, Cookie, X-Api-Key, etc.).';
    } else if (!auth && noauth) {
        label = 'Never Authed';
        color = 'error';
        icon = <CloseCircleOutlined />;
        tooltip = 'No observed request carried an auth header — endpoint is publicly reachable.';
    } else if (auth && noauth) {
        label = 'Inconsistent';
        color = 'warning';
        icon = <WarningOutlined />;
        tooltip =
            'Some observed requests had auth headers, others did not. This usually means partial rollout, conditional routes, or a misconfiguration.';
    }

    const fontSize = size === 'sm' ? 11 : 12;

    return (
        <Tooltip title={tooltip}>
            <Tag className="auto-width-tag" color={color} icon={icon} style={{ fontSize, margin: 0 }}>
                {label}
            </Tag>
        </Tooltip>
    );
};

export default AuthPostureBadge;
