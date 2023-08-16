import { Environment, Role } from '@libs/util'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiHeaders } from '@nestjs/swagger'
import { KONG_HEADER_METADATA } from './auth-kong.const'

export function processAuthKongDecorators(
  configService: ConfigService,
  types: any[],
) {
  for (const type of types) {
    const propNames = Object.getOwnPropertyNames(type.prototype)
    for (const prop of propNames) {
      const propValue = Reflect.getMetadata(
        KONG_HEADER_METADATA,
        Reflect.get(type.prototype, prop),
      )

      if (propValue) {
        const env = configService.get('global.env')
        let decorators = []
        if (env == Environment.LOCAL) {
          decorators = [
            ApiHeaders([
              {
                name: 'x-bce-role',
                required: true,
                schema: {
                  type: 'string',
                  enum: [Role.USER, Role.GUESS],
                  example: Role.USER,
                },
              },
              {
                name: 'x-bce-uid',
                required: true,
                schema: {
                  type: 'number',
                  example: 1,
                },
              },
              {
                name: 'x-bce-jwt',
                required: true,
                schema: {
                  type: 'string',
                  example:
                    'abxcvbjhdj.eyJkZXZpY2UiOiIxIiwidWlkIjoiNTE4MjUifQ==',
                },
              },
            ]),
          ]
        } else {
          decorators = [ApiBearerAuth(propValue)]
        }
        Reflect.decorate(
          decorators,
          type.prototype,
          prop,
          Reflect.getOwnPropertyDescriptor(type.prototype, prop),
        )
      }
    }
  }
}
