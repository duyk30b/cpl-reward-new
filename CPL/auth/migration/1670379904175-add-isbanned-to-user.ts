import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIsbannedToUser1670379904175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'is_banned',
        type: 'boolean',
        default: false,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', ['is_banned'])
  }
}
