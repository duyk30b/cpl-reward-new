import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addAccountLvToUser1644459714969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'account_lv',
        type: 'int',
        default: 1,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'account_lv')
  }
}
