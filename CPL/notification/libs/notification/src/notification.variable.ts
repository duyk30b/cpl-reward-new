export enum ENotificationCategory {
  ANNOUNCEMENT = -1,
  CAMPAIGN = -2,
  SYSTEM = -3,
}

export enum ENotificationType {
  GLOBAL = 1,
  PERSONAL = 2,
}

export const NOTIFICATION_CATEGORIES = [
  {
    id: ENotificationCategory.ANNOUNCEMENT,
    name: 'NOTIFICATION.CATEGORY.ANNOUNCEMENT',
  },
  {
    id: ENotificationCategory.CAMPAIGN,
    name: 'NOTIFICATION.CATEGORY.CAMPAIGN',
  },
  {
    id: ENotificationCategory.SYSTEM,
    name: 'NOTIFICATION.CATEGORY.SYSTEM',
  },
]
