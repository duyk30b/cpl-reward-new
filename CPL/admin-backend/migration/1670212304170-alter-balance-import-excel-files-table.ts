import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterBalanceImportExcelFilesTable1670212304170
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('balance_import_excel_files', [
      new TableColumn({
        name: 'total_rows',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
      new TableColumn({
        name: 'failed_rows',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
    ])
    const files = await queryRunner.query(
      `SELECT import_file_id, COUNT(id) as total_rows, SUM(case when ${'`status`'} = 4 then 1 else 0 end) as failed_rows
        FROM balance_import_excel_rows
        GROUP BY import_file_id`,
    )
    for await (const file of files) {
      await queryRunner.query(
        `UPDATE balance_import_excel_files
        SET total_rows = ${file.total_rows}, failed_rows = ${file.failed_rows}
        WHERE id = ${file.import_file_id}`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('balance_import_excel_files', [
      new TableColumn({
        name: 'total_rows',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
      new TableColumn({
        name: 'failed_rows',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
    ])
  }
}
