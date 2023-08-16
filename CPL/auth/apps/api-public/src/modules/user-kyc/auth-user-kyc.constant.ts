import { HttpStatus } from '@nestjs/common'

export const InfoNotFoundResponse = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Info not found',
  schema: {
    properties: {
      statusCode: {
        type: 'number',
        example: 400,
      },
      msg: {
        type: 'string',
        example: 'USER_INFO.INFO_NOT_FOUND',
      },
      timestamp: {
        type: 'string',
        example: '2022-05-05T03:49:34.636Z',
      },
      path: {
        type: 'string',
      },
    },
  },
}

export const KycCaptchaResponse = {
  status: HttpStatus.OK,
  description: 'Generate captcha successfully',
  schema: {
    properties: {
      captcha: {
        type: 'string',
        example: 'data:image/svg+xml;base64,xxxxxxxx',
      },
    },
  },
}
