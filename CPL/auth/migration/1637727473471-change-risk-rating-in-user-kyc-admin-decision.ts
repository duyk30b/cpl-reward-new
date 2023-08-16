import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class changeRiskRatingInUserKycAdminDecision1637727473471
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_kyc_admin_decision',
      'risk_rating',
      new TableColumn({
        name: 'risk_rating',
        isNullable: true,
        type: 'int',
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
