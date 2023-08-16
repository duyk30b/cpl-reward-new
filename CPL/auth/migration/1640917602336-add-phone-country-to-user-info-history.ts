import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addPhoneCountryToUserInfoHistory1640917602336
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_info_history',
      new TableColumn({
        name: 'phone_country',
        type: 'varchar',
        default: "''",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_info_history', 'phone_country')
  }
}
