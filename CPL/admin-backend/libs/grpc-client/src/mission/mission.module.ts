import { getProtoPath } from '@lib/grpc-client'
import grpcClientConfig from '@lib/grpc-client/grpc-client.config'
import { TagModule } from '@lib/grpc-client/tag'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import { MissionService } from './mission.service'

@Module({
  imports: [ConfigModule.forFeature(grpcClientConfig), TagModule],
  providers: [
    MissionService,
    {
      provide: 'MISSION_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['admin_mission'],
            protoPath: [getProtoPath('reward/mission.proto')],
            url: configService.get('grpc_client.reward'),
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
  exports: [MissionService],
})
export class MissionModule {}
