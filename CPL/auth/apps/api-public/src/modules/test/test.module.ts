import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { TestService } from './test.service'
import { TestController } from './test.controller'
import { DynamicLinkModule } from '@lib/dynamic-link'
import { IgnoreTestModuleMiddleware } from '../../middlewares/ignore-test-module.middleware'
import { UserModule } from '@lib/user'
// import { ValidateRecaptchaMiddleware } from '../middlewares/validate-recaptcha.middleware'
// import { ReCaptchaModule } from '@lib/re-captcha'
@Module({
  imports: [
    // test
    // ReCaptchaModule,
    DynamicLinkModule,
    UserModule,
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer
      .apply(IgnoreTestModuleMiddleware)
      .forRoutes({ path: 'test/common', method: RequestMethod.GET })
  }
}
