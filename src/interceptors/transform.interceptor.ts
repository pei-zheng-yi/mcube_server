import { responseLogger } from '../logger';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  result: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        // const response = ctx.getResponse();
        const request = ctx.getRequest();

        // const statusCode = response.statusCode;
        const url = request.originalUrl;
        const method = request.method;

        const res = {
          result: data,
          statusCode: HttpStatus.OK,
          message: 'ok',
        };

        responseLogger.info(`${method} ${url}`, res);
        return res;
      })
    );
  }
}
