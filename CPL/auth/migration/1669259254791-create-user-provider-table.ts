import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserProviderTable1669259254791
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_provider',
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
            name: 'provider_type',
            type: 'varchar',
          },
          {
            name: 'provider_id',
            type: 'varchar',
          },
          {
            name: 'provider_email',
            type: 'varchar',
            isNullable: true,
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

    await queryRunner.createIndex(
      'user_provider',
      new TableIndex({
        name: 'INDEX_USER_PROVIDER_PROVIDER_TYPE_AND_ID',
        columnNames: ['provider_type', 'provider_id'],
      }),
    )

    await queryRunner.createIndex(
      'user_provider',
      new TableIndex({
        name: 'INDEX_USER_PROVIDER_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'user_provider',
      'INDEX_USER_PROVIDER_PROVIDER_TYPE_AND_ID',
    )
    await queryRunner.dropIndex('user_provider', 'INDEX_USER_PROVIDER_USER_ID')
    await queryRunner.dropTable('user_provider', true)
  }
}
