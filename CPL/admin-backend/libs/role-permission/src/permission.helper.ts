export function getUserPermissionCacheKey(userId: string) {
  return `user_role_permission:${userId}`
}

export function getUserScreenCacheKey(userId: string) {
  return `user_role_screen:${userId}`
}
