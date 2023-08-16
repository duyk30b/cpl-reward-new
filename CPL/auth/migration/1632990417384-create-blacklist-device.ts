import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm'

export class createBlacklistDevice1632990417384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'blacklist_device',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'device_id',
            type: 'bigInt',
          },
          {
            name: 'note',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'until',
            type: 'bigInt',
            isNullable: false,
            default: 0,
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
      'blacklist_device',
      new TableIndex({
        name: 'INDEX_DEVICE_ID',
        columnNames: ['device_id'],
      }),
    )
    await queryRunner.createForeignKey(
      'blacklist_device',
      new TableForeignKey({
        columnNames: ['device_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'device',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('blacklist_device')
    await queryRunner.dropForeignKeys('blacklist_device', table.foreignKeys)
    await queryRunner.dropIndex('blacklist_device', 'INDEX_DEVICE_ID')
    await queryRunner.dropTable('blacklist_device', true)
  }
}
