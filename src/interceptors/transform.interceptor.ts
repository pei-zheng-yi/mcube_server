import { responseLogger } from '../logger';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResult {
  data: any;
  message: string | null;
}

export interface Response<T> {
  result: T;
}

@Injectable()
export class TransformInterceptor<T = IResult> implements NestInterceptor<IResult, Response<IResult>> {
  intercept(context: ExecutionContext, next: CallHandler<IResult>): Observable<Response<IResult>> {
    return next.handle().pipe(
      map((result) => {
        const ctx = context.switchToHttp();
        // const response = ctx.getResponse();
        const request = ctx.getRequest();

        // const statusCode = response.statusCode;
        const url = request.originalUrl;
        const method = request.method;

        // data默认为上级返回值，即无message时，result作为data
        const { data = result, message } = result;

        const res = {
          result: data,
          statusCode: HttpStatus.OK,
          message: message || 'OK',
        };

        responseLogger.info(`${method} ${url}`, res);
        return res;
      })
    );
  }
}
