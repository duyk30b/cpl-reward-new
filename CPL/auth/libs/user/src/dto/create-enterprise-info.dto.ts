import { Expose } from 'class-transformer'

export class CreateEnterpriseInfoDto {
  @Expose()
  applicantName: string

  @Expose()
  companyName: string

  @Expose()
  companyRegisterCountry: number

  @Expose()
  contactNumber: string

  @Expose()
  loginEmail: string

  @Expose()
  companyLocation: string

  @Expose()
  applicantJobTitle: string

  @Expose()
  sourcesFunding: string

  @Expose()
  fundingCurrency: string

  @Expose()
  urlWebsite: string

  @Expose()
  entityType: string

  @Expose()
  registeredDate: string

  @Expose()
  ownershipStructureLayer: string

  @Expose()
  incorporationNumber: string

  @Expose()
  reasonApply: string

  @Expose()
  userRelatedParties: Record<string, any>
}
