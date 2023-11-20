import { MISSION_STATUS, TARGET_TYPE } from '../mission.enum'

export class CriteriaMission {
  id?: number
  campaignId?: number
  isActive?: boolean
  status?: MISSION_STATUS
  priority?: number
  targetType?: TARGET_TYPE

  ids?: number[]
  campaignIds?: number[]
  statuses?: MISSION_STATUS[]
  targetTypes?: TARGET_TYPE[]

  activeTime?: number

  id_notIn?: number[]
}
