import { Observable } from 'rxjs'
import { MultiLanguageFieldDto } from '../grpc-client.dto'
import {
  IBaseFilter,
  IDataById,
  IGetResponse,
  IPostResponse,
  IResponseWithPagination,
} from '../grpc-client.interface'

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

export interface IGroupNotificationFilter extends IBaseFilter {
  notificationCategoryId?: number
  isActive?: boolean
  lang?: string
}

export interface IMailSchedule {
  id?: string
  status?: number
  title?: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  createdAt?: number
  publishAt?: number
  sentAt?: number
  userGroups: string[]
}

export interface IPushSchedule {
  id?: string
  status?: number
  title?: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  createdAt?: number
  publishAt?: number
  sentAt?: number
  userGroups: string[]
}

export interface IGroupNotification {
  id: string
  notificationCategoryId: number
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
  createdAt: number
  publishAt: number
  image: string
  slug: string
  needSendMail: boolean
  isMailSent: boolean
  mailSentAt: number
  needSendPush: boolean
  isPushSent: boolean
  pushSentAt: number
  isPublished: boolean
  mailSchedule: IMailSchedule
  pushSchedule: IPushSchedule
}

export interface ICreateGroupNotification {
  notificationCategoryId: number
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
  publishAt: number
  image: string
  needSendMail?: boolean
  needSendPush?: boolean
  mailSchedule?: IMailSchedule
  pushSchedule?: IPushSchedule
}

export interface IUpdateGroupNotification {
  id: string
  notificationCategoryId: number
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
  publishAt: number
  image: string
  needSendMail?: boolean
  needSendPush?: boolean
  mailSchedule?: IMailSchedule
  pushSchedule?: IPushSchedule
}

export interface INotificationService {
  sendMail(sendMailRequest: ISendMailRequest): Observable<IPostResponse>

  getListGroupNotification(
    filter: IGroupNotificationFilter,
  ): Observable<IResponseWithPagination<IGroupNotification>>
  findGroupNotificationById(
    dataById: IDataById,
  ): Observable<IGetResponse<IGroupNotification[]>>
  createGroupNotification(
    dto: ICreateGroupNotification,
  ): Observable<IPostResponse>
  updateGroupNotification(
    dto: IUpdateGroupNotification,
  ): Observable<IPostResponse>

  getSupportedLangs({}): Observable<{ data: string[] }>
}
