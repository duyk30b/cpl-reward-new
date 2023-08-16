import {
  GrpcValidateExceptionFilter,
  ValidationException,
} from '@lib/common/exceptions/validation-exception.filter'
import { MariadbModule } from '@libs/typeorm/mariadb.module'
import { Module, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { GlobalConfig } from 'config/global-config'
import { GrpcCampaignModule } from './grpc-campaign/grpc-campaign.module'
import { GrpcCommonModule } from './grpc-common/grpc-common.module'
import { GrpcMissionModule } from './grpc-mission/grpc-mission.module'
import { GrpcRewardModule } from './grpc-reward/grpc-reward.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV || 'local'}`, '.env'],
      isGlobal: true,
      load: [GlobalConfig],
    }),
    MariadbModule,
    HealthModule,
    ScheduleModule.forRoot(),
    GrpcCampaignModule,
    GrpcMissionModule,
    GrpcCommonModule,
    GrpcRewardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        validationError: { target: false, value: true },
        skipMissingProperties: true,
        transform: true, // use for DTO
        transformOptions: {
          excludeExtraneousValues: true, // exclude field not in class DTO => no
          exposeUnsetFields: false, // expose field undefined in DTO => no
        },
        exceptionFactory: (errors: ValidationError[] = []) => new ValidationException(errors),
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GrpcValidateExceptionFilter,
    },
  ],
})
export class GrpcInternalModule {}
