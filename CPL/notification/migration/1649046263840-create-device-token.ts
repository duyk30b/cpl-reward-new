import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createDeviceToken1649046263840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'device_token',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'device_id',
            type: 'bigInt',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: 1,
          },
          {
            name: 'refreshed_at',
            type: 'bigInt',
          },
        ],
      }),
    )

    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_TOKEN',
        columnNames: ['token'],
        isUnique: true,
      }),
    )

    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_DEVICE_ID',
        columnNames: ['device_id'],
        isUnique: true,
      }),
    )

    await queryRunner.createIndex(
      'device_token',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('devicce_token', 'INDEX_TOKEN')
    await queryRunner.dropIndex('devicce_token', 'INDEX_DEVICE_ID')
    await queryRunner.dropIndex('devicce_token', 'INDEX_USER_ID')
    await queryRunner.dropTable('devicce_token')
  }
}
