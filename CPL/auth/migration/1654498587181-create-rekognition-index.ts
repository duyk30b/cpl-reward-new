import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createRekognitionIndex1654498587181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rekognition_index',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'sample_image',
            type: 'varchar',
          },
          {
            name: 'face_id',
            type: 'varchar',
          },
          {
            name: 'sample_index_response',
            type: 'longtext',
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
      'rekognition_index',
      new TableIndex({
        name: 'INDEX_FACE_ID',
        columnNames: ['face_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('rekognition_index', 'INDEX_FACE_ID')
    await queryRunner.dropTable('rekognition_index', true)
  }
}
