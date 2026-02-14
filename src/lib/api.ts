import { UISite, UIGroup, siteToStorage, groupToStorage, siteFromStorage, groupFromStorage } from './storage';

export interface BackgroundError {
  success: false;
  error: {
    message: string;
    type: string;
    isRetryable: boolean;
    field?: string;
  };
}

export interface BackgroundSuccess<T> {
  success: true;
  data: T;
  error: null;
}

export type BackgroundResponse<T> = BackgroundSuccess<T> | BackgroundError;

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

export async function getMessages(): Promise<any[]> {
  return sendMessage('getTimeoutNotes');
}

export async function addMessage(text: string): Promise<any> {
  return sendMessage('addTimeoutNote', { text });
}

export async function updateMessage(id: string, updates: any): Promise<any> {
  return sendMessage('updateTimeoutNote', { id, updates });
}

export async function deleteMessage(id: string): Promise<boolean> {
  const result = await sendMessage('deleteTimeoutNote', { id });
  return result.deleted === true;
}

export async function getSites(): Promise<UISite[]> {
  const result = await sendMessage('getAllSettings');
  const backendSites = result.distractingSites || [];
  return backendSites.map((site: any) => siteFromStorage(site));
}

export async function addSite(uiSite: Partial<UISite>): Promise<UISite> {
  const backendSite = siteToStorage(uiSite as UISite);
  const { id, ...siteWithoutId } = backendSite;
  const result = await sendMessage('addDistractingSite', siteWithoutId);
  return siteFromStorage(result);
}

export async function updateSite(
  id: string,
  updates: Partial<UISite>
): Promise<UISite> {
  const backendUpdates: any = {};

  if (updates.name !== undefined) {
    backendUpdates.urlPattern = updates.name;
  }
  if ('timeLimit' in updates) {
    backendUpdates.dailyLimitSeconds = updates.timeLimit && updates.timeLimit > 0 ? updates.timeLimit * 60 : null;
  }
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

export async function deleteSite(id: string): Promise<boolean> {
  const result = await sendMessage('deleteDistractingSite', { id });
  return result.deleted === true;
}

export async function getGroups(): Promise<UIGroup[]> {
  const [backendGroups, backendSites] = await Promise.all([
    sendMessage('getGroups'),
    sendMessage('getAllSettings').then((r) => r.distractingSites || []),
  ]);

  const sitesMap = new Map<string, any>(backendSites.map((s: any) => [s.id, s]));
  return backendGroups.map((group: any) => groupFromStorage(group, sitesMap as Map<string, any>));
}

export async function addGroup(uiGroup: Partial<UIGroup>): Promise<UIGroup> {
  const backendGroup = groupToStorage(uiGroup as UIGroup);
  const { id, ...groupWithoutId } = backendGroup;
  const result = await sendMessage('addGroup', groupWithoutId);
  const sitesMap = new Map();
  return groupFromStorage(result, sitesMap);
}

export async function updateGroup(
  id: string,
  updates: Partial<UIGroup>
): Promise<UIGroup> {
  const backendUpdates: any = {};

  if (updates.name !== undefined) {
    backendUpdates.name = updates.name;
  }
  if (updates.color !== undefined) {
    backendUpdates.color = updates.color;
  }
  if ('timeLimit' in updates) {
    if (updates.timeLimit && updates.timeLimit > 0) {
      backendUpdates.dailyLimitSeconds = updates.timeLimit * 60;
    } else {
      backendUpdates.dailyLimitSeconds = null;
    }
  }
  if ('opensLimit' in updates) {
    if (updates.opensLimit && updates.opensLimit > 0) {
      backendUpdates.dailyOpenLimit = updates.opensLimit;
    } else {
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

  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map<string, any>(backendSites.map((s: any) => [s.id, s]));

  return groupFromStorage(result, sitesMap as Map<string, any>);
}

export async function deleteGroup(id: string): Promise<boolean> {
  const result = await sendMessage('deleteGroup', { id });
  return result.deleted === true;
}

export async function addSiteToGroup(
  groupId: string,
  siteId: string
): Promise<UIGroup> {
  const result = await sendMessage('addSiteToGroup', { groupId, siteId });
  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map<string, any>(backendSites.map((s: any) => [s.id, s]));
  return groupFromStorage(result, sitesMap as Map<string, any>);
}

export async function removeSiteFromGroup(
  groupId: string,
  siteId: string
): Promise<UIGroup> {
  const result = await sendMessage('removeSiteFromGroup', { groupId, siteId });
  const backendSites = await sendMessage('getAllSettings').then(
    (r) => r.distractingSites || []
  );
  const sitesMap = new Map<string, any>(backendSites.map((s: any) => [s.id, s]));
  return groupFromStorage(result, sitesMap as Map<string, any>);
}

export async function getCurrentPageInfo(): Promise<any> {
  return sendMessage('getCurrentPageLimitInfo');
}

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

export async function getRandomTimeoutNote(): Promise<any> {
  return sendMessage('getRandomTimeoutNote');
}

export async function refreshCurrentPageData(): Promise<any> {
  return sendMessage('refreshCurrentPageData');
}

export async function getBadgeInfo(url: string): Promise<any> {
  return sendMessage('getBadgeInfo', { url });
}

export async function getSystemStatus(): Promise<any> {
  return sendMessage('getSystemStatus');
}

export async function getDisplayPreferences(): Promise<any> {
  return sendMessage('getDisplayPreferences');
}

export async function updateDisplayPreferences(preferences: any): Promise<any> {
  return sendMessage('updateDisplayPreferences', preferences);
}

export async function extendLimit(
  siteId: string,
  extendedMinutes: number,
  extendedOpens: number,
  excuse: string
): Promise<{ siteId: string; extensionData: any }> {
  return sendMessage('extendLimit', {
    siteId,
    extendedMinutes,
    extendedOpens,
    excuse,
  });
}

export async function getOnboardingState(): Promise<{ completed: boolean } | null> {
  try {
    return await sendMessage('getOnboardingState');
  } catch (error) {
    // If onboarding state doesn't exist, return null
    return null;
  }
}

export async function completeOnboarding(): Promise<{ completed: boolean }> {
  return sendMessage('completeOnboarding');
}

export async function bootstrapDefaultData(): Promise<{
  groupAdded: boolean;
  messagesAdded: boolean;
}> {
  return sendMessage('bootstrapDefaultData');
}

export function listenForBroadcasts(
  callback: (event: string, data: any) => void
): () => void {
  const handleMessage = (message: any) => {
    if (message.type === 'BROADCAST') {
      callback(message.event, message.data);
    }
  };

  browser.runtime.onMessage.addListener(handleMessage);
  return () => {
    browser.runtime.onMessage.removeListener(handleMessage);
  };
}
