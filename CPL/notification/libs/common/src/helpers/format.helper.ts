import { DeviceInfoDto } from '../dto/device.dto'
import { SUPPORTED_LANGS } from '../variables/lang'

export function getBrowserFromDeviceInfo(deviceInfo: DeviceInfoDto) {
  return deviceInfo.browserName
    ? `${deviceInfo.browserName} ${deviceInfo.browserVersion}`
    : 'Unknown'
}

export function getOSFromDeviceInfo(deviceInfo: DeviceInfoDto) {
  return deviceInfo?.platform?.value || 'Unknown'
}

export function isSupportedLang(lang: string) {
  return SUPPORTED_LANGS.includes(lang)
}

export function formatHighLowTimeFrame(period: string) {
  if (!period) return ''
  const [hour, minute, second] = period.split(':').map((e) => parseInt(e))
  const day = Math.floor(hour / 24)
  if (day) return `${day} DAY`
  if (hour > 1) return `${hour} HOURS`
  if (hour) return `${hour} HOUR`
  if (minute) return `${minute} MIN`
  if (second) return `${second} SEC`
  return ''
}
