import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addAdminDecisionToUserKyc1638758966431
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_kyc', [
      new TableColumn({
        name: 'risk_rating',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'compare_document_type',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'compare_liveness_selfie',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'compare_birthday',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'compare_name',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'rejection_reasons',
        type: 'text',
        comment: 'JSON of rejection reasons',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc', [
      'risk_rating',
      'compare_document_type',
      'compare_liveness_selfie',
      'compare_birthday',
      'compare_name',
      'rejection_reasons',
    ])
  }
}
