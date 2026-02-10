/**
 * Dashboard Layout Context
 * Distributes layout state to all dashboard child components
 */

import React, { createContext, useContext } from 'react';
import { useDashboardLayout } from '../hooks/useDashboardLayout';

type DashboardLayoutContextType = ReturnType<typeof useDashboardLayout>;

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined);

export const DashboardLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const layoutState = useDashboardLayout();

  return (
    <DashboardLayoutContext.Provider value={layoutState}>
      {children}
    </DashboardLayoutContext.Provider>
  );
};

export const useDashboardLayoutContext = () => {
  const context = useContext(DashboardLayoutContext);
  if (!context) {
    throw new Error('useDashboardLayoutContext must be used within DashboardLayoutProvider');
  }
  return context;
};
