import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { letsencryptApi } from '../letsencryptApi';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type { CreateCertificateRequest } from '../types';

export const useCertificateMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { project } = useProjectVariable();

  const createMutation = useMutation({
    mutationFn: ({ request }: { request: CreateCertificateRequest }) =>
      letsencryptApi.createCertificate(request, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });

      // Check if response is a job (automatic DNS verification) or certificate (manual)
      if ('job_id' in data) {
        // Automatic DNS verification - navigate with job_id to enable polling
        navigate(`/acme/${data.certificate_id}?job_id=${data.job_id}`);
      } else if ('dns_verification' in data) {
        // Manual DNS verification - navigate to show DNS challenges
        navigate(`/acme/${data._id}`);
      }
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: ({ certId, version }: { certId: string; version: string }) =>
      letsencryptApi.duplicateCertificate(certId, version, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: string }) =>
      letsencryptApi.deleteCertificate(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
      navigate('/acme');
    },
  });

  const renewMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: string }) =>
      letsencryptApi.renewCertificate(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
    },
  });

  return {
    createMutation,
    deleteMutation,
    renewMutation,
    duplicateMutation,
    isLoading: createMutation.isPending || deleteMutation.isPending || renewMutation.isPending || duplicateMutation.isPending,
  };
};
