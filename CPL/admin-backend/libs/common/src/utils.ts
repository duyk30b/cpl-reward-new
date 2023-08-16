import { ValidationError } from '@nestjs/common'
import { TRANSACTION_TYPE } from 'apps/api/src/api-balance/balance.enum'
import { CustomValidationError } from 'apps/api/src/exception-filter/validation-exception.filter'
import { randomInt } from 'crypto'
import { IPaginationMeta } from 'nestjs-typeorm-paginate'

export function currentMilliTime(): string {
  return new Date().getTime().toString()
}

export function dateTime(): string {
  const today = new Date()
  const date: string =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  const time: string =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  return date + ' ' + time
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min // Returns a random integer from min to max
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generatorReferenceIdWithAdmin(
  adminId: string,
  transactionType: TRANSACTION_TYPE,
): string {
  const time = BigInt(new Date().getTime())
  const idUnique =
    (time << BigInt(22)) |
    (BigInt(randomInt(1, 999)) << BigInt(18)) |
    (BigInt(randomInt(1000, 9999)) << BigInt(0))
  return adminId + ':' + transactionType + ':' + idUnique
}

export function generatorReferenceIdForImportFile(
  userId: string,
  fileId: string,
): string {
  const time = BigInt(new Date().getTime())
  const idUnique =
    (time << BigInt(22)) |
    (BigInt(randomInt(1, 999)) << BigInt(18)) |
    (BigInt(randomInt(1000, 9999)) << BigInt(0))

  return fileId + ':' + userId + ':' + idUnique
}

// export function getDataFromReferenceIdWithAdmin(referenceId: string) {
//   //rewrite logic when using
//   const data = referenceId.split(':')
//   return {
//     adminId: data[0] ?? undefined,
//     transactionType: data[1] ? parseInt(data[1]) : undefined,
//   }
// }

export function jsonToCsv(json: any[]) {
  if (!json || json.length === 0) return ''
  const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
  const header = Object.keys(json[0])
  const csv = json.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(','),
  )
  csv.unshift(header.join(','))
  return csv.join('\r\n')
}

export function formatPagination(pagination: IPaginationMeta) {
  return {
    page: pagination.currentPage,
    size: pagination.itemsPerPage,
    total: pagination.totalItems,
  }
}

export function objectFlip(obj) {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key
    return ret
  }, {})
}

export function removeRecordEmpty(
  data: Array<Array<string>>,
): Array<Array<string>> {
  return data.filter((item: Array<string>) => {
    let check = false
    for (const ele of item) {
      if (ele) {
        check = true
        break
      }
    }
    return check
  })
}

export function flattenErrors(
  validationErrors: ValidationError[],
  prefix = '',
): CustomValidationError[] {
  const initialValue: CustomValidationError[] = []
  return validationErrors.reduce(
    (flattened, { property, constraints, children }) => {
      property = prefix ? prefix + '.' + property : property
      if (constraints) {
        flattened.push({
          property,
          msg: Object.values(constraints)[0],
        })
      }
      if (children && children.length) {
        flattened = flattened.concat(flattenErrors(children, property))
      }
      return flattened
    },
    initialValue,
  )
}
