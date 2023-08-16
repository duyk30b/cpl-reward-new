import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class changeDefaultStatusInUser1636006198885
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'status',
      new TableColumn({
        name: 'status',
        type: 'int',
        default: 1,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'email_verify_status',
      new TableColumn({
        name: 'email_verify_status',
        type: 'int',
        default: 2,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'authenticator_verify_status',
      new TableColumn({
        name: 'authenticator_verify_status',
        type: 'int',
        default: 2,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'kyc_verify_status',
      new TableColumn({
        name: 'kyc_verify_status',
        type: 'int',
        default: 2,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user',
      'status',
      new TableColumn({
        name: 'status',
        type: 'int',
        default: 10,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'email_verify_status',
      new TableColumn({
        name: 'email_verify_status',
        type: 'int',
        default: 10,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'authenticator_verify_status',
      new TableColumn({
        name: 'authenticator_verify_status',
        type: 'int',
        default: 10,
      }),
    )
    await queryRunner.changeColumn(
      'user',
      'kyc_verify_status',
      new TableColumn({
        name: 'kyc_verify_status',
        type: 'int',
        default: 10,
      }),
    )
  }
}
