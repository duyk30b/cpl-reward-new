import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterTableUser1652940476775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'is_root',
        type: 'boolean',
        default: 0,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'is_root')
  }
}
