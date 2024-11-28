import { HttpException } from '@nestjs/common';

export class InvalidAccountException extends HttpException {
  constructor(message?: string) {
    super(message ?? 'Invalid account provided.', 400);
  }
}
