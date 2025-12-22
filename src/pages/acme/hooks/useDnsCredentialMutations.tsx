import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { letsencryptApi } from '../letsencryptApi';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type { CreateDnsCredentialRequest, DnsProvider } from '../types';

export const useDnsCredentialMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { project } = useProjectVariable();

  const createMutation = useMutation({
    mutationFn: (request: CreateDnsCredentialRequest) =>
      letsencryptApi.createDnsCredential(request, project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-dns-credentials'] });
      navigate(`/acme/dns-credentials/${data._id}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: string; request: Partial<CreateDnsCredentialRequest> }) =>
      letsencryptApi.updateDnsCredential(id, request, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-dns-credentials'] });
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-dns-credential'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: string }) =>
      letsencryptApi.deleteDnsCredential(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-dns-credentials'] });
    },
  });

  const testMutation = useMutation({
    mutationFn: ({
      provider,
      credentials,
      domain,
      project,
    }: {
      provider: DnsProvider;
      credentials: any;
      domain: string;
      project: string;
    }) => letsencryptApi.testDnsCredential(provider, credentials, domain, project),
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    testMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || testMutation.isPending,
  };
};
