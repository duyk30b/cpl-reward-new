import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createMarketMakerSettings1658908561400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'market_maker_settings',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'coin',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'property_key',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'property_value',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('market_maker_settings', true)
  }
}
