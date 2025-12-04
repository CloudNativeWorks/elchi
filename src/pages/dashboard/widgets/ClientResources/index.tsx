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

const getStatusColor = (value: number): string => {
  if (value > 90) return '#ff4d4f';
  if (value > 70) return '#faad14';
  return '#52c41a';
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

export const ClientResources: React.FC = () => {
  const { clients, loading, error, refresh } = useClientResources({ limit: 20 });
  const navigate = useNavigate();

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
          padding: '4px 0',
        }}>
          {clients.map((client) => {
            const isOffline = client.cpu_usage < 0;
            const cpuColor = isOffline ? '#bfbfbf' : getStatusColor(client.cpu_usage);
            const memColor = isOffline ? '#bfbfbf' : getStatusColor(client.memory_usage);
            const diskColor = isOffline ? '#bfbfbf' : getStatusColor(client.disk_usage);

            return (
              <div
                key={client.client_id}
                style={{
                  background: isOffline
                    ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.03) 100%)'
                    : 'linear-gradient(135deg, rgba(5, 108, 205, 0.03) 0%, rgba(0, 198, 251, 0.03) 100%)',
                  border: isOffline ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(5, 108, 205, 0.1)',
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
                  e.currentTarget.style.boxShadow = isOffline
                    ? '0 4px 12px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(5, 108, 205, 0.15)';
                  e.currentTarget.style.borderColor = isOffline
                    ? 'rgba(0, 0, 0, 0.2)'
                    : 'rgba(5, 108, 205, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = isOffline
                    ? 'rgba(0, 0, 0, 0.1)'
                    : 'rgba(5, 108, 205, 0.1)';
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
                  background: isOffline ? '#ff4d4f' : '#52c41a',
                  boxShadow: isOffline ? 'none' : '0 0 6px #52c41a',
                }} />

                {/* Client name */}
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#262626',
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
                    <span style={{ fontSize: 10, color: '#8c8c8c', fontWeight: 500 }}>CPU</span>
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
                    background: 'rgba(0, 0, 0, 0.06)',
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
                  <div style={{ fontSize: 9, color: '#bfbfbf', marginTop: 2 }}>
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
                    <span style={{ fontSize: 10, color: '#8c8c8c', fontWeight: 500 }}>MEM</span>
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
                    background: 'rgba(0, 0, 0, 0.06)',
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
                  <div style={{ fontSize: 9, color: '#bfbfbf', marginTop: 2 }}>
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
                    <span style={{ fontSize: 10, color: '#8c8c8c', fontWeight: 500 }}>DISK</span>
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
                    background: 'rgba(0, 0, 0, 0.06)',
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
                  <div style={{ fontSize: 9, color: '#bfbfbf', marginTop: 2 }}>
                    {isOffline ? 'offline' : '/'}
                  </div>
                </div>

                {/* Bottom Info: Uptime & Connections */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 6,
                  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: '#8c8c8c' }}>⏱</span>
                    <span style={{ fontSize: 10, color: '#595959', fontWeight: 500 }}>
                      {isOffline ? '—' : formatUptime(client.uptime)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: '#8c8c8c' }}>🔗</span>
                    <span style={{ fontSize: 10, color: '#595959', fontWeight: 500 }}>
                      {isOffline ? '—' : client.connections}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BaseWidget>
  );
};

export default ClientResources;
