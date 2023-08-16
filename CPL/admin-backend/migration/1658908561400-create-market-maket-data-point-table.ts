import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createMarketMakerDataPoint1658908561400
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'market_maker_data_point',
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
            name: 'created_at',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'start_price',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'end_price',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('market_maker_data_point', true)
  }
}
