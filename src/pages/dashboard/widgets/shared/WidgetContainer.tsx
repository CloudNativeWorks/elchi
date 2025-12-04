/**
 * Widget Container Component
 * Glassmorphism container with consistent styling
 */

import React from 'react';
import { WidgetContainerProps } from '../../types/widgets.types';
import styles from '../../styles/widgets.module.scss';

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  gradient,
  size = 'medium',
  loading = false,
  error = null,
  className = '',
  children,
}) => {
  const containerClass = `${styles.widgetContainer} ${styles[size]} ${className}`;

  const containerStyle: React.CSSProperties = gradient
    ? { background: gradient, color: 'white' }
    : {};

  if (loading) {
    return (
      <div className={containerClass} style={containerStyle}>
        <div className={styles.widgetLoading}>
          <span className={styles.spinner}>⟳</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass} style={containerStyle}>
        <div className={styles.widgetError}>
          <span className={styles.errorIcon}>⚠</span>
          <p className={styles.errorMessage}>{error.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass} style={containerStyle}>
      <div className={styles.widgetContent}>{children}</div>
    </div>
  );
};

export default WidgetContainer;
