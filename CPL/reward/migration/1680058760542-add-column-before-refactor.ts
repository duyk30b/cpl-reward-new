import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addColumnMissionAndHistory1680058760542 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_reward_histories', [
      new TableColumn({
        name: 'balance_response',
        type: 'text',
        isNullable: true,
      }),
      new TableColumn({
        name: 'campaign_type',
        type: 'tinyint',
        isNullable: true,
      }),
    ])

    await queryRunner.addColumns('missions', [
      new TableColumn({
        name: 'event_name',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'campaign_type',
        type: 'tinyint',
        isNullable: true,
      }),
    ])

    await queryRunner.addColumn(
      'reward_rules',
      new TableColumn({
        name: 'wallet',
        type: 'tinyint',
        default: 0,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user_reward_histories', ['balance_response', 'campaign_type'])
    await queryRunner.dropColumns('missions', ['event_name', 'campaign_type'])
    await queryRunner.dropColumn('reward_rules', 'wallet')
  }
}
