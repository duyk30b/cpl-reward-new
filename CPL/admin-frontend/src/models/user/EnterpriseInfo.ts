import { Expose, Type } from 'class-transformer'

export class EnterpriseInfo {
  @Expose()
  id: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'applicant_name' })
  applicantName: string

  @Expose({ name: 'company_name' })
  companyName: string

  @Expose({ name: 'company_register_country' })
  companyRegisterCountry: number

  @Expose({ name: 'contact_number' })
  contactNumber: string

  @Expose({ name: 'login_email' })
  loginEmail: string

  @Expose({ name: 'company_location' })
  companyLocation: string

  @Expose({ name: 'applicant_job_title' })
  applicantJobTitle: string

  @Expose({ name: 'sources_funding' })
  sourcesFunding: string

  @Expose({ name: 'funding_currency' })
  fundingCurrency: string

  @Expose({ name: 'url_website' })
  urlWebsite: string

  @Expose({ name: 'entity_type' })
  entityType: string

  @Expose({ name: 'registered_date' })
  registeredDate: string

  @Expose({ name: 'ownership_structure_layer' })
  ownershipStructureLayer: string

  @Expose({ name: 'incorporation_number' })
  incorporationNumber: string

  @Expose({ name: 'reason_apply' })
  reasonApply: string

  @Expose({ name: 'user_related_parties' })
  @Type(() => UserRelatedPartyDto)
  userRelatedParties: UserRelatedPartyDto[]
}

export class UserRelatedPartyDto {
  @Expose()
  type: number

  @Expose({ name: 'full_name' })
  fullName: string

  @Expose()
  nationality: number

  @Expose({ name: 'country_of_residence' })
  countryOfResidence: number

  @Expose({ name: 'date_of_birth' })
  dateOfBirth: string

  @Expose()
  gender: number

  @Expose({ name: 'add_roles' })
  addRoles: string[]

  @Expose({ name: 'name_of_corporation' })
  nameOfCorporation: string

  @Expose({ name: 'entity_type' })
  entityType: string

  @Expose({ name: 'country_of_incorporation' })
  countryOfIncorporation: number

  @Expose({ name: 'country_of_operations' })
  countryOfOperations: number

  get nameToDisplay() {
    return this.type == UserRelatedPartyType.INDIVIDUAL
      ? this.fullName
      : this.nameOfCorporation
  }
}

export enum UserRelatedPartyType {
  INDIVIDUAL = 1,
  CORPORATE = 2,
}
