import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIsFirstLoginColumnInUserTable1653465184819
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'is_first_login',
        type: 'boolean',
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'is_first_login')
  }
}
