import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { letsencryptApi } from '../letsencryptApi';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type { CreateAcmeAccountRequest } from '../types';

export const useAcmeAccountMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { project } = useProjectVariable();

  const createMutation = useMutation({
    mutationFn: ({ request }: { request: CreateAcmeAccountRequest }) =>
      letsencryptApi.createAcmeAccount(request, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-acme-accounts'] });
      navigate('/acme?tab=acme-accounts');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, project, force }: { id: string; project: string; force: boolean }) =>
      letsencryptApi.deleteAcmeAccount(id, project, force),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-acme-accounts'] });
    },
  });

  const validateMutation = useMutation({
    mutationFn: ({ id, project }: { id: string; project: string }) =>
      letsencryptApi.validateAcmeAccount(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-acme-accounts'] });
    },
  });

  return {
    createMutation,
    deleteMutation,
    validateMutation,
    isLoading: createMutation.isPending || deleteMutation.isPending || validateMutation.isPending,
  };
};
