import { DateColumnTransformer, MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer } from '@lib/util'

@Entity()
export class EnterpriseInfoHistory extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'applicant_name' })
  @Expose({ name: 'applicant_name' })
  applicantName: string

  @Column({ name: 'company_name' })
  @Expose({ name: 'company_name' })
  companyName: string

  @Column({ name: 'company_register_country' })
  @Expose({ name: 'company_register_country' })
  companyRegisterCountry: number

  @Column({ name: 'contact_number' })
  @Expose({ name: 'contact_number' })
  contactNumber: string

  @Column({ name: 'login_email' })
  @Expose({ name: 'login_email' })
  loginEmail: string

  @Column({ name: 'company_location' })
  @Expose({ name: 'company_location' })
  companyLocation: string

  @Column({ name: 'applicant_job_title' })
  @Expose({ name: 'applicant_job_title' })
  applicantJobTitle: string

  @Column({ name: 'sources_funding' })
  @Expose({ name: 'sources_funding' })
  sourcesFunding: string

  @Column({ name: 'funding_currency' })
  @Expose({ name: 'funding_currency' })
  fundingCurrency: string

  @Column({ name: 'url_website' })
  @Expose({ name: 'url_website' })
  urlWebsite: string

  @Column({ name: 'entity_type' })
  @Expose({ name: 'entity_type' })
  entityType: string

  @Column({ name: 'registered_date', transformer: DateColumnTransformer() })
  @Expose({ name: 'registered_date' })
  registeredDate: string

  @Column({ name: 'ownership_structure_layer' })
  @Expose({ name: 'ownership_structure_layer' })
  ownershipStructureLayer: string

  @Column({ name: 'incorporation_number' })
  @Expose({ name: 'incorporation_number' })
  incorporationNumber: string

  @Column({ name: 'reason_apply' })
  @Expose({ name: 'reason_apply' })
  reasonApply: string

  @Column({
    name: 'user_related_parties',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose({ name: 'user_related_parties' })
  userRelatedParties: string
}
