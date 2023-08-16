import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createErrorSyncUser1651652208838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'error_sync_user',
        columns: [
          {
            name: 'user_id',
            type: 'bigInt',
            isPrimary: true,
          },
          {
            name: 'status',
            type: 'int',
            default: 2,
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'resolved_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('error_sync_user', true)
  }
}
