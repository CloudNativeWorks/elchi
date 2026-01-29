import React from 'react';
import { Skeleton, Card } from 'antd';

export const PageLoadingFallback: React.FC = () => (
  <div style={{ padding: 24, minHeight: 400 }}>
    <Card style={{ borderRadius: 16, background: 'var(--card-bg)' }}>
      <Skeleton active paragraph={{ rows: 4 }} />
    </Card>
  </div>
);

export default PageLoadingFallback;
