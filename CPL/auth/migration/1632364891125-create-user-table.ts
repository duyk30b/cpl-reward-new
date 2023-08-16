import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserTable1632364891125 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigInt',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_country',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'int',
            default: 1,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password_encryptor',
            type: 'int',
            isNullable: false,
            default: 1,
          },
          {
            name: 'salt',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
            isNullable: false,
            default: 10,
          },
          {
            name: 'otp_secret',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'referrer_code',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'referred_by_id',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'fb_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'gg_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'checkpoint',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'last_login',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'phone_verify_at',
            type: 'bigInt',
            isNullable: true,
            default: null,
          },
          {
            name: 'email_verify_at',
            type: 'bigInt',
            isNullable: true,
            default: null,
          },
          {
            name: 'authenticator_verify_at',
            type: 'bigInt',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'bigInt',
            isNullable: true,
          },
          {
            name: 'bce_updated_at',
            type: 'bigInt',
            isNullable: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_UUID',
        columnNames: ['uuid'],
        isUnique: true,
      }),
    )
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_FB_ID',
        columnNames: ['fb_id'],
      }),
    )
    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'INDEX_GG_ID',
        columnNames: ['gg_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user', 'INDEX_UUID')
    await queryRunner.dropIndex('user', 'INDEX_FB_ID')
    await queryRunner.dropIndex('user', 'INDEX_GG_ID')
    await queryRunner.dropTable('user', true)
  }
}
