import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { UserInfoService } from './user-info.service'
import { join } from 'path'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_INFO_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user_info'],
            protoPath: [join(process.cwd(), 'libs/grpc-client/src/user-info/user_info.proto')],
            url: configService.get('grpc_client.auth'),
          },
        })
      },
      inject: [ConfigService],
    },
    UserInfoService,
  ],
  exports: [UserInfoService],
})
export class UserInfoModule {}
