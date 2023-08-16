import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createDeviceTable1632366232173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'device',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
          },
          {
            name: 'device_hash',
            type: 'varchar',
          },
          {
            name: 'device_info',
            type: 'text',
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'device',
      new TableIndex({
        name: 'INDEX_UUID',
        columnNames: ['uuid'],
        isUnique: true,
      }),
    )
    await queryRunner.createIndex(
      'device',
      new TableIndex({
        name: 'INDEX_DEVICE_HASH',
        columnNames: ['device_hash'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('device', 'INDEX_UUID')
    await queryRunner.dropIndex('device', 'INDEX_DEVICE_HASH')
    await queryRunner.dropTable('device', true)
  }
}
