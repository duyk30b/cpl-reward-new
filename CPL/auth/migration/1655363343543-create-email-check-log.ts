import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createEmailCheckLog1655363343543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_check_log',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'existed_email',
            type: 'varchar',
          },
          {
            name: 'device_hash',
            type: 'varchar',
          },
          {
            name: 'ip',
            type: 'varchar',
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
    await queryRunner.dropTable('email_check_log', true)
  }
}
