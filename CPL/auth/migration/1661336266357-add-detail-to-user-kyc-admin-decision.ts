import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addDetailToUserKycAdminDecision1661336266357
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_kyc_admin_decision', [
      new TableColumn({
        name: 'is_auto',
        type: 'boolean',
        default: false,
      }),
      new TableColumn({
        name: 'admin_id',
        type: 'bigInt',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc_admin_decision', [
      'is_auto',
      'admin_id',
    ])
  }
}
