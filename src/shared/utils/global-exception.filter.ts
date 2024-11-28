import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';

import { InsuficientFundsException } from '../exceptions/insuficient-funds.exception';
import { InvalidAccountException } from '../exceptions/invalid-account.exception';

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

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    this.logger.error(
      `HTTP Status: ${status}, Path: ${request.url}, Exception: ${exception}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  getMessage(exception: unknown) {
    if (exception instanceof InsuficientFundsException) {
      return exception.getResponse();
    }
    if (exception instanceof InvalidAccountException) {
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
  }

  getStatus(exception: unknown) {
    if (exception instanceof InsuficientFundsException) {
      return exception.getStatus();
    }
    if (exception instanceof InvalidAccountException) {
      return exception.getStatus();
    }
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    if (exception instanceof Error) {
      return HttpStatus.BAD_REQUEST;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
