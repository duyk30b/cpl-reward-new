import { Observable, throwError, timer } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

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
