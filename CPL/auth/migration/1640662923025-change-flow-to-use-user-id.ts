import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class changeFlowToUseUserId1640662923025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('flow', ['device_hash', 'step'])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('flow', [
      new TableColumn({
        name: 'device_hash',
        type: 'string',
        isNullable: true,
      }),
      new TableColumn({
        name: 'step',
        type: 'int',
        default: 1,
      }),
    ])
  }
}
