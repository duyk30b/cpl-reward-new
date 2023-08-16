import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createBalanceImportExcelFiles1661937020089
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'balance_import_excel_files',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'admin_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'Int',
            isNullable: true,
          },
          {
            name: 'file_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('balance_import_excel_files', true)
  }
}
