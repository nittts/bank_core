import { HttpException } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super('Unauthorized', 401);
  }
}
