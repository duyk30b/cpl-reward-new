import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addPhoneCountryToUserInfo1640917593620
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_info',
      new TableColumn({
        name: 'phone_country',
        type: 'varchar',
        default: "''",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_info', 'phone_country')
  }
}
