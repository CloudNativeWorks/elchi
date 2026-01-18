/**
 * Client Resources Widget
 * Displays CPU and Memory usage for connected clients as compact cards
 */

import React from 'react';
import { CloudServerOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BaseWidget } from '../shared/BaseWidget';
import { useClientResources } from '../../hooks/useClientResources';
import styles from '../../styles/widgets.module.scss';
import { useChartTheme } from '@/utils/chartTheme';

const getStatusColor = (value: number, theme: any): string => {
  if (value > 90) return theme.dangerColor;
  if (value > 70) return theme.warningColor;
  return theme.successColor;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 GB';
  const gb = bytes / (1024 * 1024 * 1024);
  return gb < 1 ? `${(bytes / (1024 * 1024)).toFixed(0)} MB` : `${gb.toFixed(1)} GB`;
};

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const ClientResources: React.FC = () => {
  const { clients, loading, error, refresh } = useClientResources({ limit: 20 });
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const { theme: chartTheme, isDark } = useChartTheme();

  const displayedClients = expanded ? clients : clients.slice(0, 6);
  const hasMore = clients.length > 6;

  return (
    <BaseWidget
      title="Clients"
      icon={<CloudServerOutlined />}
      size="medium"
      loading={loading}
      error={error}
      onRefresh={refresh}
    >
      {clients.length === 0 ? (
        <div className={styles.widgetEmpty}>
          <CloudServerOutlined className={styles.emptyIcon} />
          <div className={styles.emptyTitle}>No Connected Clients</div>
          <div className={styles.emptyDescription}>
            Client resource usage will appear here when clients are connected
          </div>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 12,
            padding: '4px 0',
          }}>
            {displayedClients.map((client) => {
              const isOffline = client.cpu_usage < 0;
              const offlineColor = isDark ? '#64748b' : '#bfbfbf';
              const cpuColor = isOffline ? offlineColor : getStatusColor(client.cpu_usage, chartTheme);
              const memColor = isOffline ? offlineColor : getStatusColor(client.memory_usage, chartTheme);
              const diskColor = isOffline ? offlineColor : getStatusColor(client.disk_usage, chartTheme);

              return (
                <div
                  key={client.client_id}
                  style={{
                    background: isOffline
                      ? 'var(--bg-hover)'
                      : isDark
                        ? 'linear-gradient(135deg, rgba(59, 158, 255, 0.05) 0%, rgba(34, 211, 238, 0.05) 100%)'
                        : 'linear-gradient(135deg, rgba(5, 108, 205, 0.03) 0%, rgba(0, 198, 251, 0.03) 100%)',
                    border: `1px solid ${isOffline ? 'var(--border-default)' : 'var(--color-primary)'}`,
                    borderRadius: 8,
                    padding: 10,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isOffline ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => navigate(`/clients/${client.client_id}`)}
                >
                  {/* Status indicator */}
                  <div style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isOffline ? chartTheme.dangerColor : chartTheme.successColor,
                    boxShadow: isOffline ? 'none' : `0 0 6px ${chartTheme.successColor}`,
                  }} />

                  {/* Client name */}
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 8,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 12,
                  }}>
                    {client.name}
                  </div>

                  {/* CPU Section */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>CPU</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: cpuColor,
                      }}>
                        {isOffline ? '—' : `${Math.round(client.cpu_usage)}%`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 4,
                      background: 'var(--bg-hover)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: isOffline ? '0%' : `${client.cpu_usage}%`,
                        height: '100%',
                        background: cpuColor,
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-disabled)', marginTop: 2 }}>
                      {isOffline ? 'offline' : `${client.cpu_cores} cores`}
                    </div>
                  </div>

                  {/* Memory Section */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>MEM</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: memColor,
                      }}>
                        {isOffline ? '—' : `${Math.round(client.memory_usage)}%`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 4,
                      background: 'var(--bg-hover)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: isOffline ? '0%' : `${client.memory_usage}%`,
                        height: '100%',
                        background: memColor,
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-disabled)', marginTop: 2 }}>
                      {isOffline ? 'offline' : formatBytes(client.memory_total)}
                    </div>
                  </div>

                  {/* Disk Section */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>DISK</span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: diskColor,
                      }}>
                        {isOffline ? '—' : `${Math.round(client.disk_usage)}%`}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 4,
                      background: 'var(--bg-hover)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: isOffline ? '0%' : `${client.disk_usage}%`,
                        height: '100%',
                        background: diskColor,
                        borderRadius: 2,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--text-disabled)', marginTop: 2 }}>
                      {isOffline ? 'offline' : '/'}
                    </div>
                  </div>

                  {/* Bottom Info: Uptime & Connections */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: 6,
                    borderTop: '1px solid var(--border-default)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>⏱</span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {isOffline ? '—' : formatUptime(client.uptime)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>🔗</span>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {isOffline ? '—' : client.connections}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div style={{
              marginTop: 16,
              textAlign: 'center',
            }}>
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  padding: '8px 16px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--color-primary)',
                  background: 'transparent',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {expanded ? `Show Less` : `Show All ${clients.length} Clients`}
              </button>
            </div>
          )}
        </>
      )}
    </BaseWidget>
  );
};

export default ClientResources;
