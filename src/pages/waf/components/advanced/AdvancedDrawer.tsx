import React from 'react';
import { Drawer, Divider } from 'antd';
import MetricLabelsEditor from './MetricLabelsEditor';
import PerAuthorityEditor from './PerAuthorityEditor';

interface AdvancedDrawerProps {
    open: boolean;
    onClose: () => void;
}

const AdvancedDrawer: React.FC<AdvancedDrawerProps> = ({ open, onClose }) => (
    <Drawer
        title="Advanced settings"
        placement="right"
        width={520}
        open={open}
        onClose={onClose}
        destroyOnHidden
    >
        <MetricLabelsEditor />
        <Divider />
        <PerAuthorityEditor />
    </Drawer>
);

export default AdvancedDrawer;
