import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import GrpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { BOUnlimitedUserService } from './bo-unlimited-user.service'

@Module({
  imports: [ConfigModule.forFeature(GrpcClientConfig)],
  providers: [
    {
      provide: 'BO_PACKAGE',
      inject: [GrpcClientConfig.KEY],
      useFactory: (grpcClientConfig: ConfigType<typeof GrpcClientConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['bo_unlimited_user'],
            protoPath: [getProtoPath('bo-unlimited-user.proto')],
            url: grpcClientConfig.bOUrl,
          },
        })
      },
    },
    BOUnlimitedUserService,
  ],
  exports: [BOUnlimitedUserService],
})
export class BOModule {}
