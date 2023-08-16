import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createUserTagTable1646120539147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const isUserTagExist = await queryRunner.hasTable('user_tag')
    if (isUserTagExist) {
      const table = await queryRunner.getTable('user_tag')
      await queryRunner.dropForeignKeys('user_tag', table.foreignKeys)
      await queryRunner.dropTable('user_tag', true)
    }
    await queryRunner.createTable(
      new Table({
        name: 'user_tag',
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
            name: 'tag_id',
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
      'user_tag',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
    await queryRunner.createForeignKey(
      'user_tag',
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tag',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_tag')
    await queryRunner.dropForeignKeys('user_tag', table.foreignKeys)
    await queryRunner.dropTable('user_tag', true)
  }
}
