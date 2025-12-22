import { useMutation, useQueryClient } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import { useProjectVariable } from '@/hooks/useProjectVariable';

export const useCertificateActions = () => {
  const queryClient = useQueryClient();
  const { project } = useProjectVariable();

  const verifyMutation = useMutation({
    mutationFn: (certId: string) => letsencryptApi.verifyDns(certId, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificate'] });
    },
  });

  const renewMutation = useMutation({
    mutationFn: (certId: string) => letsencryptApi.renewCertificate(certId, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificate'] });
    },
  });

  const retryVerificationMutation = useMutation({
    mutationFn: (certId: string) => letsencryptApi.retryVerification(certId, project),
    onSuccess: () => {
      // Don't invalidate queries immediately - let job polling handle it
      // Queries will be invalidated when job completes
    },
  });

  const changeDnsCredentialMutation = useMutation({
    mutationFn: ({ certId, dnsCredentialId }: { certId: string; dnsCredentialId: string }) =>
      letsencryptApi.changeDnsCredential(certId, dnsCredentialId, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificates'] });
      queryClient.invalidateQueries({ queryKey: ['letsencrypt-certificate'] });
    },
  });

  return {
    verifyMutation,
    renewMutation,
    retryVerificationMutation,
    changeDnsCredentialMutation,
    isLoading:
      verifyMutation.isPending ||
      renewMutation.isPending ||
      retryVerificationMutation.isPending ||
      changeDnsCredentialMutation.isPending,
  };
};
