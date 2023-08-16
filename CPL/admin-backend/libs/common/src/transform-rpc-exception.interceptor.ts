import { status as GRPC_ERROR_CODE } from '@grpc/grpc-js'
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
  NotImplementedException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import { catchError, Observable, throwError } from 'rxjs'

@Injectable()
export class TransformRpcExceptionInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error && error?.code && error?.metadata) {
          return throwError(() => this.transformErrorException(error))
        }
        return throwError(() => error)
      }),
    )
  }

  private transformErrorException(exception: Record<string, unknown>) {
    const msg = exception.details || ''
    switch (exception.code) {
      case GRPC_ERROR_CODE.INVALID_ARGUMENT:
      case GRPC_ERROR_CODE.FAILED_PRECONDITION:
      case GRPC_ERROR_CODE.OUT_OF_RANGE:
        return new BadRequestException(msg)

      case GRPC_ERROR_CODE.NOT_FOUND:
        return new NotFoundException(msg)

      case GRPC_ERROR_CODE.PERMISSION_DENIED:
        return new ForbiddenException(msg)

      case GRPC_ERROR_CODE.ABORTED:
      case GRPC_ERROR_CODE.ALREADY_EXISTS:
        return new ConflictException(msg)

      case GRPC_ERROR_CODE.UNIMPLEMENTED:
        return new NotImplementedException(msg)

      case GRPC_ERROR_CODE.DEADLINE_EXCEEDED:
        return new GatewayTimeoutException(msg)

      case GRPC_ERROR_CODE.UNAUTHENTICATED:
        return new UnauthorizedException(msg)

      case GRPC_ERROR_CODE.UNAVAILABLE:
        return new ServiceUnavailableException()

      default:
        return new InternalServerErrorException(msg)
    }
  }
}
