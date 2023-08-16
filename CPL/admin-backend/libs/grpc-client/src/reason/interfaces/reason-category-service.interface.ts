import { Observable } from 'rxjs'
import {
  IBaseReasonCategoryResponse,
  ICreateReasonCategory,
  ILanguageResponse,
  IReasonCategory,
  IReasonCategoryId,
  IReasonCategoryList,
} from '@lib/grpc-client/reason/interfaces/reason-category.interface'
import { IBaseFilter } from '@lib/grpc-client'

export interface IReasonCategoryService {
  create(
    createReasonCategory: ICreateReasonCategory,
  ): Observable<IBaseReasonCategoryResponse>
  findAll(reasonCategoryFilter: IBaseFilter): Observable<IReasonCategoryList>
  findById(reasonCategoryId: IReasonCategoryId): Observable<IReasonCategory>
  update(
    reasonCategory: IReasonCategory,
  ): Observable<IBaseReasonCategoryResponse>
  delete(
    reasonCategoryId: IReasonCategoryId,
  ): Observable<IBaseReasonCategoryResponse>
  getLanguage({}): Observable<ILanguageResponse>
}
