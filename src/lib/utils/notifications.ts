import { t } from './i18n';

export interface ToastOptions {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

export const NOTIFICATIONS = {
  success: (title: string, description?: string): ToastOptions => ({
    title,
    description: description || t('notification_success_default'),
    variant: 'default',
  }),
  error: (title: string, description?: string): ToastOptions => ({
    title,
    description: description || t('notification_error_default'),
    variant: 'destructive',
  }),

  // Common notifications
  siteAdded: (siteName: string): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_siteAdded', siteName)),

  siteUpdated: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_siteUpdated')),

  siteRemoved: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_siteRemoved')),

  groupCreated: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_groupCreated')),

  groupUpdated: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_groupUpdated')),

  groupDeleted: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_groupDeleted')),

  messageAdded: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_messageAdded')),

  messageUpdated: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_messageUpdated')),

  messageRemoved: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_messageRemoved')),

  addedToGroup: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_addedToGroup')),

  removedFromGroup: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_removedFromGroup')),

  trackingEnabled: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_trackingEnabled')),

  trackingDisabled: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_trackingDisabled')),

  preferenceSaved: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_preferenceSaved')),

  extendLimitSuccess: (): ToastOptions =>
    NOTIFICATIONS.success(t('notification_title_success'), t('notification_extendLimitSuccess')),

  // Error notifications
  loadingFailed: (item: string = 'data'): ToastOptions =>
    NOTIFICATIONS.error(t('notification_title_error'), t('notification_loadingFailed', item)),

  saveFailed: (action: string = 'save'): ToastOptions =>
    NOTIFICATIONS.error(t('notification_title_error'), t('notification_saveFailed', action)),

  addFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error(t('notification_title_error'), t('notification_addFailed', item)),

  updateFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error(t('notification_title_error'), t('notification_updateFailed', item)),

  deleteFailed: (item: string = 'item'): ToastOptions =>
    NOTIFICATIONS.error(t('notification_title_error'), t('notification_deleteFailed', item)),
};
