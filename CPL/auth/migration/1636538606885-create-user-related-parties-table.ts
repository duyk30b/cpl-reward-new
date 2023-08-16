import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createUserRelatedPartiesTable1636538606885
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_related_party',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nationality',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'country_of_residence',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'add_roles',
            type: 'text',
          },
          {
            name: 'name_of_corporation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'entity_type',
            type: 'varchar',
          },
          {
            name: 'country_of_incorporation',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'country_of_operations',
            type: 'int',
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
    await queryRunner.createForeignKey(
      'user_related_party',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_related_party')
    await queryRunner.dropForeignKeys('user_related_party', table.foreignKeys)
    await queryRunner.dropTable('user_related_party', true)
  }
}
