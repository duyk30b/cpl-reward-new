import { Expose, Type } from 'class-transformer'

export class RejectionReason {
  @Expose()
  id: number

  @Expose({ name: 'category_id' })
  categoryId: number

  @Expose({ name: 'name_en' })
  nameEn: string

  @Expose({ name: 'name_ja' })
  nameJa: string

  @Expose({ name: 'reason_type' })
  reasonType: string

  checked: boolean
}

export class RejectionReasonCategory {
  @Expose()
  id: number

  @Expose({ name: 'name_en' })
  nameEn: string

  @Expose({ name: 'name_ja' })
  nameJa: string

  @Expose({ name: 'reason_type' })
  reasonType: string

  @Expose()
  @Type(() => RejectionReason)
  reasons: RejectionReason[]

  get checked() {
    return (this.reasons || []).every((reason) => reason.checked)
  }

  set checked(value) {
    if (this.reasons) {
      this.reasons.forEach((reason) => {
        reason.checked = value
      })
    }
  }
}

export enum ERejectionReasonType {
  KYC_PERSONAL = 'kyc_personal',
  KYC_ENTERPRISE = 'kyc_enterprise',
  API = 'api',
}
