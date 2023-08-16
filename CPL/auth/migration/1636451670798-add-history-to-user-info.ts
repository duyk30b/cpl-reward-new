import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addHistoryToUserInfo1636451670798 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_info',
      new TableColumn({
        name: 'user_info_history_id',
        type: 'bigInt',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_info', 'user_info_history_id')
  }
}
