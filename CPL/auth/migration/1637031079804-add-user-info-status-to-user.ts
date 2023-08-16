import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addUserInfoStatusToUser1637031079804
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({ name: 'user_info_status', type: 'int', default: 2 }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'user_info_status')
  }
}
