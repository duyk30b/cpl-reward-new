import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserKycCynopsisTable1636021684563
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_kyc_cynopsis',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ocr_status',
            type: 'int',
            default: '5',
          },
          {
            name: 'artemis_status',
            type: 'int',
            default: '5',
          },
          {
            name: 'history_id',
            type: 'bigInt',
          },
          {
            name: 'customer_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'record_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'crp_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'risk_report',
            type: 'text',
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
      'user_kyc_cynopsis',
      new TableIndex({
        name: 'INDEX_HISTORY_ID',
        columnNames: ['history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_kyc_cynopsis', 'INDEX_HISTORY_ID')
    await queryRunner.dropTable('user_kyc_cynopsis', true)
  }
}
