import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
} from '@/lib/api/kratos/client';

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
    mutationFn: async ({ schemaId, traits }: { schemaId: string; traits: any }) => {
      const { data } = await createIdentity({ schema_id: schemaId, traits });
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
    mutationFn: async ({ 
      id, 
      schemaId, 
      traits, 
      state 
    }: { 
      id: string; 
      schemaId: string; 
      traits: any; 
      state?: string;
    }) => {
      const { data } = await patchIdentity({ 
        id, 
        json_patch: [
          { op: 'replace', path: '/traits', value: traits },
          ...(state ? [{ op: 'replace', path: '/state', value: state }] : []),
        ],
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
      queryClient.invalidateQueries({ queryKey: ['identity', variables.id] });
    },
  });
};

export const usePatchIdentity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, jsonPatch }: { id: string; jsonPatch: any[] }) => {
      const { data } = await patchIdentity({ id, json_patch: jsonPatch });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
      queryClient.invalidateQueries({ queryKey: ['identity', variables.id] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identities'] });
    },
  });
};

export const useRecoverIdentity = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await createRecoveryLinkForIdentity({ identity_id: id });
      return data;
    },
  });
};

// Session hooks
export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data } = await listIdentitySessions({ id: '' });
      return data;
    },
  });
};

export const useIdentitySessions = (identityId: string) => {
  return useQuery({
    queryKey: ['identity', identityId, 'sessions'],
    queryFn: async () => {
      const { data } = await listIdentitySessions({ id: identityId });
      return data;
    },
    enabled: !!identityId,
  });
};

export const useRevokeSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      // Implementation depends on your API
      // await revokeSession(sessionId);
      return sessionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ identityId }: { identityId: string }) => {
      // Implementation depends on your API
      // await revokeAllSessions(identityId);
      return identityId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['identity', variables.identityId, 'sessions'] });
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
