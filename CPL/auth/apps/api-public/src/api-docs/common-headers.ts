export const ApiCommon = {
  device: {
    name: 'device',
    description: 'Device info',
    schema: {
      type: 'string',
      example:
        'eyJ2aXNpdG9ySWQiOiJmNjI3ZjM0Yzc3N2MzMzQ2Njg1Zjk5YjMzMTk3ZjlmZCIsInRpbWV6b25lIjp7InZhbHVlIjoiQXNpYS9TYWlnb24iLCJkdXJhdGlvbiI6MH0sInBsYXRmb3JtIjp7InZhbHVlIjoiTWFjSW50ZWwiLCJkdXJhdGlvbiI6MH0sInNjcmVlblJlc29sdXRpb24iOnsidmFsdWUiOls5MDAsMTQ0MF0sImR1cmF0aW9uIjowfSwiYXVkaW8iOnsidmFsdWUiOjEyNC4wNDM0NDk2ODQ3NTE5OCwiZHVyYXRpb24iOjJ9LCJicm93c2VyIjp7InZhbHVlIjoiQ2hyb21lIn19',
    },
    required: true,
  },
  refresh_token: {
    name: 'refresh_token',
    description: 'Refresh Token',
    schema: {
      type: 'string',
    },
    required: true,
  },
  lang: { name: 'lang', required: false, example: 'en' },
  recaptcha: {
    name: 'recaptcha',
    required: false,
    description: 're-captcha token',
  },
  recaptcha_type: {
    name: 'x-re-captcha-type',
    required: false,
    description: 're-captcha type: v3, v2_android, v2_invisible',
    schema: {
      type: 'string',
      example: 'v2_android',
    },
  },
}
