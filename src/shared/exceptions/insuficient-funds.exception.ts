import { HttpException } from '@nestjs/common';

export class InsuficientFundsError extends HttpException {
  constructor(message?: string) {
    super(message ?? 'Insuficient Funds.', 400);
  }
}
