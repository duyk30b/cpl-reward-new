import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createDeviceMapTable1632366261679 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'device_map',
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
            name: 'device_id',
            type: 'bigInt',
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
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
      'device_map',
      new TableIndex({
        name: 'INDEX_DEVICE_ID',
        columnNames: ['device_id'],
      }),
    )
    await queryRunner.createIndex(
      'device_map',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
    await queryRunner.createForeignKey(
      'device_map',
      new TableForeignKey({
        columnNames: ['device_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device',
      }),
    )
    await queryRunner.createForeignKey(
      'device_map',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('device_map')
    await queryRunner.dropForeignKeys('device_map', table.foreignKeys)
    await queryRunner.dropIndex('device_map', 'INDEX_DEVICE_ID')
    await queryRunner.dropIndex('device_map', 'INDEX_USER_ID')
    await queryRunner.dropTable('device_map', true)
  }
}
