/**
 * This file contains server actions for interacting with the Kratos API
 */
'use server';

import { 
  createIdentity, 
  patchIdentity, 
  deleteIdentity, 
  createRecoveryLinkForIdentity 
} from './client';

/**
 * Creates a new identity in the Kratos system.
 *
 * @param createIdentityBody - The data required to create a new identity.
 * @returns An object containing the response data, status, and statusText.
 */
export async function createIdentityAction(createIdentityBody: any) {
  try {
    const response = await createIdentity({ createIdentityBody });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    return {
      data: null,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Internal Server Error',
      error: error.message
    };
  }
}

/**
 * Updates an existing identity in the Kratos system.
 *
 * @param id - The unique identifier of the identity to be updated.
 * @param jsonPatch - An array of JSON Patch operations to be applied to the identity.
 * @returns An object containing the response data, status, and statusText.
 */
export async function patchIdentityAction(id: string, jsonPatch: Array<any>) {
  try {
    // Ensure that all patch operations are "replace" operations
    const patchWithReplaceOp = jsonPatch.map(patch => ({
      ...patch,
      op: 'replace'
    }));

    const response = await patchIdentity({ id, jsonPatch: patchWithReplaceOp });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    return {
      data: null,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Internal Server Error',
      error: error.message
    };
  }
}

/**
 * Deletes an identity from the Kratos system by its ID.
 *
 * @param id - The unique identifier of the identity to be deleted.
 * @returns An object containing the response status and statusText.
 */
export async function deleteIdentityAction(id: string) {
  try {
    const response = await deleteIdentity({ id });
    return {
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Internal Server Error',
      error: error.message
    };
  }
}

/**
 * Sends a recovery link to the specified identity.
 *
 * @param id - The ID of the identity to which the recovery link will be sent.
 * @returns An object containing the response data, status, and statusText.
 */
export async function createRecoveryLinkAction(id: string) {
  try {
    const createRecoveryLinkForIdentityBody = {
      identity_id: id,
      expires_in: '24h' // Default 24 hours expiry
    };

    const response = await createRecoveryLinkForIdentity({
      createRecoveryLinkForIdentityBody
    });
    
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    return {
      data: null,
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Internal Server Error',
      error: error.message
    };
  }
}
