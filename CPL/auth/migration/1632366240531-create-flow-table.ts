import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createFlowTable1632366240531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'flow',
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
            isUnique: true,
          },
          {
            name: 'action',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'device_hash',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'step',
            type: 'int',
            default: 1,
            isNullable: true,
          },
          {
            name: 'flow_data',
            type: 'longtext',
            isNullable: true,
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
      'flow',
      new TableIndex({
        name: 'INDEX_UUID',
        columnNames: ['uuid'],
        isUnique: true,
      }),
    )
    await queryRunner.createIndex(
      'flow',
      new TableIndex({
        name: 'INDEX_DEVICE_HASH',
        columnNames: ['device_hash'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('flow', 'INDEX_UUID')
    await queryRunner.dropIndex('flow', 'INDEX_DEVICE_HASH')
    await queryRunner.dropTable('flow', true)
  }
}
