import { Sequelize, Transaction } from 'sequelize';

export class DatabaseService {
  constructor(private readonly sequelize: Sequelize) {}

  async executeTransaction<T>(
    work: (transaction: Transaction) => Promise<T>,
    maxRetries = 3,
  ) {
    let retries = 0;
    let result: T;

    const transaction = await this.sequelize.transaction();

    while (retries < maxRetries) {
      try {
        result = await work(transaction);
        await transaction.commit();
      } catch (e) {
        await transaction.rollback();

        if (this.isRetryableError(e)) {
          retries++;
          continue;
        }
      }
    }

    if (retries >= maxRetries) throw new Error('Max retries exceeded');

    return result;
  }

  private isRetryableError(e: Error) {
    if (e.name === 'SequelizeTimeoutError') {
      return true;
    }

    if (
      e.name === 'SequelizeDatabaseError' &&
      e.message.toLowerCase().includes('deadlock')
    ) {
      return true;
    }

    return false;
  }
}
