/**
 * @file useBroadcastUpdates.ts
 * @description React hook for listening to real-time updates from background scripts.
 * Automatically handles broadcast messages and triggers callbacks on data changes.
 */

import { useEffect, useCallback } from 'react';

/**
 * Type definition for broadcast event handlers
 */
export type BroadcastEventHandler = (data: any) => void;

/**
 * Type definition for all broadcast events
 */
export interface BroadcastEventMap {
  siteAdded: { site: any };
  siteUpdated: { site: any; updates: any };
  siteDeleted: { siteId: string };
  groupAdded: { group: any };
  groupUpdated: { group: any; updates: any };
  groupDeleted: { groupId: string };
  siteAddedToGroup: { group: any; siteId: string };
  siteRemovedFromGroup: { group: any; siteId: string };
  quickLimitAdded: { site: any };
}

/**
 * Hook to listen for broadcast updates from background scripts.
 * Sets up a listener when the component mounts and cleans it up on unmount.
 *
 * @example
 * const [sites, setSites] = useState([]);
 *
 * useBroadcastUpdates({
 *   siteAdded: (data) => setSites(prev => [...prev, data.site]),
 *   siteUpdated: (data) => setSites(prev =>
 *     prev.map(s => s.id === data.site.id ? data.site : s)
 *   ),
 *   siteDeleted: (data) => setSites(prev =>
 *     prev.filter(s => s.id !== data.siteId)
 *   ),
 * });
 */
export function useBroadcastUpdates<K extends keyof BroadcastEventMap>(
  handlers: Partial<Record<K, BroadcastEventHandler>>
): void {
  const handleMessage = useCallback(
    (message: any) => {
      // Only process broadcast messages
      if (message.type !== 'BROADCAST') {
        return;
      }

      const { event, data } = message;

      // Call the appropriate handler if it exists
      if (event in handlers && typeof handlers[event as K] === 'function') {
        try {
          handlers[event as K]?.(data);
        } catch (error) {
          console.error(
            `[useBroadcastUpdates] Error handling broadcast event "${event}":`,
            error
          );
        }
      }
    },
    [handlers]
  );

  useEffect(() => {
    // Set up the listener
    browser.runtime.onMessage.addListener(handleMessage);

    // Clean up the listener on unmount
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleMessage]);
}

/**
 * Hook for a single broadcast event
 * More convenient when you only care about one event
 *
 * @example
 * const [sites, setSites] = useState([]);
 *
 * useBroadcastEvent('siteAdded', (data) => {
 *   setSites(prev => [...prev, data.site]);
 * });
 */
export function useBroadcastEvent<K extends keyof BroadcastEventMap>(
  event: K,
  handler: BroadcastEventHandler
): void {
  useBroadcastUpdates({
    [event]: handler,
  } as Partial<Record<K, BroadcastEventHandler>>);
}
