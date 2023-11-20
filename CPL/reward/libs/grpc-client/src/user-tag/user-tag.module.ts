import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { join } from 'path'
import { UserTagService } from './user-tag.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_TAG_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user_tag'],
            protoPath: [join(process.cwd(), 'libs/grpc-client/src/user-tag/user_tag.proto')],
            url: configService.get('grpc_client.auth'),
          },
        })
      },
      inject: [ConfigService],
    },
    UserTagService,
  ],
  exports: [UserTagService],
})
export class UserTagModule {}
