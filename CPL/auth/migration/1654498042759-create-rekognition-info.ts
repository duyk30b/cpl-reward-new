import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createRekognitionInfo1654498042759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rekognition_info',
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
            name: 'image',
            type: 'varchar',
          },
          {
            name: 'face_id',
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
      'rekognition_info',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('rekognition_info', 'INDEX_USER_ID')
    await queryRunner.dropTable('rekognition_info', true)
  }
}
