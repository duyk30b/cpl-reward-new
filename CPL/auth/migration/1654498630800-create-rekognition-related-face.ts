import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createRekognitionRelatedFace1654498630800
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rekognition_related_face',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'origin_face_id',
            type: 'varchar',
          },
          {
            name: 'related_face_id',
            type: 'varchar',
          },
          {
            name: 'similarity',
            type: 'float',
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
      'rekognition_related_face',
      new TableIndex({
        name: 'INDEX_ORIGIN_FACE_ID',
        columnNames: ['origin_face_id'],
      }),
    )

    await queryRunner.createIndex(
      'rekognition_related_face',
      new TableIndex({
        name: 'INDEX_RELATED_FACE_ID',
        columnNames: ['related_face_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'rekognition_related_face',
      'INDEX_ORIGIN_FACE_ID',
    )
    await queryRunner.dropIndex(
      'rekognition_related_face',
      'INDEX_RELATED_FACE_ID',
    )
    await queryRunner.dropTable('rekognition_related_face', true)
  }
}
