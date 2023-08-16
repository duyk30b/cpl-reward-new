import { Injectable } from '@nestjs/common'
import * as moment from 'moment'

@Injectable()
export class UtilService {
  convertTimestampToDate = (
    milliseconds: number,
    format = 'DD/MM/YYYY hh:mm',
  ) => {
    if (!milliseconds) return ''

    return moment(milliseconds, 'x').format(format)
  }
}
