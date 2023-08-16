import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createBalanceImportExcelRows1661936995600
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'balance_import_excel_rows',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'import_file_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'bigInt',
            isNullable: false,
          },
          {
            name: 'row_index',
            type: 'Int',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'Int',
            isNullable: false,
            default: 1,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: true,
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
    await queryRunner.dropTable('balance_import_excel_rows', true)
  }
}
