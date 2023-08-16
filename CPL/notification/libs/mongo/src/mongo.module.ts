import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import mongoConfig from './mongo.config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongoConfig)],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('mongo')
        const options: MongooseModuleOptions = {
          uri: `mongodb://${config.host}:${config.port}/${config.db}`,
          user: config.user,
          pass: config.pass,
          retryWrites: false,
        }
        if (config.auth_source) {
          options.authSource = config.auth_source
        }
        return options
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
