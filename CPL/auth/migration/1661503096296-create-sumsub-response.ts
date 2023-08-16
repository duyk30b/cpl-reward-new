import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createSumsubResponse1661503096296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sumsub_response',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_kyc_history_id',
            type: 'bigInt',
          },
          {
            name: 'inspection_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'applicant_docs_status_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'applicant_status_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'file_map',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'sumsub_response',
      new TableIndex({
        name: 'INDEX_KYC_HISTORY_ID',
        columnNames: ['user_kyc_history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('sumsub_response', 'INDEX_KYC_HISTORY_ID')
    await queryRunner.dropTable('sumsub_response', true)
  }
}
