import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createEmailChangeHistoryTable1653361170714
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_change_history',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'old_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'new_email',
            type: 'varchar',
          },
          {
            name: 'is_modified_by_user',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_change_history', true)
  }
}
