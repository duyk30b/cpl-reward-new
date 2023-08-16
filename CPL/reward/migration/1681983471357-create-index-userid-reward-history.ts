import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class createIndexUserIdRewardHistory1681983471357 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'user_reward_histories',
      new TableIndex({
        name: 'INDEX_REWARD_HISTORY_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_reward_histories', 'INDEX_REWARD_HISTORY_USER_ID')
  }
}
