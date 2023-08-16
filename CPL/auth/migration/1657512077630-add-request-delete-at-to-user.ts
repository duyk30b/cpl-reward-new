import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addRequestDeleteAtToUser1657512077630
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'request_delete_at',
        type: 'bigInt',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'request_delete_at')
  }
}
