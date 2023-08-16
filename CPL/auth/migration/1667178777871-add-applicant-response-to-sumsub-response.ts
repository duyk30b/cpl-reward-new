import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addApplicantResponseToSumsubResponse1667178777871
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('sumsub_response', [
      new TableColumn({
        name: 'applicant_response',
        type: 'longtext',
        isNullable: true,
      }),
      new TableColumn({
        name: 'similar_applicants_response',
        type: 'longtext',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('sumsub_response', [
      'applicant_response',
      'similar_applicants_response',
    ])
  }
}
