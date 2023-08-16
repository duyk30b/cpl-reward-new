import { KONG_HEADER_METADATA } from './auth-kong.const'

export function KongHeader(authName = 'access-token') {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(KONG_HEADER_METADATA, authName, descriptor.value)
    return descriptor
  }
}
