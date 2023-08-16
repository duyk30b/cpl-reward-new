import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createFileTable1636945353113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'uploaded_file',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'host',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'varchar',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('uploaded_file', true)
  }
}
