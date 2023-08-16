import { DEEP_LINK_MAP } from '.'
import { ESystemPushNotificationType } from './system-push-notification-setting.enum'

export function getDeeplinkByNotiType(
  type: ESystemPushNotificationType,
  params?: Record<string, string>,
) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
  return `${DEEP_LINK_MAP[type]}${queryString}`
}
