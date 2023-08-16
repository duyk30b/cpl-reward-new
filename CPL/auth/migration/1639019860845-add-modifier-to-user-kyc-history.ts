import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addModifierToUserKycHistory1639019860845
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_kyc_history', [
      new TableColumn({
        name: 'remark',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'is_modified_by_user',
        type: 'boolean',
        default: true,
      }),
      new TableColumn({
        name: 'modifier_name',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_kyc_history', [
      'remark',
      'is_modified_by_user',
      'modifier_name',
    ])
  }
}
