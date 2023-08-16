import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addApplicantResponseToSumsubInfoHistory1667181179549
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('sumsub_info_history', [
      new TableColumn({
        name: 'applicant_id',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'duplicate_status',
        type: 'int',
        default: 4,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('sumsub_info_history', [
      'applicant_id',
      'duplicate_status',
    ])
  }
}
