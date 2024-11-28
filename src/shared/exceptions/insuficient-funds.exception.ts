import { HttpException } from '@nestjs/common';

export class InsuficientFundsException extends HttpException {
  constructor(message?: string) {
    super(message ?? 'Insuficient Funds.', 400);
  }
}
