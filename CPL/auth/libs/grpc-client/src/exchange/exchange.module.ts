import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import GrpcClientConfig from '../grpc-client.config'
import { getProtoPath } from '../grpc-client.helper'
import { ExchangeUserUnlimitedService } from './exchange-user-unlimited.service'

@Module({
  imports: [ConfigModule.forFeature(GrpcClientConfig)],
  providers: [
    {
      provide: 'EXCHANGE_PACKAGE',
      inject: [GrpcClientConfig.KEY],
      useFactory: (grpcClientConfig: ConfigType<typeof GrpcClientConfig>) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['exchange.user.unlimited.admin'],
            protoPath: [getProtoPath('user.unlimited.v1.proto')],
            url: grpcClientConfig.exchangeUrl,
          },
        })
      },
    },
    ExchangeUserUnlimitedService,
  ],
  exports: [ExchangeUserUnlimitedService],
})
export class ExchangeModule {}
