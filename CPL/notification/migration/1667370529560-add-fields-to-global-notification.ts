import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addFieldsToGlobalNotification1667370529560
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('global_notification', [
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: 1,
      }),
      new TableColumn({
        name: 'need_send_mail',
        type: 'boolean',
        default: 0,
      }),
      new TableColumn({
        name: 'is_mail_sent',
        type: 'boolean',
        default: 0,
      }),
      new TableColumn({
        name: 'mail_sent_at',
        type: 'bigInt',
        isNullable: true,
      }),
      new TableColumn({
        name: 'need_send_push',
        type: 'boolean',
        default: 0,
      }),
      new TableColumn({
        name: 'is_push_sent',
        type: 'boolean',
        default: 0,
      }),
      new TableColumn({
        name: 'push_sent_at',
        type: 'bigInt',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('global_notification', [
      'is_active',
      'need_send_mail',
      'is_mail_sent',
      'mail_sent_at',
      'need_send_push',
      'is_push_sent',
      'push_sent_at',
    ])
  }
}
