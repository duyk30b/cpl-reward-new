import { MigrationInterface, QueryRunner } from 'typeorm'

export class alterFullnameInUserInfo1656645677667
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_info MODIFY COLUMN full_name VARCHAR(500)`,
    )
    await queryRunner.query(
      `ALTER TABLE user_info_history MODIFY COLUMN full_name VARCHAR(500)`,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
