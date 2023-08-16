import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'
import { TARGET_USER, WALLET, DELIVERY_METHOD } from '../libs/typeorm/src/common/enum'

enum REWARD_RULE_WALLET {
  BALANCE = 'balance',
  CASHBACK = 'cashback',
  DIVIDEND = 'dividend',
  REWARD = 'reward',
}

export class updateEnumColumns1650004605670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'mission_user',
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'user_type',
        type: 'enum',
        enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
        default: `"${TARGET_USER.USER}"`,
      }),
    )

    await queryRunner.changeColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'user_type',
        type: 'enum',
        enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
        default: `"${TARGET_USER.USER}"`,
      }),
    )

    await queryRunner.changeColumns('user_reward_histories', [
      {
        oldColumn: new TableColumn({
          name: 'user_type',
          type: 'varchar',
        }),
        newColumn: new TableColumn({
          name: 'user_type',
          type: 'enum',
          enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
          default: `"${TARGET_USER.USER}"`,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'wallet',
          type: 'varchar',
        }),
        newColumn: new TableColumn({
          name: 'wallet',
          type: 'smallint',
          default: WALLET.EXCHANGE,
        }),
      },
    ])
    await queryRunner.addColumn(
      'user_reward_histories',
      new TableColumn({
        name: 'delivery_method',
        type: 'smallint',
        default: DELIVERY_METHOD.AUTO,
      }),
    )

    await queryRunner.changeColumns('reward_rules', [
      {
        oldColumn: new TableColumn({
          name: 'type_rule',
          type: 'varchar',
        }),
        newColumn: new TableColumn({
          name: 'type_rule',
          type: 'enum',
          enum: ['campaign', 'mission'],
          default: '"campaign"',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'key',
          type: 'varchar',
        }),
        newColumn: new TableColumn({
          name: 'key',
          type: 'enum',
          enum: [
            REWARD_RULE_WALLET.CASHBACK,
            REWARD_RULE_WALLET.BALANCE,
            REWARD_RULE_WALLET.DIVIDEND,
          ],
          default: `"${REWARD_RULE_WALLET.BALANCE}"`,
        }),
      },
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'mission_user',
      new TableColumn({
        name: 'user_type',
        type: 'enum',
        enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
        default: `"${TARGET_USER.USER}"`,
      }),
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
    )

    await queryRunner.changeColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'user_type',
        type: 'enum',
        enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
        default: `"${TARGET_USER.USER}"`,
      }),
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
    )

    await queryRunner.changeColumns('user_reward_histories', [
      {
        oldColumn: new TableColumn({
          name: 'user_type',
          type: 'enum',
          enum: [TARGET_USER.USER, TARGET_USER.REFERRAL_USER],
          default: `"${TARGET_USER.USER}"`,
        }),
        newColumn: new TableColumn({
          name: 'user_type',
          type: 'varchar',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'wallet',
          type: 'smallint',
          default: WALLET.EXCHANGE,
        }),
        newColumn: new TableColumn({
          name: 'wallet',
          type: 'varchar',
        }),
      },
    ])
    await queryRunner.dropColumn('user_reward_histories', 'delivery_method')

    await queryRunner.changeColumns('reward_rules', [
      {
        oldColumn: new TableColumn({
          name: 'type_rule',
          type: 'enum',
          enum: ['campaign', 'mission'],
          default: `"${'campaign'}"`,
        }),
        newColumn: new TableColumn({
          name: 'type_rule',
          type: 'varchar',
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'key',
          type: 'enum',
          enum: [
            REWARD_RULE_WALLET.CASHBACK,
            REWARD_RULE_WALLET.BALANCE,
            REWARD_RULE_WALLET.DIVIDEND,
          ],
          default: `"${REWARD_RULE_WALLET.BALANCE}"`,
        }),
        newColumn: new TableColumn({
          name: 'key',
          type: 'varchar',
        }),
      },
    ])
  }
}
