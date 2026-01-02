import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';
import type {
  ResourceTemplate,
  TemplateCheckResponse,
  CreateTemplateRequest,
  TemplateListResponse
} from '@/types/template';

export const useResourceTemplate = () => {
  const { project } = useProjectVariable();
  const queryClient = useQueryClient();

  // Check if template exists - silent check without error notifications
  const useCheckTemplate = (gtype: string, version: string) => {
    return useQuery({
      queryKey: ['template-check', gtype, version, project],
      queryFn: async (): Promise<TemplateCheckResponse> => {
        try {
          const response = await api.get(`/api/v3/templates/check/${gtype}?project=${project}&version=${version}`);
          return response.data;
        } catch (error) {
          // Return exists: false silently for template checks
          return { exists: false };
        }
      },
      enabled: !!gtype && !!version && !!project,
      retry: false,
      refetchOnWindowFocus: false,
    });
  };

  // Get template data
  const useGetTemplate = (gtype: string, version: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['template', gtype, version, project],
      queryFn: async (): Promise<ResourceTemplate> => {
        const response = await api.get(`/api/v3/templates/${gtype}?project=${project}&version=${version}`);
        return response.data;
      },
      enabled: enabled && !!gtype && !!version && !!project,
    });
  };

  // Get all templates for current project
  const useGetTemplates = () => {
    return useQuery({
      queryKey: ['templates', project],
      queryFn: async (): Promise<TemplateListResponse> => {
        const response = await api.get(`/api/v3/templates?project=${project}`);
        return response.data;
      },
      enabled: !!project,
    });
  };

  // Save template
  const useSaveTemplate = () => {
    return useMutation({
      mutationFn: async (data: { gtype: string; version: string; template: CreateTemplateRequest }) => {
        const response = await api.post(
          `/api/v3/templates/${data.gtype}?project=${project}&version=${data.version}`,
          data.template
        );
        return response.data;
      },
      onSuccess: (data, variables) => {
        showSuccessNotification('Template saved successfully');
        queryClient.invalidateQueries({ queryKey: ['template-check', variables.gtype, variables.version, project] });
        queryClient.invalidateQueries({ queryKey: ['templates', project] });
      },
      onError: (error: any) => {
        showErrorNotification(error, 'Failed to save template');
      }
    });
  };

  // Update template
  const useUpdateTemplate = () => {
    return useMutation({
      mutationFn: async (data: { gtype: string; version: string; template: CreateTemplateRequest }) => {
        const response = await api.put(
          `/api/v3/templates/${data.gtype}?project=${project}&version=${data.version}`,
          data.template
        );
        return response.data;
      },
      onSuccess: (data, variables) => {
        showSuccessNotification('Template updated successfully');
        queryClient.invalidateQueries({ queryKey: ['template-check', variables.gtype, variables.version, project] });
        queryClient.invalidateQueries({ queryKey: ['template', variables.gtype, variables.version, project] });
        queryClient.invalidateQueries({ queryKey: ['templates', project] });
      },
      onError: (error: any) => {
        showErrorNotification(error, 'Failed to update template');
      }
    });
  };

  // Delete template
  const useDeleteTemplate = () => {
    return useMutation({
      mutationFn: async (data: { gtype: string; version: string }) => {
        const response = await api.delete(`/api/v3/templates/${data.gtype}?project=${project}&version=${data.version}`);
        return response.data;
      },
      onSuccess: (data, variables) => {
        showSuccessNotification('Template deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['template-check', variables.gtype, variables.version, project] });
        queryClient.invalidateQueries({ queryKey: ['template', variables.gtype, variables.version, project] });
        queryClient.invalidateQueries({ queryKey: ['templates', project] });
      },
      onError: (error: any) => {
        showErrorNotification(error, 'Failed to delete template');
      }
    });
  };

  return {
    useCheckTemplate,
    useGetTemplate,
    useGetTemplates,
    useSaveTemplate,
    useUpdateTemplate,
    useDeleteTemplate
  };
};
