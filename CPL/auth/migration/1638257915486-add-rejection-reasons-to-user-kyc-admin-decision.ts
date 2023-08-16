import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addRejectionReasonsToUserKycAdminDecision1638257915486
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_kyc_admin_decision',
      new TableColumn({
        name: 'rejection_reasons',
        type: 'text',
        comment: 'JSON of rejection reasons',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_kyc_admin_decision', 'rejection_reasons')
  }
}
