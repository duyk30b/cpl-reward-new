import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class alterTableAdminActionLog1669627599509
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('admin_action_log', [
      'location',
      'user_agent',
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('admin_action_log', [
      new TableColumn({
        name: 'location',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'user_agent',
        type: 'text',
        isNullable: true,
      }),
    ])
  }
}
