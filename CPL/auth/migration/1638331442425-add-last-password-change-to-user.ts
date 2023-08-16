import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addLastPasswordChangeToUser1638331442425
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'last_password_change',
        type: 'bigInt',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'last_password_change')
  }
}
