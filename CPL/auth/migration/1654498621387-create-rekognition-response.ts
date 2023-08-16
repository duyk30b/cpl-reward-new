import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createRekognitionResponse1654498621387
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rekognition_response',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'rekognition_info_history_id',
            type: 'bigInt',
          },
          {
            name: 'compare_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'compare_error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'related_faces_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'related_faces_error',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'face_index_response',
            type: 'longtext',
            isNullable: true,
          },
          {
            name: 'face_index_error',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'rekognition_response',
      new TableIndex({
        name: 'INDEX_REKOGNITION_INFO_HISTORY_ID',
        columnNames: ['rekognition_info_history_id'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'rekognition_response',
      'INDEX_REKOGNITION_INFO_HISTORY_ID',
    )
    await queryRunner.dropTable('rekognition_response', true)
  }
}
