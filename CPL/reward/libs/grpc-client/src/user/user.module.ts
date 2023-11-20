import { Module } from '@nestjs/common'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import grpcClientConfig from '../grpc-client.config'
import { UserService } from './user.service'
import { join } from 'path'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'USER_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['user'],
            protoPath: [join(process.cwd(), 'libs/grpc-client/src/user/user.proto')],
            url: configService.get('grpc_client.auth'),
          },
        })
      },
      inject: [ConfigService],
    },
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
