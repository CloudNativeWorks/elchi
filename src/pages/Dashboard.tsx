/**
 * Dashboard Page - Entry Point
 * Redirects to new modular dashboard
 */

import React from 'react';
import { DashboardPage } from './dashboard/DashboardPage';

/**
 * Main Dashboard component
 * Now uses the new modular dashboard architecture
 */
const Dashboard: React.FC = () => {
  return <DashboardPage />;
};

export default Dashboard;
