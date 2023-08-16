import { INestApplicationContext } from '@nestjs/common'
import { NestContainer } from '@nestjs/core'
import { Observable, throwError, timer } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import * as fs from 'fs'

export const genericRetryStrategy =
  ({
    maxRetryAttempts = 3,
    scalingDuration = 2000,
    excludedStatusCodes = [],
  }: {
    maxRetryAttempts?: number
    scalingDuration?: number
    excludedStatusCodes?: number[]
  } = {}) =>
  (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1
        // if maximum number of retries have been met
        // or response is a status code we don't wish to retry, throw error
        if (
          retryAttempt > maxRetryAttempts ||
          (error &&
            error.response &&
            excludedStatusCodes.find((e) => e == error.response.status))
        ) {
          return throwError(() => error)
        }
        return timer(retryAttempt * scalingDuration)
      }),
    )
  }

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getAllControllers(app: INestApplicationContext) {
  const container = (app as any).container as NestContainer
  const modules = container.getModules()
  const result = []
  modules.forEach((module) => {
    const controllers = module.controllers
    controllers.forEach((controller, type) => {
      result.push(type)
    })
  })
  return result
}

export function touchFile(filePath: string) {
  const time = new Date()
  try {
    fs.utimesSync(filePath, time, time)
  } catch (err) {
    fs.closeSync(fs.openSync(filePath, 'w'))
  }
}
