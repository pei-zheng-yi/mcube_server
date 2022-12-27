import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { isDevMode } from '../app.environment';
import { requestLogger } from '../logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();
    if (!isDevMode) {
      return call$;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const content = request.method + ' -> ' + request.url;

    if (request.method === 'GET') {
      requestLogger.info(`${content}`);
    } else {
      requestLogger.info(`${content}`, request.body);
    }
    return call$.pipe(tap(() => null));
  }
}
