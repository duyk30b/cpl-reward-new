import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createFlowLogTable1632366251276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'flow_log',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'flow_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
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
    await queryRunner.createForeignKey(
      'flow_log',
      new TableForeignKey({
        columnNames: ['flow_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'flow',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('flow_log')
    await queryRunner.dropForeignKeys('flow_log', table.foreignKeys)
    await queryRunner.dropTable('flow_log', true)
  }
}
