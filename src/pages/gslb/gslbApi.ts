/**
 * GSLB API Client
 * Handles all GSLB-related API calls with centralized notification handling
 */

import { api } from '@/common/api';
import { handleApiResponse } from '@/common/notificationHandler';
import type {
  GSLBRecord,
  GSLBConfig,
  GSLBNode,
  CreateGSLBRequest,
  UpdateGSLBRequest,
  GSLBListResponse,
  GSLBListFilter,
  GSLBIPAddress,
  NodeHealthResponse,
  NodeRecordsResponse,
  NotifyRequest,
  NotifyResponse,
  NotifyAllResponse,
} from './types';

const GSLB_BASE = '/api/v3/gslb';
const SETTING_BASE = '/api/v3/setting/gslb';

class GslbApiClient {
  // ========== GSLB Records API ==========

  /**
   * Get list of GSLB records with pagination and filters
   */
  async getGslbRecords(params: GSLBListFilter): Promise<GSLBListResponse> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await api.get<GSLBListResponse>(`${GSLB_BASE}?${queryString}`);
    return response.data;
  }

  /**
   * Get single GSLB record by ID
   */
  async getGslbRecord(id: string, project: string): Promise<GSLBRecord> {
    const response = await api.get<GSLBRecord>(`${GSLB_BASE}/${id}?project=${project}`);
    return response.data;
  }

  /**
   * Create new manual GSLB record
   */
  async createGslbRecord(record: CreateGSLBRequest): Promise<GSLBRecord> {
    const response = await api.post<GSLBRecord>(GSLB_BASE, record);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `GSLB record "${record.fqdn}" created successfully`,
      successTitle: 'GSLB Record Created'
    });

    return response.data;
  }

  /**
   * Update existing GSLB record
   */
  async updateGslbRecord(
    id: string,
    record: UpdateGSLBRequest
  ): Promise<{ message: string; id: string }> {
    const response = await api.put<{ message: string; id: string }>(
      `${GSLB_BASE}/${id}`,
      record
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'GSLB record updated successfully',
      successTitle: 'GSLB Record Updated'
    });

    return response.data;
  }

  /**
   * Delete manual GSLB record
   */
  async deleteGslbRecord(id: string, project: string): Promise<{ message: string; id: string }> {
    const response = await api.delete<{ message: string; id: string }>(
      `${GSLB_BASE}/${id}?project=${project}`
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'GSLB record deleted successfully',
      successTitle: 'GSLB Record Deleted'
    });

    return response.data;
  }

  /**
   * Add IP address to GSLB record
   * ip is required, client_id and health_state are optional
   * health_state defaults to "passing" if not provided
   */
  async addIpToRecord(
    recordId: string,
    ipData: { ip: string; client_id?: string; health_state?: 'passing' | 'warning' | 'critical' }
  ): Promise<{ message: string; ip: string; client_id: string; shard: string; health_state: string; fqdn: string; created_at: string }> {
    const response = await api.post<{ message: string; ip: string; client_id: string; shard: string; health_state: string; fqdn: string; created_at: string }>(
      `${GSLB_BASE}/${recordId}/ips`,
      ipData
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `IP ${ipData.ip} added successfully`,
      successTitle: 'IP Added'
    });

    return response.data;
  }

  /**
   * Update IP health state (Manual health state control)
   * Used for maintenance mode, emergency drain, staged rollout, gradual degradation
   */
  async updateIpHealthState(
    recordId: string,
    ip: string,
    health_state: 'passing' | 'warning' | 'critical'
  ): Promise<{ message: string; ip: string; health_state: string }> {
    const response = await api.put<{ message: string; ip: string; health_state: string }>(
      `${GSLB_BASE}/${recordId}/ips/${encodeURIComponent(ip)}`,
      { health_state }
    );

    const stateLabels = {
      passing: 'PASSING',
      warning: 'WARNING',
      critical: 'CRITICAL'
    };

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `IP ${ip} health state updated to ${stateLabels[health_state]}`,
      successTitle: 'IP Health State Updated'
    });

    return response.data;
  }

  /**
   * Remove IP address from GSLB record
   */
  async removeIpFromRecord(recordId: string, ip: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `${GSLB_BASE}/${recordId}/ips/${encodeURIComponent(ip)}`
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `IP ${ip} removed successfully`,
      successTitle: 'IP Removed'
    });

    return response.data;
  }

  /**
   * Clear IP status history
   * Clears the status_history array for a specific IP health record
   */
  async clearIpHistory(ipHealthId: string): Promise<{ message: string; id: string }> {
    const response = await api.delete<{ message: string; id: string }>(
      `${GSLB_BASE}/ip/${ipHealthId}/history`
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'IP status history cleared successfully',
      successTitle: 'History Cleared'
    });

    return response.data;
  }

  /**
   * Update regions for an IP in a GSLB record
   */
  async updateIpRegions(
    recordId: string,
    ip: string,
    regions: string[]
  ): Promise<{ message: string; ip: string; regions: string[] }> {
    const response = await api.put<{ message: string; ip: string; regions: string[] }>(
      `${GSLB_BASE}/${recordId}/ips/${encodeURIComponent(ip)}/regions`,
      { regions }
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `Regions updated for IP ${ip}`,
      successTitle: 'IP Regions Updated'
    });

    return response.data;
  }

  /**
   * Get all IPs for a GSLB record
   */
  async getRecordIps(recordId: string): Promise<GSLBIPAddress[]> {
    const response = await api.get<{ ips: GSLBIPAddress[] | null }>(
      `${GSLB_BASE}/${recordId}/ips`
    );
    // Backend returns null when there are no IPs, convert to empty array
    return response.data.ips || [];
  }

  // ========== GSLB Settings API ==========

  /**
   * Get GSLB configuration for project
   */
  async getGslbConfig(project: string): Promise<GSLBConfig> {
    const response = await api.get<GSLBConfig>(`${SETTING_BASE}?project=${project}`);
    return response.data;
  }

  /**
   * Get GSLB options (failover zones and regions) for project
   */
  async getOptions(project: string): Promise<{ failover_zones: string[]; regions: string[]; project: string; message?: string }> {
    const response = await api.get<{ failover_zones: string[]; regions: string[]; project: string; message?: string }>(
      `${SETTING_BASE}/options?project=${project}`
    );
    return response.data;
  }

  /**
   * Create or update GSLB configuration
   */
  async updateGslbConfig(project: string, config: GSLBConfig): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(
      `${SETTING_BASE}?project=${project}`,
      config
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'GSLB configuration updated successfully',
      successTitle: 'Configuration Updated'
    });

    return response.data;
  }

  /**
   * Delete GSLB configuration (only if no records exist)
   */
  async deleteGslbConfig(project: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${SETTING_BASE}?project=${project}`);

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'GSLB configuration deleted successfully',
      successTitle: 'Configuration Deleted'
    });

    return response.data;
  }

  /**
   * Bulk update GSLB records (enable/disable multiple records)
   */
  async bulkUpdateGslbRecords(
    recordIds: string[],
    enabled: boolean
  ): Promise<{ message: string; updated_count: number }> {
    const response = await api.put<{ message: string; updated_count: number }>(
      `${GSLB_BASE}/batch`,
      {
        record_ids: recordIds,
        enabled
      }
    );

    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `${response.data.updated_count} record(s) ${enabled ? 'enabled' : 'disabled'} successfully`,
      successTitle: 'Bulk Update Completed'
    });

    return response.data;
  }
  // ========== GSLB Nodes API ==========

  async getGslbNodes(): Promise<GSLBNode[]> {
    const response = await api.get<{ data: GSLBNode[]; message: string; total: number }>(`${GSLB_BASE}/nodes`);
    return response.data.data || [];
  }

  async deleteGslbNode(nodeId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`${GSLB_BASE}/nodes/${nodeId}`);
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: 'GSLB node removed successfully',
      successTitle: 'Node Removed'
    });
    return response.data;
  }

  // ========== Node Operations API ==========

  async getNodeHealth(nodeId: string): Promise<NodeHealthResponse> {
    const response = await api.get<NodeHealthResponse>(`${GSLB_BASE}/nodes/${nodeId}/health`);
    return response.data;
  }

  async getNodeRecords(
    nodeId: string,
    params?: { project?: string; name?: string; type?: string }
  ): Promise<NodeRecordsResponse> {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const url = queryString
      ? `${GSLB_BASE}/nodes/${nodeId}/records?${queryString}`
      : `${GSLB_BASE}/nodes/${nodeId}/records`;
    const response = await api.get<NodeRecordsResponse>(url);
    return response.data;
  }

  async notifyNode(
    nodeId: string,
    project: string,
    body: NotifyRequest
  ): Promise<NotifyResponse> {
    const response = await api.post<NotifyResponse>(
      `${GSLB_BASE}/nodes/${nodeId}/notify?project=${project}`,
      body
    );
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `Node notified: ${response.data.updated} updated, ${response.data.deleted} deleted`,
      successTitle: 'Node Notified'
    });
    return response.data;
  }

  async notifyAllNodes(
    project: string,
    body: NotifyRequest
  ): Promise<NotifyAllResponse> {
    const response = await api.post<NotifyAllResponse>(
      `${GSLB_BASE}/nodes/notify-all?project=${project}`,
      body
    );
    handleApiResponse(response.data, undefined, undefined, {
      showAutoSuccess: true,
      customSuccessMessage: `${response.data.success}/${response.data.total} nodes notified successfully`,
      successTitle: 'All Nodes Notified'
    });
    return response.data;
  }
}

export const gslbApi = new GslbApiClient();
