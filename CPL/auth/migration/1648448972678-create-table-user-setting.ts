import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableUserSetting1648448972678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_setting',
        columns: [
          {
            name: 'user_id',
            type: 'bigInt',
            isPrimary: true,
          },
          {
            name: 'exchange_tutorial_status',
            type: 'int',
            default: 1,
          },
          {
            name: 'bo_tutorial_status',
            type: 'int',
            default: 1,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_setting', true)
  }
}
