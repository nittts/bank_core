import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    console.log(
      'exception',
      JSON.stringify(exception, Object.getOwnPropertyNames(exception)),
    );
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const getStatus = () => {
      if (exception instanceof HttpException) {
        return exception.getStatus();
      }
      if (exception instanceof Error) {
        return HttpStatus.BAD_REQUEST;
      }

      return HttpStatus.INTERNAL_SERVER_ERROR;
    };

    const message = () => {
      if (exception instanceof ServiceUnavailableException) {
        return exception.getResponse();
      }

      if (exception instanceof HttpException) {
        const exceptionResponse = exception.getResponse();
        if (
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
        ) {
          return exceptionResponse['message'];
        }
        return 'Unknown Error';
      }

      if (exception instanceof Error) {
        return exception.message;
      }

      return exception;
    };

    const status = getStatus();

    this.logger.error(
      `HTTP Status: ${status}, Path: ${request.url}, Exception: ${exception}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message(),
    });
  }
}
