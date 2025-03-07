/**
 * This file provides the Kratos API clients and utility functions
 * for working with the Kratos API throughout the application.
 */
import { 
  Configuration, 
  ConfigurationParameters,
  IdentityApi,
  IdentityApiGetIdentityRequest,
  IdentityApiListIdentitiesRequest,
  IdentityApiListIdentitySessionsRequest,
  IdentityApiCreateIdentityRequest,
  IdentityApiPatchIdentityRequest,
  IdentityApiDeleteIdentityRequest,
  IdentityApiGetIdentitySchemaRequest,
  IdentityApiListIdentitySchemasRequest,
  IdentityApiCreateRecoveryLinkForIdentityRequest,
  IdentityApiListSessionsRequest,
} from '@ory/kratos-client';
import { getAdminUrl, getPublicUrl } from './config';

// Create configurations for API clients
const getAdminConfiguration = (): Configuration => {
  const defaultConfig: ConfigurationParameters = {};
  
  return new Configuration({
    ...defaultConfig,
    basePath: getAdminUrl(),
  });
};

const getPublicConfiguration = (): Configuration => {
  const defaultConfig: ConfigurationParameters = {};
  
  return new Configuration({
    ...defaultConfig,
    basePath: getPublicUrl(),
    baseOptions: {
      withCredentials: true,
    },
  });
};

// Instantiate API clients using IdentityApi
const adminApi = new IdentityApi(getAdminConfiguration());
const publicApi = new IdentityApi(getPublicConfiguration());

// Admin API wrappers
export async function listIdentities(params: IdentityApiListIdentitiesRequest = {}) {
  return await adminApi.listIdentities(params);
}

export async function getIdentity(params: IdentityApiGetIdentityRequest) {
  return await adminApi.getIdentity(params);
}

export async function createIdentity(params: IdentityApiCreateIdentityRequest) {
  return await adminApi.createIdentity(params);
}

export async function patchIdentity(params: IdentityApiPatchIdentityRequest) {
  return await adminApi.patchIdentity(params);
}

export async function deleteIdentity(params: IdentityApiDeleteIdentityRequest) {
  return await adminApi.deleteIdentity(params);
}

export async function listIdentitySessions(params: IdentityApiListIdentitySessionsRequest) {
  return await adminApi.listIdentitySessions(params);
}

export async function listSessions(activeOnly?: boolean) {
  return await adminApi.listSessions({expand: ['identity'], active: activeOnly});
}

export async function getIdentitySchema(params: IdentityApiGetIdentitySchemaRequest) {
  return await adminApi.getIdentitySchema(params);
}

export async function createRecoveryLinkForIdentity(params: IdentityApiCreateRecoveryLinkForIdentityRequest) {
  return await adminApi.createRecoveryLinkForIdentity(params);
}

// Public API methods
export async function listIdentitySchemas(params: IdentityApiListIdentitySchemasRequest = {}) {
  return await publicApi.listIdentitySchemas(params);
}

// Error handling utilities
export function handleKratosApiError(error: any) {
  if (!error.response) {
    console.error('Network error:', error);
    return {
      status: 500,
      message: 'Network error, please try again later.',
    };
  }

  const { status, data } = error.response;
  
  console.error('Kratos API error:', status, data);
  
  return {
    status,
    message: data.error?.message || 'An unknown error occurred.',
    details: data.error?.details || {},
  };
}
