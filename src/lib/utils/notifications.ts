export interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const NOTIFICATIONS = {
  success: (title: string, description?: string): ToastOptions => ({
    title,
    description: description || 'Operation completed successfully',
    variant: 'default',
  }),
  error: (title: string, description?: string): ToastOptions => ({
    title,
    description: description || 'Something went wrong. Please try again.',
    variant: 'destructive',
  }),

  // Common notifications
  siteAdded: (siteName: string): ToastOptions =>
    NOTIFICATIONS.success('Success', `Limit added for ${siteName}`),

  siteUpdated: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Site updated successfully'),

  siteRemoved: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Site removed successfully'),

  groupCreated: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Group created successfully'),

  groupUpdated: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Group updated successfully'),

  groupDeleted: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Group deleted successfully'),

  messageAdded: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Message added successfully'),

  messageUpdated: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Message updated successfully'),

  messageRemoved: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Message removed successfully'),

  addedToGroup: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Site added to group successfully'),

  removedFromGroup: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Site removed from group successfully'),

  trackingEnabled: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Tracking enabled'),

  trackingDisabled: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Tracking disabled'),

  preferenceSaved: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Preference saved'),

  extendLimitSuccess: (): ToastOptions =>
    NOTIFICATIONS.success('Success', 'Limit extended! Redirecting...'),

  // Error notifications
  loadingFailed: (item: string = 'data'): ToastOptions =>
    NOTIFICATIONS.error('Error', `Failed to load ${item}. Please try again.`),

  saveFailed: (action: string = 'save'): ToastOptions =>
    NOTIFICATIONS.error('Error', `Failed to ${action}. Please try again.`),

  addFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error('Error', `Failed to add ${item}. Please try again.`),

  updateFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error('Error', `Failed to update ${item}. Please try again.`),

  deleteFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error('Error', `Failed to delete ${item}. Please try again.`),
};
