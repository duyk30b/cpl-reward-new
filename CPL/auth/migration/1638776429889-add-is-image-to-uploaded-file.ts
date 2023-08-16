import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIsImageToUploadedFile1638776429889
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'uploaded_file',
      new TableColumn({
        name: 'is_image',
        type: 'boolean',
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('uploaded_file', 'is_image')
  }
}
