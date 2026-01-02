/**
 * Base Widget Component
 * Combines WidgetContainer and WidgetHeader
 */

import React from 'react';
import { BaseWidgetProps } from '../../types/widgets.types';
import { WidgetContainer } from './WidgetContainer';
import { WidgetHeader } from './WidgetHeader';

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  title,
  icon,
  gradient,
  size = 'medium',
  loading = false,
  error = null,
  lastUpdated,
  onRefresh,
  onExpand,
  className = '',
  children,
}) => {
  return (
    <WidgetContainer
      gradient={gradient}
      size={size}
      loading={loading}
      error={error}
      className={className}
    >
      <>
        <WidgetHeader
          title={title}
          icon={icon}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
          onExpand={onExpand}
          loading={loading}
        />
        {children}
      </>
    </WidgetContainer>
  );
};
