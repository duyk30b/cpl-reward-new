import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createRekognitionInfoHistory1654498611831
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rekognition_info_history',
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
            name: 'user_kyc_history_id',
            type: 'bigInt',
          },
          {
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'compare_status',
            type: 'int',
            default: 5,
          },
          {
            name: 'face_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'duplicate_status',
            type: 'int',
            default: 3,
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
      'rekognition_info_history',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )

    await queryRunner.createIndex(
      'rekognition_info_history',
      new TableIndex({
        name: 'INDEX_USER_KYC_HISTORY_ID',
        columnNames: ['user_kyc_history_id'],
        isUnique: true,
      }),
    )

    await queryRunner.createIndex(
      'rekognition_info_history',
      new TableIndex({
        name: 'INDEX_FACE_ID',
        columnNames: ['face_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('rekognition_info_history', 'INDEX_USER_ID')
    await queryRunner.dropIndex(
      'rekognition_info_history',
      'INDEX_USER_KYC_HISTORY_ID',
    )
    await queryRunner.dropIndex('rekognition_info_history', 'INDEX_FACE_ID')
    await queryRunner.dropTable('rekognition_info_history', true)
  }
}
