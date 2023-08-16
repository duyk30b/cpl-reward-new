import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addAcceptLawStatusToUser1640578208321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'accept_law_status',
        type: 'int',
        default: 2,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'accept_law_status')
  }
}
