import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createUserGroup1667892337398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_group',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'conditions',
            type: 'longtext',
          },
          {
            name: 'created_at',
            type: 'bigInt',
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_group', true)
  }
}
