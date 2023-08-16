import { Expose } from 'class-transformer'

export enum PermissionEvent {
  ROLE_UPDATED = 'role.updated',
  ADMIN_PERMISSION_UPDATED = 'admin.permission_updated',
}

export class RoleUpdatedEvent {
  @Expose({ name: 'role_id' })
  roleId: string
}

export class AdminPermissionUpdatedEvent {
  @Expose({ name: 'admin_id' })
  adminId: string
}
