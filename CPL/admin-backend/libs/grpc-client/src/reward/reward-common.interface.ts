import { Observable } from 'rxjs'

export interface IGrpcAdminCommonService {
  listEvents(empty: any): Observable<ListEventsResult>
  listGrantTarget(empty: any): Observable<IListGrantTargetResult>
  listUserConditions(empty: any): Observable<IUserConditionResult>
  listDisplayConditions(empty: any): Observable<IUserConditionResult>
}

export interface ListEventsResult {
  events: any
}

export interface IUserConditionResult {
  list: string
}

export interface IListGrantTargetResult {
  users: IEventResult[]
  wallets: IEventResult[]
  methods: IEventResult[]
  fieldsToCalculateAmount: IEventResult[]
}

export interface IEventResult {
  key: string
  value: string
}

export default IGrpcAdminCommonService
