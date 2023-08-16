import { Injectable } from '@nestjs/common'
import { PERMISSION_DATA } from '../../permissions/permission.data'

@Injectable()
export class ApiPermissionService {
  async getAll() {
    return PERMISSION_DATA
  }
}
