import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Identity, Session } from '@ory/kratos-client';
import { 
  listIdentities,
  getIdentity,
  createIdentity,
  patchIdentity,
  deleteIdentity,
  listIdentitySessions,
  getIdentitySchema,
  listIdentitySchemas,
  createRecoveryLinkForIdentity,
  toSession
} from '../kratos/client';

// Identity hooks
export const useIdentities = () => {
  return useQuery({
    queryKey: ['identities'],
    queryFn: async () => {
      const { data } = await listIdentities();
      return data;
    },
  });
};

export const useIdentity = (id: string) => {
  return useQuery({
    queryKey: ['identity', id],
    queryFn: async () => {
      const { data } = await getIdentity({ id });
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateIdentity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (identity: any) => {
      const { data } = await createIdentity({ createIdentityBody: identity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
    },
  });
};

export const useUpdateIdentity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, identity }: { id: string; identity: any }) => {
      const { data } = await patchIdentity({ 
        id, 
        jsonPatch: [
          { 
            op: 'replace', 
            path: '/', 
            value: identity 
          }
        ] 
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
      queryClient.invalidateQueries({ queryKey: ['identity', data.id] });
    },
  });
};

export const usePatchIdentity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, jsonPatch }: { id: string; jsonPatch: Array<Record<string, any>> }) => {
      const { data } = await patchIdentity({ id, jsonPatch });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
      queryClient.invalidateQueries({ queryKey: ['identity', data.id] });
    },
  });
};

export const useDeleteIdentity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteIdentity({ id });
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
      queryClient.removeQueries({ queryKey: ['identity', id] });
    },
  });
};

export const useRecoverIdentity = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await createRecoveryLinkForIdentity({
        createRecoveryLinkForIdentityBody: { identity_id: id }
      });
      return data;
    },
  });
};

// Session hooks
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await listIdentitySessions({});
      return data;
    },
  });
};

export const useIdentitySessions = (identityId: string) => {
  return useQuery({
    queryKey: ['identity-sessions', identityId],
    queryFn: async () => {
      const { data } = await listIdentitySessions({ id: identityId });
      return data;
    },
    enabled: !!identityId,
  });
};

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await toSession();
      return data;
    },
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteIdentity({ id });
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['identity-sessions'] });
      queryClient.removeQueries({ queryKey: ['session', id] });
    },
  });
};

export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (identityId: string) => {
      // This is specific to the Identity API
      await deleteIdentity({ id: identityId });
      return identityId;
    },
    onSuccess: (identityId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['identity-sessions', identityId] });
    },
  });
};

// Schema hooks
export const useSchemas = () => {
  return useQuery({
    queryKey: ['schemas'],
    queryFn: async () => {
      const { data } = await listIdentitySchemas();
      return data;
    },
  });
};

export const useSchema = (id: string) => {
  return useQuery({
    queryKey: ['schema', id],
    queryFn: async () => {
      const { data } = await getIdentitySchema({ id });
      return data;
    },
    enabled: !!id,
  });
};
