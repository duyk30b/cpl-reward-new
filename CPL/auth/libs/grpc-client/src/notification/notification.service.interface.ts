import { Observable } from 'rxjs'
import { IPostResponse } from '../grpc-client.interface'

export interface ISendMailRequest {
  userIds?: string[]
  emails?: string[]
  data: string
  mailCommand: {
    template: {
      subject: string
      file: string
    }
    lang?: string
  }
}

export interface INotificationService {
  sendMail(sendMailRequest: ISendMailRequest): Observable<IPostResponse>
}
