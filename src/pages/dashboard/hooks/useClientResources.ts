/**
 * Client Resources Hook
 * Fetches CPU and Memory stats for all connected clients
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useCustomGetQuery } from '@/common/api';
import { useOperationsApiMutation } from '@/common/operations-api';
import { OperationsType } from '@/common/types';
import { useDashboardRefresh } from '../context/DashboardRefreshContext';

export interface ClientResourceData {
  client_id: string;
  name: string;
  cpu_usage: number;
  cpu_cores: number;
  memory_usage: number;
  memory_total: number;
  memory_used: number;
  disk_usage: number;
  uptime: number;
  connections: number;
}

interface UseClientResourcesOptions {
  enabled?: boolean;
  limit?: number;
}

interface UseClientResourcesReturn {
  clients: ClientResourceData[];
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

export function useClientResources(
  options: UseClientResourcesOptions = {}
): UseClientResourcesReturn {
  const {
    enabled = true,
    limit = 10,
  } = options;

  const projectContext = useProjectVariable();
  const project = typeof projectContext === 'string' ? projectContext : projectContext.project;
  const { refreshTrigger } = useDashboardRefresh();
  const mutateOperations = useOperationsApiMutation();

  const [clients, setClients] = useState<ClientResourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Get client list
  const { data: clientsData } = useCustomGetQuery({
    queryKey: `client_list_${project}`,
    enabled: !!project && enabled,
    path: `api/op/clients?project=${project}`,
    directApi: true
  });

  const fetchClientResources = useCallback(async () => {
    if (!project || !enabled || !clientsData) return;

    // Prevent multiple simultaneous fetches
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) return;
    lastFetchRef.current = now;

    try {
      setLoading(true);

      // Get all clients (both connected and disconnected)
      const allClients = clientsData || [];
      const connectedClients = allClients.filter((c: any) => c.connected);

      if (allClients.length === 0) {
        setClients([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Fetch bulk stats only for connected clients
      let statsMap: Record<string, any> = {};

      if (connectedClients.length > 0) {
        const response = await mutateOperations.mutateAsync({
          data: {
            type: OperationsType.CLIENT_STATS,
            clients: connectedClients.map((c: any) => ({ client_id: c.client_id })),
            command: { count: 100 }
          },
          project
        });

        if (Array.isArray(response)) {
          response.forEach((stat: any) => {
            if (stat?.identity?.client_id && stat?.Result?.ClientStats) {
              statsMap[stat.identity.client_id] = stat.Result.ClientStats;
            }
          });
        }
      }

      // Build client resources for ALL clients
      const clientResources: ClientResourceData[] = [];

      allClients.forEach((clientInfo: any) => {
        const stats = statsMap[clientInfo.client_id];

        if (stats && stats.cpu && stats.memory) {
          // Connected client with stats
          const coreCount = stats.cpu.core_stats ? Object.keys(stats.cpu.core_stats).length : 0;
          const loadAvg5 = stats.cpu.load_avg_5 || 0;
          const cpuUsage = coreCount > 0 ? (loadAvg5 / coreCount) * 100 : loadAvg5 * 100;

          // Find root disk usage
          const rootDisk = stats.disk?.find((d: any) => d.mount_point === '/');
          const diskUsage = rootDisk?.usage_percent || 0;

          clientResources.push({
            client_id: clientInfo.client_id,
            name: clientInfo.name,
            cpu_usage: Math.min(cpuUsage, 100),
            cpu_cores: coreCount,
            memory_usage: stats.memory.usage_percent || 0,
            memory_total: stats.memory.total || 0,
            memory_used: stats.memory.used || 0,
            disk_usage: diskUsage,
            uptime: stats.system?.uptime || 0,
            connections: stats.network?.connections || 0,
          });
        } else {
          // Disconnected client or no stats - add with -1 values to indicate offline
          clientResources.push({
            client_id: clientInfo.client_id,
            name: clientInfo.name,
            cpu_usage: -1,
            cpu_cores: 0,
            memory_usage: -1,
            memory_total: 0,
            memory_used: 0,
            disk_usage: -1,
            uptime: 0,
            connections: 0,
          });
        }
      });

      // Sort: connected clients first (by CPU), then disconnected clients
      const sortedClients = clientResources
        .sort((a, b) => {
          // Connected clients first
          if (a.cpu_usage >= 0 && b.cpu_usage < 0) return -1;
          if (a.cpu_usage < 0 && b.cpu_usage >= 0) return 1;
          // Among connected, sort by CPU
          if (a.cpu_usage >= 0 && b.cpu_usage >= 0) return b.cpu_usage - a.cpu_usage;
          // Among disconnected, keep original order
          return 0;
        })
        .slice(0, limit);

      setClients(sortedClients);
      setError(null);
    } catch (err) {
      console.error('Error fetching client resources:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [project, enabled, clientsData, limit, mutateOperations]);

  const refresh = () => {
    lastFetchRef.current = 0; // Reset to allow immediate refresh
    fetchClientResources();
  };

  useEffect(() => {
    if (!enabled || !project || !clientsData) return;

    fetchClientResources();
  }, [enabled, project, clientsData, fetchClientResources, refreshTrigger]);

  return { clients, loading, error, refresh };
}

export default useClientResources;
