import { errorLogger } from '../logger';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const url = request.originalUrl; // 请求路由
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const method = request.method.methods;

    const exceptionRes: any = exception.getResponse();
    let message = '';
    let errors = '';
    if (typeof exceptionRes === 'string') {
      message = exceptionRes;
    } else {
      message = exceptionRes.message;
      errors = exceptionRes.error;
    }

    const finalResponse = {
      result: null,
      statusCode: status,
      message,
      errors: undefined,
    };

    if (errors) {
      finalResponse.errors = errors;
    }

    response.status(HttpStatus.OK).json({ ...finalResponse });
    errorLogger.error(`${method} ${url}`, finalResponse);
  }
}
