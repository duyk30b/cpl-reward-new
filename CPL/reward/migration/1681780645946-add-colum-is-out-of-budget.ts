import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addColumIsOutOfBudget1681780645946 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'campaigns',
      new TableColumn({
        name: 'is_out_of_budget',
        type: 'boolean',
        default: false,
      }),
    )

    await queryRunner.addColumn(
      'missions',
      new TableColumn({
        name: 'is_out_of_budget',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('campaigns', 'is_out_of_budget')
    await queryRunner.dropColumn('missions', 'is_out_of_budget')
  }
}
