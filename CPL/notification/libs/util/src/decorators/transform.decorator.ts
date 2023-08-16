import { applyDecorators } from '@nestjs/common'
import { Transform, TransformOptions } from 'class-transformer'
import * as dayjs from 'dayjs'

export function TransformTrim(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      if (!params.value || typeof params.value !== 'string') return params.value
      return params.value.trim()
    }, options),
  )
}

export function TransformInt(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      return params.value ? parseInt(params.value) : params.value
    }, options),
  )
}

export function TransformDate(
  format = 'YYYY-MM-DD',
  options?: TransformOptions,
) {
  return applyDecorators(
    Transform((params) => {
      return params.value ? dayjs(params.value).format(format) : params.value
    }, options),
  )
}

export function TransformUppercase(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      return typeof params.value == 'string'
        ? params.value.toUpperCase()
        : params.value
    }, options),
  )
}

export function TransformTextToJson(options?: TransformOptions) {
  return applyDecorators(
    Transform((params) => {
      return params.value ? JSON.parse(params.value) : params.value
    }, options),
  )
}
