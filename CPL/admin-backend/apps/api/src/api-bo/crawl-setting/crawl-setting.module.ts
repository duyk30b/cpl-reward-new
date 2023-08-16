import { MiddlewareConsumer, Module } from '@nestjs/common'
import { UserModule } from '@lib/grpc-client/user'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../../ability/ability.module'
import { CrawlSettingController } from './crawl-setting.controller'
import { CrawlSettingService } from './crawl-setting.service'
import { GrpcCrawlSettingModule } from '@lib/grpc-client/bo/crawl-setting'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserModule,
    RolePermissionModule,
    AbilityModule,
    GrpcCrawlSettingModule,
  ],
  controllers: [CrawlSettingController],
  providers: [CrawlSettingService],
})
export class CrawlSettingModule {
  async configure(consumer: MiddlewareConsumer) {
    // await consumer
    //   .apply(ValidateAccessTokenMiddleware)
    //   .forRoutes(ApiBOSettingController)
  }
}
