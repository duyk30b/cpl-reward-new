import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addVerifyStatusToUser1634873748174 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user', [
      new TableColumn({
        name: 'email_verify_status',
        type: 'int',
        default: 10,
      }),
      new TableColumn({
        name: 'authenticator_verify_status',
        type: 'int',
        default: 10,
      }),
      new TableColumn({
        name: 'kyc_verify_status',
        type: 'int',
        default: 10,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('user', [
      'email_verify_status',
      'authenticator_verify_status',
      'kyc_verify_status',
    ])
  }
}
