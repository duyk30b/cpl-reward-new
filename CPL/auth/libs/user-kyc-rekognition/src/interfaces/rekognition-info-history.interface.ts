import { IBaseFilter } from '@lib/grpc-client/grpc-client.interface'

export interface IFindRekognitionInfoHistoryWithUserInfoFilter
  extends IBaseFilter {
  faceId: string
  exceptUserId: string
}
