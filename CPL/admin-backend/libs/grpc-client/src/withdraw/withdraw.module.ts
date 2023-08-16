import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { WithdrawService } from './withdraw.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    WithdrawService,
    {
      provide: 'WITHDRAW_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['autoWithdraw'],
            protoPath: [getProtoPath('auto-withdraw.proto')],
            url: configService.get('grpc_client.auto_withdraw'),
            channelOptions: {
              'grpc.service_config': JSON.stringify({
                loadBalancingConfig: [{ round_robin: {} }],
              }),
            },
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [WithdrawService],
})
export class WithdrawModule {}
