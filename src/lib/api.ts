/**
 * @file api.ts
 * @description Message passing API wrapper for communicating with background scripts.
 * Provides type-safe wrappers around browser.runtime.sendMessage with proper error handling.
 */

import { UISite, UIGroup, siteToStorage, groupToStorage, siteFromStorage, groupFromStorage } from './storage';

/**
 * Error response from background script
 */
export interface BackgroundError {
  success: false;
  error: {
    message: string;
    type: string;
    isRetryable: boolean;
    field?: string;
  };
}

/**
 * Success response from background script
 */
export interface BackgroundSuccess<T> {
  success: true;
  data: T;
  error: null;
}

/**
 * Generic response from background script
 */
export type BackgroundResponse<T> = BackgroundSuccess<T> | BackgroundError;

/**
 * Internal error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public isRetryable: boolean = false,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Sends a message to the background script and handles the response
 */
async function sendMessage<T = any>(
  action: string,
  payload?: any
): Promise<T> {
  try {
    const response: BackgroundResponse<T> = await browser.runtime.sendMessage({
      action,
      payload,
    });

    if (!response.success) {
      throw new APIError(
        response.error?.message || 'Unknown error from background script',
        response.error?.isRetryable || false
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to communicate with background script',
      true,
      error
    );
  }
}

/**
 * Gets all timeout notes/messages
 */
export async function getMessages(): Promise<any[]> {
  return sendMessage('getTimeoutNotes');
}

/**
 * Adds a new timeout note/message
 */
export async function addMessage(text: string): Promise<any> {
  return sendMessage('addTimeoutNote', { text });
}

/**
 * Updates a timeout note/message
 */
export async function updateMessage(id: string, updates: any): Promise<any> {
  return sendMessage('updateTimeoutNote', { id, updates });
}

/**
 * Deletes a timeout note/message
 */
export async function deleteMessage(id: string): Promise<boolean> {
  const result = await sendMessage('deleteTimeoutNote', { id });
  return result.deleted === true;
}

/**
 * Gets all sites from storage and converts to UI format
 */
export async function getSites(): Promise<UISite[]> {
  const result = await sendMessage('getAllSettings');
  const backendSites = result.distractingSites || [];
  return backendSites.map((site: any) => siteFromStorage(site));
}

/**
 * Adds a new site and returns UI format
 */
export async function addSite(uiSite: Partial<UISite>): Promise<UISite> {
  // Convert UI format to backend format
  const backendSite = siteToStorage(uiSite as UISite);
  // Remove id for new sites - backend will generate it
  const { id, ...siteWithoutId } = backendSite;
  const result = await sendMessage('addDistractingSite', siteWithoutId);
  return siteFromStorage(result);
}

/**
 * Updates a site and returns UI format
 */
export async function updateSite(
  id: string,
  updates: Partial<UISite>
): Promise<UISite> {
  // Convert only the fields that are being updated
  const backendUpdates: any = {};

  if (updates.name !== undefined) {
    backendUpdates.urlPattern = updates.name;
  }
  // Handle timeLimit - it can be undefined (don't update) or a number (set)
  if ('timeLimit' in updates) {
    backendUpdates.dailyLimitSeconds = updates.timeLimit && updates.timeLimit > 0 ? updates.timeLimit * 60 : null;
  }
  // Handle opensLimit - it can be undefined (don't update) or a number (set)
  if ('opensLimit' in updates) {
    backendUpdates.dailyOpenLimit = updates.opensLimit && updates.opensLimit > 0 ? updates.opensLimit : null;
  }
  if (updates.isEnabled !== undefined) {
    backendUpdates.isEnabled = updates.isEnabled;
  }
  if (updates.groupId !== undefined) {
    backendUpdates.groupId = updates.groupId;
  }

  const result = await sendMessage('updateDistractingSite', {
    id,
    updates: backendUpdates,
  });
  return siteFromStorage(result);
}

/**
 * Deletes a site
 */
export async function deleteSite(id: string): Promise<boolean> {
  const result = await sendMessage('deleteDistractingSite', { id });
  return result.deleted === true;
}

/**
 * Gets all groups from storage and converts to UI format
 */
export async function getGroups(): Promise<UIGroup[]> {
  const [backendGroups, backendSites] = await Promise.all([
    sendMessage('getGroups'),
    sendMessage('getAllSettings').then((r) => r.distractingSites || []),
  ]);

  // Create a map of sites for quick lookup
  const sitesMap = new Map(backendSites.map((s: any) => [s.id, s]));

  return backendGroups.map((group: any) => groupFromStorage(group, sitesMap));
}

/**
 * Adds a new group and returns UI format
 */
export async function addGroup(uiGroup: Partial<UIGroup>): Promise<UIGroup> {
  // Convert UI format to backend format
  const backendGroup = groupToStorage(uiGroup as UIGroup);
  // Remove id for new groups - backend will generate it
  const { id, ...groupWithoutId } = backendGroup;
  const result = await sendMessage('addGroup', groupWithoutId);

  // For a new group, there are no sites yet
  const sitesMap = new Map();
  return groupFromStorage(result, sitesMap);
}

/**
 * Updates a group and returns UI format
 */
export async function updateGroup(
  id: string,
  updates: Partial<UIGroup>
): Promise<UIGroup> {
  // Convert only the fields that are being updated
  const backendUpdates: any = {};

  if (updates.name !== undefined) {
    backendUpdates.name = updates.name;
  }
  if (updates.color !== undefined) {
    backendUpdates.color = updates.color;
  }
  // Handle timeLimit - it can be undefined (don't update), 0/falsy (remove), or a number (set)
  if ('timeLimit' in updates) {
    if (updates.timeLimit && updates.timeLimit > 0) {
      backendUpdates.dailyLimitSeconds = updates.timeLimit * 60;
    } else {
      // Remove limit if 0, falsy, or explicitly undefined
      backendUpdates.dailyLimitSeconds = null;
    }
  }
  // Handle opensLimit - it can be undefined (don't update), 0/falsy (remove), or a number (set)
  if ('opensLimit' in updates) {
    if (updates.opensLimit && updates.opensLimit > 0) {
      backendUpdates.dailyOpenLimit = updates.opensLimit;
    } else {
      // Remove limit if 0, falsy, or explicitly undefined
      backendUpdates.dailyOpenLimit = null;
    }
  }
  if (updates.isEnabled !== undefined) {
    backendUpdates.isEnabled = updates.isEnabled;
  }

  const result = await sendMessage('updateGroup', {
    id,
    updates: backendUpdates,
  });

  // Fetch updated sites to rebuild the group
  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map(backendSites.map((s: any) => [s.id, s]));

  return groupFromStorage(result, sitesMap);
}

/**
 * Deletes a group (sites become standalone)
 */
export async function deleteGroup(id: string): Promise<boolean> {
  const result = await sendMessage('deleteGroup', { id });
  return result.deleted === true;
}

/**
 * Adds a site to a group
 */
export async function addSiteToGroup(
  groupId: string,
  siteId: string
): Promise<UIGroup> {
  const result = await sendMessage('addSiteToGroup', { groupId, siteId });

  // Fetch updated sites to rebuild the group
  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map(backendSites.map((s: any) => [s.id, s]));

  return groupFromStorage(result, sitesMap);
}

/**
 * Removes a site from a group (site becomes standalone)
 */
export async function removeSiteFromGroup(
  groupId: string,
  siteId: string
): Promise<UIGroup> {
  const result = await sendMessage('removeSiteFromGroup', { groupId, siteId });

  // Fetch updated sites to rebuild the group
  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map(backendSites.map((s: any) => [s.id, s]));

  return groupFromStorage(result, sitesMap);
}

/**
 * Gets current page info - for popup
 */
export async function getCurrentPageInfo(): Promise<any> {
  return sendMessage('getCurrentPageLimitInfo');
}

/**
 * Adds a quick limit for the current page
 */
export async function addQuickLimit(
  urlPattern: string,
  dailyLimitSeconds: number
): Promise<UISite> {
  const result = await sendMessage('addQuickLimit', {
    urlPattern,
    dailyLimitSeconds,
  });
  return siteFromStorage(result);
}

/**
 * Gets a random timeout note
 */
export async function getRandomTimeoutNote(): Promise<any> {
  return sendMessage('getRandomTimeoutNote');
}

/**
 * Refreshes current page data
 */
export async function refreshCurrentPageData(): Promise<any> {
  return sendMessage('refreshCurrentPageData');
}

/**
 * Gets badge info for a URL
 */
export async function getBadgeInfo(url: string): Promise<any> {
  return sendMessage('getBadgeInfo', { url });
}

/**
 * Gets system status
 */
export async function getSystemStatus(): Promise<any> {
  return sendMessage('getSystemStatus');
}

/**
 * Gets display preferences
 */
export async function getDisplayPreferences(): Promise<any> {
  return sendMessage('getDisplayPreferences');
}

/**
 * Updates display preferences
 */
export async function updateDisplayPreferences(preferences: any): Promise<any> {
  return sendMessage('updateDisplayPreferences', preferences);
}

/**
 * Listens for broadcast messages from background script
 */
export function listenForBroadcasts(
  callback: (event: string, data: any) => void
): () => void {
  const handleMessage = (message: any) => {
    if (message.type === 'BROADCAST') {
      callback(message.event, message.data);
    }
  };

  browser.runtime.onMessage.addListener(handleMessage);

  // Return cleanup function
  return () => {
    browser.runtime.onMessage.removeListener(handleMessage);
  };
}
