import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { AppService } from './app.service'
import { AuthFlowModule } from './modules/flow/auth-flow.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import global_config from 'config/global_config'
import db from 'config/db'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { TerminusModule } from '@nestjs/terminus'
import { ScheduleModule } from '@nestjs/schedule'
import { HealthModule } from './modules/health/health.module'
import { AuthorizationModule } from '@lib/authorization'
import { TokenModule } from './modules/token/token.module'
import jwt from 'config/jwt'
import { AuthUserModule } from './modules/user/auth-user.module'
import phone_notification from '../../../config/phone-notification'
import email_notification from '../../../config/email-notification'
import { BlacklistModule } from '@lib/blacklist'
import { ValidateBlacklistDeviceMiddleware } from './middlewares/validate-blacklist-device.middleware'
import { DeviceModule } from '@lib/device'
import { AuthDeviceModule } from './modules/device/auth-device.module'

import { ConsoleModule } from 'nestjs-console'
import otp from 'config/otp'
import { AuthenticatorModule } from './modules/authenticator/authenticator.module'
import { AuthUserInfoModule } from './modules/user-info/auth-user-info.module'
import { AuthUserKycModule } from './modules/user-kyc/auth-user-kyc.module'
import { AuthLoginHistoryModule } from './modules/auth-login-history/auth-login-history.module'
import upload_file from 'config/upload-file'
import event from 'config/event'
import redis from 'config/redis'
import { BusinessExceptionFilter } from '@lib/util/exception-filters/business-exception.filter'
import special_countries from 'config/special-countries'
import { Country } from '@lib/country/entities/country.entity'
import bce from 'config/bce'
import { BlackUser } from 'libs/black-user/src/entities/black-user.entity'
import { UnlimitedUser } from 'libs/unlimited-user/src/entities/unlimited-user.entity'
import { AuthChannelModule } from './modules/channel/auth-channel.module'
import { AuthEmqxModule } from './modules/auth-emqx/auth-emqx.module'
import { ValidateRecaptchaMiddleware } from './middlewares/validate-recaptcha.middleware'
import { ReCaptchaModule } from '@lib/re-captcha'
import { TestModule } from './modules/test/test.module'
import { deviceMiddleware } from './middlewares/device.middleware'
import { ApiSumsubModule } from './modules/api-sumsub/api-sumsub.module'
import { ValidateAccessTokenMiddleware } from './middlewares/validate-access-token.middleware'
import { UserModule } from '@lib/user'

@Module({
  imports: [
    ConsoleModule,
    ConfigModule.forRoot({
      load: [
        global_config,
        phone_notification,
        email_notification,
        otp,
        upload_file,
        event,
        redis,
        special_countries,
      ],
      isGlobal: true,
    }),
    ConfigModule.forRoot({ load: [db, jwt] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [db] })],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('authenticate.mysql.master.host'),
        port: configService.get('authenticate.mysql.master.port'),
        username: configService.get('authenticate.mysql.master.user'),
        password: configService.get('authenticate.mysql.master.pass'),
        database: configService.get('authenticate.mysql.master.db'),
        autoLoadEntities: true,
        // logging: true,
        // synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [bce] })],
      name: 'bce',
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        name: 'bce',
        host: configService.get('bce_mysql.slave.host'),
        port: configService.get('bce_mysql.slave.port'),
        username: configService.get('bce_mysql.slave.user'),
        password: configService.get('bce_mysql.slave.pass'),
        database: configService.get('bce_mysql.slave.db'),
        autoLoadEntities: true,
        synchronize: false,
        // logging: true,
        entities: [Country, BlackUser, UnlimitedUser],
      }),
      inject: [ConfigService],
    }),
    AuthFlowModule,
    TerminusModule,
    HealthModule,
    ScheduleModule.forRoot(),
    TokenModule,
    AuthorizationModule,
    AuthUserModule,
    BlacklistModule,
    DeviceModule,
    AuthDeviceModule,
    AuthenticatorModule,
    AuthUserInfoModule,
    AuthUserKycModule,
    AuthLoginHistoryModule,
    AuthChannelModule,
    AuthEmqxModule,
    ReCaptchaModule,
    TestModule,
    ApiSumsubModule,
    UserModule,
    DeviceModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(ValidateBlacklistDeviceMiddleware)
      .exclude(
        { path: 'auth-emqx/auth', method: RequestMethod.POST },
        { path: 'auth-emqx/acl', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })

    await consumer.apply(ValidateRecaptchaMiddleware).forRoutes(
      { path: 'user/register', method: RequestMethod.POST },
      { path: 'user/send-verification-email', method: RequestMethod.POST },
      { path: 'user/send-add-email-otp', method: RequestMethod.POST },
      { path: 'user/send-device-verification-otp', method: RequestMethod.POST },
      {
        path: 'user/send-forgot-password-otp',
        method: RequestMethod.POST,
      },
      {
        path: 'user/change-email/send-new-email-otp',
        method: RequestMethod.POST,
      },
      {
        path: 'user/change-email',
        method: RequestMethod.PATCH,
      },

      { path: 'user/login', method: RequestMethod.POST },
      { path: 'user/firebase', method: RequestMethod.POST },
      { path: 'user/add-email-authentication', method: RequestMethod.PATCH },
      { path: 'user/reset-password', method: RequestMethod.POST },
      // { path: 'user-kyc/upload-file', method: RequestMethod.POST },
    )

    await consumer
      .apply(deviceMiddleware)
      .exclude({ path: 'sumsub/hook', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL })

    await consumer
      .apply(ValidateAccessTokenMiddleware)
      .exclude(
        { path: 'flow', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
        { path: 'test/common', method: RequestMethod.GET },
        { path: 'token', method: RequestMethod.POST },
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
        {
          path: 'user/send-device-verification-otp',
          method: RequestMethod.POST,
        },
        { path: 'user/send-verification-email', method: RequestMethod.POST },
        { path: 'user/send-forgot-password-otp', method: RequestMethod.POST },
        { path: 'user/reset-password', method: RequestMethod.POST },
        { path: 'user/check-email-exist', method: RequestMethod.POST },
        { path: 'user/firebase', method: RequestMethod.POST },
        { path: 'auth-emqx/auth', method: RequestMethod.POST },
        { path: 'auth-emqx/acl', method: RequestMethod.POST },
        { path: 'sumsub/hook', method: RequestMethod.POST },
        { path: 'channel/get-by-name', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
