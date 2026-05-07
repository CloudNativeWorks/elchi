import React from 'react';
import { Drawer } from 'antd';
import CrsLibraryPane from './CrsLibraryPane';

interface CrsLibraryDrawerProps {
    open: boolean;
    onClose: () => void;
}

const CrsLibraryDrawer: React.FC<CrsLibraryDrawerProps> = ({ open, onClose }) => (
    <Drawer
        title="CRS Rule Library"
        placement="right"
        width={Math.min(960, typeof window !== 'undefined' ? window.innerWidth - 80 : 960)}
        open={open}
        onClose={onClose}
        destroyOnHidden={false}
        styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column' } }}
    >
        <CrsLibraryPane />
    </Drawer>
);

export default CrsLibraryDrawer;
