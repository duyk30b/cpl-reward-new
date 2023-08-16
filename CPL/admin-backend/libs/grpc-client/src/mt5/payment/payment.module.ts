import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import grpcClientConfig from '../../grpc-client.config'
import { getProtoPath } from '../../grpc-client.helper'
import { GrpcPaymentService } from './payment.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig)],
  providers: [
    {
      provide: 'MT5_PAYMENT_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['payment.echelonpay'],
            protoPath: [getProtoPath('mt5/payment.echelonpay.proto')],
            url: configService.get('grpc_client.mt5'),
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
    GrpcPaymentService,
  ],
  exports: [GrpcPaymentService],
})
export class GrpcPaymentModule {}
