import { getProtoPath } from '@lib/grpc-client/grpc-client.helper'
import { ClientOptions, Transport } from '@nestjs/microservices'

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `0.0.0.0:${process.env.GRPC_PORT || 5000}`,
    package: [
      'user',
      'user_info',
      'user_kyc',
      'tag',
      'user_tag',
      'channel',
      'grpc.health.v1',
      'grpc_login_history',
      'email_change_history',
      'reason_category',
      'reason',
    ],
    protoPath: [
      getProtoPath('user.proto'),
      getProtoPath('user_info.proto'),
      getProtoPath('user_kyc.proto'),
      getProtoPath('health.proto'),
      getProtoPath('tag.proto'),
      getProtoPath('user_tag.proto'),
      getProtoPath('channel.proto'),
      getProtoPath('grpc_login_history.proto'),
      getProtoPath('email_change_history.proto'),
      getProtoPath('reason_category.proto'),
      getProtoPath('reason.proto'),
    ],
  },
}
